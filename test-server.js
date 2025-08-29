import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '***MongoDB URI is set***' : 'MongoDB URI is not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***JWT Secret is set***' : 'JWT Secret is not set');

// Try to import and start the server
try {
  console.log('\nAttempting to import server...');
  const serverPath = path.resolve(__dirname, 'server', 'server.js');
  console.log('Server path:', serverPath);
  
  // Dynamic import
  const { default: startServer } = await import(serverPath);
  console.log('Server imported successfully');
  
  // If the server exports a function, call it
  if (typeof startServer === 'function') {
    console.log('Starting server...');
    await startServer();
  } else {
    console.log('Server is already started by the module');
  }
} catch (error) {
  console.error('Error starting server:', error);
  process.exit(1);
}
