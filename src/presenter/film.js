import { render, remove, RenderPosition, replace } from '../utils/render.js';
import { scrollFix } from '../utils/common.js';
import { UserAction, UpdateType } from '../const.js';

import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import CommentsListView from '../view/comments-list.js';
import LoadingView from '../view/loading.js';
import NewComment from '../view/new-comment.js';

const Mode = {
  CLOSE: 'CLOSE',
  OPEN: 'OPEN',
};

export default class Film {
  constructor(filmListContainer, handleViewAction, changeMode, commentsModel, api) {
    this._siteBodyElement = document.querySelector('body');
    this._filmListContainer = filmListContainer;
    this._handleViewAction = handleViewAction;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;
    this._api = api;

    this._filmDetailsComponent = null;
    this._commentWrapElement = null;
    this._newCommentComponent = null;
    this._commentsListComponent = null;
    this._filmCardComponent = null;
    this._mode = Mode.CLOSE;

    this._loadingComponent = new LoadingView();
    this._isCommentsLoading = true;

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
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);

    this._filmCardComponent.setOpenClickHandler(this._hangleOpenClick);
    // Обратите внимание, что изменения в DOM должны происходить только после
    // успешного запроса к серверу, иначе мы получим несогласованность — ситуацию, когда интерфейс не отражает реальных данных.
    // в таком случае надо отменить логику чекбоксов в попапе
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

  destroy() {
    remove(this._filmCardComponent);
  }

  _openFilmDetails() {
    this._changeMode();

    this._api.getComments(this._film.id)
      .then((comments) => { // комменты пришли
        this._commentsModel.setComments(UpdateType.INIT, comments);
      })
      .catch(() => { // комменты не пришли
        this._commentsModel.setComments(UpdateType.INIT, []);
      });

    this._commentsModel.addObserver(this._handleModelCommentsEvent);
    // попап должен рендериться и без комментариев. На месте комментариев должен появляться лоадинг и ошибка
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

      scrollFix(this._filmDetailsComponent.getElement());
    }
  }

  _handleCommentSubmit(state) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          commentsCount: this._film.commentsCount + 1,
        }));
    this._handleViewAction(
      UserAction.ADD_COMMENT,
      null, state);
  }

  _handleCloseClick() {
    this._closeFilmDetails();
  }

  _handleDeleteClick(idComment) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          commentsCount: this._film.commentsCount - 1,
        }));

    this._handleViewAction(
      UserAction.DELETE_COMMENT,
      null, idComment);
  }

  _hangleOpenClick() {
    this._openFilmDetails();
  }

  _handleViewedClick() {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isViewed: !this._film.isViewed,
        }));
  }

  _handleFavoriteClick() {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        }));
  }

  _handleWatchlistClick() {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isWatchlist: !this._film.isWatchlist,
        }));
  }

  _renderDetailsComponent() {
    this._filmDetailsComponent = new FilmDetailsView(this._film);

    this._filmDetailsComponent.setCloseClickHandler(this._handleCloseClick);
    this._filmDetailsComponent.setViewedClickHandler(this._handleViewedClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    document.addEventListener('keydown', this._escKeyDownHandler);

    this._siteBodyElement.appendChild(this._filmDetailsComponent.getElement());
    this._commentWrapElement = this._filmDetailsComponent.getElement().querySelector('.film-details__bottom-container');

    this._siteBodyElement.classList.add('hide-overflow');

    this._renderCommentsList();
  }

  //возможно это не нужно. Нужно подумать, как избежать проблем с попапом
  // в списках при удалении его фильма из этого списка
  _clearDetailsComponent() {
    remove(this._filmDetailsComponent);
    remove(this._newCommentComponent);
    remove(this._commentsListComponent);
  }

  _updateCommentList(data) {
    remove(this._newCommentComponent);
    remove(this._commentsListComponent);

    this._commentsListComponent = new CommentsListView(data);
    this._newCommentComponent = new NewComment();

    render(this._commentWrapElement, this._commentsListComponent, RenderPosition.BEFORE_CHILDS);
    render(this._commentsListComponent, this._newCommentComponent, RenderPosition.AFTER_CHILDS);

    this._commentsListComponent.setDeleteClickHandler(this._handleDeleteClick);
  }

  _renderCommentsList () {
    if (this._isCommentsLoading) {
      this._renderCommentsLoading();
      return;
    }

    const comments = this._commentsModel.getComments();
    this._newCommentComponent = new NewComment();
    this._commentsListComponent = new CommentsListView(comments);

    render(this._commentWrapElement, this._commentsListComponent, RenderPosition.BEFORE_CHILDS);
    render(this._commentsListComponent, this._newCommentComponent, RenderPosition.AFTER_CHILDS);

    this._commentsListComponent.setDeleteClickHandler(this._handleDeleteClick);
    document.addEventListener('keydown', this._ctrlEnterKeyDownHandler);
  }

  _clearCommentsList() { // наверно это не нужно
    remove(this._loadingComponent);
  }

  _handleModelCommentsEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MAJOR:
        this._updateCommentList(data);
        break;
      case UpdateType.INIT:
        this._isCommentsLoading = false;
        remove(this._loadingComponent);
        this._renderCommentsList();
        break;
    }
  }

  _renderCommentsLoading() {
    render(this._commentWrapElement, this._loadingComponent, RenderPosition.BEFORE_CHILDS);
  }
}
