@echo off
echo ===================================
echo Fullstack Developer Roadmap 2025
echo ===================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Starting Fullstack Roadmap Server...
echo.
echo When the server starts, your default browser will open automatically.
echo Press Ctrl+C to stop the server when you're finished.
echo.

:: Open browser and start server
start http://localhost:8000/simplified-roadmap.html
npx http-server -p 8000

:: This line will only execute if the server exits
echo.
echo Server stopped. Thank you for using the Fullstack Developer Roadmap!
pause 