import AbstractView from './abstract.js';
import { ViewedCount } from '../const.js';

const createProfileTemplate = (viewedCount) => {

  const renderTitle = () => {
    if (viewedCount === ViewedCount.NOT) {
      return '';
    }

    if ((viewedCount > ViewedCount.NOT) && (viewedCount <= ViewedCount.NOVICE)) {
      return '<p class="profile__rating">Novice</p>';
    }

    if ((viewedCount > ViewedCount.NOVICE) && (viewedCount <= ViewedCount.FAN)) {
      return '<p class="profile__rating">Fan</p>';
    }

    if (viewedCount > ViewedCount.FAN) {
      return '<p class="profile__rating">Movie Buff</p>';
    }
  };

  return `
  <section class="header__profile profile">
    ${ renderTitle() }
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

  setViewedCount(count) {
    this._viewedCount = count;
  }
}
