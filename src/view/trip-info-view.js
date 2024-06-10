import { DATE_FORMAT_DAY } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { humanizeTaskDueDate } from '../utils.js';

function formatTripTitle(destinations) {
  const totalDestinations = destinations.length;
  if (totalDestinations === 1) {
    return destinations[0];
  }

  if (totalDestinations === 2) {
    return `${destinations[1]} — ${destinations[0]}`;
  }

  if (totalDestinations === 3) {
    return `${destinations[2]} — ${destinations[1]} — ${destinations[0]}`;
  }

  return `${destinations[totalDestinations - 1]} — ... — ${destinations[0]}`;
}

function createInfoTemplate({ totalCount, destinations, dateStart, dateEnd }) {
  const tripTitle = formatTripTitle(destinations);

  return (
    `
    <section class="trip-main__trip-info trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">${tripTitle}</h1>
            <p class="trip-info__dates">
                ${humanizeTaskDueDate(dateStart, DATE_FORMAT_DAY)}&nbsp;&mdash;&nbsp;${humanizeTaskDueDate(dateEnd, DATE_FORMAT_DAY)}
            </p>
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
