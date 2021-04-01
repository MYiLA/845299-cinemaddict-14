import {createContentTemplate} from './view/content.js';
import {createFilmDetailsTemplate} from './view/film-details.js';
import {createMenuTemplate} from './view/menu.js';
import {createProfileTemplate} from './view/profile.js';
import {createSortTemplate} from './view/sort.js';
import {createMoviesCountTemplate} from './view/movies-count.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatElement = document.querySelector('.footer__statistics');
const siteBodyElement = document.querySelector('.hide-overflow');

render(siteHeaderElement, createProfileTemplate(), 'beforeend');

render(siteMainElement, createMenuTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createContentTemplate(), 'beforeend');

render(siteFooterStatElement, createMoviesCountTemplate(), 'beforeend');

render(siteBodyElement, createFilmDetailsTemplate(), 'beforeend');
