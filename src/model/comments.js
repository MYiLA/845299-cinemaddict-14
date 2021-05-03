import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor(commentsData) {
    super();
    this._comments = null;
    this._filmId = null;
    this._commentsData = commentsData;
  }

  _updateData() {
    this._commentsData.set(this._filmId, this._comments);
  }

  setComments(filmId) {
    this._comments = this._commentsData.get(filmId);
    this._filmId = filmId;
  }

  getComments() {
    return this._comments;
  }

  deleteComment(idComment) {
    const index = this._comments.findIndex((item) => item.id === idComment);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting item');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];
    this._updateData();
    this._notify();
  }

  addComment(update) {
    this._comments = [
      update,
      ...this._comments,
    ];
    this._updateData();
    this._notify();
  }
}
