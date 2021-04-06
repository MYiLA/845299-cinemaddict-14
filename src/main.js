import { COUNT } from './const.js';
import { getRandomInteger, getFilmPropertyCount } from './utils.js';
import { generateFilmData } from './mock/task.js';
import { createFilmsListTemplate } from './view/films-list.js';
import { createFilmsExtraTemplate } from './view/films-extra.js';
import { createFilmDetailsTemplate } from './view/film-details.js';
import { createMenuTemplate } from './view/menu.js';
import { createProfileTemplate } from './view/profile.js';
import { createSortTemplate } from './view/sort.js';
import { createMoviesCountTemplate } from './view/movies-count.js';
import {createShowMoreTemplate} from './view/show-more.js';

const MAX_FILMS_COUNT = 40;
const FILM_COUNT_STEP = 5;

const data = new Array(getRandomInteger(MAX_FILMS_COUNT)).fill().map(() => generateFilmData());

const viewedCount = getFilmPropertyCount(data, 'isViewed');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const getFilmDetailsTemplate = () => {
  let result = '';

  data[0].forEach((value, key) => {
    result = createFilmDetailsTemplate(key, value);
  });

  return result;
};

const isShowMoreBtn = data.length > COUNT.FILM_COUNT;

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterStatElement = siteBodyElement.querySelector('.footer__statistics');
const siteFilmsElement = siteMainElement.querySelector('.films');
const siteFilmsListElement = siteFilmsElement.querySelector('.films-list');
const siteFilmsListTitleElement = siteFilmsElement.querySelector('.films-list__title');

render(siteHeaderElement, createProfileTemplate(data.length, viewedCount), 'beforeend');

render(siteMainElement, createSortTemplate(data), 'afterbegin');
render(siteMainElement, createMenuTemplate(data), 'afterbegin');

render(siteFilmsElement, createFilmsExtraTemplate(data), 'beforeend');
render(siteFilmsListTitleElement, createFilmsListTemplate(data, COUNT.FILM_COUNT), 'afterend');
render(siteFilmsListElement, createShowMoreTemplate(isShowMoreBtn), 'beforeend');

render(siteFooterStatElement, createMoviesCountTemplate(data.length), 'beforeend');

render(siteBodyElement, getFilmDetailsTemplate(), 'beforeend');

const popup = siteBodyElement.querySelector('.film-details');
const closeBtn = popup.querySelector('.film-details__close-btn');

closeBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  popup.remove();
});

if (data.length > COUNT.FILM_COUNT) {
  let count = COUNT.FILM_COUNT;
  const moreBtn = document.querySelector('.films-list__show-more');

  moreBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    count += FILM_COUNT_STEP;

    siteFilmsListElement.removeChild(siteFilmsListElement.querySelector('.films-list__container'));
    render(siteFilmsListTitleElement, createFilmsListTemplate(data, count), 'afterend');

    if (data.length <= count) {
      moreBtn.remove();
    }
  });
}
