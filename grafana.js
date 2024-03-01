const baseUrl = "http://grafana:3000/api";

export const apiRequest = (url, options) => {
  const auth = options?.token ? "Bearer" + options.token : "Basic " + btoa(`admin:${process.env.GRAFANA_PASSWORD}`);

  return fetch(`${baseUrl}/${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
  });
};

export const login = () => {
  return apiRequest("serviceaccounts", {
    method: "POST",
    body: JSON.stringify({ name: "export", role: "Admin" }),
  })
    .then((response) => response.json())
    .then((data) => data.id)
    .then((accountId) => {
      return apiRequest(`/serviceaccounts/${accountId}/tokens`, {
        method: "POST",
        body: JSON.stringify({ name: "export-token" }),
      })
        .then((response) => response.json())
        .then((data) => ({ accountId, token: data.key }));
    });
};

export const logout = (accountId, token) => {
  return apiRequest(`serviceaccounts/${accountId}`, {
    method: "DELETE",
    token,
  }).then((response) => response.json());
};

export const getDashboards = (token) => {
  return apiRequest("search", {
    token,
  }).then((response) => response.json());
};

export const getDashboard = (uid, token) => {
  return apiRequest(`dashboards/uid/${uid}`, {
    token,
  }).then((response) => response.json());
};
