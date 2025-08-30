import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('dist'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// In production (e.g., on Render), the main backend entrypoint is server/server.js.
// Avoid binding a second server from this file to prevent EADDRINUSE.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Dev static server on port ${PORT}`);
  });
} else {
  console.log('Root server.js detected in production; not starting a server. Use server/server.js.');
}