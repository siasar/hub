import pg from "pg";

const baseUrl = "https://colombia.api.siasar.org/api/v1/";

const client = new pg.Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const login = async (username, password) => {
  console.debug("Logging in...");

  const response = await fetch(`${baseUrl}users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const { token } = await response.json();
  process.env["API_TOKEN"] = token;

  console.debug("Logged in", token);
  return token;
};

const getPoints = async (page = 1) => {
  console.debug(`Fetching points (Page ${page})...`);

  const params = new URLSearchParams({
    page: page,
    status: "calculated",
  });

  const response = await fetch(`${baseUrl}form/data/form.points?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  const data = await response.json();

  // Remove duplicates
  const points = data.filter((value, index, self) => {
    return self.findIndex((v) => v.id === value.id) === index;
  });

  console.debug("Fetched points", points.length);
  return points;
};

const getCommunity = async (id) => {
  console.debug(`Fetching community ${id}...`);

  const response = await fetch(`${baseUrl}form/data/form.communitys/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  return await response.json();
};

const createTables = async () => {
  console.debug("Creating tables...");

  await client.query(`
    DROP TABLE IF EXISTS points CASCADE;
    CREATE TABLE points (
      id varchar(26) PRIMARY KEY,
      status_code text,
      version date,
      country varchar(2)
    );
    CREATE INDEX points_country_idx ON points (country);
  `);

  await client.query(`
    DROP TABLE IF EXISTS communities CASCADE;
    CREATE TABLE communities (
      id varchar(26) PRIMARY KEY,
      point_id varchar(26) REFERENCES points(id) ON DELETE CASCADE,
      name text,
      country varchar(2)
    );
    CREATE INDEX communities_country_idx ON communities (country);
  `);
};

const addPoints = async (points) => {
  console.debug("Adding points...");

  const query = `
    INSERT INTO points (id, status_code, version, country)
    VALUES ${points.map((point) => `('${point.id}', '${point.status_code}', '${point.version}', 'CO')`).join(", ")}
  `;

  await client.query(query);
};

const addCommunity = async (community) => {
  console.debug(`Adding community ${community.id}...`);

  const query = `
    INSERT INTO communities (id, point_id, name, country)
    VALUES ('${community.id}', '${community.point}', '${community.field_community_name}', 'CO')
  `;

  await client.query(query);
};

const refreshMetabase = async () => {
  console.debug("Triggering Metabase refresh...");

  // Login to Metabase
  const response = await fetch("http://metabase:3000/api/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: process.env.METABASE_USER,
      password: process.env.METABASE_PASSWORD,
    }),
  });

  const { id } = await response.json();

  // Sync schema
  await fetch("http://metabase:3000/api/database/2/sync_schema", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Metabase-Session": id,
    },
  });

  // Rescan values
  await fetch("http://metabase:3000/api/database/2/rescan_values", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Metabase-Session": id,
    },
  });
};

const run = async () => {
  await client.connect();
  await createTables();
  await login(process.env.API_USER, process.env.API_PASSWORD);

  let page = 1;
  while (true) {
    const points = await getPoints(page);
    if (points.length === 0) break;
    await addPoints(points);
    for (const point of points) {
      for (const communityId of point.inquiry_relations.communities.map((c) => c.id)) {
        const community = await getCommunity(communityId);
        await addCommunity(community);
      }
    }
    page++;
  }

  await refreshMetabase();

  await client.end();

  console.debug("Done");
};

run();
