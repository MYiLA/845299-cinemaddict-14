export const createShowMoreTemplate = (isShowMoreBtn) => {
  if (isShowMoreBtn) {
    return `
      <button class="films-list__show-more">Show more</button>
    `;
  }
  return '';
};
