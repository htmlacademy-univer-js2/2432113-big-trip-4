export default class OffersModel {
  #apiService;
  #offers = [];

  constructor({ offersApiService }) {
    this.#apiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const offers = await this.#apiService.offers;
      this.#offers = this.#adaptToClientOffers(offers);
    } catch(err) {
      this.#offers = [];
    }
  }

  #adaptToClientOffers(offers) {
    const adapted = offers.reduce((acc, { type, offers: itemOffers }) => {
      acc[type] = itemOffers;
      return acc;
    }, {});
    return adapted;
  }
}
