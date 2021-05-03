import { getFilmPropertyCount } from './utils/film.js';
import { render, RenderPosition } from './utils/render.js';
import { films, commentsData } from './mock/data.js';
import FilmsModel from './model/films.js';
import СommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';

import ContentPresenter from './presenter/content.js';
import MenuView from './view/menu.js';
import ProfileView from './view/profile.js';
import MoviesCountView from './view/movies-count.js';

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new СommentsModel(commentsData);

const viewedCount = getFilmPropertyCount(filmsModel.getFilms(), 'isViewed');

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatElement = document.querySelector('.footer__statistics');

const contentPresenter = new ContentPresenter(siteMainElement, filmsModel, commentsModel);

const menuViewComponent = new MenuView(filmsModel.getFilms());

render(siteMainElement, menuViewComponent, RenderPosition.BEFORE_CHILDS);

if (filmsModel.getFilms().length) {
  const profileViewComponent = new ProfileView(viewedCount);
  render(siteHeaderElement, profileViewComponent, RenderPosition.AFTER_CHILDS);
}

const moviesCountComponent = new MoviesCountView(filmsModel.getFilms().length);
render(siteFooterStatElement, moviesCountComponent, RenderPosition.AFTER_CHILDS);

contentPresenter.init();
