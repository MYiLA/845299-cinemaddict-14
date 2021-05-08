import dayjs from 'dayjs'; // библиотека дат и времени
import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
    this._filmId = null;
  }

  _updateData() {
    // this._commentsData.set(this._filmId, this._comments);  // вообще не надо
  }

  setComments(updateType, comments) {
    this._comments = comments.slice(); // получает и записывает комментарии по переданному id фильма
    this._notify(updateType);
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

  static adaptToClient(comments) {
    const adaptedComments = Object.assign(
      {},
      comments,
      {
        date: dayjs(comments.date).valueOf(),
        text: comments.comment,
        emoji: comments.emotion,
      });

    delete adaptedComments.comment;
    delete adaptedComments.emotion;

    return adaptedComments;
  }

  static adaptToServer(comments) {
    const adaptedComments = Object.assign(
      {},
      comments,
      {
        date: dayjs(comments.date).toISOString(),
        comment: comments.text,
        emotion: comments.emoji,
      });

    delete adaptedComments.text;
    delete adaptedComments.emoji;

    return adaptedComments;
  }
}
