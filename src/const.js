const BLANK_EVENT_STRUCT =
{
  id: 1,
  type: null,
  destination: null,
  basePrice: 0,
  date: {
    start: null,
    end: null,
  },
  offers: {
    id: 1
  },
  desctiption:'',
  isFavorite: false,
  cityPhotosSrc: []
};

const DESTINATIONS =
[
  'Neftekamsk',
  'Ufa',
  'Kamen-na-Obi',
  'Yekaterinburg',
  'Ulan-Bator'
];

const EVENT_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];
const MOCK_DATES = [
  {
    start: new Date(Date.UTC(2024, 11, 29, 8, 0, 0, 0)),
    end: new Date(Date.UTC(2024, 11, 29, 10, 0, 0, 0))
  },
  {
    start: new Date(Date.UTC(2024, 4, 13, 18, 0, 0, 0)),
    end: new Date(Date.UTC(2024, 4, 13, 20, 0, 0, 0))
  },
  {
    start: new Date(Date.UTC(2024, 8, 5, 0, 0, 0, 0)),
    end: new Date(Date.UTC(2024, 8, 5, 1, 0, 0, 0))
  },
];

const MAX_EVENT_PRICE = 1000;
const PHOTOS_COUNT = 5;
const MAX_OFFER_ID = 10;
const MAX_EVENT_COUNT = 3;

const PRESENTER_MODES = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const DATE_FORMAT_EDIT = 'DD/MM/YY hh:mm';
const DATE_FORMAT_DAY = 'MMM DD';
const DATE_FORMAT_HOURS = 'hh-mm';

export {DESTINATIONS, EVENT_TYPES, MOCK_DATES,
  PHOTOS_COUNT, MAX_OFFER_ID, MAX_EVENT_COUNT,
  BLANK_EVENT_STRUCT, MAX_EVENT_PRICE, DATE_FORMAT_DAY,
  DATE_FORMAT_EDIT, DATE_FORMAT_HOURS, PRESENTER_MODES};
