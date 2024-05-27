import { DATE_FORMAT_DAY } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { humanizeTaskDueDate } from '../utils.js';

function createInfoTemplate({ totalCount, destinations, isThree, dateStart, dateEnd }) {
  return (
    `
    <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
        <h1 class="trip-info__title">${destinations[0]} &mdash; ${isThree ? destinations[1] : '...'} &mdash; ${destinations[isThree ? 2 : 1]}</h1>

        <p class="trip-info__dates">${humanizeTaskDueDate(dateStart, DATE_FORMAT_DAY)}&nbsp;&mdash;&nbsp;${humanizeTaskDueDate(dateEnd, DATE_FORMAT_DAY)}</p>
        </div>

        <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCount}</span>
        </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #data;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return this.#data ? createInfoTemplate(this.#data) : '<div></div>';
  }
}
