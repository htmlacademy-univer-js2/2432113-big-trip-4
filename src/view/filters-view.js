import AbstractView from '../framework/view/abstract-view';

const createFilterTemplate = (eventsCount, filters) => {
  let result = '';
  filters.forEach((filter) => {
    result += `<div class="trip-filters__filter">
    <input  ${eventsCount === 0 ? 'disabled' : ''} id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>
    `;
  });
  return result;
};

const createFiltersTemplate = (eventsCount, filters) => `
<div class="trip-controls__filters">
        <h2 class="visually-hidden">Filter events</h2>
        <form class="trip-filters" action="#" method="get">
            ${createFilterTemplate(eventsCount, filters)}
            <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
    </div>
    `;

export default class FiltersView extends AbstractView {
  #eventsCount;
  #filters;
  constructor(eventsCount, filters) {
    super();
    this.#eventsCount = eventsCount;
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#eventsCount, this.#filters);
  }
}
