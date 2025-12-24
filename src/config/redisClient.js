const { createClient } = require('redis');

let redisClient;
let isRedisAvailable = true;

/**
 * Self-invoking async function
 * Redis connection automatically start ho jayega
 */
(async () => {
  try {
    // Redis client create
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      },
      password: process.env.REDIS_PASSWORD || undefined
    });

    // Redis error handling
    redisClient.on('error', (err) => {
      console.error('❌ Redis Error:', err.message);
      isRedisAvailable = false;
    });

    // Redis connected successfully
    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
      isRedisAvailable = true;
    });

    // Actual connection start
    await redisClient.connect();

  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    isRedisAvailable = false;
  }
})();

module.exports = {
  redisClient,
  isRedisAvailable: () => isRedisAvailable
};
