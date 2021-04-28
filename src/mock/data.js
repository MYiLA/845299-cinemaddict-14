import dayjs from 'dayjs'; // библиотека дат и времени
import { getRandomInteger } from '../utils/common.js';
import { nanoid } from 'nanoid';

const MAX_COMMENTS_COUNT = 5;
const MIN_COMMENTS_COUNT = 0;
const MAX_WRITERS_COUNT = 5;
const MIN_WRITERS_COUNT = 1;
const MAX_LENGTH_DESC = 5;
const MIN_LENGTH_DESC = 1;
const MAX_RATING = 10;
const MIN_RATING = 3;
const MAX_RUNTIME = 240;
const MIN_RUNTIME = 30;
const MAX_GENRES_COUNT = 4;
const MIN_GENRES_COUNT = 1;
const MAX_ACTORS_COUNT = 10;
const MIN_ACTORS_COUNT = 1;
const DATE_FIRST_RELEASE = dayjs('1895-03-22').valueOf(); // допустим в этом году появился первый фильм
const DATE_FIRST_COMENT = dayjs('2015-01-01').valueOf(); // допустим в этом году зарелизился сайт и был написан первый коммент

const posters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const titles = [
  'Made for Each Other',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Sagebrush Trail',
  'Santa Claus Conquers the Martians',
  'The Dance of Life',
  'The Great Flamarion',
  'The Man with the Golden Arm',
];

const directors = [
  'John Cromwell',
  'Dave Fleischer',
  'Willard Bowsky',
  'Armand Schaefer',
  'Nicholas Webster',
  'A. Edward Sutherland',
  'Anthony Mann',
  'Otto Preminger',
];

const ageRatings = [0, 6, 12, 16, 18];

const countries = [
  'Albania',
  'Armenia',
  'Canada',
  'Ghana',
  'Laos',
  'Russia',
  'USA',
  'Thailand',
];

const writers = [
  'Jo Swerling',
  'Rose Franken',
  'Lindsley Parsons',
  'Glenville Mareth',
  'Paul L. Jacobson',
  'Benjamin Glazer',
  'Arthur Hopkins',
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Walter Newman',
  'Lewis Meltzer',
];

const actors = [
  'Carole Lombard', 'James Stewart', 'Charles Coburn',
  'Jack Mercer', 'Mae Questel', 'Lou Fleischer',
  'John Wayne', 'Nancy Shubert', 'Lane Chandler',
  'John Call', 'Leonard Hicks', 'Vincent Beck',
  'Hal Skelly', 'Nancy Carroll', 'Dorothy Revier',
  'Erich von Stroheim', 'Mary Beth Hughes', 'Dan Duryea',
  'Frank Sinatra', 'Kim Novak', 'Eleanor Parker',
];

const genres = [
  'Comedy', 'Drama', 'Romance',
  'Animation', 'Short', 'Adventure',
  'Western', 'Action', 'Comedy', 'Family',
  'Musical', 'Film-Noir', 'Mystery', 'Crime',
];

const descPhrases = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

export const getRandomItem = (list) => {
  const randomIndex = getRandomInteger(0, list.length - 1);
  return list[randomIndex];
};

export const getRandomArr = (arr, maxLength, minLength = 0) => {
  return new Array(getRandomInteger(minLength, maxLength)).fill().map(() => getRandomItem(arr));
};

export const getUniqueArr = (arr) => Array.from(new Set(arr));

const getRating = () => {
  const rating = MIN_RATING + Math.random() * (MAX_RATING - MIN_RATING);
  return rating.toFixed(1);
};

const getReleaseDate = () => {
  const isDate = Boolean(getRandomInteger(0, 3));

  if (!isDate) {
    return null;
  }

  return getRandomInteger(DATE_FIRST_RELEASE);
};

const generateFilm = () => {
  return {
    id: nanoid(),
    poster: getRandomItem(posters),
    title: getRandomItem(titles),
    titleOriginal: getRandomItem(titles),
    rating: getRating(),
    director: getRandomItem(directors),
    writers: getUniqueArr(getRandomArr(writers, MAX_WRITERS_COUNT, MIN_WRITERS_COUNT)), // от 1 до 5 уникальных значений
    actors: getUniqueArr(getRandomArr(actors, MAX_ACTORS_COUNT, MIN_ACTORS_COUNT)), // от 1 до 10 уникальных значений
    releaseDate: getReleaseDate(),
    runtime: getRandomInteger(MIN_RUNTIME, MAX_RUNTIME), // от 30 минут до 4 часов
    country: getRandomItem(countries),
    genres: getUniqueArr(getRandomArr(genres, MAX_GENRES_COUNT, MIN_GENRES_COUNT)), // 1-4 уникальных рандом значений
    desc: getRandomArr(descPhrases, MAX_LENGTH_DESC, MIN_LENGTH_DESC).join(' '), // от 1 до 5 случайных предложений из descriptions
    ageRating: getRandomItem(ageRatings), // один из списка 0+ 6+ 12+ 16+ 18+
    isViewed: Boolean(getRandomInteger(0, 1)), // помечает фильм как просмотренный/не просмотренный фильтр history
    isFavorite: Boolean(getRandomInteger(0, 1)), // добавляет/убирает из избранного
    isWatchlist: Boolean(getRandomInteger(0, 1)), // добавляет/убирает из списка воспроизведения
  };
};

const commentTexts = [
  'The movies poster was listed as #14 of "The 25 Best Movie Posters Ever" by Premiere.',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
  'The story is told from the viewpoint of its era, yet the basic elements are timeless enough that the story still holds up very well',
  'The supporting cast have simpler roles, but they do their jobs satisfactorily',
];

const emoticons = ['angry', 'puke', 'sleeping', 'smile'];

const commentAuthors = [
  'John Doe',
  'Tim Macoveev',
  'MYiLA',
  'Crazy Credits',
  'Alfred Goro',
  'Procrastinator',
];

export const getRandomCommentAuthor = () => {
  return getRandomItem(commentAuthors);
};

const generateComment = () => {
  return {
    text: getRandomItem(commentTexts), // формируется случайно на сервере, с клиента не передается
    emoji: getRandomItem(emoticons), // список из 4 или без нее [smile, sleeping, puke, angry]
    author: getRandomCommentAuthor(),
    date: getRandomInteger(DATE_FIRST_COMENT),
  };
};

export const getCommentDate = () => {
  return dayjs().valueOf();
};

export const generateFilmData = () => {
  return new Map()
    .set(generateFilm(), new Array(getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT))
      .fill().map(() => generateComment()));
};
