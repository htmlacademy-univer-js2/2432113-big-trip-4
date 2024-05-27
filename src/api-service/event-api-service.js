import ApiService from '../framework/api-service';

export default class PointsApiService extends ApiService {
  get events() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get offers(){
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `points/${event.id}`,
      method: 'PUT',
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deleteEvent(event) {

    const response = await this._load({
      url: `points/${event.id}`,
      method: 'DELETE',
    });

    return response;
  }

  async addEvent(event) {
    const response = await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(event) {
    const adapted = {...event,
      'base_price': Number(event.basePrice),
      'date_from': event.date.start instanceof Date ? event.date.start.toISOString() : null,
      'date_to': event.date.end instanceof Date ? event.date.end.toISOString() : null,
      'is_favorite': event.isFavorite,
    };

    delete adapted.date;
    delete adapted.basePrice;
    delete adapted.isFavorite;

    return adapted;
  }
}
