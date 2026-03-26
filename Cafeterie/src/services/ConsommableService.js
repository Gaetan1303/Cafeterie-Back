// ConsommableService.js
// Service pour la gestion des consommables

const consommableRepository = require('../repositories/ConsommableRepository');
const Observer = require('../utils/Observer');
const consommableObserver = new Observer();

class ConsommableService {
  constructor() {
    this.observer = consommableObserver;
  }
  subscribe(fn) {
    this.observer.subscribe(fn);
  }
  unsubscribe(fn) {
    this.observer.unsubscribe(fn);
  }
  async createConsommable(dto) {
    const item = await consommableRepository.createConsommable(dto);
    this.observer.notify('create', item);
    return item;
  }
}

const service = new ConsommableService();
module.exports = service;