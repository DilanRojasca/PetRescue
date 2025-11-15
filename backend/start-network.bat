@echo off
echo Iniciando backend accesible desde la red local...
echo.
echo IMPORTANTE: Asegurate de que tu firewall permita conexiones en el puerto 8000
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause

