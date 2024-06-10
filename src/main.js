import Presenter from './presenter/presenter.js';
import EventsModel from './model/events-model.js';
import FiltersModel from './model/filters-model.js';
import EventsApiService from './api-service/event-api-service';
import { AUTHORIZATION, END_POINT } from './const';
import OffersModel from './model/offers-model';
import OffersApiService from './api-service/offers-api-service';
import DestinationsModel from './model/destinations-model';
import DestinationsApiService from './api-service/destinations-api-service.js';

const pageBody = document.querySelector('.page-body');
const eventsContainer = pageBody.querySelector('.trip-events');
const headerElement = pageBody.querySelector('.trip-main');
const tripMain = pageBody.querySelector('.trip-main');

const events = new EventsModel({
  eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)
});

const offers = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});

const destinations = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)
});

const filtersModel = new FiltersModel();

const presenter = new Presenter(
  {
    headerElement: headerElement,
    eventsContainer: eventsContainer,
    eventsModel: events,
    filtersModel: filtersModel,
    offersModel: offers,
    destinationsModel: destinations,
    tripMain: tripMain
  }
);

presenter.init();
