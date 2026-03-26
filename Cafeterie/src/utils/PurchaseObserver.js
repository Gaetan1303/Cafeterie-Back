// PurchaseObserver.js
// Observer générique pour les achats
class PurchaseObserver {
  constructor() {
    this.subscribers = [];
  }
  subscribe(fn) {
    this.subscribers.push(fn);
  }
  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter(sub => sub !== fn);
  }
  notify(event, data) {
    for (const fn of this.subscribers) {
      try { fn(event, data); } catch (e) { /* log ou ignorer */ }
    }
  }
}

module.exports = PurchaseObserver;
