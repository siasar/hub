import Api from "./api.js";
import { createSchema, insertCommunities, insertPoints, insertProviders, insertSystems } from "./db.js";
import { refresh } from "./metabase.js";

const countries = JSON.parse(process.env.COUNTRIES);

const run = async () => {
  await createSchema();

  for (const country of countries) {
    console.debug(`********************************************`);
    console.debug(`Processing ${country.name}`);
    console.debug(`********************************************`);

    const api = new Api(country);

    let page = 1;
    while (true) {
      let points = await api.getPoints(page);

      if (!points) {
        page++;
        continue;
      }

      if (points.length === 0) {
        console.debug("No more data to process");
        break;
      }

      await insertPoints(points);

      console.debug(`Fetching inquiries`);

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
      await insertCommunities(inquiries.communities);
      await insertSystems(inquiries.systems);
      await insertProviders(inquiries.providers);

      page++;
    }
  }

  await refresh();

  console.debug("Done!");
};

run();
