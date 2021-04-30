import Observer from '../utils/observer.js';
import { updateItem, deleteItem } from '../utils/common.js';

export default class AbstractDataList extends Observer {
  constructor() {
    super();
    this._data = [];
  }

  setData(data) {
    this._data = data.slice();
  }

  getData() {
    return this._data;
  }

  updateData(updateType, update) {
    this._data = updateItem(this._data, update);
    this._notify(updateType, update);
  }

  deleteData(updateType, update) {
    this._data = deleteItem(this._data, update);
    this._notify(updateType);
  }

  addData(updateType, update) {
    this._data = [
      update,
      ...this._data,
    ];

    this._notify(updateType, update);
  }
}
