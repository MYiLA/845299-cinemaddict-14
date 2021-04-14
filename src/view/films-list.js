import { createElement } from '../utils.js';

const createFilmsListTemplate = () => {
  return `
      <div class="films-list__container">
      </div>
    `;
};

export default class FilmsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsListTemplate(this._data, this._countShow);
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
