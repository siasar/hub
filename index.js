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

    logger.info(`\t\tFetching systems`);
    const systems = await input.getSystems(points.map((point) => point.id));

    if (systems.length) {
      logger.info(`\t\tAdding ${systems.length} systems`);
      await insertSystems(systems);
    }

    logger.info(`\t\tFetching service providers`);
    const providers = await input.getServiceProviders(points.map((point) => point.id));

    if (providers.length) {
      logger.info(`\t\tAdding ${providers.length} service providers`);
      await insertProviders(providers);
    }

    input.close();
  }

  logger.info("Triggering Metabase refresh");
  await refresh();

  logger.info("Done!");
};

run();
