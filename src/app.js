const express = require('express');
const cacheMiddleware = require('./middleware/cacheMiddleware');
const proxyHandler = require('./proxy/proxyHandler');

const app = express();

// Parse JSON (not strictly needed but good practice)
app.use(express.json());

// Intercept ALL requests
app.use('*', cacheMiddleware, proxyHandler);

module.exports = app;
