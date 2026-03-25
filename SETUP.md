# 🚗 ArabaAra Projesi - Hızlı Başlama Rehberi

## 📦 Proje Yapısı

```
proje11-2-1/
├── frontend.html              ← Ana sayfa (tarayıcıda aç)
├── frontend.css               ← Stiller
├── frontend.js                ← JavaScript & API entegrasyonu
├── test-api.html              ← API test sayfası
├── README.md                  ← Detaylı dokümantasyon
├── SETUP.md                   ← Bu dosya
├── görseller/                 ← Resimler
├── backend/                   ← ASP.NET Core API
│   ├── run.bat                ← Windows: Backend başlat
│   └── ...
└── USB-KURULUMu.md            ← USB'den çalıştırma
```

---

## ⚡ 1 Dakikada Başla

### Adım 1: Backend'i Başlat (CMD veya PowerShell)
```bash
cd backend
dotnet run
```
Beklenen sonuç: `Now listening on: http://localhost:5000`

### Adım 2: Frontend'i Aç
- `frontend.html` dosyasını çift tıkla
- veya tarayıcıya sürükle
- veya Live Server ile aç

### Adım 3: Test Et
1. "Kayıt Ol" butonuna tıkla
2. Form doldurup kayıt oluş
3. Giriş yap
4. İlan ekle

---

## 🧪 Sorunları Giderme

### Backend başlamıyor: "dotnet: The term 'dotnet' is not recognized"
→ .NET 5 SDK kurulu mu? Kontrol et: `echo %PATH%`

### Frontend'de hata görmek için:
1. Tarayıcıda **F12** tuşuna bas
2. **Console** tab'ını aç
3. Formları dene ve hataları gör

### API'ye bağlanılamıyor:
1. Backend'in çalıştığını kontrol et (http://localhost:5000)
2. Firewall ayarlarını kontrol et
3. test-api.html dosyasını aç ve test et

---

## 📊 Veritabanı

### LocalDB Kurulumu (İlk Kez)
```bash
cd backend
dotnet ef database update
```

### Veritabanı Sıfırlama
```bash
cd backend
dotnet ef database drop
dotnet ef database update
```

---

## 🔐 Test Hesapları

Kullanıc kayıt edemeşzeniz, veritabanını test verisiyle doldurmak için:

```sql
-- SQL Server Management Studio'da çalıştırın
INSERT INTO Users (Email, Username, PasswordHash, FullName, CreatedAt, IsActive)
VALUES ('test@example.com', 
        'testuser', 
        '$2a$11$...', 
        'Test User',
        GETUTCDATE(), 
        1);
```

---

## 🚀 Deployment (Opsiyonel)

### Frontend (Statik)
- Herhangi bir web serverına kopyala
- veya Firebase Hosting, Netlify, Vercel kullan

### Backend (ASP.NET Core)
```bash
dotnet publish -c Release -o ./publish
```

---

## 📞 Hızlı Referans

| Problem | Çözüm |
|---------|-------|
| "Giriş yapamıyorum" | F12 Console'u aç, hataları gör |
| "Veritabanı hası" | `dotnet ef database drop` + `update` |
| "Port 5000 kullanımda" | Başka port: `dotnet run --urls "http://localhost:5001"` |
| "Frontend API'yi bulamıyor" | Backend çalışıyor mu kontrol et |

---

## 📁 Firefox/Edge/Chrome'da Açma

### Seçenek 1: Dosyayı Sürükle
`frontend.html` → Tarayıcı penceresi

### Seçenek 2: Live Server (Visual Studio Code)
1. VS Code'da `frontend.html` aç
2. Sağ tıkla → "Open with Live Server"

### Seçenek 3: Python Server
```bash
# frontend.html'in olduğu klasöre git
python -m http.server 8000
# Sonra: http://localhost:8000
```

---

**Hazır mısın? Başla!** 🚀
