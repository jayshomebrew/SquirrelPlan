@echo off
setlocal

where py >nul 2>nul
if %errorlevel%==0 (
    py -3 -m http.server 8000
) else (
    python -m http.server 8000
)

if errorlevel 1 (
    echo Failed to start the HTTP server.
    pause
)
