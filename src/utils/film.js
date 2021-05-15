import dayjs from 'dayjs';

const getFilmPropertyCount = (films, nameProperty) => {
  let counter = 0;

  films.forEach((el) => {
    switch (nameProperty) {
      case 'isWatchlist':
        if (el.isWatchlist) {
          counter += 1;
        }
        break;
      case 'isViewed':
        if (el.isViewed) {
          counter += 1;
        }
        break;
      case 'isFavorite':
        if (el.isFavorite) {
          counter += 1;
        }
        break;
    }
  });

  return counter;
};

const getWeightForNullData = (dataA, dataB) => {
  if (dataA === null && dataB === null) {
    return 0;
  }

  if (dataA === null) {
    return 1;
  }

  if (dataB === null) {
    return -1;
  }

  return null;
};

const sortByDate = (film1, film2) => {
  const date1 = film1.releaseDate;
  const date2 = film2.releaseDate;
  const weight = getWeightForNullData(date1, date2);

  if (weight !== null) {
    return weight;
  }

  return dayjs(date2).diff(dayjs(date1));
};

const sortByRating = (film1, film2) => {
  const rating1 = film1.rating;
  const rating2 = film2.rating;
  return rating2 - rating1;
};

export {
  getFilmPropertyCount,
  sortByDate,
  sortByRating
};
