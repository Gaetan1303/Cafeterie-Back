// Utilitaire de cache Redis pour Node.js
const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const client = redis.createClient({ url: REDIS_URL });

client.on('error', (err) => {
  console.error('Erreur Redis:', err);
});

async function connectRedis() {
  if (!client.isOpen) await client.connect();
}

// Récupérer une valeur du cache
async function getCache(key) {
  await connectRedis();
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

// Définir une valeur dans le cache (avec expiration en secondes)
async function setCache(key, value, ttl = 60) {
  await connectRedis();
  await client.set(key, JSON.stringify(value), { EX: ttl });
}

module.exports = { getCache, setCache };
