import SorterView from '../view/sorter-view.js';
import FiltersView from '../view/filters-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditorView from '../view/event-editor-view.js';
import EventView from '../view/event-view.js';
import { replace, render } from '../framework/render.js';

export default class Presenter {
  #events = [];
  #eventListComponent = new EventListView();
  #headerElement = null;
  #eventsModel = null;
  #tripsElement = null;
  constructor({ headerElement, tripsElement, eventsModel}) {
    this.#headerElement = headerElement;
    this.#eventsModel = eventsModel;
    this.#tripsElement = tripsElement;
  }

  init() {
    this.#events = [...this.#eventsModel.getEvents()];

    render(new FiltersView(), this.#headerElement);
    render(new SorterView(), this.#tripsElement);
    render(this.#eventListComponent, this.#tripsElement);

    this.#events.forEach((event) =>
    {
      this.#renderEvent(event);
    });
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
