import { render, remove, RenderPosition, replace } from '../utils/render.js';
import { scrollFix } from '../utils/common.js';
import {UserAction, UpdateType} from '../const.js';

import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import CommentsListView from '../view/comments-list.js';
import NewComment from '../view/new-comment.js';

const Mode = {
  CLOSE: 'CLOSE',
  OPEN: 'OPEN',
};

export default class Film {
  constructor(filmListContainer, changeData, changeMode, commentsModel) {
    this._siteBodyElement = document.querySelector('body');
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;

    this._filmDetailsComponent = null;
    this._newCommentComponent = null;
    this._commentsListComponent = null;

    this._hangleOpenClick = this._hangleOpenClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleViewedClick = this._handleViewedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._ctrlEnterKeyDownHandler = this._ctrlEnterKeyDownHandler.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
    this._handleModelCommentsEvent = this._handleModelCommentsEvent.bind(this);

    this._filmCardComponent = null;
    this._mode = Mode.CLOSE;
  }

  init(film) {
    // console.log('Презентeр this._filmPresenter инициирован');
    // console.log(film);
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
    this._commentsModel.setComments(this._film.id);
    this._commentsModel.addObserver(this._handleModelCommentsEvent);
    this._renderDetailsComponent();
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
    this._commentsModel.addComment(state);
    // todo минорный апдейт будет только в том случает, если фильм находится внутри экстраблока"самые комментируемые"
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          commentsCount: this._film.commentsCount + 1,
        }));
  }

  _handleCloseClick() {
    this._closeFilmDetails();
  }

  _handleDeleteClick(idComment) {
    this._commentsModel.deleteComment(idComment);
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          commentsCount: this._film.commentsCount - 1,
        }));
  }

  _hangleOpenClick() {
    this._openFilmDetails();
  }

  _handleViewedClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          isViewed: !this._film.isViewed,
        }));
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        }));
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          isWatchlist: !this._film.isWatchlist,
        }));
  }

  _clearDetailsComponent() {
    remove(this._filmDetailsComponent);
    remove(this._newCommentComponent);
    remove(this._commentsListComponent);
  }

  _renderDetailsComponent() {
    // данные у this.film опаздывают на шаг
    const comments = this._commentsModel.getComments();
    this._film.commentsCount = comments.length; // временное решение. не понимаю, почему данные опаздывают на 1 шаг пользователя
    this._filmDetailsComponent = new FilmDetailsView(this._film);// попапы множатся из-за увеличения презентеров из-за того, что я нажимаю на разные кнопки
    this._newCommentComponent = new NewComment();
    this._commentsListComponent = new CommentsListView(comments);

    this._filmDetailsComponent.setCloseClickHandler(this._handleCloseClick);
    this._filmDetailsComponent.setViewedClickHandler(this._handleViewedClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    this._siteBodyElement.appendChild(this._filmDetailsComponent.getElement());

    const commentWrapElement = this._filmDetailsComponent.getElement().querySelector('.film-details__comments-wrap');
    render(commentWrapElement, this._commentsListComponent, RenderPosition.AFTER_CHILDS);
    render(commentWrapElement, this._newCommentComponent, RenderPosition.AFTER_CHILDS);

    this._commentsListComponent.setDeleteClickHandler(this._handleDeleteClick);

    this._siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
    document.addEventListener('keydown', this._ctrlEnterKeyDownHandler);

    scrollFix(this._filmDetailsComponent.getElement());
  }

  _handleModelCommentsEvent() {  // отдельная инструкция для комментариев
    this._clearDetailsComponent();
    this._renderDetailsComponent();

    // очистить список
    // отрендерить список
    //обновить список комментариев
  }

  destroy() {
    remove(this._filmCardComponent);
  }
}
