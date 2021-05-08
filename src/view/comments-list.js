import dayjs from 'dayjs'; // библиотека дат и времени
import he from 'he';
import SmartView from './smart.js';

const createCommentsListTemplate = (state) => { // отрисовались до того, как обновился сервер
  const createComments = () => {
    return state.map((comment) => {
      return `
      <li class="film-details__comment" data-id="${comment.id}">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-${comment.emoji}">
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(comment.text)}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${dayjs(comment.date).fromNow()}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
    `;
    }).join('');
  };

  return `
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${state.length}</span></h3>
      <ul class="film-details__comments-list">
        ${createComments()}
      </ul>
    </section>`;
};

export default class CommentsList extends SmartView {
  constructor(comments) {
    super();
    this._state = comments;
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentsListTemplate(this._state);
  }

  reset(comments) {
    this.state = comments;
  }

  restoreHandlers() {
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'BUTTON') return;
    this._callback.deleteClick(evt.path[3].dataset.id);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().addEventListener('click', this._deleteClickHandler);
  }
}
