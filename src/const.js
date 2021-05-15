const TagName = {
  A: 'A',
  LABEL: 'LABEL',
  BUTTON: 'BUTTON',
};

const Count = {
  FILM_COUNT_STEP: 5,
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_FILM: 'UPDATE_FILM',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const MenuItem = {
  FILMS: 'films',
  STATS: 'stats',
};

const StatisticFilterType = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export {
  Count,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  MenuItem,
  StatisticFilterType,
  TagName
};
