@echo off
echo ========================================================
echo        STYLEMATE AI - Full Stack Launcher
echo ========================================================
echo.
echo [1/3] Starting RAG Backend (FastAPI + ChromaDB) on port 8000...
start "StyleMate AI - Backend" cmd /k ".\venv\Scripts\activate && cd backend && uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend (Vite + React) on port 5173...
start "StyleMate AI - Frontend" cmd /k "cd frontend && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo Opening browser to http://127.0.0.1:5173/ ...
start http://127.0.0.1:5173/
echo.
echo Both servers are running! Close the separate terminal windows to stop.
echo ========================================================
pause
