import he from 'he';
import { scrollFix } from '../utils/common.js';
import SmartView from './smart.js';

const CLEAR_COMMENT = {
  text: '',
  emoji: '',
};

const createNewCommentTemplate = (state) => {

  const { emoji, text, isDisabled } = state;
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
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${he.encode(text)}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${(emoji === 'smile') ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${(emoji === 'sleeping') ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${(emoji === 'puke') ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${(emoji === 'angry') ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>`;
};

export default class NewComment extends SmartView {
  constructor(comment = CLEAR_COMMENT) {
    super();
    this._state = NewComment.parseCommentsToState(comment);
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
    const textAreaElement = this.getElement().querySelector('.film-details__comment-input');
    textAreaElement.addEventListener('input', this._textInputHandler);
    scrollFix(textAreaElement);
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

    if (this._state.emoji && this._state.text) { // пустые комментарии блочатся до запроса к серверу
      this._callback.commentSubmit(NewComment.parseStateToComments(this._state));
    } else {
      this.getElement().style.animation = `shake ${ this._SHAKE_ANIMATION_TIMEOUT / 1000 }s`;
      setTimeout(() => {
        this.getElement().style.animation = '';
      }, this._SHAKE_ANIMATION_TIMEOUT);
    }
  }

  static parseCommentsToState(comment) {
    return Object.assign(
      {},
      comment,
      {
        isDisabled: false,
      });
  }

  static parseStateToComments(state) {
    delete state.isDisabled;
    return state;
  }
}
