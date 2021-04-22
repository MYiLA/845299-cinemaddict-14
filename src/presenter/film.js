import { render, remove, RenderPosition, replace } from '../utils/render.js';

import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

export default class Film {
  constructor(filmListContainer, changeData) {
    this._siteBodyElement = document.querySelector('body');
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;

    this._hangleOpenClick = this._hangleOpenClick.bind(this);
    this._handleViewedClick = this._handleViewedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);

    this._filmCardComponent = null;
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film, comments);
    this._filmDetailsComponent = new FilmDetailsView(film, comments);

    this._filmCardComponent.setOpenClickHandler(this._hangleOpenClick);

    this._filmCardComponent.setViewedClickHandler(this._handleViewedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    if (prevFilmCardComponent === null) {
      render(this._filmListContainer, this._filmCardComponent, RenderPosition.BEFORE_CHILDS);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this._filmListContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  _renderFilmDetails() {  // рендеринг одного попапа FilmDetailsView
    this._filmDetailsComponent.setCloseClickHandler(() => {
      //кнопка не работает, так как элемент _filmDetailsComponent не обновился и его не может найти боди
      // console.log(this._filmDetailsComponent.getElement());
      this._siteBodyElement.removeChild(this._filmDetailsComponent.getElement());
      this._siteBodyElement.classList.remove('hide-overflow');
    });

    // this._filmDetailsComponent.setWatchlistClickHandler(() => {
    //   console.log('Я НАЖАЛЬ');
    //   this._handleWatchlistClick();
    // });
    // this._filmDetailsComponent.setViewedClickHandler(this._handleViewedClick);
    // this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    // this._filmDetailsComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    this._siteBodyElement.appendChild(this._filmDetailsComponent.getElement());
    this._siteBodyElement.classList.add('hide-overflow');
  }

  _hangleOpenClick() {
    this._renderFilmDetails();
  }

  _handleViewedClick() {
    // console.log('Я НАЖАЛЬ в попапе');
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isViewed: !this._film.isViewed,
        }), this._comments);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        }), this._comments);
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isWatchlist: !this._film.isWatchlist,
        }), this._comments);
  }

  destroy() {
    remove(this._filmCardComponent);
  }
}
