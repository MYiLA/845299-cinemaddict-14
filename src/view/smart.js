import AbstractView from './abstract.js';

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._state = {};
  }

  updateState(update, justStateUpdating) {
    if (!update) {
      return;
    }

    this._state = Object.assign(
      {},
      this._state,
      update);

    if (justStateUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();  // удаление старого DOM-элемента компонента

    const newElement = this.getElement(); // создание нового DOM-элемента
    parent.replaceChild(newElement, prevElement); // размещение нового элемента вместо старого

    this.restoreHandlers(); // восстановление обработчиков событий
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
