import AbstractView from './abstract.js';

const createFilmsListTemplate = () => {
  return `
    <div class="films-list__container">
    </div>
  `;
};

export default class FilmsList extends AbstractView {
  getTemplate() {
    return createFilmsListTemplate(this._data, this._countShow);
  }
}
