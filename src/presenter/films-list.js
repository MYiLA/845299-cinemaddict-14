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
    // за основу инициализации взяла тег body. index файл не меняла.
    // Текущее решение завязано на существующую структуру index.html.
    // Возможно ли сделать (и нужно ли?) более унифицированное решение,
    // чтобы верстка создавалась с нуля в любом контейнере?
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
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(data) {  // метод для начала раболты модуля
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

  _renderFilmCard(film, comments) {
    const filmPresenter = new FilmPresenter(this._FilmsListComponent, this._handleFilmChange);
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
    render(this._siteFilmsElement, filmsTopRatedComponent, RenderPosition.BEFORE_CHILDS);
  }

  _renderFilmsMostCommented() {
    const filmsMostCommentedComponent = new FilmsExtraView(this._data, 'Most commented');
    render(this._siteFilmsElement, filmsMostCommentedComponent, RenderPosition.BEFORE_CHILDS);
  }

  _handleShowMoreButtonClick() {
    this._renderFilmCards(this._renderedFilmsCount, this._renderedFilmsCount + Count.FILM_COUNT_STEP);
    this._renderedFilmsCount += Count.FILM_COUNT_STEP;
    if (this._data.length <= this._renderedFilmsCount) {
      remove(this._ShowMoreComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._siteFilmsListElement, this._ShowMoreComponent, RenderPosition.BEFORE_CHILDS);
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
