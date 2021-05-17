import AbstractView from './abstract.js';
import { SortType, TagName } from '../const.js';

const createSortTemplate = (sortType) => {

  const renderActiveClass = (sortTypeButton) => (sortTypeButton === sortType) ? 'sort__button--active' : '';

  return `
  <ul class="sort">
    <li><a href="#" class="sort__button ${ renderActiveClass(SortType.DEFAULT) }" data-sort-type="${ SortType.DEFAULT }">Sort by default</a></li>
    <li><a href="#" class="sort__button ${ renderActiveClass(SortType.DATE) }" data-sort-type="${ SortType.DATE }">Sort by date</a></li>
    <li><a href="#" class="sort__button ${ renderActiveClass(SortType.RATING) }" data-sort-type="${ SortType.RATING }">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends AbstractView {
  constructor(sortType) {
    super();

    this._sortType = sortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  removeElement() {
    this.getElement().removeEventListener('click', this._sortTypeChangeHandler);
    super.removeElement();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== TagName.A) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    this._sortType = evt.target.dataset.sortType;
  }
}
