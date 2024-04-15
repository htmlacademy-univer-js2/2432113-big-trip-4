import AbstractView from '../framework/view/abstract-view';


const createEmptyPoint = () =>
  `
    <p class="trip-events__msg">Click New Event to create your first point</p>
  `;

export default class EventsNoneView extends AbstractView{
  get template() {
    return createEmptyPoint();
  }
}
