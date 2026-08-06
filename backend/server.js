const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://hum-saath-eta.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);
const vercelPreviewOrigin = /^https:\/\/hum-saath-[a-z0-9-]+\.vercel\.app$/i;

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || vercelPreviewOrigin.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// A friendly response for the backend URL itself. The frontend is hosted
// separately, so the root is an API landing response rather than a web page.
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HumSaath API is running',
    health: '/api/health',
    events: '/api/events'
  });
});

app.use('/api/events', require('./routes/events'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'HumSaath API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

const basePort = Number(process.env.PORT || 5000);

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`HumSaath API: http://localhost:${port}/api`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && port < basePort + 5) {
      console.warn(`Port ${port} is busy, trying ${port + 1}...`);
      server.close();
      startServer(port + 1);
      return;
    }

    console.error(error);
    process.exit(1);
  });
};

// Vercel imports this Express app from api/[...path].js. Keep the listener
// only for local development and other long-running Node hosts.
if (require.main === module) {
  startServer(basePort);
}

module.exports = app;
