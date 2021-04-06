import {createFilmCardTemplate} from './film-card.js';

export const createFilmsExtraTemplate = (data) => {

  if (!data.length) {
    return '';
  }

  const CARDS_COUNT = 2;

  const templateMultiply = () => {
    let result = '';

    data.slice(0, CARDS_COUNT).forEach((element) => {
      element.forEach((value, key) => {
        result = `${result}${createFilmCardTemplate(key, value)}`;
      });
    });

    return result;
  };

  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container">
        ${templateMultiply()}
      </div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
        ${templateMultiply()}
      </div>
    </section>
  `;
};
