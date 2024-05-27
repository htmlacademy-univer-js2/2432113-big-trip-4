export default class DestinationsModel {
  apiService;
  #destinations = [];

  constructor({ destinationsApiService }) {
    this.apiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {

    try {
      const destinations = await this.apiService.destinations;
      this.#destinations = destinations;

    } catch(err) {

      this.#destinations = [];
    }
  }

}
