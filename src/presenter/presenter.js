import SorterView from '../view/sorter-view.js';
import FiltersView from '../view/filters-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditorView from '../view/event-editor-view.js';
import EventView from '../view/event-view.js';
import { render } from '../render.js';
import { MAX_EVENT_COUNT } from '../const.js';

export default class Presenter {
  constructor({ headerElement, tripsElement, eventsModel}) {
    this.headerElement = headerElement;
    this.eventsModel = eventsModel;
    this.eventListComponent = new EventListView();
    this.tripsElement = tripsElement;
  }

  init() {
    this.events = [...this.eventsModel.getEvents()];
    render(new FiltersView(), this.headerElement);
    render(new SorterView(), this.tripsElement);
    render(this.eventListComponent, this.tripsElement);
    render(new EventEditorView(this.events[0]), this.eventListComponent.getElement());

    for (let i = 1; i < MAX_EVENT_COUNT; i++) {
      render(new EventView(this.events[i]), this.eventListComponent.getElement());
    }
  }
}
