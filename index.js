import pino from "pino";
import Api from "./api.js";
import { createSchema, updateGeom, insertCommunities, insertPoints, insertProviders, insertSystems } from "./db.js";
import { refresh } from "./metabase.js";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const countries = JSON.parse(process.env.COUNTRIES);

const run = async () => {
  logger.info("Creating schema");
  await createSchema();

  for (const country of countries) {
    logger.info(`Processing ${country.name}`);

    const api = new Api(country);

    let page = 1;
    while (true) {
      logger.info(`Fetching points (Page ${page})`);
      let points = await api.getPoints(page);

      if (!points) {
        logger.warn(`Failed to fetch points, skipping page ${page}`);
        page++;
        continue;
      }

      if (points.length === 0) {
        logger.info(`No more data to process for ${country.name}`);
        break;
      }

      logger.info(`Adding ${points.length} points`);
      await insertPoints(points);

      logger.info(`Fetching inquiries`);

      const requests = points.map((point) => api.getInquiries(point.id));
      const inquiries = (await Promise.all(requests)).reduce(
        (inquiries, pointInquiries) => {
          return {
            communities: inquiries.communities.concat(pointInquiries.communities),
            systems: inquiries.systems.concat(pointInquiries.systems),
            providers: inquiries.providers.concat(pointInquiries.providers),
          };
        },
        { communities: [], systems: [], providers: [] }
      );

      if (inquiries.communities.length) {
        logger.info(`Adding ${inquiries.communities.length} communities`);
        await insertCommunities(inquiries.communities);
      }

      if (inquiries.systems.length) {
        logger.info(`Adding ${inquiries.systems.length} systems`);
        await insertSystems(inquiries.systems);
      }

      if (inquiries.providers.length) {
        logger.info(`Adding ${inquiries.providers.length} providers`);
        await insertProviders(inquiries.providers);
      }

      page++;
    }
    await updateGeom();
  }

  logger.info("Triggering Metabase refresh");
  await refresh();

  logger.info("Done!");
};

run();
