export const refresh = async () => {
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
