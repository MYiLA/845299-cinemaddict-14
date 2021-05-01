import Observer from '../utils/observer.js';
// import { updateItem, deleteItem } from '../utils/common.js';
import { deleteItem } from '../utils/common.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = NaN;
  }

  setComments(comments) {
    this._comments = comments;
  }

  getComments(filmId) {
    return this._comments.get(filmId);
  }

  // updateComments(updateType, update) {
  //   this._comments = updateItem(this._comments, update);
  //   this._notify(updateType, update);
  // }

  deleteComments(updateType, update) {
    console.log('удалить коммент');
    // this._comments = deleteItem(this._comments, update);
    // this._notify(updateType);
  }

  addComments(filmId, update, updateType) {
    this._comments.get(filmId).push(update);
    console.log('добавить коммент');
    // this._comments = [
    //   update,
    //   ...this._comments,
    // ];

    this._notify(updateType, update);
  }
}
