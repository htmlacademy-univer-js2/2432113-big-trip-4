import dayjs from 'dayjs';

const SortTypes = {
  DEFAULT: 'default',
  BY_TIME: 'time',
  BY_PRICE: 'price'
};

//пусть будет
function compareNullDate(dateA, dateB) {
  if (!dateA && !dateB) {
    return 0;
  }
  if (!dateA) {
    return 1;
  }
  if (!dateB) {
    return -1;
  }
  return null;
}

const getDurationInMinutes = (start, end) =>
  dayjs(end).diff(dayjs(start), 'minute');


const sortByTime = (event1, event2) => {
  const weight = compareNullDate(event1.date.start, event2.date.start);
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
  const weight = compareNullDate(event1.date.start, event2.date.start);

  if (weight !== null){
    return weight;
  }

  return dayjs(event1.date.start).diff(dayjs(event2.date.start));
};

//ни один англичанин не в курсе зачем в словах (algo-)rhythm буква h посреди слова
const getSortingAlgorhythm = (sortType) => {
  switch (sortType) {
    case SortTypes.BY_TIME:
      return sortByTime;
    case SortTypes.BY_NAME:
      return sortByName;
    case SortTypes.BY_PRICE:
      return sortByPrice;
    case SortTypes.BY_OFFERS:
      return sortByOffers;
    case SortTypes.DEFAULT:
      return sortByDefault;
  }
};

export {getSortingAlgorhythm, SortTypes};
