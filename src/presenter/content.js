import { Count, SortType } from '../const.js';
import { render, remove, RenderPosition } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import { sortByDate, sortByRating } from '../utils/film.js';

import FilmPresenter from './film.js';
import FilmsListView from '../view/films-list.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsExtraView from '../view/films-extra.js';
import SortView from '../view/sort.js';
import ShowMoreView from '../view/show-more.js';
import ContentView from '../view/content.js';

export default class Content {
  constructor(contentContainer) {
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

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(data) {  // метод для начала работы модуля
    this._data = data.slice();  // борьба против мутации данных

    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this._sourcedData = data.slice();

    render(this._contentContainer, this._contentComponent, RenderPosition.AFTER_CHILDS);
    render(this._filmsListTitleElement, this._filmsListComponent, RenderPosition.AFTER_ELEMENT);

    this._renderContent();
  }

  _renderContent() {
    if (!this._data.length) {
      this._renderFilmsListEmpty();
      return;
    }

    this._renderSort();
    this._renderFilmsTopRated();
    this._renderFilmsMostCommented();
    this._renderFilmsList();
  }

  _renderFilmsList() {
    this._renderFilmCards(0, Math.min(this._data.length, this._renderedFilmsCount));

    if (this._data.length > this._renderedFilmsCount) {
      this._renderLoadMoreButton();
    }
  }

  _sortFilms(sortType) {
    // 2. Этот исходный массив фильмов необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _data

    switch (sortType) {
      case SortType.DATE:
        this._data.sort(sortByDate);
        break;
      case SortType.RATING:
        this._data.sort(sortByRating);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _data исходный массив
        this._data = this._sourcedData.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderFilmsList();
  }

  _renderSort() {  // Метод для рендеринга сортировки
    render(this._contentComponent, this._sortComponent, RenderPosition.BEFORE_ELEMENT);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleFilmChange(updatedFilm, comments) {
    const updatedItem = new Map().set(updatedFilm, comments);
    this._sourcedData = updateItem(this._sourcedData, updatedItem);
    this._filmPresenter[updatedFilm.id].init(updatedFilm, comments);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderFilmCard(film, comments) {
    const filmPresenter = new FilmPresenter(this._filmsListComponent, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film, comments);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilmCards(from, to) {
    this._data
      .slice(from, to)
      .forEach((el) => {
        el.forEach((value, key) => {
          this._renderFilmCard(key, value);
        });
      });
  }

  _renderFilmsListEmpty() {
    render(this._filmsListTitleElement, this._filmsListEmptyComponent, RenderPosition.AFTER_ELEMENT);
  }

  _renderFilmsTopRated() {
    const filmsTopRatedComponent = new FilmsExtraView(this._data, 'Top rated');
    render(this._contentComponent, filmsTopRatedComponent, RenderPosition.AFTER_CHILDS);
  }

  _renderFilmsMostCommented() {
    const filmsMostCommentedComponent = new FilmsExtraView(this._data, 'Most commented');
    render(this._contentComponent, filmsMostCommentedComponent, RenderPosition.AFTER_CHILDS);
  }

  _handleShowMoreButtonClick() {
    this._renderFilmCards(this._renderedFilmsCount, this._renderedFilmsCount + Count.FILM_COUNT_STEP);
    this._renderedFilmsCount += Count.FILM_COUNT_STEP;
    if (this._data.length <= this._renderedFilmsCount) {
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
