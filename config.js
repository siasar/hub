export default {
  countries: [
    {
      name: "Colombia",
      api: {
        url: "https://colombia.api.siasar.org/api/v1",
        username: process.env.COLOMBIA_API_USERNAME,
        password: process.env.COLOMBIA_API_PASSWORD,
      },
      database: {
        database: process.env.COLOMBIA_DB_NAME,
        user: process.env.COLOMBIA_DB_USER,
        password: process.env.COLOMBIA_DB_PASSWORD,
      },
      ssh: {
        host: "colombia.api.siasar.org",
        port: process.env.COLOMBIA_SSH_PORT,
        username: process.env.COLOMBIA_SSH_USERNAME,
        privateKey: process.env.COLOMBIA_SSH_KEY.replace(/\\n/g, "\n"),
      },
    },
    {
      name: "Panama",
      api: {
        url: "https://panama.api.siasar.org/api/v1",
        username: process.env.PANAMA_API_USERNAME,
        password: process.env.PANAMA_API_PASSWORD,
      },
      database: {
        database: process.env.PANAMA_DB_NAME,
        user: process.env.PANAMA_DB_USER,
        password: process.env.PANAMA_DB_PASSWORD,
      },
      ssh: {
        host: "panama.api.siasar.org",
        port: process.env.PANAMA_SSH_PORT,
        username: process.env.PANAMA_SSH_USERNAME,
        privateKey: process.env.PANAMA_SSH_KEY.replace(/\\n/g, "\n"),
      },
    },
  ],
};
