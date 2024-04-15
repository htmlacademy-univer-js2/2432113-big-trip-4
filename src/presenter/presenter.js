import SorterView from '../view/sorter-view.js';
import FiltersView from '../view/filters-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditorView from '../view/event-editor-view.js';
import EventView from '../view/event-view.js';
import { replace, render } from '../framework/render.js';
import EventsNoneView from '../view/events-none-view.js';

export default class Presenter {
  #events = [];
  #filters = [];
  #eventListComponent = new EventListView();
  #headerElement;
  #eventsModel;
  #tripsElement;
  #filtersModel;
  constructor({ headerElement, tripsElement, eventsModel, filtersModel}) {
    this.#headerElement = headerElement;
    this.#eventsModel = eventsModel;
    this.#tripsElement = tripsElement;
    this.#filtersModel = filtersModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    render(new FiltersView(this.#events.length, Object.keys(this.#filtersModel.filters)), this.#headerElement);
    render(new SorterView(), this.#tripsElement);
    render(this.#eventListComponent, this.#tripsElement);

    if (this.#events.length === 0){
      render(new EventsNoneView(), this.#tripsElement);
    }
    else{
      this.#events.forEach((event) =>
      {
        this.#renderEvent(event);
      });
    }
  }

  #renderEvent = (event) => {
    const onDocumentKeyDown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditToEvent();
        document.removeEventListener('keydown', onDocumentKeyDown);
      }
    };

    const eventComponent = new EventView(
      {
        event: event,
        onEventClick: () => {
          replaceEventToEdit();
          document.addEventListener('keydown', onDocumentKeyDown);
        }
      }
    );
    const editComponent = new EventEditorView(
      {
        event: event,
        onEventClick: () =>{
          replaceEditToEvent();
          document.removeEventListener('keydown', onDocumentKeyDown);
        }
      }
    );

    function replaceEventToEdit() {
      replace(editComponent, eventComponent);
    }

    function replaceEditToEvent() {
      replace(eventComponent, editComponent);
    }
    render(eventComponent, this.#eventListComponent.element);
  };
}
