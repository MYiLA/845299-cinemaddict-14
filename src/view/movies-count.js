import { createElement } from '../utils.js';

const createMoviesCountTemplate = (dataLength) => {
  return `<p>${dataLength} movies inside</p>`;
};

export default class MoviesCount {
  constructor(dataLength) {
    this._dataLength = dataLength;
    this._element = null;
  }

  getTemplate() {
    return createMoviesCountTemplate(this._dataLength);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
