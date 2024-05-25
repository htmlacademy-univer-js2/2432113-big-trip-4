import { FilterTypes, UpdateTypes } from '../const';
import FiltersView from '../view/filters-view';

import { render, replace, remove } from '../framework/render';
import { filter } from '../utils';

export default class FiltersPresenter {
  #filtersContainer;
  #filtersModel;
  #eventsModel;

  #filtersComponent = null;

  constructor({filtersContainer, filtersModel, eventsModel}) {
    this.#filtersContainer = filtersContainer;
    this.#filtersModel = filtersModel;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.init();
  }

  get filters() {
    const events = this.#eventsModel.events;

    return Object.values(FilterTypes).map((type) => ({
      type,
      count: filter[type](events).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFiltersComponent === null) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }
    this.#filtersModel.setFilter(UpdateTypes.MAJOR, filterType);
  };

  destroy() {
    remove(this.#filtersComponent);
    remove(this.#filtersContainer);
  }
}
