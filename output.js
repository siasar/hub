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
            ST_Multi(ST_GeomFromGeoJSON('${JSON.stringify(row.geom)}'))
          )`,
        )
        .join(",")}
      ON CONFLICT DO NOTHING;

      UPDATE countries SET enabled = TRUE where code in ('BO', 'BR', 'CO', 'CR', 'HN', 'KG', 'MX', 'NI', 'PA', 'PY', 'PE', 'DO');
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
        score,
        wsp,
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
            ST_SetSRID(ST_POINT(${row.longitude}, ${row.latitude}), 4326),
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
        score,
        wsi,
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
            ST_SetSRID(ST_POINT(${row.longitude}, ${row.latitude}), 4326),
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
        score,
        sep,
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
            ST_SetSRID(ST_POINT(${row.longitude}, ${row.latitude}), 4326),
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

  insertSchools(rows) {
    if (!rows.length) return;

    return this.query(`
      INSERT INTO schools (
        id,
        name,
        code,
        latitude,
        longitude,
        geom,
        status,
        version,
        score,
        shc,
        staff_women,
        staff_men,
        students_female,
        students_male,
        have_toilets,
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
            '${row.name}',
            '${row.code}',
            '${row.latitude}',
            '${row.longitude}',
            ST_SetSRID(ST_POINT(${row.longitude}, ${row.latitude}), 4326),
            '${row.status}',
            '${row.version}',
            '${row.indicators.find((i) => i.name === "SHC").label}',
            ${row.indicators.find((i) => i.name === "SHC").value},
            ${row.staff_women},
            ${row.staff_men},
            ${row.students_female},
            ${row.students_male},
            ${row.have_toilets},
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

  insertCommunitiesSystems(rows) {
    if (!rows.length) return;

    const tableName = `tmp_${Math.round(Math.random() * 100000)}`;

    return this.query(`
      CREATE TEMP TABLE ${tableName} AS
      SELECT
          community_id,
          system_id,
          provider_id,
          served_households
      FROM
          (VALUES ${rows
            .map(
              (row) => `(
                  '${row.community_id}',
                  '${row.system_id}',
                  '${row.provider_id}',
                  ${row.served_households}
                )`,
            )
            .join(",")}
          ) AS data(community_id, system_id, provider_id, served_households);

      INSERT INTO communities_systems_providers
      (
        SELECT t.*
        FROM ${tableName} t
        JOIN communities c ON c.id = t.community_id
        JOIN systems s ON s.id = t.system_id
        JOIN providers p ON p.id = t.provider_id
      );
    `);
  }

  insertCommunitiesSchools(rows) {
    if (!rows.length) return;

    const tableName = `tmp_${Math.round(Math.random() * 100000)}`;

    return this.query(`
      CREATE TEMP TABLE ${tableName} AS
      SELECT
          community_id,
          school_id
      FROM
        (VALUES ${rows
          .map(
            (row) => `(
                '${row.community_id}',
                '${row.school_id}'
            )`,
          )
          .join(",")}
        ) AS data(community_id, school_id);

      INSERT INTO communities_schools
      (
        SELECT t.*
        FROM ${tableName} t
        JOIN communities c ON c.id = t.community_id
        JOIN schools s ON s.id = t.school_id
      );
    `);
  }

  insertHealthCenters(rows) {
    if (!rows.length) return;

    return this.query(`
      INSERT INTO health_centers (
        id,
        name,
        code,
        latitude,
        longitude,
        geom,
        status,
        version,
        score,
        hcc,
        staff_women,
        staff_men,
        have_toilets,
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
            '${row.name}',
            '${row.code}',
            '${row.latitude}',
            '${row.longitude}',
            ST_SetSRID(ST_POINT(${row.longitude}, ${row.latitude}), 4326),
            '${row.status}',
            '${row.version}',
            '${row.indicators.find((i) => i.name === "HCC").label}',
            ${row.indicators.find((i) => i.name === "HCC").value},
            ${row.staff_women},
            ${row.staff_men},
            ${row.have_toilets},
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

  insertCommunitiesHealthCenters(rows) {
    if (!rows.length) return;

    const tableName = `tmp_${Math.round(Math.random() * 100000)}`;

    return this.query(`
      CREATE TEMP TABLE ${tableName} AS
      SELECT
          community_id,
          health_center_id
      FROM
        (VALUES ${rows
          .map(
            (row) => `(
                '${row.community_id}',
                '${row.health_center_id}'
              )`,
          )
          .join(",")}
        ) AS data(community_id, health_center_id);

      INSERT INTO communities_health_centers
      (
        SELECT t.*
        FROM ${tableName} t
        JOIN communities c ON c.id = t.community_id
        JOIN health_centers hc ON hc.id = t.health_center_id
      );
    `);
  }

  dropTmpTables() {
    return this.query(`
      DROP TABLE IF EXISTS communities_systems_providers_tmp CASCADE;
      DROP TABLE IF EXISTS communities_schools_tmp CASCADE;
      DROP TABLE IF EXISTS communities_health_centers_tmp CASCADE;
    `);
  }
}
