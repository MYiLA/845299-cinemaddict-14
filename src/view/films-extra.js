import FilmCard from './film-card.js';
import { createElement } from '../utils.js';

const createFilmsExtraTemplate = (data, title) => {

  const CARDS_COUNT = 2;

  const templateMultiply = () => {
    let result = '';
    data.slice(0, CARDS_COUNT).forEach((element) => {
      element.forEach((value, key) => {
        const filmCardTemplate = new FilmCard(key, value);
        result = `${result}${filmCardTemplate.getTemplate()}`;
      });
    });

    return result;
  };

  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container">
        ${templateMultiply()}
      </div>
    </section>
  `;
};

export default class FilmsExtra {
  constructor(data, title) {
    this._data = data;
    this._title = title;
    this._element = null;
  }

  getTemplate() {
    return createFilmsExtraTemplate(this._data, this._title);
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
