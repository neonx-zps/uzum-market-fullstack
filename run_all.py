import subprocess
import sys
import os
import time

def run():
    print("=" * 60)
    print("  UZUM MARKET FULLSTACK (DJANGO + REACT) ISHGA TUSHIRISH")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, 'backend')
    frontend_dir = os.path.join(base_dir, 'frontend')

    # 1. Django Setup
    print("\n[1/3] Backend sozlanmoqda...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], cwd=backend_dir)
    subprocess.run([sys.executable, "manage.py", "migrate"], cwd=backend_dir)
    subprocess.run([sys.executable, "manage.py", "seed_data"], cwd=backend_dir)

    # 2. Django Serverni orqa fonda ishga tushirish
    print("\n[2/3] Django serveri http://127.0.0.1:8000 da ishga tushmoqda...")
    backend_proc = subprocess.Popen([sys.executable, "manage.py", "runserver", "8000"], cwd=backend_dir)

    # 3. Frontend Setup & Run
    print("\n[3/3] Frontend npm paketlari o'rnatilmoqda va ishga tushmoqda...")
    npm_cmd = "npm.cmd" if os.name == 'nt' else "npm"
    subprocess.run([npm_cmd, "install"], cwd=frontend_dir)

    print("\n" + "=" * 60)
    print("Sayt ochilmoqda: http://localhost:5173")
    print("Backend API: http://127.0.0.1:8000/api/")
    print("Admin: login: admin | parol: admin123")
    print("To'xtatish uchun: Ctrl + C bosing")
    print("=" * 60 + "\n")

    try:
        subprocess.run([npm_cmd, "run", "dev"], cwd=frontend_dir)
    except KeyboardInterrupt:
        print("\nLoyihalar to'xtatilmoqda...")
        backend_proc.terminate()

if __name__ == '__main__':
    run()
