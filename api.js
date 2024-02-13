const baseUrl = "https://colombia.api.siasar.org/api/v1/";

export const login = async (username, password) => {
  console.debug("Logging in...");

  const response = await fetch(`${baseUrl}users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const { token } = await response.json();
  process.env["API_TOKEN"] = token;

  console.debug("Logged in", token);
  return token;
};

export const getPoints = async (page = 1) => {
  console.debug(`Fetching points (Page ${page})...`);

  const params = new URLSearchParams({
    page: page,
    status: "calculated",
  });

  const response = await fetch(`${baseUrl}form/data/form.points?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  const data = await response.json();

  // Remove duplicates
  const points = data.filter((value, index, self) => {
    return self.findIndex((v) => v.id === value.id) === index;
  });

  console.debug(`Fetched ${points.length} points`);
  return points;
};

export const getCommunity = async (id) => {
  console.debug(`Fetching community ${id}...`);

  const response = await fetch(`${baseUrl}form/data/form.communitys/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  return await response.json();
};

export const getInquiries = async (id) => {
  console.debug(`Fetching inquiries for Point ${id}...`);

  const response = await fetch(`${baseUrl}form/data/form.points/${id}/inquiries`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  return await response.json();
};
