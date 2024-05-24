import { EVENT_TYPES, DESTINATIONS, MOCK_DATES, MAX_EVENT_PRICE, PHOTOS_COUNT} from '../const';
import { getRandomArrayElement, getRandomInt } from '../utils';
import { OFFERS } from './offers-mock';
import { nanoid } from 'nanoid';

const getRandomPhoto = () => `https://loremflickr.com/248/152?random=${getRandomInt(100)}`;

const createEvent = () =>({
  id: nanoid(),
  type: getRandomArrayElement(EVENT_TYPES),
  destination: getRandomArrayElement(DESTINATIONS),
  basePrice: getRandomInt(MAX_EVENT_PRICE),
  date:getRandomArrayElement(MOCK_DATES),
  offers:[],
  isFavorite: false,
  desctiption:'я аянами рей а ты кто я тоже аянами рей',
  cityPhotosSrc:Array.from({length: PHOTOS_COUNT}, getRandomPhoto),
});

const getRandomMockEvent = () => {
  const event = createEvent();
  return {
    ...event,
    offers:OFFERS[event.type.toLowerCase()]
  };
};

export {getRandomMockEvent};
