import { remove, render, replace } from '../framework/render';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #tripInfoComponent;

  #offersModel;
  #destinationsModel;
  #eventsModel;

  #tripMain;
  constructor({tripMain, eventsModel, offersModel, destinationsModel}) {
    this.#tripMain = tripMain;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.init();
  }

  init() {
    const prevTripInfoComponent = this.#tripInfoComponent;

    const events = this.#eventsModel.events;
    const data = this.#prepareData(events);

    this.#tripInfoComponent = new TripInfoView(data);

    if (!prevTripInfoComponent) {
      render(this.#tripInfoComponent, this.#tripMain);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #countOffersCost = (curOffers, activeOffers) => {
    let totalCount = 0;
    curOffers.forEach((offer) => {
      if (activeOffers.some((activeOffer) => offer.id === activeOffer)) {
        totalCount += offer.price;
      }
    });

    return totalCount;
  };

  #getTotalCost = (events) => {
    let totalCount = 0;

    events.forEach((event) => {
      const currentTypeOffers = this.#offersModel.offers[event.type];
      totalCount += event.basePrice + this.#countOffersCost(currentTypeOffers, event.offers);
    });
    return totalCount;
  };

  #prepareData = (events) => {
    const destinations = [];

    switch (events.length) {
      case 3:
        events.forEach((event) => {
          destinations.unshift(this.#destinationsModel.destinations.find(({ id }) => event.destination === id).name);
        });
        return {
          totalCount: this.#getTotalCost(events),
          destinations: destinations,
          isThree: true,
          dateStart: events[0].date.start,
          dateEnd: events[2].date.end
        };
      default:
        if (events.length < 3) {
          return;
        }
    }

    destinations.unshift(this.#destinationsModel.destinations.find(({ id }) => events[0].destination === id).name);
    destinations.unshift(this.#destinationsModel.destinations.find(({ id }) => events[events.length - 1].destination === id).name);

    const totalCount = this.#getTotalCost(events);

    return { totalCount, destinations, isThree: false, dateStart: events[events.length - 1].date.start, dateEnd: events[0].date.end };
  };
}
