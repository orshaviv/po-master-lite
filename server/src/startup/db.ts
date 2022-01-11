import storage from 'node-persist';

const poDb = storage.create({ dir: 'poDb' });
poDb.init();

export { poDb };
