const getRandomInt = (maxNumber) => Math.floor(Math.random() * maxNumber);

const getRandomArrayElement = (items) => items[getRandomInt(items.length)];

import dayjs from 'dayjs';

const humanizeTaskDueDate = (dueDate, format) => dueDate ? dayjs(dueDate).format(format) : '';

const countDuration = (dateStart, dateEnd) => dayjs(dateEnd).diff(dateStart, 'm');

const updateItem = (items, update) => {
  const updatedItems = items.map((item) => (item.id === update.id ? update : item));
  return updatedItems;
};

export {getRandomArrayElement, getRandomInt, humanizeTaskDueDate, countDuration, updateItem};
