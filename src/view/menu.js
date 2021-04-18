import { getFilmPropertyCount } from '../utils/film.js';
import AbstractView from './abstract.js';

const createMenuTemplate = (data) => {
  const watchlistCount = getFilmPropertyCount(data, 'isWatchlist');
  const viewedCount = getFilmPropertyCount(data, 'isViewed');
  const favoriteCount = getFilmPropertyCount(data, 'isFavorite');

  return `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${viewedCount}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoriteCount}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createMenuTemplate(this._data);
  }
}
