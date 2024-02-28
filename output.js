import pg from "pg";
import fs from "fs";

export default class Output {
  constructor(config) {
    this.pool = new pg.Pool(config);
  }

  query(query) {
    return this.pool.query(query);
  }

  end() {
    return this.pool.end();
  }

  createSchema() {
    return this.query(fs.readFileSync("schema.sql", "utf8"));
  }

  insertCountries(rows) {
    if (!rows.length) return;

    return this.query(`
      INSERT INTO countries (
        code,
        name,
        fullname,
        geom
      )
      VALUES ${rows
        .map(
          (row) => `(
            '${row.code}',
            '${row.name}',
            '${row.fullname}',
            ST_GeomFromGeoJSON('${JSON.stringify(row.geom)}')
          )`,
        )
        .join(",")}
      ON CONFLICT DO NOTHING;
    `);
  }

  insertPoints(rows) {
    if (!rows.length) return;

    return this.query(`
      INSERT INTO points (
        id,
        status,
        version,
        country_code
      )
      VALUES ${rows
        .map(
          (row) => `(
            '${row.ulid}',
            '${row.status}',
            '${row.version}',
            '${row.country_code}'
          )`,
        )
        .join(",")}
      ON CONFLICT DO NOTHING;
    `);
  }

  insertCommunities(rows) {
    if (!rows.length) return;

    return this.query(`
      INSERT INTO communities (
        id,
        point_id,
        name,
        latitude, 
        longitude, 
        geom,
        status,
        version,
        wsp,
        wsp_value,
        image_url,
        population,
        households,
        households_without_water,
        country_code,
        country,
        adm1,
        adm2,
        adm3,
        adm4
      )
      VALUES ${rows
        .map(
          (row) => `(
            '${row.ulid}',
            '${row.pointUlid}',
            '${row.name}',
            ${row.latitude},
            ${row.longitude},
            ST_POINT(${row.longitude}, ${row.latitude}, 4326),
            '${row.status}',
            '${row.version}',
            '${row.indicators.find((i) => i.name === "WSP").label}',
            ${row.indicators.find((i) => i.name === "WSP").value},
            ${row.images.length ? `'${row.images[0]}'` : null},
            ${row.population},
            ${row.households},
            ${row.households_without_water},
            '${row.country_code}',
            '${row.country}',
            '${row.adm1}',
            '${row.adm2}',
            '${row.adm3}',
            '${row.adm4}'
          )`,
        )
        .join(",")}
      ON CONFLICT DO NOTHING;
    `);
  }

  insertSystems(rows) {
    if (!rows.length) return;

    return this.query(`
      INSERT INTO systems (
        id,
        point_id,
        name,
        latitude, 
        longitude, 
        geom,
        status,
        version,
        wsi,
        wsi_value,
        image_url,
        country_code,
        country,
        adm1,
        adm2,
        adm3,
        adm4
      )
      VALUES ${rows
        .map(
          (row) => `(
            '${row.ulid}',
            '${row.pointUlid}',
            '${row.name}',
            ${row.latitude},
            ${row.longitude},
            ST_POINT(${row.longitude}, ${row.latitude}, 4326),
            '${row.status}',
            '${row.version}',
            '${row.indicators.find((i) => i.name === "WSI").label}',
            ${row.indicators.find((i) => i.name === "WSI").value},
            ${row.images.length ? `'${row.images[0]}'` : null},
            '${row.country_code}',
            '${row.country}',
            '${row.adm1}',
            '${row.adm2}',
            '${row.adm3}',
            '${row.adm4}'
          )`,
        )
        .join(",")}
      ON CONFLICT DO NOTHING;
    `);
  }

  insertProviders(rows) {
    if (!rows.length) return;

    return this.query(`
      INSERT INTO providers (
        id,
        point_id,
        name,
        latitude, 
        longitude, 
        geom,
        status,
        version,
        sep,
        sep_value,
        image_url,
        country_code,
        country,
        adm1,
        adm2,
        adm3,
        adm4
      )
      VALUES ${rows
        .map(
          (row) => `(
            '${row.ulid}',
            '${row.pointUlid}',
            '${row.name}',
            '${row.latitude}',
            '${row.longitude}',
            ST_POINT(${row.longitude}, ${row.latitude}, 4326),
            '${row.status}',
            '${row.version}',
            '${row.indicators.find((i) => i.name === "SEP").label}',
            ${row.indicators.find((i) => i.name === "SEP").value},
            ${row.images.length ? `'${row.images[0]}'` : null},
            '${row.country_code}',
            '${row.country}',
            '${row.adm1}',
            '${row.adm2}',
            '${row.adm3}',
            '${row.adm4}'
          )`,
        )
        .join(",")}
      ON CONFLICT DO NOTHING;
    `);
  }
}
