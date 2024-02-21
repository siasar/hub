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
      country varchar(2)
    );
    CREATE INDEX points_country_idx ON points (country);
  `);

  await query(`
    DROP TABLE IF EXISTS communities CASCADE;
    CREATE TABLE communities (
      id varchar(26) PRIMARY KEY,
      point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
      name text,
      latitude float,
      longitude float,
      geom geometry(Point,4326),
      status text,
      wsp varchar(1),
      wsp_value float,
      version timestamp,
      image_url text,
      country varchar(2),
      adm0 text,
      adm1 text,
      adm2 text,
      adm3 text,
      adm4 text
    );
    CREATE INDEX communities_wsp_idx ON communities (wsp);
    CREATE INDEX communities_wsp_value_idx ON communities (wsp_value);
    CREATE INDEX communities_country_idx ON communities (country);
    CREATE INDEX communities_adm0_idx ON communities (adm0);
    CREATE INDEX communities_adm1_idx ON communities (adm1);
    CREATE INDEX communities_adm2_idx ON communities (adm2);
    CREATE INDEX communities_adm3_idx ON communities (adm3);
    CREATE INDEX communities_adm4_idx ON communities (adm4);
    CREATE INDEX communities_geom_idx ON communities USING GIST (geom);
  `);

  await query(`
    DROP TABLE IF EXISTS systems CASCADE;
    CREATE TABLE systems (
      id varchar(26) PRIMARY KEY,
      point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
      name text,
      latitude float,
      longitude float,
      geom geometry(Point,4326),
      status text,
      wsi varchar(1),
      wsi_value float,
      version timestamp,
      image_url text,
      country varchar(2),
      adm0 text,
      adm1 text,
      adm2 text,
      adm3 text,
      adm4 text
    );
    CREATE INDEX systems_wsi_idx ON systems (wsi);
    CREATE INDEX systems_wsi_value_idx ON systems (wsi_value);
    CREATE INDEX systems_country_idx ON systems (country);
    CREATE INDEX systems_adm0_idx ON systems (adm0);
    CREATE INDEX systems_adm1_idx ON systems (adm1);
    CREATE INDEX systems_adm2_idx ON systems (adm2);
    CREATE INDEX systems_adm3_idx ON systems (adm3);
    CREATE INDEX systems_adm4_idx ON systems (adm4);
    CREATE INDEX systems_geom_idx ON systems USING GIST (geom);
  `);

  await query(`
    DROP TABLE IF EXISTS providers CASCADE;
    CREATE TABLE providers (
      id varchar(26) PRIMARY KEY,
      point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
      name text,
      latitude float,
      longitude float,
      geom geometry(Point,4326),
      status text,
      sep varchar(1),
      sep_value float,
      version timestamp,
      image_url text,
      country varchar(2),
      adm0 text,
      adm1 text,
      adm2 text,
      adm3 text,
      adm4 text
    );
    CREATE INDEX providers_sep_idx ON providers (sep);
    CREATE INDEX providers_sep_value_idx ON providers (sep_value);
    CREATE INDEX providers_country_idx ON providers (country);
    CREATE INDEX providers_adm0_idx ON providers (adm0);
    CREATE INDEX providers_adm1_idx ON providers (adm1);
    CREATE INDEX providers_adm2_idx ON providers (adm2);
    CREATE INDEX providers_adm3_idx ON providers (adm3);
    CREATE INDEX providers_adm4_idx ON providers (adm4);
    CREATE INDEX providers_geom_idx ON providers USING GIST (geom);
  `);
};

export const insertPoints = async (points) => {
  if (!points.length) return;

  await query(`
    INSERT INTO points (
      id,
      status,
      version,
      country
    )
    VALUES ${points
      .map(
        (point) => `(
          '${point.ulid}',
          '${point.status}',
          '${point.version}',
          '${point.country}'
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
      latitude, 
      longitude, 
      geom,
      status,
      version,
      wsp,
      wsp_value,
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
          '${community.ulid}',
          '${community.pointUlid}',
          '${community.name}',
          ${community.latitude},
          ${community.longitude},
          ST_POINT(${community.longitude}, ${community.latitude}, 4326),
          '${community.status}',
          '${community.version}',
          '${community.indicators.find((i) => i.name === 'WSP').label}',
          ${community.indicators.find((i) => i.name === 'WSP').value},
          ${community.images.length ? `'${community.images[0]}'` : null},
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
      latitude, 
      longitude, 
      geom,
      status,
      version,
      wsi,
      wsi_value,
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
          '${system.ulid}',
          '${system.pointUlid}',
          '${system.name}',
          ${system.latitude},
          ${system.longitude},
          ST_POINT(${system.longitude}, ${system.latitude}, 4326),
          '${system.status}',
          '${system.version}',
          '${system.indicators.find((i) => i.name === 'WSI').label}',
          ${system.indicators.find((i) => i.name === 'WSI').value},
          ${system.images.length ? `'${system.images[0]}'` : null},
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
      latitude, 
      longitude, 
      geom,
      status,
      version,
      sep,
      sep_value,
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
          '${provider.indicators.find((i) => i.name === 'SEP').label}',
          ${provider.indicators.find((i) => i.name === 'SEP').value},
          ${provider.images.length ? `'${provider.images[0]}'` : null},
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
