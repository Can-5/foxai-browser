@echo off
title FoxAI Browser - Update
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0FoxAI-Launcher.ps1" -Update
echo.
pause
