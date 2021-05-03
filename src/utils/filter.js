import { FilterType } from '../const';

// isFilmViewed, isFilmFavorite, isFilmWatchlist
export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite), // можно дописать еще условия попадания в фильтр
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isViewed),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
};
