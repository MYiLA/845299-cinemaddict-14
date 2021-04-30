import { getRandomInteger } from './utils/common.js';
import { getFilmPropertyCount } from './utils/film.js';
import { render, RenderPosition } from './utils/render.js';
import { generateFilmData, films } from './mock/data.js';
import FilmsModel from './model/films.js';

import ContentPresenter from './presenter/content.js';
import MenuView from './view/menu.js';
import ProfileView from './view/profile.js';
import MoviesCountView from './view/movies-count.js';

// const MAX_FILMS_COUNT = 60;

// const data = new Array(getRandomInteger(MAX_FILMS_COUNT)).fill().map(generateFilmData);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const viewedCount = getFilmPropertyCount(films, 'isViewed');

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatElement = document.querySelector('.footer__statistics');

const contentPresenter = new ContentPresenter(siteMainElement, filmsModel);

const menuViewComponent = new MenuView(films);

render(siteMainElement, menuViewComponent, RenderPosition.BEFORE_CHILDS);

if (films.length) {
  const profileViewComponent = new ProfileView(films.length, viewedCount);
  render(siteHeaderElement, profileViewComponent, RenderPosition.AFTER_CHILDS);
}

const moviesCountComponent = new MoviesCountView(films.length);
render(siteFooterStatElement, moviesCountComponent, RenderPosition.AFTER_CHILDS);

contentPresenter.init(films);
