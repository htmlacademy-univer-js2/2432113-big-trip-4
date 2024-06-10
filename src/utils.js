import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const getRandomInt = (maxNumber) => Math.floor(Math.random() * maxNumber);

const getRandomArrayElement = (items) => items[getRandomInt(items.length)];

const isEscKey = (key) => key === 'Escape';

const humanizeTaskDueDate = (dueDate, format) => dueDate ? dayjs(dueDate).format(format) : '';

const countDuration = (dateStart, dateEnd) => {
  dayjs.extend(duration);
  const diff = dayjs.duration(dayjs(dateEnd).diff(dateStart));

  const padZero = (num) => (num < 10 ? `0${num}` : num);

  if (diff.asHours() < 1) {
    return `${padZero(diff.minutes())}m`;
  } else if (diff.asDays() < 1) {
    return `${padZero(diff.hours())}h ${padZero(diff.minutes())}m`;
  } else {
    const totalDays = diff.years ? diff.years() * 365 + diff.days() : diff.days;
    return `${padZero(totalDays)}d ${padZero(diff.hours())}h ${padZero(diff.minutes())}m`;
  }
};

const isEventPresent = (event) => {
  const now = dayjs();
  return (
    dayjs(event.date.start).isSame(now) ||
    (dayjs(event.date.start).isBefore(now) && dayjs(event.date.end).isAfter(now))
  );
};

const filter = {
  'everything': (data) => [...data],
  'future': (data) => data.filter((event) => dayjs(event.date.start).isAfter(dayjs())),
  'present': (data) => data.filter(isEventPresent),
  'past': (data) => data.filter((event) => dayjs(event.date.end).isBefore(dayjs())),
};

const updateItem = (items, update) => {
  const updatedItems = items.map((item) => (item.id === update.id ? update : item));
  return updatedItems;
};

export {isEscKey, filter, getRandomArrayElement, getRandomInt, humanizeTaskDueDate, countDuration, updateItem};
