export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const updateItem = (items, update) => {
  let index = NaN;
  if (update.constructor === Map) {
    index = items.findIndex((item) => {
      return (item.keys().next().value.id === update.keys().next().value.id);
    });
  }

  if (!update.constructor === Map) {
    index = items.findIndex((item) => item.id === update.id);
  }

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const scrollFix = (element) => {
  element.scrollTop = element.scrollHeight;
};

export const translateMinutesToHours = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const minutesRemaining = minutes - hours * 60;

  return `${hours}h ${minutesRemaining}m`;
};
