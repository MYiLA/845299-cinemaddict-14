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
    console.log('getComments');
    return this._comments;
  }

  deleteComment(updateType, update) {
    console.log('удалить коммент');
    const index = this._comments.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting item');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._updateData();
    this._notify(updateType);
  }

  addComment(update, updateType) {
    console.log('добавить коммент');
    this._comments = [
      update,
      ...this._comments,
    ];
    this._updateData();
    this._notify(updateType, update);
  }
}
