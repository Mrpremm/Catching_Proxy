const axios = require('axios');
const { redisClient, isRedisAvailable } = require('../config/redisClient');

module.exports = async (req, res) => {
  try {
    const backendURL = `${process.env.BACKEND_BASE_URL}${req.originalUrl}`;

    const response = await axios({
      method: req.method,
      url: backendURL,
      headers: {
        ...req.headers,
        host: undefined // Avoid host header conflicts
      },
      data: req.body,
      timeout: 5000
    });

    // Cache only GET responses
    if (
      req.method === 'GET' &&
      req.cacheKey &&
      isRedisAvailable()
    ) {
      await redisClient.setEx(
        req.cacheKey,
        req.cacheTTL,
        JSON.stringify(response.data)
      );
    }

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);

    if (error.response) {
      // Backend responded with error
      return res
        .status(error.response.status)
        .json(error.response.data);
    }

    // Backend unreachable
    res.status(502).json({
      message: 'Bad Gateway: Backend service unavailable'
    });
  }
};
