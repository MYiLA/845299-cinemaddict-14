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

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING_SAVING: 'ABORTING_SAVING',
  ABORTING_DELETING: 'ABORTING_DELETING',
};

const SHAKE_ANIMATION_TIMEOUT = 600;

const ViewedCount = {
  NOT: 0,
  NOVICE: 10,
  FAN: 20,
};

// if ((viewedCount > ViewedCount.NOT) && (viewedCount <= ViewedCount.NOVICE)) { return '<p class="profile__rating">Novice</p>'; }
// if ((viewedCount > ViewedCount.NOVICE) && (viewedCount <= ViewedCount.FAN)) { return '<p class="profile__rating">Fan</p>'; }
// if (viewedCount > ViewedCount.FAN) { return '<p class="profile__rating">Movie Buff</p>'; }

export {
  Count,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  MenuItem,
  StatisticFilterType,
  TagName,
  State,
  SHAKE_ANIMATION_TIMEOUT,
  ViewedCount
};
