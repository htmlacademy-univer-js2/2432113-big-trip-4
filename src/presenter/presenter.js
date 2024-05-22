import SorterView from '../view/sorter-view.js';
import FiltersView from '../view/filters-view.js';
import EventListView from '../view/event-list-view.js';
//import EventEditorView from '../view/event-editor-view.js';
//import EventView from '../view/event-view.js';
import { render } from '../framework/render.js';
import EventsNoneView from '../view/events-none-view.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils.js';

export default class Presenter {
  #events = [];
  #eventListContainer = new EventListView();
  #headerElement;
  #eventsModel;
  #eventsContainer;
  #filtersModel;
  #eventPresenters = new Map();

  constructor({ headerElement, eventsContainer, eventsModel, filtersModel}) {
    this.#headerElement = headerElement;
    this.#eventsModel = eventsModel;
    this.#eventsContainer = eventsContainer;
    this.#filtersModel = filtersModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#renderComponents();
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(
      {
        eventsContainer: this.#eventsContainer,
        onEventChange: this.#onEventChange,
        onModeChange: this.#onModeChange
      }
    );
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  };

  #onModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEventsNone(){
    render(new EventsNoneView(), this.#eventsContainer);
  }

  #renderSorter(){
    render(new SorterView(), this.#headerElement);
  }

  #renderFilters(){
    render(new FiltersView(this.#events.length, Object.keys(this.#filtersModel.filters)), this.#headerElement);
  }

  #renderEventsContainer(){
    render(this.#eventListContainer, this.#eventsContainer);
  }

  #initEvents(){
    this.#renderEventsContainer();

    if(this.#events.length === 0){
      this.#renderEventsNone();
    }
    else{
      this.#renderEvents();
    }
  }

  #clearEvents() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderComponents() {
    this.#renderSorter();
    this.#renderFilters();
    this.#initEvents();
  }

  #renderEvents() {
    this.#events.forEach((event) => {
      this.#renderEvent(event);
    });
  }

  #onEventChange = (newEvent) => {
    this.#events = updateItem(this.#events, newEvent);
    this.#eventPresenters.get(newEvent.id).init(newEvent);
  };
}
