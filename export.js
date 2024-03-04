import fs from "fs";
import { getDashboards, getDashboard, login, logout } from "./grafana.js";
import { diff } from "json-diff";

const basePath = `${process.cwd()}/grafana/dashboards`;

console.info("Login");
login()
  .then((data) => {
    console.info("Fetching dashboards");
    return getDashboards(data.token).then((dashboards) => ({ ...data, dashboards }));
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
    data.dashboards.forEach(({ dashboard, meta }) => {
      const path = meta.folderId !== 0 ? `${basePath}/${meta.folderTitle}` : basePath;
      const filename = `${path}/${meta.slug}.json`;
      if (fs.existsSync(filename)) {
        const current = JSON.parse(fs.readFileSync(filename, "utf8"));
        const ignoreKeys = ["id", "version"];
        const diffKeys = Object.keys(diff(current, dashboard)).filter((key) => !ignoreKeys.includes(key));
        if (diffKeys.length === 0) {
          console.info(`\t🚫 Skipping ${dashboard.title}`);
          return;
        }
      }
      console.info(`\t✅ Saving ${dashboard.title}`);
      fs.writeFileSync(`${path}/${meta.slug}.json`, JSON.stringify(dashboard, null, 2));
    });
    return data;
  })
  .then(({ accountId, token }) => {
    console.info("Logout");
    return logout(accountId, token);
  });
