import FilmCard from './film-card.js';
import AbstractView from './abstract.js';

const createFilmsExtraTemplate = (films, title) => {
  const CARDS_COUNT = 2;

  const templateMultiply = () => {
    let result = '';
    films.slice(0, CARDS_COUNT).forEach((el) => {
      const filmCardTemplate = new FilmCard(el);
      result = `${result}${filmCardTemplate.getTemplate()}`;
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
  constructor(films, title) {
    super();
    this._films = films;
    this._title = title;
  }

  getTemplate() {
    return createFilmsExtraTemplate(this._films, this._title);
  }
}
