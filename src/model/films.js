import dayjs from 'dayjs';
import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilms(updateType, update) {
    const index = this._films.findIndex((item) => item.id === update.id);

    if (index === -1) {
      return this._films;
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilms = Object.assign(
      {},
      film,
      {
        title: film.film_info.title,
        titleOriginal: film.film_info.alternative_title,
        rating: film.film_info.total_rating,
        poster: film.film_info.poster,
        ageRating: film.film_info.age_rating,
        director: film.film_info.director,
        writers: film.film_info.writers,
        actors: film.film_info.actors,
        releaseDate: dayjs(film.film_info.release.date).valueOf(),
        country: film.film_info.release.release_country,
        runtime: film.film_info.runtime,
        genres: film.film_info.genre,
        desc: film.film_info.description,

        isWatchlist: film.user_details.watchlist,
        isViewed: film.user_details.already_watched,
        watchingDate: dayjs(film.user_details.watching_date).valueOf(),
        isFavorite: film.user_details.favorite,
      });

    delete adaptedFilms.film_info;
    delete adaptedFilms.user_details;

    return adaptedFilms;
  }

  static adaptToServer(film) {
    const adaptedFilms = Object.assign(
      {},
      film,
      {
        'film_info': {
          title: film.title,
          'alternative_title': film.titleOriginal,
          'total_rating': film.rating,
          poster: film.poster,
          'age_rating': film.ageRating,
          director: film.director,
          writers: film.writers,
          actors: film.actors,
          release: {
            date: dayjs(film.releaseDate).toISOString(),
            'release_country': film.country,
          },
          runtime: film.runtime,
          genre: film.genres,
          description: film.desc,
        },
        'user_details': {
          watchlist: film.isWatchlist,
          'already_watched': film.isViewed,
          'watching_date': film.watchingDate ? dayjs(film.watchingDate).toISOString() : film.watchingDate,
          favorite: film.isFavorite,
        },
      });

    delete adaptedFilms.title;
    delete adaptedFilms.titleOriginal;
    delete adaptedFilms.rating;
    delete adaptedFilms.poster;
    delete adaptedFilms.ageRating;
    delete adaptedFilms.director;
    delete adaptedFilms.writers;
    delete adaptedFilms.actors;
    delete adaptedFilms.releaseDate;
    delete adaptedFilms.country;
    delete adaptedFilms.runtime;
    delete adaptedFilms.genres;
    delete adaptedFilms.desc;
    delete adaptedFilms.isWatchlist;
    delete adaptedFilms.isViewed;
    delete adaptedFilms.watchingDate;
    delete adaptedFilms.isFavorite;

    return adaptedFilms;
  }
}
