import AbstractView from './abstract.js';

const createFilmsListTemplate = () => {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
};

export default class FilmsListEmpty extends AbstractView {
  getTemplate() {
    return createFilmsListTemplate(this._data, this._countShow);
  }
}
