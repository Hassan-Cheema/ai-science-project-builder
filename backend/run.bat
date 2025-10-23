@echo off
echo Starting AI Science Builder Backend...
echo.

cd /d "%~dp0"
call venv\Scripts\activate.bat
uvicorn main:app --reload

pause

