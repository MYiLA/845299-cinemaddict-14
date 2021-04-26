import { getRandomInteger } from './utils/common.js';
import { getFilmPropertyCount } from './utils/film.js';
import { render, RenderPosition } from './utils/render.js';
import { generateFilmData } from './mock/data.js';

import FilmsListPresenter from './presenter/films-list.js';
import MenuView from './view/menu.js';
import ProfileView from './view/profile.js';
import MoviesCountView from './view/movies-count.js';

const MAX_FILMS_COUNT = 60;

const data = new Array(getRandomInteger(MAX_FILMS_COUNT)).fill().map(generateFilmData);

const viewedCount = getFilmPropertyCount(data, 'isViewed');

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatElement = document.querySelector('.footer__statistics');

const filmsListPresenter = new FilmsListPresenter(siteMainElement);

const menuViewComponent = new MenuView(data);

render(siteMainElement, menuViewComponent, RenderPosition.BEFORE_CHILDS);

if (data.length) {
  const profileViewComponent = new ProfileView(data.length, viewedCount);
  render(siteHeaderElement, profileViewComponent, RenderPosition.AFTER_CHILDS);
}

const moviesCountComponent = new MoviesCountView(data.length);
render(siteFooterStatElement, moviesCountComponent, RenderPosition.AFTER_CHILDS);

filmsListPresenter.init(data);
