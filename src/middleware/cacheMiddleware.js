const { redisClient, isRedisAvailable } = require('../config/redisClient');

const DEFAULT_TTL = Number(process.env.CACHE_TTL) || 300;

module.exports = async (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  // If Redis is down, skip cache
  if (!isRedisAvailable()) {
    return next();
  }

  // Create unique cache key
  const cacheKey = `${req.method}:${req.originalUrl}`;

  try {
    const cachedData = await redisClient.get(cacheKey);

    // Cache HIT
    if (cachedData) {
      console.log('⚡ Cache HIT:', cacheKey);
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Cache MISS
    console.log('❌ Cache MISS:', cacheKey);
    req.cacheKey = cacheKey;
    req.cacheTTL = DEFAULT_TTL;

    next();
  } catch (error) {
    console.error('Cache Middleware Error:', error.message);
    next(); // Fallback to backend
  }
};
