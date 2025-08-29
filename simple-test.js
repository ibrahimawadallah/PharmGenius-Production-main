console.log('Simple test script is running!');
console.log('Current directory:', process.cwd());
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? '***MongoDB URI is set***' : 'MongoDB URI is not set',
  JWT_SECRET: process.env.JWT_SECRET ? '***JWT Secret is set***' : 'JWT Secret is not set'
});
