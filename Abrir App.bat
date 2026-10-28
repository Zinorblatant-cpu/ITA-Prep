@echo off
title ITA 2028 - Painel de Estudos
cd /d "%~dp0"

if not exist "node_modules" (
  echo Primeira vez rodando - instalando dependencias, aguarde um pouco...
  call npm install
)

echo Iniciando servidores (backend + frontend)...
start "ITA 2028 - Servidor (nao feche esta janela)" cmd /k npm run dev

echo Aguardando os servidores subirem...
timeout /t 6 /nobreak >nul

start http://localhost:5173

exit
