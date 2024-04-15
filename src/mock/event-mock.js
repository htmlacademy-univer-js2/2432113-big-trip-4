import { EVENT_TYPES, DESTINATIONS, MOCK_DATES, MAX_EVENT_PRICE, PHOTOS_COUNT} from '../const';
import { getRandomArrayElement, getRandomInt } from '../utils';

const getRandomPhoto = () => `https://loremflickr.com/248/152?random=${getRandomInt(100)}`;

const createEvent = () =>({
  id: getRandomInt(50),
  type: getRandomArrayElement(EVENT_TYPES),
  destination: getRandomArrayElement(DESTINATIONS),
  basePrice: getRandomInt(MAX_EVENT_PRICE),
  date:getRandomArrayElement(MOCK_DATES),
  offers:{
    id: getRandomInt(50),
  },
  isFavorite: false,
  desctiption:'я аянами рей а ты кто я тоже аянами рей',
  cityPhotosSrc:Array.from({length: PHOTOS_COUNT}, getRandomPhoto),
});

const getRandomMockEvent = () => createEvent();

export {getRandomMockEvent};
