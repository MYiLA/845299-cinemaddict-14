import { getFilmPropertyCount } from './utils/film.js';
import { remove, render, RenderPosition } from './utils/render.js';
import { UpdateType } from './const.js';
import FilmsModel from './model/films.js';
import СommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import ContentPresenter from './presenter/content.js';
import FilterPresenter from './presenter/filter.js';
import MenuView from './view/menu.js';
import ProfileView from './view/profile.js';
import MoviesCountView from './view/movies-count.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic eo06840ik29889a';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatElement = document.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new СommentsModel();
const filterModel = new FilterModel();

const menuViewComponent = new MenuView();
const moviesCountEmptyComponent = new MoviesCountView(0);

const contentPresenter = new ContentPresenter(siteMainElement, filmsModel, commentsModel, filterModel, api);
const filterPresenter = new FilterPresenter(menuViewComponent, filterModel, filmsModel);


render(siteFooterStatElement, moviesCountEmptyComponent, RenderPosition.AFTER_CHILDS);
render(siteMainElement, menuViewComponent, RenderPosition.BEFORE_CHILDS);

filterPresenter.init();
contentPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    // поместить сюда обработчик меню, чтобы не перейти на статистику до загрузки данных? Возможно это не нужно киноману
    const viewedCount = getFilmPropertyCount(filmsModel.getFilms(), 'isViewed');

    if (filmsModel.getFilms().length) {
      const profileViewComponent = new ProfileView(viewedCount);
      render(siteHeaderElement, profileViewComponent, RenderPosition.AFTER_CHILDS);
    }

    remove(moviesCountEmptyComponent);
    const moviesCountComponent = new MoviesCountView(filmsModel.getFilms().length);
    render(siteFooterStatElement, moviesCountComponent, RenderPosition.AFTER_CHILDS);

  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    // поместить сюда обработчик меню, чтобы не перейти на статистику до загрузки данных? Возможно это не нужно киноману
  });
