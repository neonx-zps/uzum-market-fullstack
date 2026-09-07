@echo off
title Uzum Market Fullstack Ishga Tushirish
color 0b
echo =====================================================================
echo       UZUM MARKET CLONE - IMTIHON UCHUN ISHGA TUSHIRISH
echo =====================================================================
echo.

echo [1/4] Backend kutubxonalari o'rnatilmoqda...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

echo.
echo [2/4] Baza migratsiyalari va 400 ta tovar yuklanmoqda...
python manage.py makemigrations shop
python manage.py migrate
python manage.py seed_data

echo.
echo [3/4] Django REST Framework serveri ishga tushirilmoqda (Port 8000)...
start "Django DRF Backend" cmd /k "venv\Scripts\activate && python manage.py runserver 8000"

echo.
echo [4/4] Frontend kutubxonalari o'rnatilmoqda va ishga tushirilmoqda...
cd ..\frontend
call npm install
start "React Frontend" cmd /k "npm run dev"

echo.
echo Brauzerda Uzum Market sayti ochilmoqda...
timeout /t 4 >nul
start http://localhost:5173

echo =====================================================================
echo BARCHASI TAYYOR!
echo Frontend Sayt: http://localhost:5173
echo Backend API: http://127.0.0.1:8000/
echo Admin panel: http://127.0.0.1:8000/admin/ (login: admin, parol: admin123)
echo =====================================================================
pause
