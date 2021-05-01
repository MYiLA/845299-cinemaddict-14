import { Count, SortType } from '../const.js';
import { render, remove, RenderPosition } from '../utils/render.js';
import { sortByDate, sortByRating } from '../utils/film.js';

import FilmPresenter from './film.js';
import FilmsListView from '../view/films-list.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
// экстра блоки
// import FilmsExtraView from '../view/films-extra.js';
import SortView from '../view/sort.js';
import ShowMoreView from '../view/show-more.js';
import ContentView from '../view/content.js';

export default class Content {
  constructor(contentContainer, filmsModel, commentsModel) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._contentContainer = contentContainer;
    this._renderedFilmsCount = Count.FILM_COUNT_STEP;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._contentComponent = new ContentView();
    this._filmsListTitleElement = this._contentComponent.getElement().querySelector('.films-list__title');
    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListEmptyComponent = new FilmsListEmptyView();
    this._showMoreComponent = new ShowMoreView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {  // метод для начала работы модуля
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
    if (!this._getFilms().length) {
      this._renderFilmsListEmpty();
      return;
    }

    this._renderSort();
    // экстра блоки
    // this._renderFilmsTopRated();
    // this._renderFilmsMostCommented();
    this._renderFilmsList();
  }

  _renderFilmsList() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, Count.FILM_COUNT_STEP));

    this._renderFilmCards(films);

    if (filmCount > Count.FILM_COUNT_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList();
    this._renderFilmsList();
  }

  _renderSort() {  // Метод для рендеринга сортировки
    render(this._contentComponent, this._sortComponent, RenderPosition.BEFORE_ELEMENT);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
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

  //экстра блоки
  // _renderFilmsTopRated() {
  //   const filmsTopRatedComponent = new FilmsExtraView(this._films, 'Top rated');
  //   render(this._contentComponent, filmsTopRatedComponent, RenderPosition.AFTER_CHILDS);
  // }

  // _renderFilmsMostCommented() {
  //   const filmsMostCommentedComponent = new FilmsExtraView(this._films, 'Most commented');
  //   render(this._contentComponent, filmsMostCommentedComponent, RenderPosition.AFTER_CHILDS);
  // }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + Count.FILM_COUNT_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);
    this._renderFilmCards(films);
    this._renderedFilmsCount = newRenderedFilmCount;

    if (this._renderedFilmsCount >= filmCount) {
      remove(this._showMoreComponent);
    }
  }

  _renderLoadMoreButton() {
    const filmsListElement = this._contentComponent.getElement().querySelector('.films-list');

    render(filmsListElement, this._showMoreComponent, RenderPosition.AFTER_CHILDS);
    this._showMoreComponent.setShowClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmsList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => {
        presenter.destroy();
      });
    this._filmPresenter = {};
    this._renderedFilmsCount = Count.FILM_COUNT_STEP;
    remove(this._showMoreComponent);
  }
}
