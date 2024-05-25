import Presenter from './presenter/presenter.js';
import EventsModel from './model/event-model.js';
import FiltersModel from './model/filters-model.js';
import EventAdderView from './view/event-adder-view.js';
import { render } from './framework/render';

const pageBody = document.querySelector('.page-body');
const eventsContainer = pageBody.querySelector('.trip-events');
const headerElement = pageBody.querySelector('.trip-controls');

const events = new EventsModel();
const filters = new FiltersModel();

const presenter = new Presenter(
  {
    headerElement: headerElement,
    eventsContainer: eventsContainer,
    eventsModel: events,
    filtersModel: filters,
    onAddEventClose: handleNewEventFormClose
  }
);

const newEventButtonComponent = new EventAdderView({
  onClick: handleAddEventButtonClick
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleAddEventButtonClick() {
  presenter.createEvent();
  newEventButtonComponent.element.disabled = true;
}

render(newEventButtonComponent, document.querySelector('.page-body__container'));

presenter.init();
