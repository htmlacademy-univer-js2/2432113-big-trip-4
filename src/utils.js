import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const getRandomInt = (maxNumber) => Math.floor(Math.random() * maxNumber);

const getRandomArrayElement = (items) => items[getRandomInt(items.length)];

const isEscKey = (key) => key === 'Escape';

const humanizeTaskDueDate = (dueDate, format) => dueDate ? dayjs(dueDate).format(format) : '';

const countDuration = (dateStart, dateEnd) => {
  dayjs.extend(duration);
  const diff = dayjs.duration(dayjs(dateEnd).diff(dayjs(dateStart)));

  const minutes = diff.minutes();
  const hours = diff.hours();
  const days = diff.days();

  if (diff.asHours() < 1) {
    return `${minutes}M`;
  } else if (diff.asDays() < 1) {
    return `${hours}H ${minutes}M`;
  } else {
    return `${days}D ${hours}H ${minutes}M`;
  }
};

const isEventPresent = (point) => {
  const now = dayjs();
  return (
    dayjs(point.date.start).isSame(now) ||
    (dayjs(point.date.start).isBefore(now) && dayjs(point.date.end).isAfter(now))
  );
};

const filter = {
  'everything': (data) => [...data],
  'future': (data) => data.filter((point) => dayjs(point.date.start).isAfter(dayjs())),
  'present': (data) => data.filter(isEventPresent),
  'past': (data) => data.filter((point) => dayjs(point.date.end).isBefore(dayjs())),
};

const updateItem = (items, update) => {
  const updatedItems = items.map((item) => (item.id === update.id ? update : item));
  return updatedItems;
};

export {isEscKey, filter, getRandomArrayElement, getRandomInt, humanizeTaskDueDate, countDuration, updateItem};
