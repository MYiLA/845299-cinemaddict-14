export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const scrollFix = (element) => {
  element.scrollTop = element.scrollHeight;
};

export const translateMinutesToHours = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const minutesRemaining = minutes - hours * 60;

  return {
    h: hours,
    m: minutesRemaining,
  };
};

export const removeItemOnce = (arr, value) => {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};
