@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo ============================
echo   ФОРМАТИРОВАНИЕ ФЛЕШКИ
echo ============================
echo.

echo Доступные диски:
wmic logicaldisk get name, volumename, description
echo.

set /p drive=Введите букву флешки (пример E): 
set drive=%drive%:

echo.
echo ВНИМАНИЕ! ВСЕ ДАННЫЕ НА %drive% БУДУТ УДАЛЕНЫ!
set /p confirm=Введите YES чтобы продолжить: 
if /I not "%confirm%"=="YES" exit

echo.
echo Форматирование...
format %drive% /FS:FAT32 /Q /Y

echo.
echo Генерация UUID...

:: ===== UUID =====
set uuid=
for %%i in (1 2 3) do set uuid=!uuid!!random:~-1!
set uuid=!uuid!!random:~-1!

call :randLetter
set uuid=!uuid!!letter!

set uuid=!uuid!-

for %%i in (1 2) do set uuid=!uuid!!random:~-1!
call :randLetter
set uuid=!uuid!!letter!
call :randLetter
set uuid=!uuid!!letter!

set uuid=!uuid!-

for %%i in (1 2) do set uuid=!uuid!!random:~-1!
call :randLetter
set uuid=!uuid!!letter!
for %%i in (1 2) do set uuid=!uuid!!random:~-1!

set uuid=!uuid!-

for %%i in (1 2) do set uuid=!uuid!!random:~-1!
call :randLetter
set uuid=!uuid!!letter!
call :randLetter
set uuid=!uuid!!letter!
for %%i in (1 2) do set uuid=!uuid!!random:~-1!

echo !uuid! > %drive%\UUID.sknd

echo UUID: !uuid!

:: ===== IP =====
echo Генерация IP...

set ip=
for %%i in (1 2 3) do set ip=!ip!!random:~-1!
set ip=!ip!.
for %%i in (1 2 3) do set ip=!ip!!random:~-1!
set ip=!ip!.
for %%i in (1 2) do set ip=!ip!!random:~-1!
set ip=!ip!.
for %%i in (1 2) do set ip=!ip!!random:~-1!
set ip=!ip!.
set ip=!ip!!random:~-1!

echo !ip! > %drive%\IP.sknd
echo T-1 > %drive%\model.sknd
echo > %drive%\code.scndcr

echo IP: !ip!

echo.
echo ГОТОВО!
pause
exit

:: ===== ФУНКЦИЯ СЛУЧАЙНОЙ БУКВЫ =====
:randLetter
set letters=abcdefghijklmnopqrstuvwxyz
set /a idx=%random% %% 26
set letter=!letters:~%idx%,1!
exit /b