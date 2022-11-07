import { RESTDataSource } from "apollo-datasource-rest";
import DataLoader from "dataloader";

export default class BeerService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.punkapi.com/v2/";
    this.dataLoader = new DataLoader(async (ids) => {
      const beers = await this.get(`beers?ids=${ids.join("|")}`);
      return ids.map(id => beers.find(beer => beer.id == id));
    })
  }

  async getBeerById(id) {
    return this.dataLoader.load(id);
  }

  async getBeersByName(name) {
    return this.get(`beers?beer_name=${name}`);
  }

  async getBeersById(ids) {
    return this.dataLoader.loadMany(ids);
  }

  async getBeers() {
    return this.get(`beers`);
  }
}
