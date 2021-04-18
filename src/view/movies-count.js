import AbstractView from './abstract.js';

const createMoviesCountTemplate = (dataLength) => {
  return `<p>${dataLength} movies inside</p>`;
};

export default class MoviesCount extends AbstractView {
  constructor(dataLength) {
    super();
    this._dataLength = dataLength;
  }

  getTemplate() {
    return createMoviesCountTemplate(this._dataLength);
  }
}
