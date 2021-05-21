import { remove, render, RenderPosition } from './utils/render.js';
import { showToast, hideToast } from './utils/toast.js';
import { UpdateType, MenuItem } from './const.js';
import FilmsModel from './model/films.js';
import СommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import ContentPresenter from './presenter/content.js';
import FilterPresenter from './presenter/filter.js';
import MenuView from './view/menu.js';
import MoviesCountView from './view/movies-count.js';
import StatisticsView from './view/statistics.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic eo06840ik29889a';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const STORE_FILMS_PREFIX = 'films';
const STORE_COMMENTS_PREFIX = 'comments';
const STORE_VER = 'v14';
const STORE_FILMS_NAME = `${STORE_FILMS_PREFIX}-${STORE_VER}`;
const STORE_COMMENTS_NAME = `${STORE_COMMENTS_PREFIX}-${STORE_VER}`;


const siteMainElement = document.querySelector('.main');
const siteFooterStatElement = document.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);
const storeFilms = new Store(STORE_FILMS_NAME, window.localStorage);
const storeComments = new Store(STORE_COMMENTS_NAME, window.localStorage);
const apiWithProviderFilms = new Provider(api, storeFilms);
const apiWithProviderComments = new Provider(api, storeComments);

const filmsModel = new FilmsModel();
const commentsModel = new СommentsModel();
const filterModel = new FilterModel();

const menuViewComponent = new MenuView();

const moviesCountEmptyComponent = new MoviesCountView(0);

const contentPresenter = new ContentPresenter(siteMainElement, filmsModel, commentsModel, filterModel, apiWithProviderFilms, apiWithProviderComments);
const filterPresenter = new FilterPresenter(menuViewComponent, filterModel, filmsModel);


render(siteFooterStatElement, moviesCountEmptyComponent, RenderPosition.AFTER_CHILDS);
render(siteMainElement, menuViewComponent, RenderPosition.BEFORE_CHILDS);

filterPresenter.init();
contentPresenter.init();

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      if (statisticsComponent) {
        statisticsComponent.hide();
      }
      contentPresenter.show();
      break;
    case MenuItem.STATS:
      remove(statisticsComponent);
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

apiWithProviderFilms.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    remove(moviesCountEmptyComponent);
    const moviesCountComponent = new MoviesCountView(filmsModel.getFilms().length);
    render(siteFooterStatElement, moviesCountComponent, RenderPosition.AFTER_CHILDS);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    const statisticsComponent = new StatisticsView(filmsModel.getFilms());
    render(siteMainElement, statisticsComponent, RenderPosition.AFTER_CHILDS);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  // console.log('ONLINE');
  hideToast();
  apiWithProviderFilms.sync();
});

window.addEventListener('offline', () => {
  showToast('Oops! Your internet is not working');
});
