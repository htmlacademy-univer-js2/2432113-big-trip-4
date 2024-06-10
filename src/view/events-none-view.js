import AbstractView from '../framework/view/abstract-view';

import {FilterTypes} from '../const.js';

const noEventsMessage = {
  [FilterTypes.ALL]: 'Click New Event to create your first event',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.PAST]: 'There are no past events now',
};

const createEventsNoneTemplate = (filterType) =>
  `
    <p class="trip-events__msg">${noEventsMessage[filterType]}</p>
  `;

export default class EventsNoneView extends AbstractView{

  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEventsNoneTemplate(this.#filterType);
  }
}
