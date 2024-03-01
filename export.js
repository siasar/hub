import fs from "fs";
import { getDashboards, getDashboard, login, logout } from "./grafana.js";

const basePath = `${process.cwd()}/grafana/dashboards`;

console.info("Login");
login()
  .then((data) => {
    console.info("Fetching dashboards");
    return getDashboards(data.token).then((dashboards) => ({ ...data, dashboards }));
  })
  .then((data) => {
    console.info("Cleaning folder");
    if (fs.existsSync(basePath)) {
      fs.rmSync(basePath, { recursive: true, force: true });
    }
    return data;
  })
  .then((data) => {
    console.info("Creating folders");
    fs.mkdirSync(`${basePath}`, { recursive: true });
    data.dashboards
      .filter((d) => d.type === "dash-folder")
      .forEach((folder) => {
        fs.mkdirSync(`${basePath}/${folder.title}`, { recursive: true });
      });
    return data;
  })
  .then((data) => {
    console.info("Fetching dashboards details");
    return Promise.all(
      data.dashboards
        .filter((d) => d.type === "dash-db")
        .map((dashboard) => {
          return getDashboard(dashboard.uid, data.token);
        }),
    ).then((dashboards) => {
      return { ...data, dashboards };
    });
  })
  .then((data) => {
    console.info("Saving dashboards");
    data.dashboards.forEach((dashboard) => {
      const path = dashboard.meta.folderId !== 0 ? `${basePath}/${dashboard.meta.folderTitle}` : basePath;
      fs.writeFileSync(`${path}/${dashboard.meta.slug}.json`, JSON.stringify(dashboard.dashboard, null, 2));
    });
    return data;
  })
  .then(({ accountId, token }) => {
    console.info("Logout");
    return logout(accountId, token);
  });
