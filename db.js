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
  console.debug("Creating database schema...");

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
      status text,
      indicator varchar(1),
      indicator_value float,
      version timestamp,
      country varchar(2)
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
      status text,
      indicator varchar(1),
      indicator_value float,
      version timestamp,
      country varchar(2)
    );
    CREATE INDEX systems_country_idx ON systems (country);
    CREATE INDEX systems_indicator_idx ON systems (indicator);
  `);
};

export const insertPoints = async (points) => {
  if (!points.length) return;

  console.debug(`Adding ${points.length} points...`);

  await query(`
    INSERT INTO points (id, status, version, country)
    VALUES ${points
      .map(
        (point) => `(
          '${point.id}', 
          '${point.status_code}', 
          '${point.version}', 
          'CO'
        )`
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};

export const insertCommunities = async (communities) => {
  if (!communities.length) return;

  console.debug(`Adding ${communities.length} communities...`);

  await query(`
    INSERT INTO communities (id, point_id, name, status, version, indicator, indicator_value, country)
    VALUES ${communities
      .map(
        (community) => `(
          '${community.id}', 
          '${community.point}', 
          '${community.field_title}', 
          '${community.field_status}', 
          '${community.field_editors_update.pop()?.value}', 
          '${community.indicator}', 
          ${community.indicator_value}, 
          'CO'
        )`
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};

export const insertSystems = async (systems) => {
  if (!systems.length) return;

  console.debug(`Adding ${systems.length} systems...`);

  await query(`
    INSERT INTO systems (id, point_id, name, status, version, indicator, indicator_value, country)
    VALUES ${systems
      .map(
        (system) => `(
          '${system.id}', 
          '${system.point}', 
          '${system.field_title}', 
          '${system.field_status}', 
          '${system.field_editors_update.pop()?.value}', 
          '${system.indicator}', 
          ${system.indicator_value}, 
          'CO'
        )`
      )
      .join(",")}
    ON CONFLICT DO NOTHING;
  `);
};
