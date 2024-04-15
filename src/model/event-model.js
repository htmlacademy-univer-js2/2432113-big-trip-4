import { getRandomMockEvent} from '../mock/event-mock.js';
import { MAX_EVENT_COUNT } from '../const.js';

export default class EventsModel {
  #events = Array.from({length: MAX_EVENT_COUNT}, getRandomMockEvent);

  get events() {
    return this.#events;
  }

}

export {EventsModel};
