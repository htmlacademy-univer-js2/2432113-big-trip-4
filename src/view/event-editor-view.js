import { humanizeTaskDueDate } from '../utils.js';
import { DATE_FORMAT_EDIT} from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { DESTINATIONS } from '../const.js';
import { OFFERS } from '../mock/offers-mock.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createPicture = (picture) =>
  `
  <img class="event__photo" src="${picture}.jpg" alt="Event photo">
  `;

const createPictures = (cityPhotosSrc) => Array.from(cityPhotosSrc, createPicture);

const createOptions = (type) =>
  `<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>

    <div class="event__type-item">
      <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${'taxi' === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${'bus' === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${'train' === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${'ship' === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${'drive' === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${'flight' === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${'check-in' === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${'sightseeing' === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${'restaurant' === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
    </div>
  </fieldset>
</div>`;

const createDistOpt = (destination) => {
  let res = '';
  DESTINATIONS.forEach((dest) => {
    res += `<option ${destination === dest ? 'selected' : ''} value="${dest}">${dest}</option>`;
  });
  return res;
};

const createDestinations = (type, destination) =>
  `<div class="event__field-group  event__field-group--destination">
  <label class="event__label  event__type-output" for="event-destination-1">
    ${type}
  </label>

  <select class="event__input  event__input--destination" type="text" selected="${destination} id="destination-list-1">
    ${createDistOpt(destination)}

  </select>
</div>`;

const createOfferEdit = (offers) => {
  let res = '';
  offers.forEach((offer) => {
    res += `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}-1" type="checkbox" offerId="${offer.id}" ${offer.checked ? 'checked' : ''}>
      <label class="event__offer-label" for="${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
    `;
  });
  return res;
};


const createOffersEdit = (offers) =>
  `
  <section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${createOfferEdit(offers) }
    </div>
  </section>
  `;

const createEventEditorTemplate = ({type, destination, basePrice, date, desctiption, cityPhotosSrc, offers}) =>
  (
    `
    <li><form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        ${createOptions(type)}

      </div>

      ${createDestinations(type, destination)}

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeTaskDueDate(date.start, DATE_FORMAT_EDIT)}">
        &mdash;
        <label claыss="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeTaskDueDate(date.end, DATE_FORMAT_EDIT)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      ${createOffersEdit(offers)}


      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${desctiption}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPictures(cityPhotosSrc)}
          </div>
        </div>
      </section>
    </section>
    </form>
    </li>


    `
  );

export default class EventEditorView extends AbstractStatefulView{
  #onEventChange;
  #eventEditClick;
  #datepickerFrom;
  #datepickerTo;
  constructor({event, onEventClick, onEventChange}) {
    super();
    this._setState(EventEditorView.parseEventToState(event));
    this.#eventEditClick = onEventClick;
    this.#onEventChange = onEventChange;
    this._restoreHandlers();
  }

  get template() {
    return createEventEditorTemplate(this._state);
  }

  removeElement() {
    super.removeElement();
    this.#destroyDatepickers();
  }

  #destroyDatepickers() {
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #onDateChangeFrom = ([userDate]) => {
    this.updateElement({
      date: {
        start: userDate,
        end: this._state.date.end,
      },
    });
  };

  #onDateChangeTo = ([userDate]) => {
    this.updateElement({
      date: {
        start: this._state.date.start,
        end: userDate,
      },
    });
  };

  #setDatepickers() {
    const timeInputs = this.element.querySelectorAll('.event__input--time');
    if (this._state.date) {
      this.#datepickerFrom = this.#createDatepicker(timeInputs[0], this.#onDateChangeFrom);
      this.#datepickerTo = this.#createDatepicker(timeInputs[1], this.#onDateChangeTo);
    }
  }

  #createDatepicker(element, onChange) {
    return flatpickr(element, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: '',
      onChange: onChange,
    });
  }

  _restoreHandlers() {
    const handlers = [
      { selector: '.event__input--price', event: 'change', handler: this.#onPriceInput },
      { selector: '.event__reset-btn', event: 'click', handler: this.#onEditorClose },
      { selector: '.event__input--destination', event: 'change', handler: this.#onDestinationChange },
      { selector: '.event__type-group', event: 'change', handler: this.#onTypeChange },
      { selector: '.event__offer-checkbox', event: 'change', handler: this.#onOffersChange}
    ];
    handlers.forEach(({ selector, event, handler}) => {
      const elements = this.element.querySelectorAll(selector);
      elements.forEach((element) => element.addEventListener(event, handler));
    });

    this.element.addEventListener('submit', this.#onSaving);
    this.#setDatepickers();
  }

  #onOffersChange = (evt) => {
    const offerId = evt.target.getAttribute('offerId');
    const curOffer = this._state.offers.find((offer) => offer.id === offerId);

    if (curOffer) {
      curOffer.checked = evt.target.checked;
    }

    this.updateElement({
      offers: this._state.offers,
    });
  };

  #onTypeChange = (evt) => {
    evt.preventDefault();
    const newType = evt.target.value;
    const newOffers = OFFERS[newType.toLowerCase()];

    this.updateElement({
      type: newType,
      offers: newOffers
    });
  };

  #onEditorClose = (evt) => {
    evt.preventDefault();
    this.#eventEditClick(this._state);
  };

  #onSaving = (evt) => {
    evt.preventDefault();
    this.#onEditorClose(evt);
    this.#onEventChange(EventEditorView.parseStateToEvent(this._state));
  };

  #onDestinationChange = (evt) => {
    this.updateElement({
      destination: evt.target.value,
    });
  };

  #onPriceInput = (evt) => {
    this.updateElement({
      basePrice: evt.target.value,
    });
  };

  static parseEventToState(event){
    return {...event};
  }

  static parseStateToEvent(state){
    return {...state};
  }
}
