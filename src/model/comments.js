import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = null;
    this._filmId = null;
  }

  _updateData() {
    // this._commentsData.set(this._filmId, this._comments);  // вообще не надо
  }

  setComments(filmId) {
    // this._comments = this._commentsData.get(filmId); // получает и записывает комментарии по переданному id фильма
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
    this._notify(this._comments);
  }

  addComment(update) {
    this._comments = [
      update,
      ...this._comments,
    ];
    this._updateData();
    this._notify(this._comments);
  }
}
