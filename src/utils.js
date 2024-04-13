const getRandomInt = (maxNumber) => Math.floor(Math.random() * maxNumber);

const getRandomArrayElement = (items) => items[getRandomInt(items.length)];

import dayjs from 'dayjs';

const humanizeTaskDueDate = (dueDate, format) => dueDate ? dayjs(dueDate).format(format) : '';

const countDuration = (dateStart, dateEnd) => dayjs(dateEnd).diff(dateStart, 'm');

export {getRandomArrayElement, getRandomInt, humanizeTaskDueDate, countDuration};
