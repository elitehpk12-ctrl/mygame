import express from 'express';
import cors from 'cors';

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5175;
const MAX_PORT = DEFAULT_PORT + 5;

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Forbidden Archipelago backend',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/command', (req, res) => {
  const { action, payload } = req.body;
  res.json({
    received: true,
    action: action ?? null,
    payload: payload ?? null,
  });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && port < MAX_PORT) {
      console.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    console.error('Backend failed to start:', error.message);
    process.exit(1);
  });
}

startServer(DEFAULT_PORT);
