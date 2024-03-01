const baseUrl = "http://grafana:3000";

fetch(`${baseUrl}/api/serviceaccounts`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Basic " + btoa(`admin:${process.env.GRAFANA_PASSWORD}`),
  },
  body: JSON.stringify({ name: "export", role: "Admin" }),
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    return data.id;
  })
  .then((accountId) => {
    return fetch(`${baseUrl}/api/serviceaccounts/${accountId}/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`admin:${process.env.GRAFANA_PASSWORD}`),
      },
      body: JSON.stringify({ name: "export-token" }),
    })
      .then((response) => response.json())
      .then((data) => ({ accountId, token: data.key }));
  })
  .then((data) => {
    return fetch(`${baseUrl}/api/search`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    })
      .then((response) => response.json())
      .then((dashboards) => ({ ...data, dashboards }));
  })
  .then((data) => {
    console.log(data);
    return data;
  })
  .then(({ accountId, token }) => {
    return fetch(`${baseUrl}/api/serviceaccounts/${accountId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      return response.json();
    });
  });
