import { humanizeTaskDueDate } from '../utils.js';
import { DATE_FORMAT_EDIT} from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

const createPicture = (picture) =>
  `
  <img class="event__photo" src="${picture.src}" alt="Event photo">
  `;

const createPictures = (photos) => photos.map((photo) => createPicture(photo)).join('');

const createOption = (type, isActive) => `
<div class="event__type-item">
  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isActive ? 'checked' : ''}>
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
</div>`;

const createOptions = (currentType, allTypes) =>
  (`<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${allTypes.map((type) =>
      createOption(type, currentType === type)
    ).join('')}
    </fieldset>
  </div>`);

const createDestination = (destination, isActive) => `<option ${isActive ? 'selected' : ''} value="${destination}">${destination}</option>`;

const createDestinations = (curType, curDestination, allDestinations, isDisabled) =>
  `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${curType}
    </label>

    <select class="event__input  event__input--destination" id="destination-list-1" ${isDisabled ? 'disabled' : ''}>
      ${curDestination !== '' ?
    allDestinations.map((destination) =>
      createDestination(destination.name, destination.id === curDestination)
    ).join('') :
    allDestinations.map((destination) =>
      createDestination(destination.name, false)
    ).join('')
}
    </select>
  </div>`;

const createOfferEdit = (currentTypeOffers, offers, isDisabled) => {
  let res = '';

  currentTypeOffers.forEach((offer) => {
    let isActive = false;
    if(offers){
      isActive = offers.some((offerId) => offerId === offer.id);
    }
    res += `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}-1" type="checkbox" name="${offer.id}" ${ isActive ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
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


const createOffersEdit = (currentTypeOffers, offers, isDisabled) =>
  `
  <section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${createOfferEdit(currentTypeOffers, offers, isDisabled) }
    </div>
  </section>
  `;

const createButtons = (isNew, isDisabled, isDeleting, isSaving) =>{
  const saveButtonText = isSaving ? 'Saving...' : 'Save';
  const resetButtonText = isNew ? 'Cancel' : 'Delete';

  return(`
  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${saveButtonText}</button>
  <button class="event__reset-btn" type="reset"? ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : resetButtonText}</button>
  ${isNew ? '' : '<button class="event__rollup-btn" type="button">'}
  `);
};

const createDestinationInfo = (curDestinationData) => {
  if (!curDestinationData.description & curDestinationData.pictures.length < 1){
    return '';
  }
  return `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${curDestinationData.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPictures(curDestinationData.pictures)}
          </div>
        </div>
      </section>`;
};

const createEventEditorTemplate = (event, allOffers, allDestinations) =>{
  const curDestinationData = allDestinations.find(({id}) => id === event.destination);
  const {type, destination, basePrice, date, offers, isNew, isDeleting, isSaving, isDisabled} = event;
  const currentTypeOffers = allOffers[event.type];

  return (
    `
    <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

        ${createOptions(type, Object.keys(allOffers))}

      </div>

      ${createDestinations(type, destination, allDestinations, isDisabled)}

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input  class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeTaskDueDate(date.start, DATE_FORMAT_EDIT)}" ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeTaskDueDate(date.end, DATE_FORMAT_EDIT)}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
      </div>
        ${createButtons(isNew, isDisabled, isDeleting, isSaving)}
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${currentTypeOffers.length > 0 ? createOffersEdit(currentTypeOffers, offers, isDisabled) : ''}

      ${curDestinationData ? createDestinationInfo(curDestinationData) : ''}

    </section>
    </form>
    </li>
    `
  );};

export default class EventEditorView extends AbstractStatefulView{
  #onSubmit;
  #datepickerFrom;
  #datepickerTo;
  #deleteEvent;
  #event;
  #isCreateNewEvent ;
  #allOffers;
  #allDestinations;
  constructor({event, onSubmit, deleteEvent, offers, destinations, isNew}) {
    super();
    this._setState(EventEditorView.parseEventToState(event, isNew));
    this.#onSubmit = onSubmit;
    this.#event = event;
    this.#deleteEvent = deleteEvent;
    this.#allOffers = offers;
    this.#allDestinations = destinations;

    this.#isCreateNewEvent = isNew;
    this._restoreHandlers();
  }

  get template() {
    return createEventEditorTemplate(this._state, this.#allOffers, this.#allDestinations);
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
    this._setState({
      date: {
        start: userDate,
        end: this._state.date.end,
      },
    });
  };

  #onDateChangeTo = ([userDate]) => {
    this._setState({
      date: {
        start: this._state.date.start,
        end: userDate,
      },
    });
  };

  #setDatepickers() {
    const timeInputs = this.element.querySelectorAll('.event__input--time');
    if (this._state.date) {
      this.#datepickerFrom = this.#createDatepicker(timeInputs[0], this.#onDateChangeFrom, this._state.date.start);
      this.#datepickerTo = this.#createDatepicker(timeInputs[1], this.#onDateChangeTo, this._state.date.end);
    }
  }

  #createDatepicker(element, onChange, stateTime) {
    return flatpickr(element, {
      enableTime: true,
      // это свойство флэтпикера, его в camelcase я не превращу :/
      // eslint-disable-next-line camelcase
      time_24hr: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: stateTime ? dayjs(stateTime).format('DD/MM/YY HH:mm') : '',
      onChange: onChange,
    });
  }

  _restoreHandlers() {
    const handlers = [
      { selector: '.event__input--price', event: 'input', handler: this.#onPriceInput },
      { selector: '.event__reset-btn', event: 'click', handler: this.#onDeleteButtonClick },
      { selector: '.event__input--destination', event: 'change', handler: this.#onDestinationChange },
      { selector: '.event__type-group', event: 'input', handler: this.#onTypeChange },
      { selector: '.event__offer-checkbox', event: 'change', handler: this.#onOffersChange }
    ];

    if(!this._state.isNew){
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#onEditorClose);
    }

    handlers.forEach(({ selector, event, handler }) => {
      const elements = this.element.querySelectorAll(selector);
      elements.forEach((element) => element.addEventListener(event, handler));
    });

    this.element.addEventListener('submit', this.#onSaving);
    this.#setDatepickers();
  }

  #onOffersChange = (evt) => {
    const offerId = evt.target.name;

    const newOffers = this._state.offers.includes(offerId) ?
      this._state.offers.filter((offer) => offer !== offerId) :
      [...this._state.offers, offerId];

    this.updateElement({
      offers: newOffers,
    });
  };

  #onTypeChange = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  reset(event) {
    this.updateElement(
      EventEditorView.parseEventToState(event, this.#isCreateNewEvent),
    );
  }

  #onEditorClose = (evt) => {
    evt.preventDefault();
    this.reset(this.#event);
    this.#onSubmit();
  };

  #onDeleteButtonClick = (evt) => {
    evt.preventDefault();
    this.#deleteEvent(EventEditorView.parseStateToEvent(this._state));
  };

  #onSaving = (evt) => {
    evt.preventDefault();
    this.#onSubmit(EventEditorView.parseStateToEvent(this._state));
  };

  #onDestinationChange = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#allDestinations.find(({name}) => name === evt.target.value).id,
    });
  };

  //пофиксил (нужны были setState, а не полные апдейты)
  #onPriceInput = (evt) => {
    const regex = /^\d{1,6}$/;
    if (regex.test(evt.target.value)) {
      this._setState({
        basePrice: evt.target.value,
      });
    }
  };

  static parseEventToState(event, isNew){
    return {
      ...event,
      isNew: isNew,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToEvent(state){
    const event = {...state };
    delete event.isNew;
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    return event;
  }
}
