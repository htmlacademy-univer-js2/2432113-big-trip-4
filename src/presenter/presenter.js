import SorterView from '../view/sorter-view.js';
//import FiltersView from '../view/filters-view.js';
import EventListView from '../view/event-list-view.js';
//import EventEditorView from '../view/event-editor-view.js';
//import EventView from '../view/event-view.js';
import { remove, render } from '../framework/render.js';
import EventsNoneView from '../view/events-none-view.js';
import EventPresenter from './event-presenter.js';
//import { updateItem } from '../utils.js';
import { UpdateTypes, UserActions, FilterTypes } from '../const.js';
import { getSortingAlgorythm, SORT_TYPES } from '../sorter-utils.js';
import FiltersPresenter from './filters-presenter.js';
import EventAdderPresenter from './event-adder-presenter.js';
import { filter } from '../utils.js';

export default class Presenter {
  //#events = [];
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

  constructor({
    headerElement,
    eventsContainer,
    eventsModel,
    filtersModel,
    onAddEventClose
  }) {
    this.#headerElement = headerElement;
    this.#eventsModel = eventsModel;
    this.#eventsContainer = eventsContainer;
    this.#filtersModel = filtersModel;
    this.#onAddEventClose = onAddEventClose;

    this.#eventAdderPresenter = new EventAdderPresenter({
      eventsContainer: this.#eventsContainer,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onAddEventClose
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  init() {
    //this.#events = [...this.#eventsModel.events];
    this.#renderFilters();
    this.#renderComponents();
  }

  createEvent() {
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
    const eventPresenter = new EventPresenter(
      {
        eventsContainer: this.#eventsContainer,
        onEventChange: this.#handleViewAction,
        onModeChange: this.#onModeChange
      }
    );
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
    }
  };

  #clearComponents({ resetSortType = false } = {}) {
    this.#eventAdderPresenter.destroy();
    this.#clearEvents();
    remove(this.#eventListContainer);
    remove(this.#sorterComponent);

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

  #renderSorter() {
    this.#sorterComponent = new SorterView({
      onSort: this.#onSort
    });
    render(this.#sorterComponent, this.#eventsContainer);
  }

  #renderFilters() {
    this.#filtersElement = new FiltersPresenter({
      filtersContainer: this.#headerElement,
      filtersModel: this.#filtersModel,
      eventsModel: this.#eventsModel
    });
    this.#filtersElement.init();
  }

  #renderEventsContainer() {
    render(this.#eventListContainer, this.#eventsContainer);
  }

  #initEvents() {
    this.#renderEventsContainer();

    if (this.#eventsModel.events.length === 0) {
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
    this.#renderSorter();
    this.#initEvents();
  }

  #renderEvents(events) {
    events.forEach((event) => {
      this.#renderEvent(event);
    });
  }
}
