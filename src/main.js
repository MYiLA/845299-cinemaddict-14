import { getRandomInteger } from './utils/common.js';
import { getFilmPropertyCount } from './utils/film.js';
import { render, RenderPosition } from './utils/render.js';
import { generateFilmData } from './mock/task.js';

import FilmsListPresenter from './presenter/films-list.js';
import MenuView from './view/menu.js';
import ProfileView from './view/profile.js';
import MoviesCountView from './view/movies-count.js';

const MAX_FILMS_COUNT = 60;

const data = new Array(getRandomInteger(MAX_FILMS_COUNT)).fill().map(generateFilmData);

const viewedCount = getFilmPropertyCount(data, 'isViewed');

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterStatElement = siteBodyElement.querySelector('.footer__statistics');

const filmsListPresenter = new FilmsListPresenter(siteBodyElement);

const menuViewComponent = new MenuView(data);

render(siteMainElement, menuViewComponent, RenderPosition.AFTER_CHILDS);

if (data.length) {
  const profileViewComponent = new ProfileView(data.length, viewedCount);
  render(siteHeaderElement, profileViewComponent, RenderPosition.BEFORE_CHILDS);
}

const moviesCountComponent = new MoviesCountView(data.length);
render(siteFooterStatElement, moviesCountComponent, RenderPosition.BEFORE_CHILDS);

filmsListPresenter.init(data);
