@echo off
rem FoxAI Tor Mode - Tor agi uzerinden baslatir (127.0.0.1:9050 gerekli)
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0FoxAI-Launcher.ps1" -Tor -Launch
