export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
    this._masterKey = null;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getItem(masterKey) {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey))[masterKey] || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(
      this._storeKey,
      JSON.stringify(items));
  }

  setItem(masterKey, value) {
    this._masterKey = masterKey;
    const store = this.getItems();

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(
        Object.assign({}, store, {
          [this._masterKey]: value,
        })));
  }

  removeItem(key) {
    const store = this.getItems();
    delete store[this._masterKey][key];

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(store));
  }
}
