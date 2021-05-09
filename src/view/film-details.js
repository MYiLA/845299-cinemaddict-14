import dayjs from 'dayjs'; // библиотека дат и времени
import relativeTime from 'dayjs/plugin/relativeTime';
import AbstractView from './abstract.js';
import { translateMinutesToHours } from '../utils/common.js';

dayjs.extend(relativeTime);

const createFilmDetailsTemplate = (film) => {
  const genresRender = () => {
    if (film.genres.length === 1) {
      return `
        <td class="film-details__term">Genre</td>
        <td class="film-details__cell">
        ${film.genres[0]}
      `;
    }

    let result = '';

    film.genres.forEach((element) => {
      result += `<span class="film-details__genre">${element}</span>`;
    });

    return `
      <td class="film-details__term">Genres</td>
      <td class="film-details__cell">
      ${result}
    `;
  };

  return `
  <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${film.poster}" alt="">

            <p class="film-details__age">${film.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${film.title}</h3>
                <p class="film-details__title-original">Original: ${film.titleOriginal}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${film.rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${film.writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${film.actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${dayjs(film.releaseDate).format('DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${translateMinutesToHours(film.runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${film.country}</td>
              </tr>
              <tr class="film-details__row">
                  ${genresRender()}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${film.desc}
            </p>
          </div>
        </div>
      </div>

      <div class="film-details__bottom-container">
      </div>
    </form>
  </section>`;
};

export default class FilmDetails extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._closeClickHandler = this._closeClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, this._state);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }
}
