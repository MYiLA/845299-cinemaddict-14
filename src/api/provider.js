import FilmsModel from '../model/films.js';
import CommentsModel from '../model/comments.js';
import { isOnline } from '../utils/common.js';

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};
// добавьте приватное свойство-флаг, которое будет хранить булево значение, означающее необходимость синхронизации;
// реализуйте публичный метод для получения этого значения (геттер).
// Обратите внимание, для дальнейшего удобства синхронизации нужно помечать изменённые сущности вне сети.
// Реализуйте в Provider метод синхронизации. Логика следующая:
// в случае успешного обращения к серверу нужно заменить в хранилище данные, изменённые или созданные без сети,
// на те, что придут в ответе сервера. Изменить свойство-флаг о необходимости синхронизации.
// Добавьте в обработчик события online вызов метода Provider для синхронизации с сервером.
// Это необходимо сделать лишь в том случае, если синхронизация требуется.
export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if(isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    if(isOnline()) {
      return this._api.getComments(filmId)
        .then((comments) => {
          const items = createStoreStructure(comments.map(CommentsModel.adaptToServer));
          this._store.setItem(filmId, items);
          return comments;
        });
    }

    const storeComments = Object.values(this._store.getItem(filmId));
    return Promise.resolve(CommentsModel.adaptToClient(storeComments));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  addComment(filmId, comment) {
    if (isOnline()) {
      return this._api.addComment(filmId, comment)
        .then((newComment) => {
          const items = createStoreStructure(newComment.comments.map(CommentsModel.adaptToServer));
          this._store.setItem(filmId, items);
          return newComment;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(commentId) {
    if(isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => {
          return this._store.removeItem(commentId);
        });
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const store = Object.values(this._store.getItems());

      return this._api.sync(store)
        .then((response) => {
          const items = createStoreStructure(response.updated);
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
