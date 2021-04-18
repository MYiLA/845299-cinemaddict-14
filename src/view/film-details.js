import NewComment from './new-comment.js';
import AbstractView from './abstract.js';

const createFilmDetailsTemplate = (film, comments) => {

  const genresRender = () => {
    if (film.genres.length === 1) {
      return `
        <td class="film-details__term">Genre</td>
        <td class="film-details__cell">
        ${film.genres[0]}
      `;
    }

    let result = '';

    film.genres.forEach((element) => {
      result += `<span class="film-details__genre">${element}</span>`;
    });

    return `
      <td class="film-details__term">Genres</td>
      <td class="film-details__cell">
      ${result}
    `;
  };

  const commentsRender = () => {
    return comments.map((comment) => {
      return `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-angry">
        </span>
        <div>
          <p class="film-details__comment-text">${comment.text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${comment.date}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
    `;
    }).join('');
  };

  const getChecked = (bln) => bln ? 'checked' : '';

  const newCommentComponent = new NewComment(comments[0]);

  return `
  <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${film.poster}" alt="">

            <p class="film-details__age">${film.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${film.title}</h3>
                <p class="film-details__title-original">Original: ${film.titleOriginal}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${film.rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${film.writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${film.actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${film.releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${film.runtime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${film.country}</td>
              </tr>
              <tr class="film-details__row">
                  ${genresRender()}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${film.desc}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${getChecked(film.isWatchlist)}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${getChecked(film.isViewed)}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${getChecked(film.isFavorite)}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsRender()}
          </ul>

          ${newCommentComponent.getTemplate()}

        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetails extends AbstractView {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._closeClickHandler = this._closeClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, this._comments);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    // 1. колбэк мы запишем во внутреннее свойство
    this._callback.closeClick = callback;
    // 2. В addEventListener передадим абстрактный обработчик
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }
}
