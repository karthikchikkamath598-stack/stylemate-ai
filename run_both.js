const { spawn } = require('child_process');
const path = require('path');

console.log('========================================================');
console.log('       STYLEMATE AI — Unified Server Launcher');
console.log('========================================================\n');

// 1. Launch FastAPI Backend
const pythonExe = path.join(__dirname, 'venv', 'Scripts', 'python.exe');
const backendDir = path.join(__dirname, 'backend');

console.log('✦ [Backend] Launching FastAPI + ChromaDB on http://127.0.0.1:8000...');
const backend = spawn(pythonExe, ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000', '--reload'], {
  cwd: backendDir,
  shell: true,
  stdio: 'inherit'
});

backend.on('error', (err) => {
  console.error('✦ [Backend Error]:', err);
});

// 2. Launch Vite Frontend
const frontendDir = path.join(__dirname, 'frontend');
console.log('✦ [Frontend] Launching Vite on http://127.0.0.1:5173...\n');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const frontend = spawn(npmCmd, ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'inherit'
});

frontend.on('error', (err) => {
  console.error('✦ [Frontend Error]:', err);
});

process.on('SIGINT', () => {
  console.log('\nGracefully shutting down StyleMate AI servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});
