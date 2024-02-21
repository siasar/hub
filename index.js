import pino from "pino";
import { createSchema, insertCommunities, insertPoints, insertProviders, insertSystems } from "./output.js";
import { refresh } from "./metabase.js";
import Input from "./input.js";
import config from "./config.json" with { type: "json" };

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      colorizeObjects: true,
    },
  },
});

const run = async () => {
  logger.info("Creating schema");
  await createSchema();

  for (const country of config.countries) {
    logger.info(`Processing ${country.name}`);

    const input = new Input(country);

    logger.info(`\tConnecting server`);
    await input.connect();

    logger.info(`\tFetching points`);
    const points = await input.getPoints();

    if (points.length === 0) {
      logger.info(`\tNo data to process for ${country.name}`);
      break;
    }

    logger.info(`\t\tAdding ${points.length} points`);
    await insertPoints(points);

    logger.info(`\t\tFetching communities`);
    const communities = await input.getCommunities(points.map((point) => point.id));

    if (communities.length) {
      logger.info(`\t\tAdding ${communities.length} communities`);
      await insertCommunities(communities);
    }

    //   logger.info(`\t\tFetching inquiries`);

    //   const requests = points.map((point) => api.getInquiries(point.id));
    //   const inquiries = (await Promise.all(requests)).reduce(
    //     (inquiries, pointInquiries) => {
    //       return {
    //         communities: inquiries.communities.concat(pointInquiries.communities),
    //         systems: inquiries.systems.concat(pointInquiries.systems),
    //         providers: inquiries.providers.concat(pointInquiries.providers),
    //       };
    //     },
    //     { communities: [], systems: [], providers: [] },
    //   );

    //   if (inquiries.communities.length) {
    //     logger.info(`\t\tAdding ${inquiries.communities.length} communities`);
    //     await insertCommunities(inquiries.communities);
    //   }

    //   if (inquiries.systems.length) {
    //     logger.info(`\t\tAdding ${inquiries.systems.length} systems`);
    //     await insertSystems(inquiries.systems);
    //   }

    //   if (inquiries.providers.length) {
    //     logger.info(`\t\tAdding ${inquiries.providers.length} providers`);
    //     await insertProviders(inquiries.providers);
    //   }

    input.close();
  }

  logger.info("Triggering Metabase refresh");
  await refresh();

  logger.info("Done!");
};

run();
