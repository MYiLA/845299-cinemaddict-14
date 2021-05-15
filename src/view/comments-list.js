import dayjs from 'dayjs';
import he from 'he';
import SmartView from './smart.js';

const createCommentsListTemplate = (state) => {
  const createComments = () => {

    return state.map((comment) => {
      const { id, emoji, author, text, date, isDisabled, isDeleting } = comment;

      return `
      <li class="film-details__comment" data-id="${ id }">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${ emoji }.png" width="55" height="55" alt="emoji-${ emoji }">
        </span>
        <div>
          <p class="film-details__comment-text">${ he.encode(text) }</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${ author }</span>
            <span class="film-details__comment-day">${ dayjs(date).fromNow() }</span>
            <button class="film-details__comment-delete" ${ isDisabled ? 'disabled' : '' }>${ isDeleting ? 'Deleting...' : 'Delete' }</button>
          </p>
        </div>
      </li>
    `;
    }).join('');
  };

  return `
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${ state.length }</span></h3>
      <ul class="film-details__comments-list">
        ${ createComments() }
      </ul>
    </section>`;
};

export default class CommentsList extends SmartView{
  constructor(comments) {
    super();
    this._state = CommentsList.parseCommentsToState(comments);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentsListTemplate(this._state);
  }

  restoreHandlers() {
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    this._callback.deleteClick(evt.path[3].dataset.id);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().addEventListener('click', this._deleteClickHandler);
  }

  removeElement() {
    this.getElement().removeEventListener('click', this._deleteClickHandler);
    super.removeElement();
  }

  static parseCommentsToState(comments) {
    return comments.map((comment) => {
      return Object.assign(
        {},
        comment,
        {
          isDisabled: false,
          isDeleting: false,
        });
    });
  }

  updateState(state, commentId) {
    this._state = this._state.map((element) => {
      if(element.id === commentId) {
        return Object.assign(
          {},
          element,
          state);
      }

      return element;
    });

    this.updateElement();
  }

  shake(callback, commentId) {
    this.getElement().querySelector(`[data-id="${ commentId }"]`).style.animation = `shake ${ this._SHAKE_ANIMATION_TIMEOUT / 1000 }s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, this._SHAKE_ANIMATION_TIMEOUT);
  }
}
