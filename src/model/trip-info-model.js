export default class TripInfoModel {
  #destinations;
  events;
  #info;

  constructor({ events, offersModel, destinationsModel }) {
    this.#destinations = destinationsModel.destinations;
    this.events = offersModel.offers;
    this.#info = this.#prepareData(events);
  }

  get info() {
    return this.#info;
  }

  #countOffersPrice = (curOffers, activeOffers) => {
    let totalCount = 0;
    curOffers.forEach((offer) => {
      if (activeOffers.some((activeOffer) => offer.id === activeOffer)) {
        totalCount += offer.price;
      }
    });
    return totalCount;
  };

  #getTotalPrice(events) {
    return events.reduce((total, event) => {
      const currentTypeOffers = this.events[event.type];
      return total + event.basePrice + this.#countOffersPrice(currentTypeOffers, event.offers);
    }, 0);
  }

  #prepareData(events) {
    const destinations = [];

    if (events.length < 1) {
      return null;
    }

    events.forEach((event) => {
      const destination = this.#destinations.find(({ id }) => event.destination === id);
      if (destination) {
        destinations.unshift(destination.name);
      }
    });

    const totalCount = this.#getTotalPrice(events);
    const dateStart = events[events.length - 1].date.start;
    const dateEnd = events[0].date.end;

    return { totalCount, destinations, dateStart, dateEnd };
  }
}
