import AbstractView from './abstract.js';

const createSortTemplate = () => {

  // const dataDefault = () => {
  //   return data;
  // };

  // const dataDate = () => {
  //   return data.sort();
  // };

  // const dataRating = () => {
  //   return data.sort();
  // };

  return `
  <ul class="sort">
    <li><a href="#" class="sort__button">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button sort__button--active">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends AbstractView {
  getTemplate() {
    return createSortTemplate();
  }
}
