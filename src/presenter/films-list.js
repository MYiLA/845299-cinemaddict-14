import { render, remove, RenderPosition } from '../utils/render.js';
import { Count } from '../const.js';

import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import FilmsListView from '../view/films-list.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsExtraView from '../view/films-extra.js';
import SortView from '../view/sort.js';
import ShowMoreView from '../view/show-more.js';

export default class FilmsList {
  constructor(siteBodyElement) {
    // за основу инициализации взяла тег body. index файл не меняла.
    // Текущее решение завязано на существующую структуру index.html.
    // Возможно ли сделать (и нужно ли?) более унифицированное решение,
    // чтобы верстка создавалась с нуля в любом контейнере?
    this._siteBodyElement = siteBodyElement;
    this._siteMainElement = this._siteBodyElement.querySelector('.main');
    this._siteFilmsElement = this._siteMainElement.querySelector('.films');
    this._siteFilmsListElement = this._siteFilmsElement.querySelector('.films-list');
    this._siteFilmsListTitleElement = this._siteFilmsElement.querySelector('.films-list__title');
    this.renderedFilmsCount = Count.FILM_COUNT_STEP;

    this._SortComponent = new SortView();
    this._FilmsListComponent = new FilmsListView();
    this._FilmsListEmptyComponent = new FilmsListEmptyView();
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
    this._renderFilmCards(0, Math.min(this._data.length, this.renderedFilmsCount));

    if (this._data.length > this.renderedFilmsCount) {
      this._renderLoadMoreButton();
    }
  }

  _renderSort() {  // Метод для рендеринга сортировки
    render(this._siteFilmsElement, this._SortComponent, RenderPosition.BEFORE_ELEMENT);
  }

  _renderFilmCard(film, comments) { // рендеринг одной карточки фильма FilmCardView
    const filmComponent = new FilmCardView(film, comments);
    filmComponent.setOpenClickHandler(() => this._renderFilmDetails(film, comments));
    render(this._FilmsListComponent, filmComponent, RenderPosition.BEFORE_CHILDS);
  }

  _renderFilmCards(from, to) {
    this._data
      .slice(from, to)
      .forEach((el) => {
        el.forEach((value, key) => this._renderFilmCard(key, value));
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

  _renderFilmDetails(film, comments) {  // рендеринг одного попапа FilmDetailsView
    const FilmDetailsComponent = new FilmDetailsView(film, comments);

    FilmDetailsComponent.setCloseClickHandler(() => {
      this._siteBodyElement.removeChild(FilmDetailsComponent.getElement());
      this._siteBodyElement.classList.remove('hide-overflow');
    });

    this._siteBodyElement.appendChild(FilmDetailsComponent.getElement());
    this._siteBodyElement.classList.add('hide-overflow');
  }

  _renderLoadMoreButton() {  // Метод, куда уйдёт логика по отрисовке карточек по кнопке ShowMoreView
    let count = this.renderedFilmsCount;
    const showMoreComponent = new ShowMoreView();
    render(this._siteFilmsListElement, showMoreComponent, RenderPosition.BEFORE_CHILDS);

    showMoreComponent.setShowClickHandler(() => {
      this._renderFilmCards(count, count + this.renderedFilmsCount);
      count += this.renderedFilmsCount;

      if (this._data.length <= count) {
        remove(showMoreComponent);
      }
    });
  }
}
