import { render, remove, RenderPosition } from '../utils/render.js';
import { Count } from '../const.js';
import { updateItem } from '../utils/common.js';

import FilmPresenter from './film.js';
import FilmsListView from '../view/films-list.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsExtraView from '../view/films-extra.js';
import SortView from '../view/sort.js';
import ShowMoreView from '../view/show-more.js';

export default class FilmsList {
  constructor(siteMainElement) {
    this._siteMainElement = siteMainElement;
    this._siteFilmsElement = this._siteMainElement.querySelector('.films');
    this._siteFilmsListElement = this._siteFilmsElement.querySelector('.films-list');
    this._siteFilmsListTitleElement = this._siteFilmsElement.querySelector('.films-list__title');
    this._renderedFilmsCount = Count.FILM_COUNT_STEP;
    this._filmPresenter = {};

    this._SortComponent = new SortView();
    this._FilmsListComponent = new FilmsListView();
    this._FilmsListEmptyComponent = new FilmsListEmptyView();
    this._ShowMoreComponent = new ShowMoreView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(data) {  // метод для начала работы модуля
    this._data = data.slice();  // борьба против мутации данных
    if (!this._data.length) {
      this._renderFilmsListEmpty();
      return;
    }

    this._renderSort();
    this._renderFilmsTopRated();
    this._renderFilmsMostCommented();

    render(this._siteFilmsListTitleElement, this._FilmsListComponent, RenderPosition.AFTER_ELEMENT);
    this._renderFilmCards(0, Math.min(this._data.length, this._renderedFilmsCount));

    if (this._data.length > this._renderedFilmsCount) {
      this._renderLoadMoreButton();
    }
  }

  _renderSort() {  // Метод для рендеринга сортировки
    render(this._siteFilmsElement, this._SortComponent, RenderPosition.BEFORE_ELEMENT);
  }

  _handleFilmChange(updatedFilm, comments) {
    const updatedItem = new Map().set(updatedFilm, comments);
    this._data = updateItem(this._data, updatedItem);
    this._filmPresenter[updatedFilm.id].init(updatedFilm, comments);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderFilmCard(film, comments) {
    const filmPresenter = new FilmPresenter(this._FilmsListComponent, this._handleFilmChange, this._handleModeChange);
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
    render(this._siteFilmsListTitleElement, this._FilmsListEmptyComponent, RenderPosition.AFTER_ELEMENT);
  }

  _renderFilmsTopRated() {
    const filmsTopRatedComponent = new FilmsExtraView(this._data, 'Top rated');
    render(this._siteFilmsElement, filmsTopRatedComponent, RenderPosition.AFTER_CHILDS);
  }

  _renderFilmsMostCommented() {
    const filmsMostCommentedComponent = new FilmsExtraView(this._data, 'Most commented');
    render(this._siteFilmsElement, filmsMostCommentedComponent, RenderPosition.AFTER_CHILDS);
  }

  _handleShowMoreButtonClick() {
    this._renderFilmCards(this._renderedFilmsCount, this._renderedFilmsCount + Count.FILM_COUNT_STEP);
    this._renderedFilmsCount += Count.FILM_COUNT_STEP;
    if (this._data.length <= this._renderedFilmsCount) {
      remove(this._ShowMoreComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._siteFilmsListElement, this._ShowMoreComponent, RenderPosition.AFTER_CHILDS);
    this._ShowMoreComponent.setShowClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmsList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => {
        // console.log('Удаляем презентер');
        // console.log(presenter);
        presenter.destroy();
      });
    this._filmPresenter = {};
    this._renderedFilmsCount = Count.FILM_COUNT_STEP;
    remove(this._ShowMoreComponent);
    // console.log('Список презентеров очищен');
  }
}
