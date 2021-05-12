const scrollFix = (element) => {
  element.scrollTop = element.scrollHeight;
};

const translateMinutesToHours = (minutesCount) => {
  const hours = Math.floor(minutesCount / 60);
  const minutes = minutesCount - hours * 60;

  return {
    hours,
    minutes,
  };
};

const removeItemOnce = (arr, value) => {
  const index = arr.indexOf(value);

  if (index > -1) {
    arr.splice(index, 1);
  }

  return arr;
};

export {
  scrollFix,
  translateMinutesToHours,
  removeItemOnce
};
