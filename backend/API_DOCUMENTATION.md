# Car Listing API - Backend Documentation

## 📋 Genel Bilgi

Bu ASP.NET Core 5.0 API, araç satış ilanları platformunun backend'ini sağlar. Kullanıcı hesap yönetimi, giriş/çıkış ve araç ilanlarına tam erişim denetimi sunar.

## 🚀 Başlangıç

### Gereksinimler
- .NET 5 SDK
- SQL Server veya LocalDB
- Visual Studio Code veya Visual Studio

### Kurulum ve Çalıştırma

1. **Proje dizinine gidin:**
```bash
cd backend
```

2. **Veritabanı migration'ları çalıştırın:**
```bash
dotnet ef database update
```

3. **API'yi başlatın:**
```bash
dotnet run
```

API varsayılan olarak `http://localhost:5000` adresinde çalışacaktır.

## 🔐 Kimlik Doğrulama (Authentication)

Tüm istekler JWT (JSON Web Token) kullanarak kimlik doğrulaması yapar.

### 1. Hesap Oluşturma (Register)
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123",
  "fullName": "John Doe"
}
```

**Response:** (200 OK)
```json
{
  "id": 1,
  "username": "username",
  "email": "user@example.com",
  "fullName": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Giriş Yapma (Login)
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:** (200 OK)
```json
{
  "id": 1,
  "username": "username",
  "email": "user@example.com",
  "fullName": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🚗 Araç İlanları API

### Header'a Token Eklemek
Tüm protected endpoint'ler için:
```
Authorization: Bearer {token}
```

### 1. Tüm İlanları Alma (Herkese Açık)
**GET** `/api/cars`

**Response:** (200 OK)
```json
[
  {
    "id": 1,
    "userId": 1,
    "make": "Mercedes-Benz",
    "model": "C-Class",
    "year": 2023,
    "type": "sedan",
    "price": 4500000,
    "kilometers": 15000,
    "fuelType": "Dizel",
    "transmission": "Otomatik",
    "power": 200,
    "location": "İstanbul",
    "description": "Çok temiz, bakımlı araç",
    "imageUrl": "https://...",
    "createdAt": "2026-03-22T10:30:00"
  }
]
```

### 2. Tek İlanı Alma (Herkese Açık)
**GET** `/api/cars/{id}`

**Response:** (200 OK)
```json
{
  "id": 1,
  "userId": 1,
  "make": "Mercedes-Benz",
  "model": "C-Class",
  ...
}
```

### 3. Yeni İlan Oluşturma (Kimlik Doğrulaması Gerekli)
**POST** `/api/cars`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "make": "Mercedes-Benz",
  "model": "GLA",
  "year": 2023,
  "type": "suv",
  "price": 4280000,
  "kilometers": 42500,
  "fuelType": "Dizel",
  "transmission": "Otomatik",
  "power": 163,
  "location": "Ankara",
  "description": "Geniş iç hacim, güçlü performans",
  "imageUrl": "https://..."
}
```

**Response:** (201 Created)
```json
{
  "id": 2,
  "userId": 1,
  "make": "Mercedes-Benz",
  ...
}
```

### 4. İlan Güncelleme (Kimlik Doğrulaması Gerekli)
**PUT** `/api/cars/{id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** (Güncellemek istediğiniz alanlar)
```json
{
  "price": 4200000,
  "kilometers": 50000,
  "description": "Az kullanılmış, garajda saklanmıştır"
}
```

**Response:** (204 No Content)

### 5. İlan Silme (Kimlik Doğrulaması Gerekli)
**DELETE** `/api/cars/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** (204 No Content)

### 6. Kullanıcının İlanlarını Alma (Herkese Açık)
**GET** `/api/cars/user/{userId}`

**Response:** (200 OK)
```json
[
  {
    "id": 1,
    "userId": 1,
    "make": "Mercedes-Benz",
    ...
  }
]
```

## 📝 Veri Modelleri

### User (Kullanıcı)
- `id` (int): Kullanıcı ID'si
- `email` (string): E-posta (Unique)
- `username` (string): Kullanıcı adı (Unique)
- `passwordHash` (string): Şifreli parola
- `fullName` (string): Tam ad
- `createdAt` (DateTime): Oluşturma tarihi
- `updatedAt` (DateTime?): Güncellenme tarihi
- `isActive` (bool): Hesap durumu

### CarListing (Araç İlanı)
- `id` (int): İlan ID'si
- `userId` (int): Sahibin kullanıcı ID'si
- `make` (string): Marka
- `model` (string): Model
- `year` (int): Yıl
- `type` (string): Araç tipi (sedan, suv, sport, hatchback, van)
- `price` (decimal): Fiyat
- `kilometers` (int): Kilometre
- `fuelType` (string): Yakıt tipi (Benzin, Dizel, Hibrit, Elektrik)
- `transmission` (string): Şanzıman (Otomatik, Manuel)
- `power` (int): Motor gücü (BG)
- `location` (string): Şehir
- `description` (string): Açıklama
- `imageUrl` (string): Resim URL'i
- `createdAt` (DateTime): Oluşturma tarihi
- `updatedAt` (DateTime?): Güncellenme tarihi
- `isActive` (bool): İlan durumu

## 🔧 Ayarlar (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CarListingDB;Trusted_Connection=true;"
  },
  "Jwt": {
    "Secret": "ThisIsAVeryLongSecretKeyThatIsAtLeast32CharactersLongForJwtSigningPurposes",
    "Issuer": "CarListingAPI",
    "Audience": "CarListingAPIUsers",
    "ExpiryMinutes": 1440
  }
}
```

## 🌐 CORS Ayarları

API tüm originlerden gelen istekleri kabul eder (geliştirme amaçlı). Production'da güncelleyin.

## 📚 Swagger/OpenAPI

API dokümantasyonu Swagger UI'da mevcuttur:
- URL: `http://localhost:5000/swagger`
- Burada tüm endpoint'leri test edebilirsiniz

## ❌ Hata Kodları

- `200 OK`: Başarılı istek
- `201 Created`: Kaynak başarıyla oluşturuldu
- `204 No Content`: Başarılı, içerik yok
- `400 Bad Request`: Geçersiz istek
- `401 Unauthorized`: Kimlik doğrulama gerekli
- `403 Forbidden`: Yetkiniz yok (başkasının ilanını düzenleyemezsiniz)
- `404 Not Found`: Kaynak bulunamadı
- `500 Internal Server Error`: Sunucu hatası

## 🔐 Güvenlik Özellikleri

- ✅ BCrypt şifre hashleme
- ✅ JWT token tabanlı kimlik doğrulama
- ✅ CORS başlıkları
- ✅ Veritabanı ilişkileri ve cascade delete
- ✅ Kullanıcı sahipliği doğrulaması (soft delete)

## 📦 Kullanılan Paketler

- Microsoft.EntityFrameworkCore.SqlServer (5.0.0)
- System.IdentityModel.Tokens.Jwt (6.8.0)
- Microsoft.IdentityModel.Tokens (6.8.0)
- Microsoft.AspNetCore.Authentication.JwtBearer (5.0.0)
- BCrypt.Net-Core (1.6.0)
- Microsoft.EntityFrameworkCore.Tools (5.0.0)

## 📞 İletişim

Backend API bileşeni tarafından desteklenmektedir.
