import { dayjs } from 'dayjs';


export default class FiltersModel {
  #filters;

  constructor () {
    this.#filters = {
      'everything': (data) => [...data],
      'future': (data) => data.filter((point) => dayjs(point.date.start).isBefore(dayjs(new Date())).day),
      'present': (data) => data.filter((point) => dayjs(point.date.start.day).isSame(dayjs(new Date()).day)),
      'past': (data) => data.filter((point) => dayjs(point.date.start).isAfter(dayjs(new Date())).day)
    };
  }

  get filters(){
    return this.#filters;
  }
}
