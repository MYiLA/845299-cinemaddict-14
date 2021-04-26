import AbstractView from './abstract.js';

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._state = {};
  }

  updateState(update, justStateUpdating) { // будет обновлять данные и, если нужно, вызывать метод updateElement
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
    this.removeElement();  // удалить старый DOM-элемент компонента;

    const newElement = this.getElement(); // создать новый DOM-элемент;
    parent.replaceChild(newElement, prevElement); // поместить новый элемент вместо старого;

    this.restoreHandlers(); // восстановить обработчики событий, вызвав restoreHandlers.
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
