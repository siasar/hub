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

  parseAdm(adm) {
    function getNames(obj) {
      let names = [];
      while (obj) {
        names.push(obj.name);
        obj = obj.parent;
      }
      return names;
    }

    const names = getNames(adm).reverse();

    return {
      adm0: this.country.name,
      adm1: names[0],
      adm2: names[1],
      adm3: names[2],
      adm4: names[3],
    };
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
        country: this.country.code,
        image_url: point.image ? this.country.url + point.image : null,
        ...this.parseAdm(point.administrative_division?.[0].meta),
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
      country: this.country.code,
      country_name: this.country.name,
      point_id: pointId,
      image_url: inquiry.field_image?.[0]?.meta.url ? this.country.url + inquiry.field_image[0].meta.url : null,
      version: inquiry.field_editors_update.pop()?.value,
      ...this.parseAdm(inquiry.field_region.meta),
    }));

    return {
      communities: inquiries.filter((i) => i.type === "form.community"),
      systems: inquiries.filter((i) => i.type === "form.wssystem"),
      providers: inquiries.filter((i) => i.type === "form.wsprovider"),
    };
  }
}
