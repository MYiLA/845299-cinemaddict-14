import { FilterType } from '../const';

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isViewed),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
};

export {
  filter
};
