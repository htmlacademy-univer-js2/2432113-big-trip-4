import Presenter from './presenter/presenter.js';
import EventsModel from './model/event-model.js';
import FiltersModel from './model/filters-model.js';

const pageBody = document.querySelector('.page-body');
const tripsContainer = pageBody.querySelector('.trip-events');
const headerElement = pageBody.querySelector('.trip-controls');

const events = new EventsModel();
const filters = new FiltersModel();

const presenter = new Presenter(
  {
    headerElement: headerElement,
    tripsElement: tripsContainer,
    eventsModel: events,
    filtersModel: filters
  }
);
presenter.init();
