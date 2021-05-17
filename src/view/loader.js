import AbstractView from './abstract.js';

const createLoaderTemplate = () => {
  return `
    <h2 class="films-list__title">Loading...</h2>
  `;
};

export default class Loader extends AbstractView {
  getTemplate() {
    return createLoaderTemplate();
  }
}
