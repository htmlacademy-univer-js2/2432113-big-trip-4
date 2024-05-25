import AbstractView from '../framework/view/abstract-view';

const createFilterTemplate = (filter, currentFilterType) => {
  const { type, count } = filter;

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${count === 0 ? 'disabled' : ''}
        ${currentFilterType === type ? 'checked' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">
        ${type}
      </label>
    </div>
  `;
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filtersMarkup = filterItems
    .map((filter) => createFilterTemplate(filter, currentFilterType))
    .join('');

  return `
    <div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filtersMarkup}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>
  `;
};

export default class FiltersView extends AbstractView {
  #currentFilter;
  #filters;
  #handleFilterTypeChange;
  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#currentFilter = currentFilterType;
    this.#filters = filters;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
