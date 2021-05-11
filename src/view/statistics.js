import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import { StatisticFilterType } from '../const.js';
import { getFilmPropertyCount } from '../utils/film.js';
import { dataFilmsViewedInDateRange } from '../utils/statistics.js';
import { translateMinutesToHours } from '../utils/common.js';

const HEIGHT_FOR_SCROLL = '1200px';

const renderGenreChart = (genreCtx, numbersOfEachGenre, thisElement) => {
  return new Chart(genreCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: Object.keys(numbersOfEachGenre),
      datasets: [{
        data: Object.values(numbersOfEachGenre),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    dataset: {
      barThickness: 24,
    },
    options: {
      animation: {
        onComplete: function() {
          setTimeout(() => {
            thisElement.style.minHeight = '';
          }, 0);
        },
      },
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (data, filters) => {
  const { films, dateFrom } = data;
  const { isViewedCount, runtimeCount, topGenre } = dataFilmsViewedInDateRange(films, dateFrom);
  const { h, m } = translateMinutesToHours(runtimeCount);

  const titleRender = () => {
    const viewedCount = getFilmPropertyCount(data.films, 'isViewed');

    if (viewedCount === 0) {
      return '';
    }

    if ((viewedCount >= 1) && (viewedCount <= 10)) {
      return '<span class="statistic__rank-label">Novice</span>';
    }

    if ((viewedCount >= 11) && (viewedCount <= 20)) {
      return '<span class="statistic__rank-label">Fan</span>';
    }

    if (viewedCount >= 21) {
      return '<span class="statistic__rank-label">Movie buff</span>';
    }
  };

  const filtersRender = () => {
    const filtersTemplate = filters
      .map((filter) => {
        return `
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter.type}" value="${filter.type}" ${filter.isActive ? 'checked' : ''}>
          <label for="statistic-${filter.type}" class="statistic__filters-label">${filter.name}</label>
        `;
      })
      .join('');
    return filtersTemplate;
  };

  return `
  <section class="statistic hide">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      ${titleRender()}
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${filtersRender()}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${isViewedCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${h} <span class="statistic__item-description">h</span> ${m} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>
  `;
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();

    this._state = {
      films,
      dateFrom: dayjs(0).toDate(),
    };

    this._genreChart = null;
    this._filters = [
      {
        type: StatisticFilterType.ALL_TIME,
        name: 'All time',
        isActive: true,
      },
      {
        type: StatisticFilterType.TODAY,
        name: 'Today',
        isActive: false,
      },
      {
        type: StatisticFilterType.WEEK,
        name: 'Week',
        isActive: false,
      },
      {
        type: StatisticFilterType.MONTH,
        name: 'Month',
        isActive: false,
      },
      {
        type: StatisticFilterType.YEAR,
        name: 'Year',
        isActive: false,
      },
    ];

    this._scroll = this.getElement().scrollHeight;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._setCharts();
    this._setDatefilter();
  }

  getTemplate() {
    return createStatisticsTemplate(this._state, this._filters);
  }

  restoreHandlers() {
    this._setCharts();
    this._setDatefilter();
  }

  updateElement() {
    super.updateElement();
    this.show();
    this.getElement().style.minHeight = HEIGHT_FOR_SCROLL;
    document.documentElement.scrollTop = this._scroll;
  }

  _setCharts() {
    if (this._genreChart !== null) {
      this._genreChart = null;
    }

    const genreCtx = this.getElement().querySelector('.statistic__chart');

    const { films, dateFrom } = this._state;
    const { numbersOfEachGenre } = dataFilmsViewedInDateRange(films, dateFrom );

    this._genreChart = renderGenreChart(genreCtx, numbersOfEachGenre, this.getElement());
  }

  _filterChangeHandler(evt) {

    if (evt.target.tagName !== 'LABEL') return;

    this._scroll = document.documentElement.scrollTop;

    const filter = evt.target.getAttribute('for').split('statistic-')[1];

    this._filters.forEach((filterState) => {
      if (filterState.type === filter) {
        if (filterState.isActive) return;
        filterState.isActive = true;
        return;
      }
      filterState.isActive = false;
    });

    switch (filter) {
      case StatisticFilterType.ALL_TIME:
        this.updateState({
          dateFrom: dayjs(0).toDate(),
        });
        break;
      case StatisticFilterType.MONTH:
        this.updateState({
          dateFrom: dayjs().subtract(1, 'month').toDate(),
        });
        break;
      case StatisticFilterType.TODAY:
        this.updateState({
          dateFrom: dayjs().subtract(1, 'day').toDate(),
        });
        break;
      case StatisticFilterType.WEEK:
        this.updateState({
          dateFrom: dayjs().subtract(1, 'week').toDate(),
        });
        break;
      case StatisticFilterType.YEAR:
        this.updateState({
          dateFrom: dayjs().subtract(1, 'year').toDate(),
        });
        break;
    }
  }

  _setDatefilter() {
    this.getElement().querySelector('.statistic__filters').addEventListener('click', this._filterChangeHandler);
  }
}
