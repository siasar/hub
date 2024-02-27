import pino from "pino";
import Output from "./output.js";
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

const output = new Output({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const processCountry = (country) => {
  const input = new Input(country);

  logger.info(`${country.name}: Connecting server`);

  return input
    .connect()
    .then(() => {
      logger.info(`${country.name}: Fetching points`);
      return input.getPoints();
    })
    .then((points) => {
      logger.info(`${country.name}: Adding ${points.length} points`);
      return output.insertPoints(points).then(() => {
        return points;
      });
    })
    .then((points) => {
      logger.info(`${country.name}: Fetching points data`);
      const pointsIds = points.map((point) => point.id);

      return Promise.all([
        input.getCommunities(pointsIds),
        input.getSystems(pointsIds),
        input.getServiceProviders(pointsIds),
      ]);
    })
    .then(([communities, systems, providers]) => {
      const inserts = [];

      if (communities.length) {
        logger.info(`${country.name}: Adding ${communities.length} communities`);
        inserts.push(output.insertCommunities(communities));
      }

      if (systems.length) {
        logger.info(`${country.name}: Adding ${systems.length} systems`);
        inserts.push(output.insertSystems(systems));
      }

      if (providers.length) {
        logger.info(`${country.name}: Adding ${providers.length} service providers`);
        inserts.push(output.insertProviders(providers));
      }

      return Promise.all(inserts);
    })
    .then(() => {
      logger.info(`${country.name}: Closing input connection`);
      return input.end();
    })
    .catch((err) => {
      logger.error(err);
      input.end();
    });
};

logger.info("Creating Database Schema");

output
  .createSchema()
  .then(() => {
    return Promise.all(config.countries.map(processCountry));
  })
  .then(() => {
    logger.info("All Done! Closing output connection");
    return output.end();
  })
  .catch((err) => {
    logger.error(err);
    output.end();
  });
