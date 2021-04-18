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
