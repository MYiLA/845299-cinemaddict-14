import dayjs from 'dayjs'; // библиотека дат и времени
import AbstractView from './abstract.js';
import { translateMinutesToHours } from '../utils/common.js';

const MAX_DESC_SYMBOL = 140;

const createFilmCardTemplate = (film) => {
  const { desc, releaseDate, title, rating, runtime, genres, poster, comments, isWatchlist, isViewed, isFavorite } = film;

  const { h, m } = translateMinutesToHours(runtime);

  const releaseDateRender = () => {
    if (!releaseDate) {
      return '';
    }

    return `<span class="film-card__year">${dayjs(releaseDate).format('YYYY')}</span>`;
  };

  const descRender = () => {
    if (desc.length > MAX_DESC_SYMBOL) {
      return `${desc.slice(0 , MAX_DESC_SYMBOL - 1)}...`;
    }
    return desc;
  };

  const activeClassRender = (bln) => bln ? 'film-card__controls-item--active' : '';

  return `
  <article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      ${releaseDateRender()}
      <span class="film-card__duration">${h}h ${m}m</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${descRender()}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${activeClassRender(isWatchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${activeClassRender(isViewed)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${activeClassRender(isFavorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._openClickHandler = this._openClickHandler.bind(this);
    this._viewedClickHandler = this._viewedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, this._comments);
  }

  _openClickHandler(evt) {
    evt.preventDefault();
    this._callback.openClick();
  }

  _viewedClickHandler(evt) {
    evt.preventDefault();
    this._callback.viewedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }


  setOpenClickHandler(callback) {
    // 1. колбэк мы запишем во внутреннее свойство
    this._callback.openClick = callback;
    // 2. В addEventListener передадим абстрактный обработчик
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openClickHandler);
  }

  setViewedClickHandler(callback) {
    this._callback.viewedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._viewedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }
}
