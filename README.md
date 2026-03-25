# ArabaAra - Araba Satış Platform

## 📱 Frontend + Backend Uygulaması

### 🎯 Özellikler

✅ **Kullanıcı Yönetimi**
- Kayıt (Register)
- Giriş (Login) / Çıkış (Logout)
- JWT Token tabanlı kimlik doğrulama

✅ **Araç İlanları**
- Tüm ilanları görüntüleme
- Yeni ilanlar ekleme (sadece giriş yapanlar)
- İlan detaylarını görüntüleme
- İlan güncelleme ve silme

✅ **UI/UX**
- Responsif tasarım
- Modal formlar
- Kategoriye göre filtreleme
- Arama özelliği
- Bildirim sistemi

---

## 🚀 Frontend Kurulumu

Frontend basit HTML/CSS/JavaScript'tir. Herhangi bir yükleme gerekmez.

### Dosya Yapısı
```
frontend.html      - Ana sayfa
frontend.css       - Stiller
frontend.js        - JavaScript logic & API entegrasyonu
görseller/         - Resim klasörü
```

### Çalıştırma
1. Basit bir HTTP server'ında açın (Python, Live Server, vs.)
2. `frontend.html` dosyasını açın
3. Backend'in çalıştığından emin olun

---

## 🛠 Backend Kurulumu (.NET 5)

### Adım 1: Backend Klasörüne Gidin
```bash
cd backend
```

### Adım 2: Veritabanı Oluşturun
```bash
dotnet ef database update
```

Bu komut LocalDB'de `CarListingDB` adında bir veritabanı oluşturacaktır.

### Adım 3: API'yi Çalıştırın
```bash
dotnet run
```

API varsayılan olarak `http://localhost:5000` adresinde açılacaktır.

### Adım 4: Swagger UI'ı Açın (İsteğe Bağlı)
API test etmek için:
```
http://localhost:5000/swagger
```

---

## 📋 Veri Tabanı

### SQL Server LocalDB
- **Server**: `(localdb)\mssqllocaldb`
- **Database**: `CarListingDB`
- **Connection**: `appsettings.json` dosyasında tanımlı

### Tablolar
- `Users` - Kullanıcılar
- `CarListings` - Araç ilanları

---

## 🔐 Kimlik Doğrulama (JWT)

### Token Yapısı
- **Secret**: 32+ karakter (appsettings.json'da)
- **Expiry**: 24 saat
- **Issuer**: CarListingAPI
- **Audience**: CarListingAPIUsers

### Frontend'de Token Kullanımı
LocalStorage'da otomatik saklanır:
```javascript
localStorage.getItem('token')      // JWT Token
localStorage.getItem('user')       // User JSON
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş

### Araçlar (Cars)
- `GET /api/cars` - Tüm ilanlar
- `GET /api/cars/{id}` - Tek ilan
- `POST /api/cars` - Yeni ilan (Auth gerekli)
- `PUT /api/cars/{id}` - İlan güncelle (Auth gerekli)
- `DELETE /api/cars/{id}` - İlan sil (Auth gerekli)
- `GET /api/cars/user/{userId}` - Kullanıcının ilanları

---

## 🧪 Test Etme

### 1. Hesap Oluşturun
- Frontend'de "Kayıt Ol" butonuna tıklayın
- Form doldurun ve gönder

### 2. Giriş Yapın
- "Giriş Yap" butonuna tıklayın
- Email ve şifre girin

###  3. İlan Ekleyin
- Sağ üst köşede "+ İlan Ekle" butonuna tıklayın
- Form doldurup göndermeyin
- İlan galeriye eklenecektir

### 4. İlan Detaylarını Görün
- Herhangi bir araç kartına tıklayın
- Detay modalı açılacaktır

---

## 📚 Öğrenme Kaynakları

### Frontend
- HTML/CSS/JavaScript vanilla
- Fetch API ile HTTP çağrıları
- Local Storage yönetimi
- Modal ve form yönetimi

### Backend
- ASP.NET Core 5
- Entity Framework Core
- JWT Authentication
- SQL Server
- RESTful API Design

---

## ⚙️ Konfigürasyon

### appsettings.json (Backend)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CarListingDB;Trusted_Connection=true;"
  },
  "Jwt": {
    "Secret": "..."
  ,
    "Issuer": "CarListingAPI",
    "Audience": "CarListingAPIUsers",
    "ExpiryMinutes": 1440
  }
}
```

### frontend.js (Frontend)
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## 🔧 Sorun Giderme

### API bağlantısı başarısız
- Backend'in çalıştığından emin olun: `http://localhost:5000`
- Firewall ayarlarını kontrol edin
- CORS ayarlarını doğrulayın

### Veritabanı hatası
```bash
dotnet ef database drop
dotnet ef database update
```

### Token hatası
- Browser konsolunu açın (F12)
- localStorage'da token olup olmadığını kontrol edin
- Token'ın süresi dolmadığını kontrol edin

---

## 📦 Proje Yapısı

```
proje11-2-1/
├── frontend.html
├── frontend.css
├── frontend.js
├── görseller/
├── backend/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   ├── DTOs/
│   ├── Controllers/
│   ├── Startup.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── CarListingAPI.csproj
└── README.md
```

---

## 🎓 Geliştirme Aşamaları

### ✅ Tamamlanan
- Frontend UI tasarımı
- Modern responsive layout
- Login/Register sistemi
- JWT authentication
- Araç ilanları CRUD
- Database integration

### 🔄 Gelecek Geliştirmeler
- Profil yönetimi
- İlan fotoğraf yükleme
- Yorum sistemi
- Favoriler
- İstatistikler
- Admin paneli
- Email doğrulama
- Şifre sıfırlama

---

## 📞 Destek

Herhangi bir sorunuz varsa:
1. Browser console'unu kontrol edin (F12 → Console)
2. Network tab'ında API çağrılarını izleyin
3. Backend log'larına bakın

---

**Son Güncelleme**: Mart 22, 2026
**Versiyon**: 1.0
