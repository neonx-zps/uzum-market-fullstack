# Uzum Market Fullstack Clone (Imtihon Loyihasi)

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Django 4+, Django REST Framework (DRF), django-cors-headers
- **Autentifikatsiya:** Token Authentication, Ro'yxatdan o'tish (parol tasdiqlash bilan), Login, Profil
- **Ma'lumotlar bazasi:** SQLite (Barcha tovarlar va kategoriyalar bilan)

---

## Tezkor ishga tushirish (1 ta bosishda):

### Windows foydalanuvchilari uchun:
Faqatgina **`RUN_ALL.bat`** faylini 2 marta bosing!
U avtomatik:
1. Virtual muhit yaratadi va kutubxonalarni o'rnatadi.
2. Bazani (`db.sqlite3`) tayyorlab, namunaviy mahsulotlarni yuklaydi.
3. Django serverni `http://127.0.0.1:8000` portida ochadi.
4. React frontendni `http://localhost:5173` da ochib beradi.

### Python orqali ishga tushirish (Barcha operatsion tizimlar):
```bash
python run_all.py
```

---

## Qo'lda (alohida) ishga tushirish:

### 1. Backend:
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```
- API manzili: `http://127.0.0.1:8000/api/`
- Admin panel: `http://127.0.0.1:8000/admin/`
  - **Login:** `admin`
  - **Parol:** `admin123`

### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```
- Sayt: `http://localhost:5173`
