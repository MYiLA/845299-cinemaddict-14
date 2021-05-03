import AbstractView from './abstract.js';

const createMenuTemplate = () => {
  return `
  <nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createMenuTemplate(this._films);
  }
}
