import { createPool } from "mysql2/promise";
import { Client } from "ssh2";

export default class Input {
  constructor(config) {
    this.config = config;
    this.sshClient = new Client();
  }

  async connect() {
    this.pool = await new Promise((resolve, reject) => {
      this.sshClient
        .on("ready", () => {
          const port = Math.floor(Math.random() * 10000 + 10000);
          this.sshClient.forwardOut("localhost", port, "localhost", 3306, (err, stream) => {
            if (err) reject(err);
            resolve(createPool({ ...this.config.database, host: "localhost", port, stream }));
          });
        })
        .connect({
          ...this.config.ssh,
          privateKey: process.env.SSH_PRIVATE_KEY,
        });
    });
  }

  async query(query) {
    return await this.pool.query(query);
  }

  async close() {
    await this.pool.end();
    this.sshClient.end();
  }

  idDecode(buffer) {
    const hex = buffer.toString("hex").padStart(32, "0");

    const replacements = {
      V: "Z",
      U: "Y",
      T: "X",
      S: "W",
      R: "V",
      Q: "T",
      P: "S",
      O: "R",
      N: "Q",
      M: "P",
      L: "N",
      K: "M",
      J: "K",
      I: "J",
    };

    return (
      BigInt("0x" + hex.substring(0, 2))
        .toString(32)
        .padStart(2, "0") +
      BigInt("0x" + hex.substring(2, 17))
        .toString(32)
        .padStart(12, "0") +
      BigInt("0x" + hex.substring(17, 32))
        .toString(32)
        .padStart(12, "0")
    )
      .toUpperCase()
      .replace(/[VUTSRQPONMLKJI]/g, (match) => replacements[match]);
  }

  indicatorLabel(value) {
    if (value >= 0.0 && value < 0.4) return "D";
    if (value >= 0.4 && value < 0.7) return "C";
    if (value >= 0.7 && value < 0.9) return "B";
    if (value >= 0.9 && value <= 1.0) return "A";
    return "E";
  }

  idList(ids) {
    return ids.map((id) => `'${id.toString("hex")}'`).join(",");
  }

  async getPoints() {
    const [rows] = await this.query(`
      SELECT
        p.id,
        p.field_status AS status,
        CAST(p.field_changed_value AS CHAR) AS version,
        p.field_country_value AS country
      FROM form_point p
      WHERE p.field_status = 'calculated'
    `);

    return rows.map((row) => ({
      ...row,
      ulid: this.idDecode(row.id),
    }));
  }

  async getCommunities(pointIds) {
    const query = `
      SELECT 
        c.id,
        c.field_community_name AS name,
        c.field_status AS status,
        CAST(c.field_changed_value AS CHAR) AS version,
        c.field_country_value AS country,
        pc.record AS point_id,
        c.field_location_lat AS latitude,
        c.field_location_lon AS longitude,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT('name', i.name, 'value', i.value))
          FROM indicator i
          WHERE i.record = c.id
        ) AS indicators,
        (
          SELECT JSON_ARRAYAGG(HEX(f.field_community_photos_value))
          FROM form_community__field_community_photos f
          WHERE f.record = c.id
        ) AS images,
        country.name AS adm0,
        adm1.name AS adm1,
        adm2.name AS adm2,
        adm3.name AS adm3,
        adm4.name AS adm4
      FROM form_community c
      JOIN form_point__field_communities pc ON pc.field_communities_value = c.id
      JOIN country ON country.code = c.field_country_value
      JOIN administrative_division adm4 ON adm4.id = c.field_region_value
      JOIN administrative_division adm3 ON adm3.id = adm4.parent_id
      JOIN administrative_division adm2 ON adm2.id = adm3.parent_id
      JOIN administrative_division adm1 ON adm1.id = adm2.parent_id
      WHERE HEX(pc.record) IN (${this.idList(pointIds)})
        AND c.field_status = 'validated';
    `;

    const [rows] = await this.query(query);

    return rows.map((row) => ({
      ...row,
      ulid: this.idDecode(row.id),
      pointUlid: this.idDecode(row.point_id),
      indicators: JSON.parse(row.indicators).map((i) => ({ ...i, label: this.indicatorLabel(i.value) })),
      images: JSON.parse(row.images || "[]").map(
        (i) => `${this.config.api.url}/files/${this.idDecode(i.toString("hex"))}/download`,
      ),
    }));
  }
}
