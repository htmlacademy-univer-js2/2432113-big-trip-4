import SorterView from '../view/sorter-view.js';
import FiltersView from '../view/filters-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditorView from '../view/event-editor-view.js';
import EventView from '../view/event-view.js';

import { render } from '../render.js';

const EVENTS_COUNT = 3;

export default class Presenter {
  constructor({ header, events, controls }) {
    this.headerElement = header;
    this.eventsElement = events;
    this.controlsElement = controls;
    this.eventListComponent = new EventListView();
  }

  init() {
    render(new FiltersView(), this.headerElement);
    render(new SorterView(), this.eventsElement);
    render(this.eventListComponent, this.eventsElement);
    render(new EventEditorView(), this.eventListComponent.getElement());

    for (let i = 0; i < EVENTS_COUNT; i++) {
      render(new EventView(), this.eventListComponent.getElement());
    }
  }
}
