import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const dataFilmsViewedInDateRange = (films, dateFrom) => { // данные о Просмотренных фильмах В Диапазоне Дат
  const isViewedFilms = [];

  films.forEach((film) => {
    if (!film.isViewed) {
      return;
    }
    // С помощью day.js проверям, сколько просмотренных фильмов
    // попадают в диапазон дат
    if (
      dayjs(film.watchingDate).isAfter(dateFrom)
    ) {
      return isViewedFilms.push(film);
    }

    return;
  });

  if (isViewedFilms.length === 0) {
    return {
      isViewedCount: 0,
      runtimeCount: 0,
      numbersOfEachGenre: {},
      topGenre: '',
    };
  }

  const numbersOfEachGenre = {};

  const runtimeCount = isViewedFilms.reduce((acc, film) => {
    // ищем жанры и аккумулируем в объект c количеством повторений
    film.genres.forEach((genre) => {
      if (numbersOfEachGenre[genre] !== undefined) {
        numbersOfEachGenre[genre] += 1;
      } else {
        numbersOfEachGenre[genre] = 1;
      }
    });

    return acc + film.runtime;
  }, 0);

  const topGenre = Object.entries(numbersOfEachGenre).reduce((acc, genre) => acc[1] > genre[1] ? acc : genre)[0];

  return {
    isViewedCount: isViewedFilms.length,
    runtimeCount,
    numbersOfEachGenre,
    topGenre,
  };
};

