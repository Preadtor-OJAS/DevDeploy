"use strict";

var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _applications = _interopRequireDefault(require("./routes/applications.routes"));
const { clerkMiddleware } = require('@clerk/express');
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
_dotenv.default.config();
const app = (0, _express.default)();
const PORT = process.env.PORT || 5000;
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use(clerkMiddleware());

// Routes
app.use('/api/applications', _applications.default);
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Express Error:', err.message);
  res.status(err.statusCode || 401).json({ error: err.message || 'Unauthenticated' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});