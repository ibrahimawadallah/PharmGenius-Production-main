import app from '../server/server.js';

// Bridge all /api/* requests to the Express app
export default function handler(req, res) {
  return app(req, res);
}
