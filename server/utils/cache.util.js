const cache = new Map();
const TTL = 10 * 60 * 1000; 

exports.getCache = (key) => {
  const data = cache.get(key);
  if (!data) return null;
  if (Date.now() - data.timestamp > TTL) {
    cache.delete(key);
    return null;
  }
  return data.value;
};

exports.setCache = (key, value) => {
  cache.set(key, { value, timestamp: Date.now() });
};
