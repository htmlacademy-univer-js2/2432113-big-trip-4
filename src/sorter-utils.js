import dayjs from 'dayjs';

const SORT_TYPES = {
  DEFAULT: 'default',
  BY_PRICE: 'price',
  BY_TIME: 'time',
  BY_OFFERS: 'offers',
  BY_NAME: 'name',
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

const getTimeInMinutes = (date) => dayjs(date).hour() * 60 + dayjs(date).minute();

const sortByTime = (point1, point2) => {
  const weight = getWeightForNullDate(point1.date.start, point2.date.start);
  if (weight !== null) {
    return weight;
  }

  const time1 = getTimeInMinutes(point1.date.start);
  const time2 = getTimeInMinutes(point2.date.start);

  return time2 - time1;
};

const sortByName = (point1, point2) =>
  point1.type[0].localeCompare(point2.type[0]);

const sortByPrice = (point1, point2) =>
  point2.basePrice - point1.basePrice;

//переделать в будущем
const sortByOffers = (point1, point2) =>
  point2.offers.id - point1.offers.id;

const sortByDefault = (point1, point2) => {
  const weight = getWeightForNullDate(point1.date.start, point2.date.start);

  if (weight !== null){
    return weight;
  }

  return dayjs(point1.date.start).diff(dayjs(point2.date.start));
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
