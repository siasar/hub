import pg from "pg";

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

export const query = async (query) => {
  return await pool.query(query);
};

export const createSchema = async () => {
  await query(`
    DROP TABLE IF EXISTS points CASCADE;
    CREATE TABLE points (
      id varchar(26) PRIMARY KEY,
      status text,
      version timestamp,
      image_url text,
      country varchar(2),
      adm0 text,
      adm1 text,
      adm2 text,
      adm3 text,
      adm4 text
    );
    CREATE INDEX points_country_idx ON points (country);
    CREATE INDEX points_adm0_idx ON points (adm0);
    CREATE INDEX points_adm1_idx ON points (adm1);
    CREATE INDEX points_adm2_idx ON points (adm2);
    CREATE INDEX points_adm3_idx ON points (adm3);
    CREATE INDEX points_adm4_idx ON points (adm4);
  `);

  await query(`
    DROP TABLE IF EXISTS communities CASCADE;
    CREATE TABLE communities (
      id varchar(26) PRIMARY KEY,
      point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
      name text,
      status text,
      indicator varchar(1),
      indicator_value float,
      version timestamp,
      image_url text,
      country varchar(2),
      adm0 text,
      adm1 text,
      adm2 text,
      adm3 text,
      adm4 text
    );
    CREATE INDEX communities_indicator_idx ON communities (indicator);
    CREATE INDEX communities_indicator_value_idx ON communities (indicator_value);
    CREATE INDEX communities_country_idx ON communities (country);
    CREATE INDEX communities_adm0_idx ON communities (adm0);
    CREATE INDEX communities_adm1_idx ON communities (adm1);
    CREATE INDEX communities_adm2_idx ON communities (adm2);
    CREATE INDEX communities_adm3_idx ON communities (adm3);
    CREATE INDEX communities_adm4_idx ON communities (adm4);
  `);

  await query(`
    DROP TABLE IF EXISTS systems CASCADE;
    CREATE TABLE systems (
      id varchar(26) PRIMARY KEY,
      point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
      name text,
      status text,
      indicator varchar(1),
      indicator_value float,
      version timestamp,
      image_url text,
      country varchar(2),
      adm0 text,
      adm1 text,
      adm2 text,
      adm3 text,
      adm4 text
    );
    CREATE INDEX systems_indicator_idx ON systems (indicator);
    CREATE INDEX systems_indicator_value_idx ON systems (indicator_value);
    CREATE INDEX systems_country_idx ON systems (country);
    CREATE INDEX systems_adm0_idx ON systems (adm0);
    CREATE INDEX systems_adm1_idx ON systems (adm1);
    CREATE INDEX systems_adm2_idx ON systems (adm2);
    CREATE INDEX systems_adm3_idx ON systems (adm3);
    CREATE INDEX systems_adm4_idx ON systems (adm4);
  `);

  await query(`
    DROP TABLE IF EXISTS providers CASCADE;
    CREATE TABLE providers (
      id varchar(26) PRIMARY KEY,
      point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
      name text,
      status text,
      indicator varchar(1),
      indicator_value float,
      version timestamp,
      image_url text,
      country varchar(2),
      adm0 text,
      adm1 text,
      adm2 text,
      adm3 text,
      adm4 text
    );
    CREATE INDEX providers_indicator_idx ON providers (indicator);
    CREATE INDEX providers_indicator_value_idx ON providers (indicator_value);
    CREATE INDEX providers_country_idx ON providers (country);
    CREATE INDEX providers_adm0_idx ON providers (adm0);
    CREATE INDEX providers_adm1_idx ON providers (adm1);
    CREATE INDEX providers_adm2_idx ON providers (adm2);
    CREATE INDEX providers_adm3_idx ON providers (adm3);
    CREATE INDEX providers_adm4_idx ON providers (adm4);
  `);
};

export const insertPoints = async (points) => {
  if (!points.length) return;

  await query(`
    INSERT INTO points (
      id,
      status,
      version,
      image_url,
      country,
      adm0,
      adm1,
      adm2,
      adm3,
      adm4
    )
    VALUES ${points
      .map(
        (point) => `(
          '${point.id}',
          '${point.status_code}',
          '${point.version}',
          ${point.image_url ? `'${point.image_url}'` : null},
          '${point.country}',
          '${point.adm0}',
          '${point.adm1}',
          '${point.adm2}',
          '${point.adm3}',
          '${point.adm4}'
        )`,
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};

export const insertCommunities = async (communities) => {
  if (!communities.length) return;

  await query(`
    INSERT INTO communities (
      id,
      point_id,
      name,
      status,
      version,
      indicator,
      indicator_value,
      image_url,
      country,
      adm0,
      adm1,
      adm2,
      adm3,
      adm4
    )
    VALUES ${communities
      .map(
        (community) => `(
          '${community.id}',
          '${community.point_id}',
          '${community.field_title}',
          '${community.field_status}',
          '${community.version}',
          '${community.indicator}',
          ${community.indicator_value},
          ${community.image_url ? `'${community.image_url}'` : null},
          '${community.country}',
          '${community.adm0}',
          '${community.adm1}',
          '${community.adm2}',
          '${community.adm3}',
          '${community.adm4}'
        )`,
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};

export const insertSystems = async (systems) => {
  if (!systems.length) return;

  await query(`
    INSERT INTO systems (
      id,
      point_id,
      name,
      status,
      version,
      indicator,
      indicator_value,
      image_url,
      country,
      adm0,
      adm1,
      adm2,
      adm3,
      adm4
    )
    VALUES ${systems
      .map(
        (system) => `(
          '${system.id}',
          '${system.point_id}',
          '${system.field_title}',
          '${system.field_status}',
          '${system.version}',
          '${system.indicator}',
          ${system.indicator_value},
          ${system.image_url ? `'${system.image_url}'` : null},
          '${system.country}',
          '${system.adm0}',
          '${system.adm1}',
          '${system.adm2}',
          '${system.adm3}',
          '${system.adm4}'
        )`,
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};

export const insertProviders = async (providers) => {
  if (!providers.length) return;

  await query(`
    INSERT INTO providers (
      id,
      point_id,
      name,
      status,
      version,
      indicator,
      indicator_value,
      image_url,
      country,
      adm0,
      adm1,
      adm2,
      adm3,
      adm4
    )
    VALUES ${providers
      .map(
        (provider) => `(
          '${provider.id}',
          '${provider.point_id}',
          '${provider.field_title}',
          '${provider.field_status}',
          '${provider.version}',
          '${provider.indicator}',
          ${provider.indicator_value},
          ${provider.image_url ? `'${provider.image_url}'` : null},
          '${provider.country}',
          '${provider.adm0}',
          '${provider.adm1}',
          '${provider.adm2}',
          '${provider.adm3}',
          '${provider.adm4}'
        )`,
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};
