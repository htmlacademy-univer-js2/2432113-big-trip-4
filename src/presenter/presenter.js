import SorterView from '../view/sorter-view.js';
import EventListView from '../view/event-list-view.js';
import { remove, render } from '../framework/render.js';
import EventsNoneView from '../view/events-none-view.js';
import EventPresenter from './event-presenter.js';
import { UpdateTypes, UserActions, FilterTypes, TimeLimit } from '../const.js';
import { getSortingAlgorhythm, SortTypes } from '../sorter-utils.js';
import FiltersPresenter from './filters-presenter.js';
import EventAdderPresenter from './event-adder-presenter.js';
import { filter } from '../utils.js';
import LoadingView from '../view/loading-view.js';
import EventAdderView from '../view/event-adder-view.js';
import Observable from '../framework/observable.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripInfoPresenter from './trip-info-presenter.js';

export default class Presenter extends Observable {
  #eventListContainer = new EventListView();
  #headerElement;
  #eventsModel;
  #eventsContainer;
  #filtersModel;
  #eventPresenters = new Map();
  #currentSort = SortTypes.DEFAULT;
  #sorterComponent;
  #filtersElement;
  #eventsNoneComponent;
  #filterType = FilterTypes.ALL;
  #eventAdderPresenter;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #offersModel;
  #destinationsModel;
  #tripMain;
  #tripInfoPresenter;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  addEventButtonComponent = new EventAdderView({
    onClick: () => {
      this.#createEvent();
      this.addEventButtonComponent.element.disabled = true;
      if(this.#eventsNoneComponent){
        remove(this.#eventsNoneComponent);
      }
    }});

  constructor({
    headerElement,
    eventsContainer,
    eventsModel,
    filtersModel,
    offersModel,
    destinationsModel,
    tripMain
  }) {
    super();
    this.#headerElement = headerElement;
    this.#eventsModel = eventsModel;
    this.#eventsContainer = eventsContainer;
    this.#filtersModel = filtersModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#tripMain = tripMain;

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
      this.#renderFilters();
      render(this.addEventButtonComponent, this.#tripMain);
    });
  }

  init() {
    this.#renderComponents();
  }

  #createEvent() {
    this.#currentSort = SortTypes.DEFAULT;
    this.#filtersModel.setFilter(UpdateTypes.MAJOR, FilterTypes.ALL);

    this.#eventAdderPresenter.init();
  }

  get events() {
    this.#filterType = this.#filtersModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);
    filteredEvents.sort(getSortingAlgorhythm(this.#currentSort));
    return filteredEvents;
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter({
      offers: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,
      eventsContainer: this.#eventListContainer.element,
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

  #renderTripInfo(){
    this.#tripInfoPresenter = new TripInfoPresenter({
      tripMain: this.#tripMain,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
    });
    //this.#tripInfoPresenter.init(this.events);
  }

  #renderFilters() {
    this.#filtersElement = new FiltersPresenter({
      filtersContainer: this.#headerElement,
      filtersModel: this.#filtersModel,
      eventsModel: this.#eventsModel
    });
    this.#filtersElement.init();
  }

  #handleViewAction = async (actionType, updateType, newEvent) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserActions.UPDATE_EVENT:
        //console.log(this.#eventPresenters.get(newEvent.id));
        this.#eventPresenters.get(newEvent.id).setSaving();
        try{
          await this.#eventsModel.updateEvent(updateType, newEvent);
        } catch(err){
          this.#eventPresenters.get(newEvent.id).setAborting();
        }
        break;
      case UserActions.ADD_EVENT:
        this.#eventAdderPresenter.setSaving();
        try{
          await this.#eventsModel.addEvent(updateType, newEvent);
        } catch (err){
          this.#eventAdderPresenter.setAborting();
        }
        break;
      case UserActions.DELETE_EVENT:
        this.#eventPresenters.get(newEvent.id).setDeleting();
        try{
          await this.#eventsModel.deleteEvent(updateType, newEvent);
        } catch (err) {
          this.#eventPresenters.get(newEvent.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
          onDestroy: () => {this.addEventButtonComponent.element.disabled = false;},
          offers: this.#offersModel.offers,
          destinations: this.#destinationsModel.destinations,
          isNew: false
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
      this.#currentSort = SortTypes.DEFAULT;
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

    if(!this.#tripInfoPresenter){
      this.#renderTripInfo();
    }

    this.#tripInfoPresenter.init(this.events);
    this.#renderSorter();
    this.#initEvents();
  }

  #renderEvents(events) {
    events.forEach((event) => {
      this.#renderEvent(event);
    });
  }
}
