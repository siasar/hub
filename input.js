import { createConnection } from "mysql2/promise";
import { Client } from "ssh2";

export default class Input {
  constructor(config) {
    this.config = config;
    this.sshClient = new Client();
    this.countries = config.countries.reduce((countries, country) => {
      return { ...countries, [country.code]: country };
    }, {});
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.sshClient
        .on("ready", () => {
          const port = Math.floor(Math.random() * 10000 + 10000);
          this.sshClient.forwardOut("localhost", port, "localhost", 3306, (err, stream) => {
            if (err) reject(err);
            createConnection({ ...this.config.database, host: "localhost", port, stream }).then((connection) => {
              this.connection = connection;
              resolve();
            });
          });
        })
        .connect(this.config.ssh);
    });
  }

  query(query) {
    return this.connection.query(query);
  }

  end() {
    return this.connection.end().then(() => this.sshClient.end());
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

  getCountries() {
    const query = `
      SELECT
        c.code,
        c.name AS fullname,
        cg.polygon AS geom
      FROM country c
      LEFT JOIN country_geometry cg ON c.code = cg.id
    `;

    return this.query(query).then(([rows]) => rows);
  }

  getPoints() {
    const query = `
      SELECT
        p.id,
        p.field_status AS status,
        CAST(p.field_changed_value AS CHAR) AS version,
        UPPER(p.field_country_value) AS country_code
      FROM form_point p
      WHERE p.field_status = 'calculated'
    `;

    return this.query(query).then(([rows]) => {
      return rows.map((row) => ({
        ...row,
        ulid: this.idDecode(row.id),
        country: this.countries[row.country_code].name,
      }));
    });
  }

  getCommunities(pointIds) {
    const query = `
      SELECT
        c.id,
        c.field_community_name AS name,
        c.field_status AS status,
        CAST(c.field_changed_value AS CHAR) AS version,
        UPPER(c.field_country_value) AS country_code,
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
        field_total_population as population,
        field_total_households as households,
        field_households_without_water_supply_system as households_without_water,
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

    return this.query(query).then(([rows]) => {
      return rows.map((row) => ({
        ...row,
        ulid: this.idDecode(row.id),
        pointUlid: this.idDecode(row.point_id),
        indicators: JSON.parse(row.indicators).map((i) => ({ ...i, label: this.indicatorLabel(i.value) })),
        images: JSON.parse(row.images || "[]").map(
          (i) => `${this.config.api.url}/files/${this.idDecode(i.toString("hex"))}/download`,
        ),
        country: this.countries[row.country_code],
      }));
    });
  }

  getSystems(pointIds) {
    const query = `
      SELECT
        s.id,
        s.field_system_name AS name,
        s.field_status AS status,
        CAST(s.field_changed_value AS CHAR) AS version,
        UPPER(s.field_country_value) AS country_code,
        ps.record AS point_id,
        s.field_location_lat AS latitude,
        s.field_location_lon AS longitude,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT('name', i.name, 'value', i.value))
          FROM indicator i
          WHERE i.record = s.id
        ) AS indicators,
        (
          SELECT JSON_ARRAYAGG(HEX(f.field_wss_photos_value))
          FROM form_wssystem__field_wss_photos f
          WHERE f.record = s.id
        ) AS images,
        adm1.name AS adm1,
        adm2.name AS adm2,
        adm3.name AS adm3,
        adm4.name AS adm4
      FROM form_wssystem s
      JOIN form_point__field_wsystems ps ON ps.field_wsystems_value = s.id
      JOIN country ON country.code = s.field_country_value
      JOIN administrative_division adm4 ON adm4.id = s.field_region_value
      JOIN administrative_division adm3 ON adm3.id = adm4.parent_id
      JOIN administrative_division adm2 ON adm2.id = adm3.parent_id
      JOIN administrative_division adm1 ON adm1.id = adm2.parent_id
      WHERE HEX(ps.record) IN (${this.idList(pointIds)})
        AND s.field_status = 'validated';
    `;

    return this.query(query).then(([rows]) => {
      return rows.map((row) => ({
        ...row,
        ulid: this.idDecode(row.id),
        pointUlid: this.idDecode(row.point_id),
        indicators: JSON.parse(row.indicators).map((i) => ({ ...i, label: this.indicatorLabel(i.value) })),
        images: JSON.parse(row.images || "[]").map(
          (i) => `${this.config.api.url}/files/${this.idDecode(i.toString("hex"))}/download`,
        ),
        country: this.countries[row.country_code].name,
      }));
    });
  }

  getServiceProviders(pointIds) {
    const query = `
      SELECT
        sp.id,
        sp.field_provider_name AS name,
        sp.field_status AS status,
        CAST(sp.field_changed_value AS CHAR) AS version,
        UPPER(sp.field_country_value) AS country_code,
        psp.record AS point_id,
        sp.field_location_lat AS latitude,
        sp.field_location_lon AS longitude,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT('name', i.name, 'value', i.value))
          FROM indicator i
          WHERE i.record = sp.id
        ) AS indicators,
        (
          SELECT JSON_ARRAYAGG(HEX(f.field_photos_value))
          FROM form_wsprovider__field_photos f
          WHERE f.record = sp.id
        ) AS images,
        adm1.name AS adm1,
        adm2.name AS adm2,
        adm3.name AS adm3,
        adm4.name AS adm4
      FROM form_wsprovider sp
      JOIN form_point__field_wsps psp ON psp.field_wsps_value = sp.id
      JOIN country ON country.code = sp.field_country_value
      JOIN administrative_division adm4 ON adm4.id = sp.field_region_value
      JOIN administrative_division adm3 ON adm3.id = adm4.parent_id
      JOIN administrative_division adm2 ON adm2.id = adm3.parent_id
      JOIN administrative_division adm1 ON adm1.id = adm2.parent_id
      WHERE HEX(psp.record) IN (${this.idList(pointIds)})
        AND sp.field_status = 'validated';
    `;

    return this.query(query).then(([rows]) => {
      return rows.map((row) => ({
        ...row,
        ulid: this.idDecode(row.id),
        pointUlid: this.idDecode(row.point_id),
        indicators: JSON.parse(row.indicators).map((i) => ({ ...i, label: this.indicatorLabel(i.value) })),
        images: JSON.parse(row.images || "[]").map(
          (i) => `${this.config.api.url}/files/${this.idDecode(i.toString("hex"))}/download`,
        ),
        country: this.countries[row.country_code],
      }));
    });
  }
}
