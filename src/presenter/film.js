import { render, remove, RenderPosition, replace } from '../utils/render.js';
import { scrollFix } from '../utils/common.js';
import { commentsData } from '../mock/data.js'; // не уверена, что это нужно здесь

import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import NewComment from '../view/new-comment.js';

const Mode = {
  CLOSE: 'CLOSE',
  OPEN: 'OPEN',
};

export default class Film {
  constructor(filmListContainer, changeData, changeMode) {
    this._siteBodyElement = document.querySelector('body');
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsData = commentsData;

    this._hangleOpenClick = this._hangleOpenClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleViewedClick = this._handleViewedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._ctrlEnterKeyDownHandler = this._ctrlEnterKeyDownHandler.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);

    this._filmCardComponent = null;
    this._mode = Mode.CLOSE;
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);

    this._filmCardComponent.setOpenClickHandler(this._hangleOpenClick);

    this._filmCardComponent.setViewedClickHandler(this._handleViewedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    if (prevFilmCardComponent === null) {
      render(this._filmListContainer, this._filmCardComponent, RenderPosition.AFTER_CHILDS);
      return;
    }

    if (this._filmListContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  _openFilmDetails() {
    this._changeMode();
    const comments = commentsData.get(this._film.id);

    this._filmDetailsComponent = new FilmDetailsView(this._film, comments);
    this._newCommentComponent = new NewComment();
    this._filmDetailsComponent.setCloseClickHandler(this._handleCloseClick);

    this._filmDetailsComponent.setViewedClickHandler(this._handleViewedClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    this._siteBodyElement.appendChild(this._filmDetailsComponent.getElement());
    const commentEditWrapElement = this._filmDetailsComponent.getElement().querySelector('.film-details__comments-wrap');
    render(commentEditWrapElement, this._newCommentComponent, RenderPosition.AFTER_CHILDS);
    this._siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
    document.addEventListener('keydown', this._ctrlEnterKeyDownHandler);
    this._mode = Mode.OPEN;
  }

  resetView() {
    if (this._mode !== Mode.CLOSE) {
      this._closeFilmDetails();
    }
  }

  _closeFilmDetails() {
    this._siteBodyElement.removeChild(this._siteBodyElement.querySelector('.film-details'));
    this._siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    document.removeEventListener('keydown', this._ctrlEnterKeyDownHandler);
    this._mode = Mode.CLOSE;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  _ctrlEnterKeyDownHandler(evt) {
    if (
      (evt.ctrlKey && evt.code === 'Enter')
      ||
      (evt.metaKey && evt.code === 'Enter'))
    {
      evt.preventDefault();
      this._newCommentComponent.setCommentSubmitHandler(this._handleCommentSubmit);
    }
  }

  _handleCommentSubmit(state) {
    this._commentsData.get(this._film.id).push(state);

    this._changeData(Object.assign(
      {},
      this._film,
      {
        commentsCount: this._film.commentsCount + 1,
      }));
    this._closeFilmDetails();
    this._openFilmDetails();
    scrollFix(this._filmDetailsComponent.getElement());
  }

  _handleCloseClick() {
    this._closeFilmDetails();
  }

  _hangleOpenClick() {
    this._openFilmDetails();
  }

  _handleViewedClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isViewed: !this._film.isViewed,
        }));
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        }));
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isWatchlist: !this._film.isWatchlist,
        }));
  }

  destroy() {
    remove(this._filmCardComponent);
  }
}
