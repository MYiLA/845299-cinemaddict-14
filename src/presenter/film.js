import { render, remove, RenderPosition, replace } from '../utils/render.js';
import { scrollFix, removeItemOnce } from '../utils/common.js';
import { UserAction, UpdateType } from '../const.js';

import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import FilmControlsView from '../view/film-controls.js';
import CommentsListView from '../view/comments-list.js';
import LoadingView from '../view/loading.js';
import NewComment from '../view/new-comment.js';

const Mode = {
  CLOSE: 'CLOSE',
  OPEN: 'OPEN',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING_SAVING: 'ABORTING_SAVING',
  ABORTING_DELETING: 'ABORTING_DELETING',
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
    this._topContainer = null;
    this._newCommentComponent = null;
    this._commentsListComponent = null;
    this._filmControlsComponent = null;
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
    // в таком случае надо переписать логику чекбоксов в попапе
    this._filmCardComponent.setViewedClickHandler(this._handleViewedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    if (this._filmControlsComponent !== null) {
      this._updateFilmControls();
    }

    if (prevFilmCardComponent === null) {
      render(this._filmListContainer, this._filmCardComponent, RenderPosition.AFTER_CHILDS);
      return;
    }

    if (this._filmListContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  destroy() { // нужно?
    remove(this._filmCardComponent);
  }

  setViewStateComment(state, idComment) {
    const updateForm = (isDisabled) => {
      this._newCommentComponent.updateState({
        isDisabled,
      });
    };

    const updateComments = (isDisabled, isDeleting) => {
      this._commentsListComponent.updateState({ // апдейт нужен только одному комментарию.
        isDisabled,
        isDeleting,
      }, idComment);
      this._renderNewCommentComponent();
    };

    switch (state) {
      case State.SAVING:
        updateForm(true);
        break;

      case State.DELETING: // возможно тут нужен id комментария (чтобы понять какой именно задизейблить) + список комментов сделать смарт объектом
        updateComments(true, true);
        break;

      case State.ABORTING_SAVING:
        this._newCommentComponent.shake(updateForm(false));
        break;

      case State.ABORTING_DELETING:
        this._commentsListComponent.shake(updateComments(false, false), idComment);
        break;
    }
  }

  setAborting() {
    this._filmCardComponent.shake();
    if (this._filmControlsComponent) {
      this._filmControlsComponent.shake();
    }
  }

  _openFilmDetails() {
    // console.log('_openFilmDetails()');
    this._changeMode();
    this._renderDetailsComponent();
    this._mode = Mode.OPEN;
    this._renderFilmControls(); // если не получилось обновить данные, то потрясти

    this._commentsModel.addObserver(this._handleModelCommentsEvent);
    this._api.getComments(this._film.id)
      .then((comments) => { // комменты пришли
        this._commentsModel.setComments(UpdateType.INIT, comments);
        this._renderCommentsList();
      })
      .catch(() => { // комменты не пришли
        this._commentsModel.setComments(UpdateType.INIT, []);
        this._renderCommentsList();
      });
  }

  resetView() {
    if (this._mode !== Mode.CLOSE) {
      this._closeFilmDetails();
    }
  }

  _closeFilmDetails() {
    // console.log('_closeFilmDetails()');
    this._commentsModel.removeObserver(this._handleModelCommentsEvent);
    this._siteBodyElement.removeChild(this._siteBodyElement.querySelector('.film-details'));
    this._siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    document.removeEventListener('keydown', this._ctrlEnterKeyDownHandler);
    this._mode = Mode.CLOSE;
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this._film);
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
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      state,
      this._film);
  }

  _handleCloseClick() {
    this._closeFilmDetails();
  }

  _handleDeleteClick(idComment) {
    this._handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      idComment,
      Object.assign(
        {},
        this._film,
        {
          comments: removeItemOnce(this._film.comments, idComment),
        }));
  }

  _hangleOpenClick() {
    this._openFilmDetails();
  }

  _handleViewedClick(Update = UpdateType.MINOR) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      Update,
      Object.assign(
        {},
        this._film,
        {
          isViewed: !this._film.isViewed,
        }));
  }

  _handleFavoriteClick(Update = UpdateType.MINOR) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      Update,
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        }));
  }

  _handleWatchlistClick(Update = UpdateType.MINOR) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      Update,
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
    document.addEventListener('keydown', this._escKeyDownHandler);

    this._siteBodyElement.appendChild(this._filmDetailsComponent.getElement());
    this._commentWrapElement = this._filmDetailsComponent.getElement().querySelector('.film-details__bottom-container');
    this._topContainer = this._filmDetailsComponent.getElement().querySelector('.film-details__top-container');

    this._siteBodyElement.classList.add('hide-overflow');
  }

  _updateCommentList() {
    this._clearCommentsList();
    this._renderCommentsList();
  }

  _renderCommentsList () {
    if (this._isCommentsLoading) {
      this._renderCommentsLoading();
      return;
    }

    const comments = this._commentsModel.getComments();

    this._commentsListComponent = new CommentsListView(comments);
    render(this._commentWrapElement, this._commentsListComponent, RenderPosition.BEFORE_CHILDS);
    this._renderNewCommentComponent();

    this._commentsListComponent.setDeleteClickHandler(this._handleDeleteClick);
    document.addEventListener('keydown', this._ctrlEnterKeyDownHandler);
  }

  _clearCommentsList() {
    remove(this._newCommentComponent);
    remove(this._commentsListComponent);
    document.removeEventListener('keydown', this._ctrlEnterKeyDownHandler);
  }

  _renderNewCommentComponent() {
    this._newCommentComponent = new NewComment();
    render(this._commentsListComponent, this._newCommentComponent, RenderPosition.AFTER_CHILDS);
  }

  _updateFilmControls() {
    this._clearFilmControls();
    this._renderFilmControls();
  }

  _renderFilmControls() {
    this._filmControlsComponent = new FilmControlsView(this._film);

    this._filmControlsComponent.setViewedClickHandler(this._handleViewedClick);
    this._filmControlsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmControlsComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    render(this._topContainer, this._filmControlsComponent, RenderPosition.AFTER_CHILDS);
  }

  _clearFilmControls() {
    remove(this._filmControlsComponent);
  }

  _handleModelCommentsEvent(updateType) { // Возможно для комментариев не нужен тип перерисовки?
    switch (updateType) {
      case UpdateType.INIT:
        this._isCommentsLoading = false;
        remove(this._loadingComponent);
        break;
      default:
        this._updateCommentList(); // обновление комментов при любом типе апдейта кроме инита
    }
  }

  _renderCommentsLoading() {
    render(this._commentWrapElement, this._loadingComponent, RenderPosition.BEFORE_CHILDS);
  }
}
