import {createFilmCardTemplate} from './film-card.js';

export const createFilmsListTemplate = (data, count) => {

  if (!data.length) {
    return '<h2 class="films-list__title">There are no movies in our database</h2>';
  }

  const templateMultiply = (count) => {
    let result = '';

    const dataSliced = data.slice(0, count);

    dataSliced.forEach((element) => {
      element.forEach((value, key) => {
        result = `${result}${createFilmCardTemplate(key, value)}`;
      });
    });

    return result;
  };

  return `
      <div class="films-list__container">
        ${templateMultiply(count)}
      </div>
    `;
};
