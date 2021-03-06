import dayjs from 'dayjs';
import AbstractView from './abstract.js';
import { translateMinutesToHours } from '../utils/common.js';

const MAX_DESC_SYMBOL = 140;

const createFilmCardTemplate = (film) => {
  const { desc, releaseDate, title, rating, runtime, genres, poster, comments, isWatchlist, isViewed, isFavorite } = film;

  const { hours, minutes } = translateMinutesToHours(runtime);

  const renderReleaseDate = () => {
    if (!releaseDate) {
      return '';
    }

    return `<span class="film-card__year">${ dayjs(releaseDate).format('YYYY') }</span>`;
  };

  const renderDesc = () => {
    if (desc.length > MAX_DESC_SYMBOL) {
      return `${ desc.slice(0 , MAX_DESC_SYMBOL - 1) }...`;
    }
    return desc;
  };

  const renderActiveClass = (bln) => bln ? 'film-card__controls-item--active' : '';

  return `
  <article class="film-card">
    <h3 class="film-card__title">${ title }</h3>
    <p class="film-card__rating">${ rating }</p>
    <p class="film-card__info">
      ${renderReleaseDate()}
      <span class="film-card__duration">${ hours }h ${ minutes }m</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${ poster }" alt="" class="film-card__poster">
    <p class="film-card__description">${ renderDesc() }</p>
    <a class="film-card__comments">${ comments.length } comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${ renderActiveClass(isWatchlist) }" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${ renderActiveClass(isViewed) }" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${ renderActiveClass(isFavorite) }" type="button">Mark as favorite</button>
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

    this._posterElement = this.getElement().querySelector('.film-card__poster');
    this._titleElement = this.getElement().querySelector('.film-card__title');
    this._commentsElement = this.getElement().querySelector('.film-card__comments');
    this._controlWatchedElement = this.getElement().querySelector('.film-card__controls-item--mark-as-watched');
    this._controlFavoriteElement = this.getElement().querySelector('.film-card__controls-item--favorite');
    this._controlWatchlistElement = this.getElement().querySelector('.film-card__controls-item--add-to-watchlist');
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, this._comments);
  }

  setOpenClickHandler(callback) {
    this._callback.openClick = callback;

    this._posterElement.addEventListener('click', this._openClickHandler);
    this._titleElement.addEventListener('click', this._openClickHandler);
    this._commentsElement.addEventListener('click', this._openClickHandler);
  }

  setViewedClickHandler(callback) {
    this._callback.viewedClick = callback;
    this._controlWatchedElement.addEventListener('click', this._viewedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this._controlFavoriteElement.addEventListener('click', this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this._controlWatchlistElement.addEventListener('click', this._watchlistClickHandler);
  }

  removeElement() {
    this._posterElement.removeEventListener('click', this._openClickHandler);
    this._titleElement.removeEventListener('click', this._openClickHandler);
    this._commentsElement.removeEventListener('click', this._openClickHandler);
    this._controlWatchedElement.removeEventListener('click', this._viewedClickHandler);
    this._controlFavoriteElement.removeEventListener('click', this._favoriteClickHandler);
    this._controlWatchlistElement.removeEventListener('click', this._watchlistClickHandler);
    super.removeElement();
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
}
