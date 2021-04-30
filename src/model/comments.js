import Observer from '../utils/observer.js';
// import { updateItem, deleteItem } from '../utils/common.js';
import { deleteItem } from '../utils/common.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  // updateComments(updateType, update) {
  //   this._comments = updateItem(this._comments, update);
  //   this._notify(updateType, update);
  // }

  deleteComments(updateType, update) {
    this._comments = deleteItem(this._comments, update);
    this._notify(updateType);
  }

  addComments(updateType, update) {
    this._comments = [
      update,
      ...this._comments,
    ];

    this._notify(updateType, update);
  }
}
