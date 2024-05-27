import AbstractView from '../framework/view/abstract-view.js';
import { DATE_FORMAT_DAY, DATE_FORMAT_HOURS } from '../const.js';
import { humanizeTaskDueDate, countDuration } from '../utils.js';

const createOffers = (offers, offersData) => {
  let res = '';
  offers.forEach((offerId) => {
    const curOfferData = offersData.find(({id}) => id === offerId);
    res += `
    <li class="event__offer">
      <span class="event__offer-title">${curOfferData.title}</span>
      +€&nbsp;
      <span class="event__offer-price">${curOfferData.price}</span>
    </li>
    `;
  });
  return res;
};


function createEventTemplate(event, offersData, destinationData ) {
  return (
    `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${event.date.start}">${humanizeTaskDueDate(event.date.start, DATE_FORMAT_DAY)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.type} ${destinationData !== undefined ? destinationData.name : 'Choose destination'}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${event.date.start}">${humanizeTaskDueDate(event.date.start, DATE_FORMAT_HOURS)}</time>
            &mdash;
            <time class="event__end-time" datetime="${event.date.end}}">${humanizeTaskDueDate(event.date.end, DATE_FORMAT_HOURS)}</time>
          </p>
          <p class="event__duration">${countDuration(event.date.start, event.date.end)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffers(event.offers, offersData)}
        </ul>
        <button class="event__favorite-btn ${event.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
    `
  );
}

export default class EventView extends AbstractView{
  #eventClick;
  #event;
  #eventFavoriteClick;
  #offers;
  #destination;

  constructor({event, onEventClick, onFavoriteClick, offers, destinations}){
    super();
    this.#event = event;
    this.#eventClick = onEventClick;
    this.#eventFavoriteClick = onFavoriteClick;
    this.#offers = offers;
    this.#destination = destinations;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#eventClickHandler);
    this.element.querySelector('.event__favorite-btn ').addEventListener('click', this.#eventFavoriteClick);
  }

  get template() {
    return createEventTemplate(this.#event, this.#offers, this.#destination);
  }

  #eventClickHandler = (evt) => {
    evt.preventDefault();
    this.#eventClick();
  };
}
