import Presenter from './presenter/presenter.js';

const pageBody = document.querySelector('.page-body');
const tripControls = pageBody.querySelector('.trip-controls');
const tripEvents = pageBody.querySelector('.trip-events');

const presenter = new Presenter({
  header: pageBody.querySelector('.trip-controls'),
  events: tripEvents,
  control: tripControls,
});

presenter.init();
