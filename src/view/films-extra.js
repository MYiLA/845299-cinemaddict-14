import FilmCard from './film-card.js';
import AbstractView from './abstract.js';

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

export default class FilmsExtra extends AbstractView {
  constructor(data, title) {
    super();
    this._data = data;
    this._title = title;
  }

  getTemplate() {
    return createFilmsExtraTemplate(this._data, this._title);
  }
}
