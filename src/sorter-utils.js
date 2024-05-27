import dayjs from 'dayjs';

const SORT_TYPES = {
  DEFAULT: 'default',
  BY_TIME: 'time',
  BY_PRICE: 'price'
};

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }
  if (dateA === null) {
    return 1;
  }
  if (dateB === null) {
    return -1;
  }
  return null;
}

const getDurationInMinutes = (start, end) =>
  dayjs(end).diff(dayjs(start), 'minute');


const sortByTime = (event1, event2) => {
  const weight = getWeightForNullDate(event1.date.start, event2.date.start);
  if (weight !== null) {
    return weight;
  }

  const duration1 = getDurationInMinutes(event1.date.start, event1.date.end);
  const duration2 = getDurationInMinutes(event2.date.start, event2.date.end);

  return duration2 - duration1;
};

const sortByName = (event1, event2) =>
  event1.type[0].localeCompare(event2.type[0]);

const sortByPrice = (event1, event2) =>
  event2.basePrice - event1.basePrice;

const sortByOffers = (event1, event2) =>
  event2.offers.length - event1.offers.length;

const sortByDefault = (event1, event2) => {
  const weight = getWeightForNullDate(event1.date.start, event2.date.start);

  if (weight !== null){
    return weight;
  }

  return dayjs(event1.date.start).diff(dayjs(event2.date.start));
};

const getSortingAlgorythm = (sortType) => {
  switch (sortType) {
    case SORT_TYPES.BY_TIME:
      return sortByTime;
    case SORT_TYPES.BY_NAME:
      return sortByName;
    case SORT_TYPES.BY_PRICE:
      return sortByPrice;
    case SORT_TYPES.BY_OFFERS:
      return sortByOffers;
    case SORT_TYPES.DEFAULT:
      return sortByDefault;
  }
};

export {getSortingAlgorythm, SORT_TYPES};
