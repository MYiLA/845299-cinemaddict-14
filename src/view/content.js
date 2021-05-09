import AbstractView from './abstract.js';

const createContentTemplate = () => {
  return `
  <section class="films">
    <section class="films-list">
    </section>
  </section>`;
};

export default class Content extends AbstractView {
  getTemplate() {
    return createContentTemplate();
  }
}
