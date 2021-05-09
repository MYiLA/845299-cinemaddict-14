import { Count, SortType, UpdateType, UserAction } from '../const.js';
import { render, remove, RenderPosition } from '../utils/render.js';
import { sortByDate, sortByRating } from '../utils/film.js';
import { filter } from '../utils/filter.js';

import FilmPresenter, { State as TaskPresenterViewState } from './film.js';
import FilmsListView from '../view/films-list.js';
import LoadingView from '../view/loading.js';
import FilmsListTitleView from '../view/films-list-title';
import FilmsListEmptyView from '../view/films-list-empty.js';
import SortView from '../view/sort.js';
import ShowMoreView from '../view/show-more.js';
import ContentView from '../view/content.js';

export default class Content {
  constructor(contentContainer, filmsModel, commentsModel, filterModel, api) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._api = api;
    this._contentContainer = contentContainer;
    this._renderedFilmCount = Count.FILM_COUNT_STEP;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._showMoreComponent = null;
    this._sortComponent = null;

    this._contentComponent = new ContentView();
    this._filmsListElement = this._contentComponent.getElement().querySelector('.films-list');

    this._filmsListComponent = new FilmsListView();
    this._filmsListEmptyComponent = new FilmsListEmptyView();
    this._loadingComponent = new LoadingView();
    this._filmsListTitleComponent = new FilmsListTitleView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelFilmsEvent = this._handleModelFilmsEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {  // метод для начала работы модуля
    render(this._contentContainer, this._contentComponent, RenderPosition.AFTER_CHILDS);
    this._renderFilmsListTitle();
    render(this._filmsListTitleComponent, this._filmsListComponent, RenderPosition.AFTER_ELEMENT);

    this._filmsModel.addObserver(this._handleModelFilmsEvent);
    this._filterModel.addObserver(this._handleModelFilmsEvent);

    this._renderContent();
  }

  destroy() {
    this._clearContent({ resetRenderedTaskCount: true, resetSortType: true });

    remove(this._filmsListTitleComponent);
    remove(this._filmsListComponent);
    remove(this._contentComponent);

    this._filmsModel.removeObserver(this._handleModelFilmsEvent);
    this._filterModel.removeObserver(this._handleModelFilmsEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortByDate);
      case SortType.RATING:
        return filtredFilms.sort(sortByRating);
    }

    return filtredFilms;
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update, film) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilms(updateType, response);
          })
          .catch(() => {
            this._filmPresenter[update.id].setAborting(); // только для фильма
          });
        break;
      case UserAction.ADD_COMMENT:
        this._filmPresenter[film.id].setViewStateComment(TaskPresenterViewState.SAVING);
        // this._taskPresenter[update.id].setViewState(TaskPresenterViewState.SAVING);
        this._api.addComment(film.id, update)
          .then((response) => {
            this._commentsModel.addComment(updateType, response.comments);
            this._filmsModel.updateFilms(updateType, response.film);
          })
          .catch(() => {
            this._filmPresenter[film.id].setViewStateComment(TaskPresenterViewState.ABORTING_SAVING);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._filmPresenter[film.id].setViewStateComment(TaskPresenterViewState.DELETING, update);
        this._api.deleteComment(update)
          .then(() => {
            // метод удаления ничего не возвращает
            this._commentsModel.deleteComment(updateType, update);
            this._filmsModel.updateFilms(updateType, film);
          })
          .catch(() => {
            this._filmPresenter[film.id].setViewStateComment(TaskPresenterViewState.ABORTING_DELETING, update);
          });
        break;
    }
  }

  _handleModelFilmsEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearContent();
        this._renderContent();
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        this._clearContent({ resetRenderedFilmCount: true, resetSortType: true });
        this._renderContent();
        // - обновить всю доску (например, при переключении фильтра)
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderContent();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearContent({ resetRenderedFilmCount: true });
    this._renderContent();
  }

  _renderSort() {  // Метод для рендеринга сортировки
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._contentComponent, this._sortComponent, RenderPosition.BEFORE_ELEMENT);
  }

  _renderFilmCard(film) {
    const filmPresenter = new FilmPresenter(this._filmsListComponent, this._handleViewAction, this._handleModeChange, this._commentsModel, this._api);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilmCards(films) {
    films.forEach((film) => this._renderFilmCard(film));
  }

  _renderLoading() {
    render(this._filmsListElement, this._loadingComponent, RenderPosition.BEFORE_CHILDS);
  }

  _renderFilmsListTitle() {
    render(this._filmsListElement, this._filmsListTitleComponent, RenderPosition.BEFORE_CHILDS);
  }

  _renderFilmsListEmpty() {
    render(this._filmsListTitleComponent, this._filmsListEmptyComponent, RenderPosition.AFTER_ELEMENT);
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + Count.FILM_COUNT_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilmCards(films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreComponent !== null) {
      this._showMoreComponent = null;
    }

    this._showMoreComponent = new ShowMoreView();
    this._showMoreComponent.setShowClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListElement, this._showMoreComponent, RenderPosition.AFTER_CHILDS);
  }

  _clearContent({ resetRenderedFilmCount = false, resetSortType = false } = {}) {
    const filmCount = this._getFilms().length;
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => {
        presenter.destroy();
      });
    this._filmPresenter = {};

    remove(this._filmsListTitleComponent);
    remove(this._sortComponent);
    remove(this._showMoreComponent);
    remove(this._loadingComponent);
    remove(this._filmsListEmptyComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = Count.FILM_COUNT_STEP;
    } else {
      // На случай, если перерисовка контента вызвана
      // уменьшением количества фильмов (например удаление из списка фаворитов)
      // нужно скорректировать число показанных фильмов
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderContent() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderFilmsListTitle();
    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      this._renderFilmsListEmpty();
      return;
    }

    this._renderSort();
    // Теперь, когда _renderContent рендерит контент не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу Count.FILM_COUNT_STEP на свойство _renderedFilmCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    this._renderFilmCards(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }
  }
}
