import AbstractView from './abstract.js';

const createShowMoreTemplate = () => {
  return `
    <button class="films-list__show-more">Show more</button>
  `;
};

export default class ShowMore extends AbstractView {
  constructor() {
    super();
    this._showClickHandler = this._showClickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreTemplate();
  }

  setShowClickHandler(callback) {
    this._callback.showClick = callback;
    this.getElement().addEventListener('click', this._showClickHandler);
  }

  removeElement() {
    this.getElement().removeEventListener('click', this._showClickHandler);
    super.removeElement();
  }

  _showClickHandler(evt) {
    evt.preventDefault();
    this._callback.showClick();
  }
}
