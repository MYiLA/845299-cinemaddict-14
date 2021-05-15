import AbstractView from './abstract.js';
import { TagName } from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  const renderCount = () => {
    if (type === 'all') {
      return '';
    }
    return `<span class="main-navigation__item-count">${ count }</span>`;
  };

  return `
    <a href="#${ type }" class="main-navigation__item ${ type === currentFilterType ? 'main-navigation__item--active' : '' }">${ name } ${ renderCount() }</a>
  `;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `
    <div class="main-navigation__items">
      ${ filterItemsTemplate }
    </div>
    `;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== TagName.A) {
      return;
    }

    this._callback.filterTypeChange(evt.target.getAttribute('href').split('#')[1]);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  removeElement() {
    this.getElement().removeEventListener('click', this._filterTypeChangeHandler);
    super.removeElement();
  }
}
