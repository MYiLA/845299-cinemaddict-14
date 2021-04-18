import { RenderPosition } from './const.js';
import { getRandomInteger } from './utils/common.js';
import { getFilmPropertyCount } from './utils/film.js';
import { render, remove } from './utils/render.js';
import { generateFilmData } from './mock/task.js';

import FilmCardView from './view/film-card.js';
import FilmDetailsView from './view/film-details.js';
import FilmsListView from './view/films-list.js';
import FilmsListEmptyView from './view/films-list-empty.js';
import FilmsExtraView from './view/films-extra.js';
import MenuView from './view/menu.js';
import ProfileView from './view/profile.js';
import SortView from './view/sort.js';
import MoviesCountView from './view/movies-count.js';
import ShowMoreView from './view/show-more.js';

const MAX_FILMS_COUNT = 60;
const FILM_COUNT_STEP = 5;

const data = new Array(getRandomInteger(MAX_FILMS_COUNT)).fill().map(generateFilmData);

const viewedCount = getFilmPropertyCount(data, 'isViewed');

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterStatElement = siteBodyElement.querySelector('.footer__statistics');
const siteFilmsElement = siteMainElement.querySelector('.films');
const siteFilmsListElement = siteFilmsElement.querySelector('.films-list');
const siteFilmsListTitleElement = siteFilmsElement.querySelector('.films-list__title');

const renderFilmCard = (filmsList, film, comments) => {
  const filmComponent = new FilmCardView(film, comments);
  const FilmDetailsComponent = new FilmDetailsView(film, comments);

  const openPopup = () => {
    FilmDetailsComponent.setCloseClickHandler(() => {
      siteBodyElement.removeChild(FilmDetailsComponent.getElement());
      siteBodyElement.classList.remove('hide-overflow');
    });

    siteBodyElement.appendChild(FilmDetailsComponent.getElement());
    siteBodyElement.classList.add('hide-overflow');
  };

  filmComponent.setOpenClickHandler(openPopup);

  render(filmsList, filmComponent, RenderPosition.BEFOREEND);
};

const renderListCards = (filmsListContainer, data, filmsListTitle) => {
  const filmsListComponent = new FilmsListView();

  // заглушка
  if (!data.length) {
    render(filmsListTitle, new FilmsListEmptyView(), RenderPosition.AFTEREND);
    return;
  }

  render(filmsListTitle, filmsListComponent, RenderPosition.AFTEREND);

  data
    .slice(0, Math.min(data.length, FILM_COUNT_STEP))
    .forEach((el) => {
      el.forEach((value, key) => {
        renderFilmCard(filmsListComponent, key, value);
      });
    });

  if (data.length > FILM_COUNT_STEP) {
    let count = FILM_COUNT_STEP;

    const showMoreComponent = new ShowMoreView();
    render(filmsListContainer, showMoreComponent, RenderPosition.BEFOREEND);

    showMoreComponent.setShowClickHandler(() => {
      data
        .slice(count, count + FILM_COUNT_STEP)
        .forEach((el) => {
          el.forEach((value, key) => {
            renderFilmCard(filmsListComponent, key, value);
          });
        });

      count += FILM_COUNT_STEP;

      if (data.length <= count) {
        remove(showMoreComponent);
      }
    });
  }
};

const sortViewComponent = new SortView();
render(siteMainElement, sortViewComponent, RenderPosition.AFTERBEGIN);

const menuViewComponent = new MenuView(data);
render(siteMainElement, menuViewComponent, RenderPosition.AFTERBEGIN);

if (data.length) {
  const profileViewComponent = new ProfileView(data.length, viewedCount);
  render(siteHeaderElement, profileViewComponent, RenderPosition.BEFOREEND);

  const filmsTopRatedComponent = new FilmsExtraView(data, 'Top rated');
  render(siteFilmsElement, filmsTopRatedComponent, RenderPosition.BEFOREEND);

  const filmsMostCommentedComponent = new FilmsExtraView(data, 'Most commented');
  render(siteFilmsElement, filmsMostCommentedComponent, RenderPosition.BEFOREEND);
}

const moviesCountComponent = new MoviesCountView(data.length);
render(siteFooterStatElement, moviesCountComponent, RenderPosition.BEFOREEND);

renderListCards(siteFilmsListElement, data, siteFilmsListTitleElement);
