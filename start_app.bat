@echo off
echo Starting Customer Insight Dashboard...

:: Start Backend
start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

:: Start Frontend
start cmd /k "cd frontend && npm run dev"

echo Servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
pause
