export default class Api {
  constructor(country) {
    this.country = country;
    this.baseUrl = country.url + "/api/v1";
    this.username = country.username;
    this.password = country.password;
  }

  async login() {
    const response = await fetch(`${this.baseUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: this.username, password: this.password }),
    });

    this.token = (await response.json()).token;

    return this.token;
  }

  async getPoints(page = 1) {
    if (!this.token) await this.login();

    const params = new URLSearchParams({
      page: page,
      status: "calculated",
    });

    const response = await fetch(`${this.baseUrl}/form/data/form.points?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (response.status !== 200) return;

    return (await response.json())
      .filter((point, index, self) => {
        return self.findIndex((p) => p.id === point.id) === index;
      })
      .map((point) => ({
        ...point,
        country_code: this.country.code,
        country_name: this.country.name,
        image_url: point.image ? this.country.url + point.image : null,
      }));
  }

  async getCommunity(id) {
    if (!this.token) await this.login();

    const response = await fetch(`${this.baseUrl}/form/data/form.communitys/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });

    return await response.json();
  }

  async getSystem(id) {
    if (!this.token) await this.login();

    const response = await fetch(`${this.baseUrl}/form/data/form.wssystems/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });

    return await response.json();
  }

  async getProvider(id) {
    if (!this.token) await this.login();

    const response = await fetch(`${this.baseUrl}/form/data/form.wsproviders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch provider ${id}`);
    }

    return await response.json();
  }

  async getData(type, inquiries, fetchData) {
    const filteredInquiries = inquiries.filter((i) => i.type === type);
    const details = await Promise.all(filteredInquiries.map((inquiry) => fetchData(inquiry.id)));
    return filteredInquiries.map((inquiry, index) => {
      const { indicator, indicator_value, country_code, country_name, image_url, version} = inquiry;
      const { ...inquiryDetails } = details[index];
      return {
        indicator,
        indicator_value,
        country_code,
        country_name,
        image_url,
        version,
        ...inquiryDetails
      }
    });
  }

  async getInquiries(pointId) {
    if (!this.token) await this.login();

    const response = await fetch(`${this.baseUrl}/form/data/form.points/${pointId}/inquiries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });

    const inquiries = (await response.json()).map((inquiry) => ({
      ...inquiry,
      country_code: this.country.code,
      country_name: this.country.name,
      point_id: pointId,
      image_url: inquiry.field_image?.[0]?.meta.url ? this.country.url + inquiry.field_image[0].meta.url : null,
      version: inquiry.field_editors_update.pop()?.value,
    }));

    const communities = await this.getData("form.community", inquiries, this.getCommunity.bind(this));
    const systems = await this.getData("form.wssystem", inquiries, this.getSystem.bind(this));
    const service_providers = await this.getData("form.wsprovider", inquiries, this.getProvider.bind(this));

    return {
      communities: communities,
      systems: systems,
      providers: service_providers,
    };
  }
}
