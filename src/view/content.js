import {createShowMoreTemplate} from './show-more.js';
import {createFilmCardTemplate} from './film-card.js';

const CARD_COUNT = 5;
const CARD_RATED_COUNT = 2;
const CARD_COMMENTED_COUNT = 2;

const templateMultiply = (template, count) => {
  let result = '';

  for (let i = 0; i < count; i++) {
    result = `${result}${template}`;
  }

  return result;
};

export const createContentTemplate = () => {
  return `
  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
        ${templateMultiply(createFilmCardTemplate(), CARD_COUNT)}
      </div>
      ${createShowMoreTemplate()}
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container">
        ${templateMultiply(createFilmCardTemplate(), CARD_RATED_COUNT)}
      </div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
        ${templateMultiply(createFilmCardTemplate(), CARD_COMMENTED_COUNT)}
      </div>
    </section>
  </section>`;
};
