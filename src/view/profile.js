import AbstractView from './abstract.js';

const createProfileTemplate = (viewedCount) => {
  const titleRender = () => {
    if (viewedCount === 0) {
      return '';
    }

    if ((viewedCount >= 1) && (viewedCount <= 10)) {
      return '<p class="profile__rating">Novice</p>';
    }

    if ((viewedCount >= 11) && (viewedCount <= 20)) {
      return '<p class="profile__rating">Fan</p>';
    }

    if (viewedCount >= 21) {
      return '<p class="profile__rating">Movie Buff</p>';
    }
  };

  return `
  <section class="header__profile profile">
    ${titleRender()}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile extends AbstractView {
  constructor(viewedCount) {
    super();
    this._viewedCount = viewedCount;
  }

  getTemplate() {
    return createProfileTemplate(this._viewedCount);
  }
}
