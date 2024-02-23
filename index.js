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

const processCountry = (country) => {
  return new Promise(async (resolve, reject) => {
    logger.info(`Processing ${country.name}`);

    const input = new Input(country);

    logger.info(`${country.name}: Connecting server`);
    await input.connect();

    logger.info(`${country.name}: Fetching points`);
    const points = await input.getPoints();

    if (points.length === 0) {
      logger.info(`${country.name}: No data to process`);
      return resolve();
    }

    logger.info(`${country.name}: Adding ${points.length} points`);
    await insertPoints(points);

    logger.info(`${country.name}: Fetching communities`);
    const communities = await input.getCommunities(points.map((point) => point.id));

    if (communities.length) {
      logger.info(`${country.name}: Adding ${communities.length} communities`);
      await insertCommunities(communities);
    }

    logger.info(`${country.name}: Fetching systems`);
    const systems = await input.getSystems(points.map((point) => point.id));

    if (systems.length) {
      logger.info(`${country.name}: Adding ${systems.length} systems`);
      await insertSystems(systems);
    }

    logger.info(`${country.name}: Fetching service providers`);
    const providers = await input.getServiceProviders(points.map((point) => point.id));

    if (providers.length) {
      logger.info(`${country.name}: Adding ${providers.length} service providers`);
      await insertProviders(providers);
    }

    await input.close();

    resolve();
  });
};

const run = async () => {
  logger.info("Creating schema");
  await createSchema();

  Promise.all(config.countries.map(processCountry)).then(async () => {
    logger.info("Triggering Metabase refresh");
    await refresh();

    logger.info("Done!");
  });
};

run();
