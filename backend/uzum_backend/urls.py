from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home_view(request):
    html_content = '''
    <!DOCTYPE html>
    <html lang="uz">
    <head>
        <meta charset="UTF-8">
        <title>Uzum Market - Backend API Server</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F4F5F8; margin: 0; padding: 40px 20px; display: flex; justify-content: center; }
            .card { background: white; max-width: 650px; width: 100%; border-radius: 20px; padding: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
            .badge { background: #EFE8FF; color: #7000FF; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 12px; display: inline-block; margin-bottom: 15px; }
            h1 { margin: 0 0 10px 0; color: #1F2026; font-size: 26px; }
            p { color: #666; line-height: 1.6; font-size: 15px; }
            .btn { display: inline-block; background: #7000FF; color: white; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; margin-right: 10px; margin-top: 15px; transition: 0.2s; }
            .btn:hover { background: #5e00d6; }
            .btn-outline { background: #F4F5F8; color: #1F2026; }
            .btn-outline:hover { background: #E5E7EB; }
            .endpoints { background: #FAF9FD; border: 1px solid #EBE4FF; border-radius: 12px; padding: 15px 20px; margin-top: 25px; }
            .endpoints ul { margin: 10px 0 0 0; padding-left: 20px; color: #444; font-family: monospace; font-size: 14px; }
            .endpoints li { margin-bottom: 6px; }
        </style>
    </head>
    <body>
        <div class="card">
            <span class="badge">DJANGO REST FRAMEWORK (DRF) BACKEND</span>
            <h1>Uzum Market API serveri faol! 🚀</h1>
            <p>Siz Django backend serverining asosiy manzilidasiz. Asosiy e-commerce foydalanuvchi interfeysini (React) ko'rish uchun quyidagi tugmani bosing:</p>
            
            <a href="http://localhost:5173" target="_blank" class="btn">🛒 React Do'konni Ochish (Port 5173)</a>
            <a href="/admin/" target="_blank" class="btn btn-outline">⚙️ Django Admin Panel</a>

            <div class="endpoints">
                <strong style="color:#7000FF;">Mavjud API Endpointlar:</strong>
                <ul>
                    <li><a href="/api/products/" target="_blank">GET /api/products/</a> — Mahsulotlar ro'yxati</li>
                    <li><a href="/api/categories/" target="_blank">GET /api/categories/</a> — Toifalar</li>
                    <li><a href="/api/orders/" target="_blank">POST /api/orders/</a> — Buyurtmalar</li>
                    <li>POST /api/auth/register/ — Ro'yxatdan o'tish</li>
                    <li>POST /api/auth/login/ — Tizimga kirish</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    '''
    return HttpResponse(html_content)

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('shop.urls')),
]
