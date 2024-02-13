import { getInquiries, getPoints, login } from "./api.js";
import { createSchema, insertCommunities, insertPoints, insertSystems } from "./db.js";
import { refresh } from "./metabase.js";

const run = async () => {
  await createSchema();
  await login(process.env.API_USER, process.env.API_PASSWORD);

  let page = 1;
  while (true) {
    const points = await getPoints(page);
    if (points.length === 0) {
      console.debug("No more data to process");
      break;
    }
    await insertPoints(points);
    const requests = points.map((point) => getInquiries(point.id));
    const inquiries = (await Promise.all(requests)).flatMap((pointInquiries, index) =>
      pointInquiries.map((inquiry) => ({ ...inquiry, point: points[index].id }))
    );
    await insertCommunities(inquiries.filter((i) => i.type === "form.community"));
    await insertSystems(inquiries.filter((i) => i.type === "form.wssystem"));

    page++;
  }

  await refresh();

  console.debug("Done!");
};

run();
