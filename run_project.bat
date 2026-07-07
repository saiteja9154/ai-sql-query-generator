@echo off
echo ====================================================================
echo   AI SQL Query Generator - Full-Stack Resume Project Launcher
echo ====================================================================
echo.

echo [1/4] Setting up Python FastAPI Backend...
cd backend
python -m pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to install Python packages. Please make sure Python 3.8+ is installed and in your PATH variables.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/4] Initializing Database & Seeding Mock Data...
python db_initializer.py
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to seed SQLite tables.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/4] Launching FastAPI Server (Port 8000)...
start "SQL Generator Backend" cmd /c "python main.py"
cd ..

echo.
echo [4/4] Setting up React Frontend (Root-Level)...
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to install Node modules. Please make sure Node.js is installed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Launching React Frontend Server (Port 3000)...
start "SQL Generator Frontend" cmd /c "npm run dev"

echo.
echo ====================================================================
echo   Success! Servers are starting in the background:
echo   - Database Playground: http://localhost:3000
echo   - API Swagger Auto-Docs: http://127.0.0.1:8000/docs
echo ====================================================================
echo.
pause
