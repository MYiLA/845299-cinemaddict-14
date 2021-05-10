// import SmartView from './smart.js';
import AbstractView from './abstract.js';

const createStatisticsTemplate = (films) => {
  return `<h1>createStatisticsTemplate ${films}</h1>`;
};

export default class Statistics extends AbstractView {
  constructor(films) {
    // console.log(films);
    super();

    this._films = films;
  }

  getTemplate() {
    return createStatisticsTemplate(this._films);
  }

}
