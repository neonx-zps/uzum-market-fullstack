import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from shop.models import Category, Product

class Command(BaseCommand):
    help = "Uzum Market uchun 400 ta mahsulotni generatsiya qilish"

    def handle(self, *args, **options):
        # 1. Superuser
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@uzum.uz", "admin123")
            self.stdout.write(self.style.SUCCESS("Superuser: admin / admin123"))

        # 2. Toifalar ro'yxati
        cats_data = [
            ("smartphones", "Smartfonlar va gadjetlar", "📱"),
            ("appliances", "Maishiy texnika", "🧊"),
            ("clothing", "Kiyim-kechak", "👕"),
            ("footwear", "Poyabzallar", "👟"),
            ("beauty", "Go'zallik va parvarish", "✨"),
            ("home", "Uy-ro'zg'or buyumlari", "🛋️"),
            ("electronics", "Kompyuter va orgtexnika", "💻"),
            ("auto", "Avtotovarlar", "🚗"),
            ("sports", "Sport va hordiq", "⚽"),
            ("books", "Kitoblar va kanselyariya", "📚")
        ]

        cat_map = {}
        for slug, name, icon in cats_data:
            c_obj, _ = Category.objects.get_or_create(slug=slug, defaults={"name": name, "icon": icon})
            cat_map[slug] = c_obj

        # 3. 400 ta tovar shablonlari (Barchasi qo'shtirnoq ichida xatosiz)
        random.seed(42)

        dataset_blueprints = [
            {
                "cat": "smartphones",
                "titles": [
                    "Apple iPhone 15 Pro Max", "Apple iPhone 14 Pro", "Apple iPhone 13 128GB",
                    "Samsung Galaxy S24 Ultra", "Samsung Galaxy A55 5G", "Samsung Galaxy Z Flip5",
                    "Xiaomi 14 Pro Leica", "Redmi Note 13 Pro+ 5G", "POCO X6 Pro 12/512GB",
                    "Honor Magic 6 Pro", "Honor 90 5G Dual SIM", "Huawei P60 Pro Art Edition",
                    "Google Pixel 8 Pro", "OnePlus 12 16/512GB", "Apple Watch Series 9 45mm",
                    "Samsung Galaxy Watch 6 Classic", "AirPods Pro 2 MagSafe", "Sony WH-1000XM5 ANC",
                    "Marshall Major IV Wireless", "Anker PowerCore 20000mAh Tezkor zaryad"
                ],
                "specs": ["128GB", "256GB", "512GB", "1TB", "Titanium Gray", "Phantom Black", "Alpine White", "Midnight Blue"],
                "min_p": 450000, "max_p": 18500000,
                "images": [
                    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
                ],
                "badges": ["Katta chegirma", "Hafta xiti", "Kafolat 1 yil", "TOP gadjet"]
            },
            {
                "cat": "appliances",
                "titles": [
                    "Robot-changyutgich Xiaomi S10+", "Robot-changyutgich Roborock S8 Pro",
                    "DeLonghi Magnifica S Kofe mashinasi", "Philips 3000 bugli dazmol",
                    "Tefal OptiGrill XL elektr gril", "Artel Inverter 12 Sovutgich konditsioner",
                    "LG NoFrost Ikki kamerali muzlatgich", "Samsung EcoBubble 8kg Kir yuvish mashinasi",
                    "Bosch Serie 4 Idish yuvish mashinasi", "Dyson V15 Detect Simsiz changyutgich",
                    "Braun Multiquick 9 Blender to'plami", "Shivaki Mikroto'lqinli pech 23L Grill",
                    "Xiaomi Smart Air Fryer 6.5L Friturnitsa", "Haier Smart 4K UHD 55 dyuymli Televizor"
                ],
                "specs": ["Inverter Eco", "Smart Wi-Fi nazorati", "Oq / Kumushrang", "Premium xrom", "Sensorli boshqaruv"],
                "min_p": 320000, "max_p": 14200000,
                "images": [
                    "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&auto=format&fit=crop&q=80"
                ],
                "badges": ["Super narx", "Rasmiy kafolat", "Bepul yetkazish", "Tejamkor energiya"]
            },
            {
                "cat": "clothing",
                "titles": [
                    "Erkaklar klassik paxtali ko'ylak", "Oversize xudi qalin junli matodan",
                    "Ayollar bahorgi trenchi bej rangli", "Erkaklar sport kostyumi qalin trikotaj",
                    "Kuzgi-bahorgi bomber kurtka", "Ayollar midi uslubidagi yengil ko'ylagi",
                    "Klassik to'g'ri bichimli jinsi shim", "Erkaklar v-yoqali kashmir jemperi",
                    "Erkaklar bazaviy futbolkalari to'plami 3 dona", "Qalin qishki puffer kurtka"
                ],
                "specs": ["100% paxta", "S / M / L / XL / XXL", "Turkiya sifati", "Qora / Moviy / Bej", "Yuvishga chidamli"],
                "min_p": 99000, "max_p": 950000,
                "images": [
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80"
                ],
                "badges": ["Yangi to'plam", "Mavsum xiti", "100% Paxta", "Chegirma"]
            },
            {
                "cat": "footwear",
                "titles": [
                    "Nike Air Max Pulse krossovka", "Adidas Originals Forum Low krossovka",
                    "Puma RS-X Efekt sport poyabzali", "New Balance 530 yugurish krossovkasi",
                    "Klassik charm erkaklar oksford tufli", "Ayollar qulay kundalik loferlari",
                    "Asics Gel-Kahana 8 treyl krossovka", "Erkaklar qishki charmli botinkasi",
                    "Yengil yozgi krossovka nafas oluvchi to'rli", "Converse Chuck Taylor All Star keda"
                ],
                "specs": ["O'lcham: 39-45", "Ortopedik taglik", "Tabiiy charm", "Amortizatsiya tizimi"],
                "min_p": 240000, "max_p": 2450000,
                "images": [
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80"
                ],
                "badges": ["Original brend", "Top sifat", "Mavsum trendi"]
            },
            {
                "cat": "beauty",
                "titles": [
                    "The Ordinary Niacinamide 10% + Zinc 1%", "Cerave Foaming Yuz tozalovchi gel 473ml",
                    "Cosrx Snail Mucin 96% Tiklovchi essensiya", "L'Oreal Elseve Gialuron shampun",
                    "Dior Sauvage erkaklar parfyum suvi 100ml", "Tom Ford Lost Cherry selektiv atir",
                    "Maybelline Sky High uzaytiruvchi tush", "Laneige Lip Sleeping Mask tungi lab balzami",
                    "La Roche-Posay Effaclar Duo+ kremi", "Koreys matoli yuz niqoblari 10 talik to'plam"
                ],
                "specs": ["Original mahsulot", "Fransiya/Koreya", "Barcha teri turlari uchun", "Gipoallergen"],
                "min_p": 45000, "max_p": 2100000,
                "images": [
                    "https://images.unsplash.com/photo-1608248597359-00508c90b633?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
                ],
                "badges": ["100% Original", "Top parvarish", "Mashhur tanlov"]
            },
            {
                "cat": "home",
                "titles": [
                    "Anatomik Memory Foam xotirali yostiq", "IKEA uslubidagi zamonaviy pol yoritgichi",
                    "Oshxona uchun 6 qismli granit pichoqlar to'plami", "Bambukdan tayyorlangan sochiqlar 4 dona",
                    "Aromatik diffuzor efir moylari bilan", "Luminarc 18 ta qismli ovqat idishlari",
                    "Yumshoq mikrofibra ikki kishilik choyshab", "Avtomatik sensorli chiqindi qutisi 15L",
                    "Katta hajmli kiyim saqlash qutilari 3 dona", "Teflon qoplamali qovurish tovasi 28cm"
                ],
                "specs": ["Yuqori chidamlilik", "Ekologik toza material", "Oshxona va uy uchun", "Sovg'abop qadoqda"],
                "min_p": 65000, "max_p": 850000,
                "images": [
                    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&auto=format&fit=crop&q=80"
                ],
                "badges": ["Shinam uy", "Super sifat", "Oshxona xiti"]
            },
            {
                "cat": "electronics",
                "titles": [
                    "MacBook Air 13 M2 8/256GB Midnight", "Asus ROG Strix G16 O'yin noutbuki",
                    "Lenovo ThinkPad E14 noutbuki", "Logitech MX Master 3S Simsiz sichqoncha",
                    "Mexanik klaviatura RGB Redragon", "Dell 27 dyuymli 2K IPS 165Hz Monitor",
                    "Samsung 980 Pro 1TB NVMe M.2 SSD", "Tashqi qattiq disk WD Elements 2TB USB 3.0",
                    "Sony PlayStation 5 Slim 1TB", "Nintendo Switch OLED versiyasi oq"
                ],
                "specs": ["Rasmiy kafolat 1 yil", "Ultra tezkor tezlik", "Professional uskunalar"],
                "min_p": 190000, "max_p": 22500000,
                "images": [
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80"
                ],
                "badges": ["Geymerlar tanlovi", "Premium IT", "Katta chegirma"]
            },
            {
                "cat": "auto",
                "titles": [
                    "70mai Dash Cam A800S 4K Avtomobil videoregistratori", "Baseus avtomobil uchun kuchli changyutgich",
                    "Avtomobil telefon ushlagichi simsiz zaryadlovchi 15W", "EVA poliklar to'plami Chevrolet avtomobillari uchun",
                    "Avtomobil shinasini damlovchi portativ kompressor", "Mikrofibra yuvish sochiqlari to'plami 3 dona",
                    "Gidrofobik shisha qoplamasi va polirovkasi", "Avtomobil saloni uchun xushbo'y hid taratuvchi"
                ],
                "specs": ["Barcha mashinalarga mos", "Universal o'lcham", "Tezkor o'rnatish"],
                "min_p": 45000, "max_p": 1400000,
                "images": [
                    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80"
                ],
                "badges": ["Haydovchilar tanlovi", "Mustahkam", "Avto top"]
            },
            {
                "cat": "sports",
                "titles": [
                    "Universal gantellar to'plami yig'iladigan 20kg", "Yoga va fitnes gilamchasi sirpanmaydigan TPE",
                    "Termos zanglamas po'latdan 1 litr haroratni saqlovchi", "Sport zal va sayohat uchun sumka",
                    "Elektr skuter Xiaomi Electric Scooter 4 Pro", "Aqlli sakrash arqoni hisoblagich bilan",
                    "Fitnes rezinkalari to'plami 5 xil yuklama bilan"
                ],
                "specs": ["Professional sport sifati", "Yengil va mustahkam", "Salomatlik uchun"],
                "min_p": 35000, "max_p": 6500000,
                "images": [
                    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80"
                ],
                "badges": ["Fitnes va sport", "Faol hayot", "Top tanlov"]
            },
            {
                "cat": "books",
                "titles": [
                    "Atom odatlari - Jeyms Klir", "Boy ota, kambag'al ota - Robert Kiyosaki",
                    "Stiv Jobs rasmiy biografiyasi - Uolter Ayzekson", "Diqqat: Muvaffaqiyat sirlari",
                    "Alkimyogar - Paulo Koelo", "Psixologiya: Insonlar bilan muloqot san'ati",
                    "Moliyaviy erkinlik sari 7 qadam", "Kanselyariya nabori: Premium kundalik va qalam to'plami"
                ],
                "specs": ["O'zbek tilida", "Qattiq muqova", "Sifatli oq qog'oz", "Eng sara asarlar"],
                "min_p": 35000, "max_p": 250000,
                "images": [
                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
                ],
                "badges": ["Bestseller", "Foydali kitob", "Tavsiya etamiz"]
            }
        ]

        total_needed = 400
        existing_count = Product.objects.count()

        if existing_count >= total_needed:
            self.stdout.write(self.style.SUCCESS(f"Bazada allaqachon {existing_count} ta mahsulot mavjud!"))
            return

        self.stdout.write(f"Hozir bazada {existing_count} ta tovar bor. 400 tagacha to'ldirilmoqda...")

        products_to_create = []
        item_counter = existing_count + 1

        while len(products_to_create) + existing_count < total_needed:
            for bp in dataset_blueprints:
                if len(products_to_create) + existing_count >= total_needed:
                    break

                cat_obj = cat_map[bp["cat"]]
                base_title = random.choice(bp["titles"])
                spec = random.choice(bp["specs"])
                img = random.choice(bp["images"])
                badge = random.choice(bp["badges"]) if random.random() > 0.25 else None

                raw_price = random.randint(bp["min_p"] // 1000, bp["max_p"] // 1000) * 1000
                has_discount = random.random() > 0.35
                old_p = int(raw_price * random.uniform(1.15, 1.45)) if has_discount else None

                title = f"{base_title} ({spec}) #{item_counter}"
                desc = (
                    f"Uzum Market kafolati bilan original mahsulot. {base_title}. "
                    f"Xususiyatlari: {spec}. O'zbekiston bo'ylab 1 kunda tezkor va bepul yetkazib berish. "
                    f"Uzum Nasiya orqali qulay to'lov rejasi mavjud."
                )

                prod = Product(
                    category=cat_obj,
                    title=title,
                    description=desc,
                    price=raw_price,
                    old_price=old_p,
                    rating=round(random.uniform(4.3, 5.0), 1),
                    reviews_count=random.randint(12, 1480),
                    image_url=img,
                    badge=badge,
                    in_stock=random.randint(5, 120)
                )
                products_to_create.append(prod)
                item_counter += 1

        Product.objects.bulk_create(products_to_create)
        final_count = Product.objects.count()
        self.stdout.write(self.style.SUCCESS(f"Muvaffaqiyatli yakunlandi! Bazadagi tovarlar soni: {final_count} ta!"))
