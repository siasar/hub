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
      country text
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
      indicator varchar(1),
      indicator_value float,
      version timestamp,
      image_url text,
      country text
    );
    CREATE INDEX communities_country_idx ON communities (country);
    CREATE INDEX communities_indicator_idx ON communities (indicator);
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
      indicator varchar(1),
      indicator_value float,
      version timestamp,
      image_url text,
      country text
    );
    CREATE INDEX systems_country_idx ON systems (country);
    CREATE INDEX systems_indicator_idx ON systems (indicator);
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
      indicator varchar(1),
      indicator_value float,
      version timestamp,
      image_url text,
      country text
    );
    CREATE INDEX providers_country_idx ON providers (country);
    CREATE INDEX providers_indicator_idx ON providers (indicator);
  `);
};

export const insertPoints = async (points) => {
  if (!points.length) return;

  await query(`
    INSERT INTO points (id, status, version, image_url, country)
    VALUES ${points
      .map(
        (point) => `(
          '${point.id}',
          '${point.status_code}',
          '${point.version}',
          ${point.image_url ? `'${point.image_url}'` : null},
          '${point.country_name}'
        )`,
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};

export const insertCommunities = async (communities) => {
  if (!communities.length) return;

  await query(`
    INSERT INTO communities (id, point_id, name, latitude, longitude, geom, status, version, indicator, indicator_value, image_url, country)
    VALUES ${communities
      .map(
        (community) => `(
          '${community.id}',
          '${community.point}',
          '${community.field_community_name}',
          ${community.field_location_lat},
          ${community.field_location_lon},
          ST_POINT(${community.field_location_lon}, ${community.field_location_lat}, 4326),
          '${community.field_status}',
          '${community.version}',
          '${community.indicator}',
          ${community.indicator_value},
          ${community.image_url ? `'${community.image_url}'` : null},
          '${community.country_name}'
        )`,
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};

export const insertSystems = async (systems) => {
  if (!systems.length) return;

  await query(`
    INSERT INTO systems (id, point_id, name, latitude, longitude, geom, status, version, indicator, indicator_value, image_url, country)
    VALUES ${systems
      .map(
        (system) => `(
          '${system.id}',
          '${system.point}',
          '${system.field_system_name}',
          ${system.field_location_lat},
          ${system.field_location_lon},
          ST_POINT(${system.field_location_lon}, ${system.field_location_lat}, 4326),
          '${system.field_status}',
          '${system.version}',
          '${system.indicator}',
          ${system.indicator_value},
          ${system.image_url ? `'${system.image_url}'` : null},
          '${system.country_name}'
        )`,
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};

export const insertProviders = async (providers) => {
  if (!providers.length) return;

  await query(`
    INSERT INTO providers (id, point_id, name, latitude, longitude, geom, status, version, indicator, indicator_value, image_url, country)
    VALUES ${providers
      .map(
        (provider) => `(
            '${provider.id}',
            '${provider.point}',
            '${provider.field_provider_name}',
            ${provider.field_location_lat},
            ${provider.field_location_lon},
            ST_POINT(${provider.field_location_lon}, ${provider.field_location_lat}, 4326),
            '${provider.field_status}',
            '${provider.version}',
            '${provider.indicator}',
            ${provider.indicator_value},
            ${provider.image_url ? `'${provider.image_url}'` : null},
            '${provider.country_name}'
          )`
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};
