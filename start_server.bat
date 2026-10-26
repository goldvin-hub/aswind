@echo off
title ASWIN Portfolio - Local Server
cd /d "%~dp0"
echo ========================================================
echo  Starting Local Server for ASWIN Portfolio...
echo ========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
