export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const findIdMap = (items, update) => items.findIndex((item) => {
  return (item.keys().next().value.id === update.keys().next().value.id);
});

const findIdObj = (items, update) => items.findIndex((item) => item.id === update.id);

export const updateItem = (items, update) => {
  let index = -1;
  // обновить список мапов
  if (update.constructor === Map) {
    index = findIdMap(items, update);
  }
  // обновить список объектов
  if (update.constructor === Object) {
    index = findIdObj(items, update);
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

export const deleteItem = (items, update) => {
  let index = undefined;
  // удалить мапу из списка
  if (update.constructor === Map) {
    index = findIdMap(items, update);
  }

  // удалить объект из списка
  if (update.constructor === Object) {
    index = findIdObj(items, update);
  }

  if (index === -1) {
    throw new Error('Can\'t delete unexisting item');
  }

  return [
    ...items.slice(0, index),
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
