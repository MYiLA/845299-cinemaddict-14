import { Count, SortType, UpdateType, UserAction } from '../const.js';
import { render, remove, RenderPosition } from '../utils/render.js';
import { sortByDate, sortByRating } from '../utils/film.js';

import FilmPresenter from './film.js';
import FilmsListView from '../view/films-list.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import SortView from '../view/sort.js';
import ShowMoreView from '../view/show-more.js';
import ContentView from '../view/content.js';

export default class Content {
  constructor(contentContainer, filmsModel, commentsModel) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._contentContainer = contentContainer;
    this._renderedFilmCount = Count.FILM_COUNT_STEP;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._showMoreComponent = null;
    this._sortComponent = null;

    this._contentComponent = new ContentView();
    this._filmsListTitleElement = this._contentComponent.getElement().querySelector('.films-list__title');
    this._filmsListElement = this._contentComponent.getElement().querySelector('.films-list');

    this._filmsListComponent = new FilmsListView();
    this._filmsListEmptyComponent = new FilmsListEmptyView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelFilmsEvent = this._handleModelFilmsEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {  // метод для начала работы модул
    this._filmsModel.addObserver(this._handleModelFilmsEvent);

    render(this._contentContainer, this._contentComponent, RenderPosition.AFTER_CHILDS);
    render(this._filmsListTitleElement, this._filmsListComponent, RenderPosition.AFTER_ELEMENT);

    this._renderContent();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortByDate);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortByRating);
    }

    return this._filmsModel.getFilms();
  }

  _renderContent() {
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

  _clearContent({ resetRenderedFilmCount = false, resetSortType = false } = {}) {
    const filmCount = this._getFilms().length;
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => {
        presenter.destroy();
      });
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._showMoreComponent);
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

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearContent({resetRenderedFilmCount: true});
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

  _handleViewAction(actionType, updateType, update) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilms(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
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
        this._clearContent({resetRenderedFilmCount: true, resetSortType: true});
        this._renderContent();
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderFilmCard(film) {
    const filmPresenter = new FilmPresenter(this._filmsListComponent, this._handleViewAction, this._handleModeChange, this._commentsModel);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilmCards(films) {
    films.forEach((film) => {
      this._renderFilmCard(film);
    });
  }

  _renderFilmsListEmpty() {
    render(this._filmsListTitleElement, this._filmsListEmptyComponent, RenderPosition.AFTER_ELEMENT);
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
}
