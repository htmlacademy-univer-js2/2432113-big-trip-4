import { getRandomMockEvent} from '../mock/event-mock.js';
import { MAX_EVENT_COUNT } from '../const.js';
import Observable from '../framework/observable.js';

export default class EventsModel extends Observable{
  #events = Array.from({length: MAX_EVENT_COUNT}, getRandomMockEvent);

  get events() {
    return this.#events;
  }

  #findEventIndex(eventId) {
    const index = this.#events.findIndex((event) => event.id === eventId);
    if (index === -1) {
      throw new Error('Can\'t find event');
    }
    return index;
  }

  updateEvent(updateType, newEvent) {
    const index = this.#findEventIndex(newEvent.id);
    this.#events = [
      ...this.#events.slice(0, index),
      newEvent,
      ...this.#events.slice(index + 1),
    ];
    this._notify(updateType, newEvent);
  }

  addEvent(updateType, newEvent) {
    this.#events = [newEvent, ...this.#events];
    this._notify(updateType, newEvent);
  }

  deleteEvent(updateType, eventToDelete) {
    const index = this.#findEventIndex(eventToDelete.id);
    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];
    this._notify(updateType);
  }
}
