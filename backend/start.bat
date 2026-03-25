@echo off
cd /d "%~dp0"
echo Araba Backend Baslatiliyor...
dotnet run --urls "http://localhost:5000"
pause
