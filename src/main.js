import { remove, render, RenderPosition } from './utils/render.js';
import { UpdateType, MenuItem } from './const.js';
import FilmsModel from './model/films.js';
import СommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import ContentPresenter from './presenter/content.js';
import FilterPresenter from './presenter/filter.js';
import MenuView from './view/menu.js';
import MoviesCountView from './view/movies-count.js';
import StatisticsView from './view/statistics.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic eo06840ik29889a';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
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

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      statisticsComponent.hide();
      contentPresenter.show();
      break;
    case MenuItem.STATS:
      remove(statisticsComponent); // от этого можно избавиться, если удалять вовремя обработчики
      renderStatisticsComponent();
      statisticsComponent.show();
      contentPresenter.hide();
      break;
  }
};

menuViewComponent.setMenuClickHandler(handleMenuClick);

const renderStatisticsComponent = () => {
  statisticsComponent = new StatisticsView(filmsModel.getFilms());
  render(siteMainElement, statisticsComponent, RenderPosition.AFTER_CHILDS);
};

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    // поместить сюда обработчик меню, чтобы не перейти на статистику до загрузки данных? Возможно это не нужно киноману
    // статистика и профиль не меняют отображение при изменении данных (надо их добавить в слушатели изменений)
    remove(moviesCountEmptyComponent);
    const moviesCountComponent = new MoviesCountView(filmsModel.getFilms().length);
    render(siteFooterStatElement, moviesCountComponent, RenderPosition.AFTER_CHILDS);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    const statisticsComponent = new StatisticsView(filmsModel.getFilms());
    render(siteMainElement, statisticsComponent, RenderPosition.AFTER_CHILDS);
    // поместить сюда обработчик меню, чтобы не перейти на статистику до загрузки данных? Возможно это не нужно киноману
  });
