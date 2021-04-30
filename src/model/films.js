import Observer from '../utils/observer.js';
// import { updateItem, deleteItem } from '../utils/common.js';
import { updateItem } from '../utils/common.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilms(updateType, update) {
    this._films = updateItem(this._films, update);
    this._notify(updateType, update);
  }

  // deleteFilms(updateType, update) {
  //   this._films = deleteItem(this._films, update);
  //   this._notify(updateType);
  // }

  // addFilms(updateType, update) {
  //   this._films = [
  //     update,
  //     ...this._films,
  //   ];

  //   this._notify(updateType, update);
  // }

}
