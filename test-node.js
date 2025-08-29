// Simple test file to verify Node.js execution
console.log('Node.js test script is running!');
console.log('Current directory:', process.cwd());
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);

// Try to load environment variables
try {
  require('dotenv').config();
  console.log('Environment variables loaded successfully');
} catch (error) {
  console.error('Error loading environment variables:', error);
}

// Try to import a core module
try {
  const fs = require('fs');
  console.log('File system module loaded successfully');
} catch (error) {
  console.error('Error loading file system module:', error);
}

// Try to import a project module
try {
  const path = require('path');
  const serverPath = path.join(__dirname, 'server', 'server.js');
  console.log('Server path:', serverPath);
  
  // Check if server file exists
  if (fs.existsSync(serverPath)) {
    console.log('Server file exists');
    
    // Try to read the first few lines of the server file
    const serverContent = fs.readFileSync(serverPath, 'utf8').split('\n').slice(0, 10).join('\n');
    console.log('First 10 lines of server.js:');
    console.log(serverContent);
  } else {
    console.error('Server file does not exist at:', serverPath);
  }
} catch (error) {
  console.error('Error checking server file:', error);
}
