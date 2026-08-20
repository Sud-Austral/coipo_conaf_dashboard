@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo COIPO SIDCO Dashboard - Poblar capas cartograficas locales
echo ============================================================
echo.
where python >nul 2>nul
if errorlevel 1 (
  echo ERROR: Python no esta disponible en PATH.
  echo Ejecuta este BAT desde un equipo con Python instalado.
  pause
  exit /b 1
)

python -c "import requests" >nul 2>nul
if errorlevel 1 (
  echo Instalando dependencia requests...
  python -m pip install requests
)

echo.
echo Descargando y particionando capas oficiales...
python scripts\descargar_capas_chile.py

echo.
echo ============================================================
echo Proceso terminado.
echo Revisa: frontend\public\data\capas\manifest.json
echo ============================================================
pause
