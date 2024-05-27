import SorterView from '../view/sorter-view.js';
import EventListView from '../view/event-list-view.js';
import { remove, render } from '../framework/render.js';
import EventsNoneView from '../view/events-none-view.js';
import EventPresenter from './event-presenter.js';
import { UpdateTypes, UserActions, FilterTypes } from '../const.js';
import { getSortingAlgorythm, SORT_TYPES } from '../sorter-utils.js';
import FiltersPresenter from './filters-presenter.js';
import EventAdderPresenter from './event-adder-presenter.js';
import { filter } from '../utils.js';
import LoadingView from '../view/loading-view.js';
import EventAdderView from '../view/event-adder-view.js';
import Observable from '../framework/observable.js';

export default class Presenter extends Observable {
  #eventListContainer = new EventListView();
  #headerElement;
  #eventsModel;
  #eventsContainer;
  #filtersModel;
  #eventPresenters = new Map();
  #currentSort = SORT_TYPES.DEFAULT;
  #sorterComponent;
  #onAddEventClose;
  #filtersElement;
  #eventsNoneComponent;
  #filterType = FilterTypes.ALL;
  #eventAdderPresenter;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #offersModel;
  #destinationsModel;

  constructor({
    headerElement,
    eventsContainer,
    eventsModel,
    filtersModel,
    onAddEventClose,
    offersModel,
    destinationsModel,
  }) {
    super();
    this.#headerElement = headerElement;
    this.#eventsModel = eventsModel;
    this.#eventsContainer = eventsContainer;
    this.#filtersModel = filtersModel;
    this.#onAddEventClose = onAddEventClose;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.addObserver(this.#handleModelEvent);

    Promise.all([
      this.#eventsModel.init(),
      this.#offersModel.init(),
      this.#destinationsModel.init(),
    ]).then(() => {
      this._notify(UpdateTypes.INIT);
    }).finally(() => {
      render(this.addEventButtonComponent, document.querySelector('.page-body__container'));
      this.#renderFilters();
    });
  }

  handleEventAdderButtonClick = () => {
    this.#createEvent();
    this.addEventButtonComponent.element.disabled = true;
  };

  addEventButtonComponent = new EventAdderView({
    onClick: this.handleEventAdderButtonClick
  });

  onAddTaskClose = () => {
    this.addEventButtonComponent.element.disabled = false;
  };

  init() {
    this.#renderComponents();
  }

  #createEvent() {
    this.#currentSort = SORT_TYPES.DEFAULT;
    this.#filtersModel.setFilter(UpdateTypes.MAJOR, FilterTypes.ALL);
    this.#eventAdderPresenter.init();
  }

  get events() {
    this.#filterType = this.#filtersModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);
    filteredEvents.sort(getSortingAlgorythm(this.#currentSort));
    return filteredEvents;
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter({
      offers: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,
      eventsContainer: this.#eventsContainer,
      onEventChange: this.#handleViewAction,
      onModeChange: this.#onModeChange
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  };

  #onModeChange = () => {
    this.#eventAdderPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEventsNone() {
    this.#eventsNoneComponent = new EventsNoneView(this.#filterType);
    render(this.#eventsNoneComponent, this.#eventsContainer);
  }

  #renderFilters() {
    this.#filtersElement = new FiltersPresenter({
      filtersContainer: this.#headerElement,
      filtersModel: this.#filtersModel,
      eventsModel: this.#eventsModel
    });
    this.#filtersElement.init();
  }

  #handleViewAction = (actionType, updateType, newEvent) => {
    switch (actionType) {
      case UserActions.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, newEvent);
        break;
      case UserActions.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, newEvent);
        break;
      case UserActions.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, newEvent);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateTypes.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateTypes.MINOR:
        this.#clearComponents();
        this.#renderComponents();
        break;
      case UpdateTypes.MAJOR:
        this.#clearComponents({ resetSortType: true });
        this.#renderComponents();
        break;
      case UpdateTypes.INIT:
        this.#eventAdderPresenter = new EventAdderPresenter({
          eventsContainer: this.#eventsContainer,
          onDataChange: this.#handleViewAction,
          onDestroy: this.onAddTaskClose,
          offers: this.#offersModel.offers,
          destinations: this.#destinationsModel.destinations,
        });
        this.#isLoading = false;
        this.#clearComponents();
        this.#renderComponents();
        break;
    }
  };

  #clearComponents({ resetSortType = false } = {}) {
    if (this.#eventAdderPresenter) {
      this.#eventAdderPresenter.destroy();
    }
    this.#clearEvents();
    remove(this.#eventListContainer);
    if (this.#sorterComponent) {
      remove(this.#sorterComponent);
    }
    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
    }

    if (this.#eventsNoneComponent) {
      remove(this.#eventsNoneComponent);
    }
    if (resetSortType) {
      this.#currentSort = SORT_TYPES.DEFAULT;
    }
  }

  #onSort = (sortType) => {
    if (this.#currentSort === sortType) {
      return;
    }
    this.#currentSort = sortType;

    this.#clearComponents();
    this.#renderComponents();
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsContainer);
  }

  #renderSorter() {
    this.#sorterComponent = new SorterView({
      currentSortType: this.#currentSort,
      onSort: this.#onSort
    });
    render(this.#sorterComponent, this.#eventsContainer);
  }

  #renderEventsContainer() {
    render(this.#eventListContainer, this.#eventsContainer);
  }

  #initEvents() {
    this.#renderEventsContainer();

    if (this.#eventsModel.events.length === 0 && !this.#isLoading) {
      this.#renderEventsNone();
    } else {
      this.#renderEvents(this.events);
    }
  }

  #clearEvents() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderComponents() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderSorter();
    this.#initEvents();
  }

  #renderEvents(events) {
    events.forEach((event) => {
      this.#renderEvent(event);
    });
  }
}
