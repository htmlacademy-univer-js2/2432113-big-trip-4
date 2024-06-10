import Observable from '../framework/observable.js';

export default class EventsModel extends Observable{
  #events = [];
  #eventsApiService;

  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  async init(){
    try {
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptToClientEvents);

    } catch(err) {
      this.#events = [];
    }

  }

  get events() {
    return this.#events;
  }

  #adaptToClientEvents(event) {
    const adapted = {...event,
      date: { start: new Date(event['date_from']), end: new Date(event['date_to'])},
      basePrice: event['base_price'],
      isFavorite: event['is_favorite'],
    };

    delete adapted['base_price'];
    delete adapted['date_from'];
    delete adapted['date_to'];
    delete adapted['is_favorite'];

    return adapted;
  }

  async updateEvent (updateType, newEvent) {
    const index = this.#events.findIndex((event) => event.id === newEvent.id);

    if (index === -1) {
      throw new Error('can\'t find event' );
    }

    try {
      const response = await this.#eventsApiService.updateEvent(newEvent);
      const updatedEvent = this.#adaptToClientEvents(response);
      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error('Can\'t update event');
    }
  }


  async addEvent(updateType, newEvent){
    try {

      const response = await this.#eventsApiService.addEvent(newEvent);
      const adaptedResponse = this.#adaptToClientEvents(response);
      this.#events = [adaptedResponse, ...this.#events];

      this._notify(updateType, adaptedResponse);
    } catch(err) {
      throw new Error(err);

    }
  }

  async deleteEvent(updateType, newEvent){

    const index = this.#events.findIndex((event) => event.id === newEvent.id);

    if (index === -1) {
      throw new Error('can\'t find event' );
    }

    try {
      await this.#eventsApiService.deleteEvent(newEvent);
      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete event');
    }
  }
}
