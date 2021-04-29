import dayjs from 'dayjs'; // библиотека дат и времени

export const getFilmPropertyCount = (data, nameProperty) => {
  let counter = 0;
  data.forEach((element) => {
    element.forEach((value, key) => {
      switch (nameProperty) {
        case 'isWatchlist':
          if (key.isWatchlist) {
            counter += 1;
          }
          break;
        case 'isViewed':
          if (key.isViewed) {
            counter += 1;
          }
          break;
        case 'isFavorite':
          if (key.isFavorite) {
            counter += 1;
          }
          break;
      }
    });
  });
  return counter;
};

// если у фильма нет даты релиза
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

// сортировка
export const sortByDate = (film1, film2) => {
  const date1 = film1.keys().next().value.releaseDate;
  const date2 = film2.keys().next().value.releaseDate;
  const weight = getWeightForNullData(date1, date2);

  if (weight !== null) {
    return weight;
  }

  return dayjs(date2).diff(dayjs(date1));
};

export const sortByRating = (film1, film2) => {
  const rating1 = film1.keys().next().value.rating;
  const rating2 = film2.keys().next().value.rating;
  return rating2 - rating1;
};
