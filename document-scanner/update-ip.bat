@echo off
echo 🔍 Zjišťuji aktuální IP adresu...

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP: =%
echo 📍 Nalezena IP: %IP%

echo 📝 Aktualizuji ApiService.js...
powershell -Command "(Get-Content mobile-app\src\services\ApiService.js) -replace \"const BASE_URL = 'http://[0-9.]*:3000'\", \"const BASE_URL = 'http://%IP%:3000'\" | Set-Content mobile-app\src\services\ApiService.js"

echo ✅ IP adresa aktualizována na: %IP%
echo 📱 Nyní můžete spustit mobilní aplikaci
pause
