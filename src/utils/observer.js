export default class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((existedObserver) => existedObserver !== observer);
  }

  _notify(event, payload) {
    // console.log('список обсерверов'); // список при нажатии и удалении вызывается 2-3 раза подряд. как будто попап открывается и закрывается
    // console.log(this._observers);

    this._observers.forEach((observer) => observer(event, payload));
  }
}
