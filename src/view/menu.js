import AbstractView from './abstract.js';
import { MenuItem, TagName } from '../const.js';

const createMenuTemplate = () => {
  return `
  <nav class="main-navigation">
    <a href="#${ MenuItem.STATS }" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();
    this._statsClickHandler = this._statsClickHandler.bind(this);
    this._isStats = false;
  }

  getTemplate() {
    return createMenuTemplate(this._isStats);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._statsClickHandler);
  }

  removeElement() {
    this.getElement().removeEventListener('click', this._statsClickHandler);
    super.removeElement();
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    const activeElement = evt.target;

    if (activeElement.tagName !== TagName.A) {
      return;
    }

    if (activeElement.getAttribute('href') === `#${ MenuItem.STATS }`) {
      this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => {
        item.classList.remove('main-navigation__item--active');
      });

      activeElement.classList.add('main-navigation__additional--active');
      this._callback.menuClick(MenuItem.STATS);
      return;
    } else {
      this.getElement().querySelector(`[href="#${ MenuItem.STATS }"]`).classList.remove('main-navigation__additional--active');
      activeElement.classList.add('main-navigation__item--active');
      this._callback.menuClick(MenuItem.FILMS);
    }
  }
}
