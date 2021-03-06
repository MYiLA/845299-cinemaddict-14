import AbstractView from './abstract.js';
import { UpdateType } from '../const.js';

const createFilmControlsTemplate = (film) => {
  const getChecked = (bln) => bln ? 'checked' : '';
  const { isWatchlist, isViewed, isFavorite } = film;

  return `
  <section class="film-details__controls">
    <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${ getChecked(isWatchlist) }>
    <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

    <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${ getChecked(isViewed) }>
    <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

    <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${ getChecked(isFavorite) }>
    <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
  </section>
`;
};

export default class FilmControls extends AbstractView {
  constructor(film) {
    super();
    this._state = film;
    this._viewedClickHandler = this._viewedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);

    this._controlWatchedElement = this.getElement().querySelector('.film-details__control-label--watched');
    this._controlFavoriteElement = this.getElement().querySelector('.film-details__control-label--favorite');
    this._controlWatchlistElement = this.getElement().querySelector('.film-details__control-label--watchlist');
  }

  getTemplate() {
    return createFilmControlsTemplate(this._state);
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
    this._controlWatchedElement.removeEventListener('click', this._viewedClickHandler);
    this._controlFavoriteElement.removeEventListener('click', this._favoriteClickHandler);
    this._controlWatchlistElement.removeEventListener('click', this._watchlistClickHandler);
    super.removeElement();
  }

  _viewedClickHandler(evt) {
    evt.preventDefault();
    this._callback.viewedClick(UpdateType.PATCH);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick(UpdateType.PATCH);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick(UpdateType.PATCH);
  }
}
