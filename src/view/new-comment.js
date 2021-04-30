import { getRandomCommentAuthor, getCommentDate, getId } from '../mock/data.js';
import { scrollFix } from '../utils/common.js';
// import dayjs from 'dayjs'; // библиотека дат и времени
import SmartView from './smart.js';

const CLEAR_COMMENT = {
  text: '',
  emoji: '',
};

const createNewCommentTemplate = (state) => {

  const {emoji, text} = state;
  const emojiRender = () => {

    if (!emoji) {
      return '';
    }
    return `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`;
  };

  return `
  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      ${emojiRender()}
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${(emoji === 'smile') ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${(emoji === 'sleeping') ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${(emoji === 'puke') ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${(emoji === 'angry') ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>`;
};

export default class NewComment extends SmartView {
  constructor(comment = CLEAR_COMMENT) {
    super();
    this._state = comment;
    this._emojiToggleHandler = this._emojiToggleHandler.bind(this);
    this._textInputHandler = this._textInputHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createNewCommentTemplate(this._state);
  }

  _setInnerHandlers() {
    const emojiElements = this.getElement().querySelectorAll('.film-details__emoji-label');
    emojiElements.forEach((el) => {
      el.addEventListener('click', this._emojiToggleHandler);
    });
    const textareaElement = this.getElement().querySelector('.film-details__comment-input');
    textareaElement.addEventListener('input', this._textInputHandler);
    scrollFix(textareaElement);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _emojiToggleHandler(evt) {
    this.updateState({
      emoji: `${evt.path[1].htmlFor}`.split('-')[1],
    });
  }

  _textInputHandler(evt) {
    evt.preventDefault();
    this.updateState({
      text: evt.target.value,
    }, true);
  }

  setCommentSubmitHandler(callback) {
    this._callback.commentSubmit = callback;
    if (this._state.emoji) {
      this._callback.commentSubmit(NewComment.parseStateToData(this._state));
    }
  }

  static parseStateToData(state) {
    state = Object.assign(
      {
        id: getId(),
        author: getRandomCommentAuthor(),
        date: getCommentDate(),
      }, state);

    return state;
  }
}
