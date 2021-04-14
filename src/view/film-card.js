import dayjs from 'dayjs'; // библиотека дат и времени
import { createElement } from '../utils.js';

const MAX_DESC_SYMBOL = 140;

const createFilmCardTemplate = (film, comments) => {

  const releaseDateRender = () => {
    if (!film.releaseDate) {
      return '';
    }
    return `<span class="film-card__year">${dayjs(film.releaseDate).format('YYYY')}</span>`;
  };

  const descRender = () => {
    if (film.desc.length > MAX_DESC_SYMBOL) {
      return `${film.desc.slice(0 , MAX_DESC_SYMBOL - 1)}...`;
    }
    return film.desc;
  };

  const activeClassRender = (bln) => bln ? 'film-card__controls-item--active' : '';

  return `
  <article class="film-card">
    <h3 class="film-card__title">${film.title}</h3>
    <p class="film-card__rating">${film.rating}</p>
    <p class="film-card__info">
      ${releaseDateRender()}
      <span class="film-card__duration">${film.runtime}</span>
      <span class="film-card__genre">${film.genres[0]}</span>
    </p>
    <img src="./images/posters/${film.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${descRender()}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${activeClassRender(film.isWatchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${activeClassRender(film.isViewed)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${activeClassRender(film.isFavorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard {
  constructor(film, comments) {
    this._film = film;
    this._comments = comments;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, this._comments);
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
