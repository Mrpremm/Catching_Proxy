const express = require('express');
const cacheMiddleware = require('./middleware/cacheMiddleware');
const proxyHandler = require('./proxy/proxyHandler');

const app = express();

app.use(express.json());

// ✅ CORRECT WAY (no "*")
app.use(cacheMiddleware);
app.use(proxyHandler);

module.exports = app;
