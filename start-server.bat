@echo off
echo Starting local web server...
echo.
echo Server will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
python3 -m http.server 8001
pause
