export const createSortTemplate = (data) => {

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
