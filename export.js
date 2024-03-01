import fs from "fs";
import pino from "pino";

const baseUrl = "http://grafana:3000";
const basePath = "/usr/src/app/grafana/provisioning/dashboards";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      colorizeObjects: true,
    },
  },
});

logger.info("Connecting Grafana");
logger.info("Creating account");
fetch(`${baseUrl}/api/serviceaccounts`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Basic " + btoa(`admin:${process.env.GRAFANA_PASSWORD}`),
  },
  body: JSON.stringify({ name: "export", role: "Admin" }),
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    return data.id;
  })
  .then((accountId) => {
    logger.info("Fetching token");
    return fetch(`${baseUrl}/api/serviceaccounts/${accountId}/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`admin:${process.env.GRAFANA_PASSWORD}`),
      },
      body: JSON.stringify({ name: "export-token" }),
    })
      .then((response) => response.json())
      .then((data) => ({ accountId, token: data.key }));
  })
  .then((data) => {
    logger.info("Fetching dashboards");
    return fetch(`${baseUrl}/api/search`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    })
      .then((response) => response.json())
      .then((dashboards) => ({ ...data, dashboards }));
  })
  .then((data) => {
    logger.info("Creating folders");
    data.dashboards
      .filter((d) => d.type === "dash-folder")
      .forEach((folder) => {
        fs.mkdirSync(`${basePath}/${folder.title}`, { recursive: true });
      });

    logger.info("Fetching dashboards details");
    return Promise.all(
      data.dashboards
        .filter((d) => d.type === "dash-db")
        .map((dashboard) => {
          return fetch(`${baseUrl}/api/dashboards/uid/${dashboard.uid}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + data.token,
            },
          }).then((response) => response.json());
        }),
    ).then((dashboards) => {
      logger.info("Saving dashboards");
      dashboards.forEach((dashboard) => {
        const path = dashboard.meta.folderId !== 0 ? `${basePath}/${dashboard.meta.folderTitle}` : basePath;
        fs.writeFileSync(`${path}/${dashboard.meta.slug}.json`, JSON.stringify(dashboard.dashboard, null, 2));
      });
      return data;
    });
  })
  .then(({ accountId, token }) => {
    logger.info("Deleting account");
    return fetch(`${baseUrl}/api/serviceaccounts/${accountId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      return response.json();
    });
  });
