const API_URL = 'http://192.168.1.9:5000/api';

// ── TEMA: Sayfa yüklenmeden önce uygula (beyaz flash önlenir) ──
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
}

// ── GLOBAL STATE ──
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {

    // ── ELEMENT TANIMLARI ──
    const loginModal       = document.getElementById('loginModal');
    const registerModal    = document.getElementById('registerModal');
    const loginForm        = document.getElementById('loginForm');
    const registerForm     = document.getElementById('registerForm');
    const themeToggle      = document.getElementById('themeToggle');
    const gallery          = document.getElementById('gallery');
    const search           = document.getElementById('search');
    const filters          = document.querySelectorAll('.filter');
    const model            = document.getElementById('model');
    const modelImg         = document.getElementById('modelImg');
    const modelTitle       = document.getElementById('modelTitle');
    const modelMeta        = document.getElementById('modelMeta');
    const modelDesc        = document.getElementById('modelDesc');
    const modelPrice       = document.getElementById('modelPrice');
    const addListingModal  = document.getElementById('addListingModal');
    const addListingForm   = document.getElementById('addListingForm');
    const imageInput       = document.getElementById('carImage');
    const imagePreview     = document.getElementById('imagePreview');
    const previewImg       = document.getElementById('previewImg');
    const dashboardModal   = document.getElementById('dashboardModal');

    let selectedImageData = null;

    // ═══════════════════════════════════════════════
    // TEMA
    // ═══════════════════════════════════════════════

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            document.documentElement.classList.remove('dark-mode');
            if (themeToggle) themeToggle.textContent = '🌙';
        }
    }

    function toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (themeToggle) themeToggle.textContent = isDark ? '☀️' : '🌙';
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    initTheme();

    // ═══════════════════════════════════════════════
    // YARDIMCI FONKSİYONLAR
    // ═══════════════════════════════════════════════

    // BUG DÜZELTİLDİ: Bu fonksiyonlar eksikti → crash
    function generateEmailFromName(fullName) {
        return fullName.toLowerCase()
            .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
            .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
            .replace(/\s+/g, '.') + '@arabaara.com';
    }

    function generateUsernameFromName(fullName) {
        return fullName.toLowerCase()
            .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
            .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
            .replace(/\s+/g, '_');
    }

    // BUG DÜZELTİLDİ: lookupEmailByName eksikti → login crash
    function lookupEmailByName(fullName) {
        const map = getLocalUsers();
        return map[fullName.toLowerCase()]?.email || null;
    }

    // LocalStorage kullanıcı yönetimi
    function getLocalUsers() {
        try {
            return JSON.parse(localStorage.getItem('arabaara_users') || '[]');
        } catch { return []; }
    }

    function saveLocalUsers(users) {
        localStorage.setItem('arabaara_users', JSON.stringify(users));
    }

    function findLocalUser(fullName, password) {
        const users = getLocalUsers();
        return users.find(u =>
            u.fullName.toLowerCase() === fullName.toLowerCase() && u.password === password
        ) || null;
    }

    function registerLocalUser(fullName, password) {
        const users = getLocalUsers();
        // Aynı isim var mı kontrol et
        const exists = users.find(u => u.fullName.toLowerCase() === fullName.toLowerCase());
        if (exists) return null; // zaten kayıtlı
        const username  = generateUsernameFromName(fullName) + '_' + Date.now();
        const email     = generateEmailFromName(fullName) + '.' + Date.now();
        const isAdmin   = fullName.trim().toLowerCase() === 'admin';
        const newUser   = {
            id: Date.now(),
            fullName,
            username,
            email,
            password,
            isAdmin,
            role: isAdmin ? 'admin' : 'user',
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        saveLocalUsers(users);
        return newUser;
    }

    // LocalStorage ilan yönetimi
    function getLocalListings() {
        try {
            return JSON.parse(localStorage.getItem('arabaara_listings') || '[]');
        } catch { return []; }
    }

    function saveLocalListings(listings) {
        localStorage.setItem('arabaara_listings', JSON.stringify(listings));
    }

    function addLocalListing(listing) {
        const listings = getLocalListings();
        listing.id = Date.now();
        listing.createdAt = new Date().toISOString();
        listings.unshift(listing);
        saveLocalListings(listings);
        return listing;
    }

    function deleteLocalListing(id) {
        const listings = getLocalListings();
        saveLocalListings(listings.filter(l => l.id !== id));
    }

    // ═══════════════════════════════════════════════
    // MESAJ GÖSTER
    // ═══════════════════════════════════════════════

    function showMessage(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            padding: 16px 24px;
            background: ${type === 'error' ? '#d73a49' : type === 'success' ? '#28a745' : '#0052cc'};
            color: white; border-radius: 8px; z-index: 9999;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            font-weight: 500; font-size: 14px; max-width: 320px;
            animation: slideIn 0.3s ease;
        `;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 4000);
    }

    // ═══════════════════════════════════════════════
    // KULLANICI YÖNETİMİ & UI
    // ═══════════════════════════════════════════════

    function loadUser() {
        const userData = localStorage.getItem('user');
        const token    = localStorage.getItem('token');
        if (userData && token) {
            currentUser = JSON.parse(userData);
            updateUIForLoggedIn();
        } else {
            currentUser = null;
            updateUIForLoggedOut();
        }
    }

    function saveUser(user, token) {
        currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        updateUIForLoggedIn();
    }

    function isAdmin() {
        return currentUser && (
            currentUser.isAdmin === true ||
            currentUser.role === 'admin' ||
            currentUser.fullName?.toLowerCase() === 'admin'
        );
    }

    function updateUIForLoggedIn() {
        const userMenu    = document.getElementById('userMenu');
        const authButtons = document.getElementById('authButtons');
        if (userMenu)    userMenu.style.display    = 'flex';
        if (authButtons) authButtons.style.display = 'none';

        const displayNameEl = document.getElementById('userDisplayName');
        if (displayNameEl && currentUser) {
            displayNameEl.textContent = currentUser.fullName || currentUser.username;
        }

        // Dashboard butonu sadece admin için
        const dashBtn = document.getElementById('openDashboardBtn');
        if (dashBtn) dashBtn.style.display = isAdmin() ? 'inline-flex' : 'none';
    }

    // BUG DÜZELTİLDİ: Önceden logout olunca İlan Ekle butonu gizlenmiyordu
    function updateUIForLoggedOut() {
        const authButtons = document.getElementById('authButtons');
        const userMenu    = document.getElementById('userMenu');
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu)    userMenu.style.display    = 'none';
    }

    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    // ═══════════════════════════════════════════════
    // MODAL AÇMA / KAPAMA
    // ═══════════════════════════════════════════════

    const openLoginBtn     = document.getElementById('openLoginModal');
    const openRegisterBtn  = document.getElementById('openRegisterModal');
    const closeLoginBtn    = document.getElementById('closeLoginModal');
    const closeRegisterBtn = document.getElementById('closeRegisterModal');
    const switchToRegBtn   = document.getElementById('switchToRegister');
    const switchToLogBtn   = document.getElementById('switchToLogin');

    if (openLoginBtn) openLoginBtn.onclick = () => {
        loginModal?.classList.add('open');
        registerModal?.classList.remove('open');
    };
    if (openRegisterBtn) openRegisterBtn.onclick = () => {
        registerModal?.classList.add('open');
        loginModal?.classList.remove('open');
    };
    if (closeLoginBtn)    closeLoginBtn.onclick    = () => loginModal?.classList.remove('open');
    if (closeRegisterBtn) closeRegisterBtn.onclick = () => registerModal?.classList.remove('open');
    if (switchToRegBtn) switchToRegBtn.onclick = (e) => {
        e.preventDefault();
        loginModal?.classList.remove('open');
        registerModal?.classList.add('open');
    };
    if (switchToLogBtn) switchToLogBtn.onclick = (e) => {
        e.preventDefault();
        registerModal?.classList.remove('open');
        loginModal?.classList.add('open');
    };

    loginModal?.addEventListener('click',    e => { if (e.target === loginModal)    loginModal.classList.remove('open'); });
    registerModal?.addEventListener('click', e => { if (e.target === registerModal) registerModal.classList.remove('open'); });

    // ═══════════════════════════════════════════════
    // KAYIT OL
    // ═══════════════════════════════════════════════

    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = registerForm.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.textContent = 'Kaydediliyor...'; }

            try {
                const fullName = document.getElementById('registerFullName').value.trim();
                const password = document.getElementById('registerPassword').value;

                if (!fullName) throw new Error('❌ Lütfen adınızı soyadınızı girin');
                if (password.length < 6) throw new Error('❌ Şifre en az 6 karakter olmalı');

                // Önce backend dene
                let registered = false;
                try {
                    const timestamp = Date.now();
                    const email    = generateEmailFromName(fullName) + '.' + timestamp;
                    const username = generateUsernameFromName(fullName) + '_' + timestamp;

                    const response = await fetch(`${API_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, username, password, fullName })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const user = {
                            id: data.id, username: data.username,
                            email: data.email || email,
                            fullName: data.fullName || fullName,
                            isAdmin: data.isAdmin || false,
                            role: data.role || 'user'
                        };
                        // LocalStorage'a da kaydet (login için isim→email eşlemesi)
                        registerLocalUser(fullName, password);
                        saveUser(user, data.token);
                        showMessage(`✓ Hoşgeldiniz, ${fullName}!`, 'success');
                        registerModal?.classList.remove('open');
                        registerForm.reset();
                        registered = true;
                    }
                } catch (_) { /* Backend kapalı, offline moda geç */ }

                if (!registered) {
                    // LocalStorage fallback
                    const existing = getLocalUsers().find(u =>
                        u.fullName.toLowerCase() === fullName.toLowerCase()
                    );
                    if (existing) throw new Error('❌ Bu isimle zaten kayıtlı bir hesap var');

                    const newUser = registerLocalUser(fullName, password);
                    const fakeToken = 'local_' + Date.now();
                    saveUser(newUser, fakeToken);
                    showMessage(`✓ Hoşgeldiniz, ${fullName}! (Çevrimdışı mod)`, 'success');
                    registerModal?.classList.remove('open');
                    registerForm.reset();
                }

                updateStats();

            } catch (error) {
                showMessage(error.message || '❌ Kayıt sırasında hata oluştu', 'error');
            } finally {
                if (btn) { btn.disabled = false; btn.textContent = 'Kayıt Ol'; }
            }
        };
    }

    // ═══════════════════════════════════════════════
    // GİRİŞ YAP
    // ═══════════════════════════════════════════════

    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.textContent = 'Giriş yapılıyor...'; }

            try {
                // BUG DÜZELTİLDİ: loginFullName → artık doğru ID
                const fullName = document.getElementById('loginFullName').value.trim();
                const password = document.getElementById('loginPassword').value;

                if (!fullName) throw new Error('❌ Lütfen adınızı soyadınızı girin');
                if (!password) throw new Error('❌ Lütfen şifrenizi girin');

                // Önce backend dene
                let loggedIn = false;
                try {
                    // Backend e-posta bekliyor, LocalStorage'dan bak
                    const storedUser = getLocalUsers().find(u =>
                        u.fullName.toLowerCase() === fullName.toLowerCase()
                    );
                    const email = storedUser?.email || generateEmailFromName(fullName);

                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const user = {
                            id: data.id, username: data.username,
                            email: data.email, fullName: data.fullName || fullName,
                            isAdmin: data.isAdmin || false,
                            role: data.role || 'user'
                        };
                        saveUser(user, data.token);
                        showMessage(`✓ Hoşgeldiniz, ${data.fullName || fullName}!`, 'success');
                        loginModal?.classList.remove('open');
                        loginForm.reset();
                        loggedIn = true;
                    }
                } catch (_) { /* Backend kapalı */ }

                if (!loggedIn) {
                    // LocalStorage fallback
                    const localUser = findLocalUser(fullName, password);
                    if (!localUser) throw new Error('❌ Ad Soyad veya şifre yanlış');

                    const fakeToken = 'local_' + Date.now();
                    saveUser(localUser, fakeToken);
                    showMessage(`✓ Hoşgeldiniz, ${fullName}! (Çevrimdışı mod)`, 'success');
                    loginModal?.classList.remove('open');
                    loginForm.reset();
                }

            } catch (error) {
                showMessage(error.message || '❌ Giriş sırasında hata oluştu', 'error');
            } finally {
                if (btn) { btn.disabled = false; btn.textContent = 'Giriş Yap'; }
            }
        };
    }

    // ═══════════════════════════════════════════════
    // ÇIKIŞ
    // ═══════════════════════════════════════════════

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        currentUser = null;
        updateUIForLoggedOut();
        showMessage('Çıkış yapıldı', 'info');
    };

    // ═══════════════════════════════════════════════
    // İLAN EKLEME MODALİ
    // ═══════════════════════════════════════════════

    const openAddListingBtn2  = document.getElementById('openAddListingBtn');
    const closeAddListingBtn  = document.getElementById('closeAddListing');
    const cancelAddListingBtn = document.getElementById('cancelAddListing');

    function openAddListingModal() {
        if (!currentUser) {
            showMessage('❌ İlan eklemek için önce giriş yapın', 'error');
            loginModal?.classList.add('open');
            return;
        }
        addListingModal?.classList.add('open');
        addListingModal?.setAttribute('aria-hidden', 'false');
    }

    function closeAddListingModal() {
        addListingModal?.classList.remove('open');
        addListingModal?.setAttribute('aria-hidden', 'true');
        addListingForm?.reset();
        selectedImageData = null;
        if (imagePreview) imagePreview.style.display = 'none';
    }

    if (openAddListingBtn2)   openAddListingBtn2.addEventListener('click',   openAddListingModal);
    if (closeAddListingBtn)   closeAddListingBtn.addEventListener('click',   closeAddListingModal);
    if (cancelAddListingBtn)  cancelAddListingBtn.addEventListener('click',  closeAddListingModal);
    addListingModal?.addEventListener('click', e => { if (e.target === addListingModal) closeAddListingModal(); });

    // ── FOTOĞRAF SEÇİMİ ──
    if (imageInput) {
        imageInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                showMessage('❌ Fotoğraf çok büyük (Max 5MB)', 'error');
                imageInput.value = '';
                selectedImageData = null;
                if (imagePreview) imagePreview.style.display = 'none';
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                selectedImageData = event.target.result;
                if (previewImg)    previewImg.src = selectedImageData;
                if (imagePreview)  imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    }

    // ── İLAN FORM SUBMIT ──
    addListingForm?.addEventListener('submit', async e => {
        e.preventDefault();

        if (!currentUser) {
            showMessage('❌ İlan eklemek için giriş yapın', 'error');
            return;
        }

        const carMake         = document.getElementById('carMake')?.value.trim();
        const carModel        = document.getElementById('carModel')?.value.trim();
        const carYear         = parseInt(document.getElementById('carYear')?.value);
        const carType         = document.getElementById('carType')?.value;
        const carPrice        = parseInt(document.getElementById('carPrice')?.value);
        const carKm           = parseInt(document.getElementById('carKm')?.value);
        const carFuel         = document.getElementById('carFuel')?.value;
        const carTransmission = document.getElementById('carTransmission')?.value;
        const carPower        = parseInt(document.getElementById('carPower')?.value);
        const carLocation     = document.getElementById('carLocation')?.value.trim();
        const carDescription  = document.getElementById('carDescription')?.value.trim();

        const carData = {
            make: carMake, model: carModel, year: carYear, type: carType,
            price: carPrice, kilometers: carKm, fuelType: carFuel,
            transmission: carTransmission, power: carPower,
            location: carLocation, description: carDescription,
            addedBy: currentUser.fullName || currentUser.username,
            imageUrl: selectedImageData ||
                `https://placehold.co/400x300/001a33/ffffff?text=${encodeURIComponent(carMake + '+' + carModel)}`
        };

        const submitBtn = addListingForm.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Yayınlanıyor...'; }

        let savedOk = false;

        // Önce backend'e gönder
        try {
            const response = await fetch(`${API_URL}/cars`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(carData)
            });
            if (response.ok) savedOk = true;
        } catch (_) { /* Backend kapalı */ }

        // Her durumda LocalStorage'a kaydet (fallback + offline)
        const savedListing = addLocalListing({ ...carData });

        // Galeri'ye kart ekle
        addCardToGallery(savedListing);
        closeAddListingModal();
        showMessage(`✓ "${carMake} ${carModel}" başarıyla yayınlandı!${savedOk ? '' : ' (Çevrimdışı mod)'}`, 'success');
        updateStats();

        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'İlanı Yayınla'; }
    });

    // ── KART OLUŞTUR ──
    function createCardHTML(data) {
        const { make, model, year, type, price, kilometers, fuelType, transmission, power, location, description, imageUrl, id } = data;
        const priceFormatted = price ? '₺' + parseInt(price).toLocaleString('tr-TR') : '-';
        const kmFormatted    = kilometers ? parseInt(kilometers).toLocaleString('tr-TR') + ' km' : '0 km';
        return `
            <div class="card-image-wrapper">
                <img src="${imageUrl || 'https://placehold.co/400x300/001a33/ffffff?text=Araba'}"
                     alt="${make} ${model}"
                     onerror="this.src='https://placehold.co/400x300/001a33/ffffff?text=Araba'">
                <div class="card-badge">Yeni İlan</div>
            </div>
            <div class="card-body">
                <div class="card-header">
                    <h3>${make} ${model}</h3>
                    <span class="card-year">${year}</span>
                </div>
                <div class="card-meta">
                    <span class="meta-item">📍 ${location}</span>
                    <span class="meta-item">⏱️ ${kmFormatted}</span>
                </div>
                <div class="card-specs">
                    <div class="spec"><span class="spec-icon">⛽</span><span class="spec-text">${fuelType}</span></div>
                    <div class="spec"><span class="spec-icon">⚙️</span><span class="spec-text">${transmission}</span></div>
                    <div class="spec"><span class="spec-icon">🚗</span><span class="spec-text">${power} bg</span></div>
                </div>
                <div class="desc desc-hidden">${description || 'Detay için tıklayın'}</div>
                <div class="card-footer">
                    <div class="card-price">${priceFormatted}</div>
                    <div class="card-actions">
                        <button class="btn btn-primary details">Detay</button>
                        ${isAdmin() ? `<button class="btn btn-danger btn-delete-listing" data-id="${id}">Sil</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    function addCardToGallery(data) {
        const newCard = document.createElement('article');
        newCard.className = 'card';
        newCard.dataset.type = data.type;
        newCard.dataset.listingId = data.id;
        newCard.innerHTML = createCardHTML(data);
        gallery?.insertBefore(newCard, gallery.firstChild);
    }

    // ── KAYITLI İLANLARI YÜKLEyen FUNCTİON (sayfa açılışında) ──
async function loadSavedListings() {
    // Önce backend'den yükle
    try {
        const response = await fetch(`${API_URL}/cars`);
        if (response.ok) {
            const backendListings = await response.json();
            if (backendListings.length > 0) {
                backendListings.forEach(listing => addCardToGallery(listing));
                return; // Backend çalışıyorsa localStorage'a bakma
            }
        }
    } catch (_) { /* Backend kapalı, localStorage'a bak */ }

    // Backend yoksa localStorage'dan yükle
    const listings = getLocalListings();
    listings.forEach(listing => addCardToGallery(listing));
}
    // ═══════════════════════════════════════════════
    // DASHBOARD
    // ═══════════════════════════════════════════════

    const openDashboardBtn  = document.getElementById('openDashboardBtn');
    const closeDashboardBtn = document.getElementById('closeDashboard');

    function openDashboard() {
        if (!isAdmin()) {
            showMessage('❌ Bu bölüme erişim yetkiniz yok', 'error');
            return;
        }
        populateDashboard();
        dashboardModal?.classList.add('open');
        dashboardModal?.setAttribute('aria-hidden', 'false');
    }

    function closeDashboardModal() {
        dashboardModal?.classList.remove('open');
        dashboardModal?.setAttribute('aria-hidden', 'true');
    }

    if (openDashboardBtn)  openDashboardBtn.addEventListener('click',  openDashboard);
    if (closeDashboardBtn) closeDashboardBtn.addEventListener('click', closeDashboardModal);
    dashboardModal?.addEventListener('click', e => { if (e.target === dashboardModal) closeDashboardModal(); });

    function populateDashboard() {
        const listings = getLocalListings();
        const users    = getLocalUsers();

        // Stat kartları
        const totalListings = listings.length + 4; // +4 statik kart
        const avgPrice = listings.length > 0
            ? Math.round(listings.reduce((sum, l) => sum + (parseInt(l.price) || 0), 0) / listings.length)
            : 0;
        const today = new Date().toDateString();
        const todayCount = listings.filter(l => new Date(l.createdAt).toDateString() === today).length;

        setEl('dashTotalListings', totalListings);
        setEl('dashTotalUsers',    users.length);
        setEl('dashAvgPrice',      avgPrice > 0 ? '₺' + avgPrice.toLocaleString('tr-TR') : '-');
        setEl('dashTodayListings', todayCount);

        // İlanlar tablosu
        const tableBody = document.getElementById('dashListingsTable');
        if (tableBody) {
            if (listings.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:20px">Henüz kullanıcı ilanı yok</td></tr>';
            } else {
                tableBody.innerHTML = listings.map((l, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td><strong>${l.make} ${l.model}</strong></td>
                        <td><span class="dash-badge">${l.type || '-'}</span></td>
                        <td>₺${parseInt(l.price || 0).toLocaleString('tr-TR')}</td>
                        <td>${l.location || '-'}</td>
                        <td>${l.addedBy || '-'}</td>
                        <td>${l.createdAt ? new Date(l.createdAt).toLocaleDateString('tr-TR') : '-'}</td>
                        <td>
                            <button class="btn-dash-delete" onclick="window.dashDeleteListing(${l.id})">🗑️ Sil</button>
                        </td>
                    </tr>
                `).join('');
            }
        }

        // Kullanıcılar tablosu
        const usersBody = document.getElementById('dashUsersTable');
        if (usersBody) {
            if (users.length === 0) {
                usersBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:20px">Kayıtlı kullanıcı yok</td></tr>';
            } else {
                usersBody.innerHTML = users.map((u, i) => {
                    const userListings = listings.filter(l => l.addedBy === u.fullName).length;
                    return `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${u.fullName}</td>
                            <td>${u.username || '-'}</td>
                            <td><span class="dash-badge ${u.isAdmin ? 'dash-badge-admin' : ''}">${u.isAdmin ? '👑 Admin' : '👤 Kullanıcı'}</span></td>
                            <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : '-'}</td>
                            <td>${userListings}</td>
                        </tr>
                    `;
                }).join('');
            }
        }
    }

    // Dashboard'dan ilan silme
    window.dashDeleteListing = function(id) {
        if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
        deleteLocalListing(id);
        // Galeriden de kaldır
        const cardEl = gallery?.querySelector(`[data-listing-id="${id}"]`);
        if (cardEl) cardEl.remove();
        populateDashboard();
        updateStats();
        showMessage('İlan silindi', 'success');
    };

    // ═══════════════════════════════════════════════
    // GALERİDEN SİLME (Admin - kart üzerindeki sil butonu)
    // ═══════════════════════════════════════════════

    gallery?.addEventListener('click', e => {
        const deleteBtn = e.target.closest('.btn-delete-listing');
        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            if (confirm('Bu ilanı silmek istediğinize emin misiniz?')) {
                deleteLocalListing(id);
                deleteBtn.closest('.card')?.remove();
                updateStats();
                showMessage('İlan silindi', 'success');
            }
        }
    });

    // ═══════════════════════════════════════════════
    // İSTATİSTİK BÖLÜMÜ
    // ═══════════════════════════════════════════════

    const STATIC_CARDS = [
        { type: 'sedan',  price: 5200000 },
        { type: 'suv',    price: 4280000 },
        { type: 'sport',  price: 3800000 },
        { type: 'sport',  price: 15400000 }
    ];

    const TYPE_LABELS = {
        sedan: 'Sedan', suv: 'SUV/Jeep', sport: 'Spor',
        hatchback: 'Hatchback', van: 'Minivan', all: 'Hepsi'
    };

    function updateStats() {
        const localListings = getLocalListings();
        const allListings   = [...STATIC_CARDS.map(c => ({ type: c.type, price: c.price })), ...localListings.map(l => ({ type: l.type, price: l.price }))];
        const users         = getLocalUsers();

        const totalListings = allListings.length;
        const totalUsers    = users.length;

        const validPrices = allListings.map(l => parseInt(l.price) || 0).filter(p => p > 0);
        const avgPrice    = validPrices.length > 0
            ? Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length)
            : 0;

        // Tip dağılımı
        const typeCounts = {};
        allListings.forEach(l => {
            if (l.type) typeCounts[l.type] = (typeCounts[l.type] || 0) + 1;
        });
        const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

        setEl('statTotalListings', totalListings);
        setEl('statTotalUsers',    totalUsers);
        setEl('statAvgPrice',      avgPrice > 0 ? '₺' + avgPrice.toLocaleString('tr-TR') : '-');
        setEl('statTopType',       topType ? (TYPE_LABELS[topType[0]] || topType[0]) : '-');

        // Tip çubuğu
        const breakdown = document.getElementById('typeBreakdown');
        if (breakdown && Object.keys(typeCounts).length > 0) {
            const maxCount = Math.max(...Object.values(typeCounts));
            breakdown.innerHTML = '<div class="type-breakdown-title">Araç Tipi Dağılımı</div>' +
                Object.entries(typeCounts).map(([type, count]) => `
                    <div class="type-bar-row">
                        <span class="type-bar-label">${TYPE_LABELS[type] || type}</span>
                        <div class="type-bar-track">
                            <div class="type-bar-fill" style="width:${Math.round((count / maxCount) * 100)}%"></div>
                        </div>
                        <span class="type-bar-count">${count}</span>
                    </div>
                `).join('');
        }
    }

    function setEl(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    // ═══════════════════════════════════════════════
    // GALERİ FİLTRE & ARAMA
    // ═══════════════════════════════════════════════

    function filterGallery(type, query) {
        query = (query || '').trim().toLowerCase();
        gallery?.querySelectorAll('.card').forEach(card => {
            const cardType  = card.dataset.type || '';
            const title     = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc      = card.querySelector('.desc')?.textContent.toLowerCase() || '';
            const matchType = type === 'all' || cardType === type;
            const matchQ    = !query || title.includes(query) || desc.includes(query);
            card.style.display = (matchType && matchQ) ? '' : 'none';
        });
    }

    filters.forEach(btn => btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterGallery(btn.dataset.type, search?.value);
    }));

    search?.addEventListener('input', () => {
        const active = document.querySelector('.filter.active')?.dataset.type || 'all';
        filterGallery(active, search.value);
    });

    // ═══════════════════════════════════════════════
    // DETAY MODALI
    // ═══════════════════════════════════════════════

    gallery?.addEventListener('click', e => {
        const btn = e.target.closest('.details');
        if (!btn) return;
        const card = btn.closest('.card');

        const img      = card.querySelector('img')?.src;
        const title    = card.querySelector('h3')?.textContent;
        const desc     = card.querySelector('.desc')?.textContent;
        const price    = card.querySelector('.card-price')?.textContent;
        const year     = card.querySelector('.card-year')?.textContent;
        const videoUrl = card.dataset.video;

        const specs = [];
        card.querySelectorAll('.spec').forEach(spec => {
            specs.push({
                icon: spec.querySelector('.spec-icon')?.textContent,
                text: spec.querySelector('.spec-text')?.textContent
            });
        });

        let location = '', km = '';
        card.querySelectorAll('.meta-item').forEach(item => {
            if (item.textContent.includes('📍')) location = item.textContent.replace('📍', '').trim();
            if (item.textContent.includes('⏱️')) km = item.textContent.replace('⏱️', '').trim();
        });

        const modelVideoContainer = document.getElementById('modelVideoContainer');
        const modelVideo          = document.getElementById('modelVideo');
        const modelOpenVideoBtn   = document.getElementById('modelOpenVideo');

        if (videoUrl) {
            if (modelImg) modelImg.style.display = 'none';
            if (modelVideoContainer) modelVideoContainer.style.display = 'block';
            if (modelVideo) modelVideo.src = videoUrl;
            if (modelOpenVideoBtn) {
                modelOpenVideoBtn.style.display = 'inline-block';
                modelOpenVideoBtn.onclick = (ev) => { ev.stopPropagation(); window.open(videoUrl, '_blank'); };
            }
        } else {
            if (modelImg) { modelImg.style.display = 'block'; modelImg.src = img; }
            if (modelVideoContainer) modelVideoContainer.style.display = 'none';
            if (modelOpenVideoBtn)   modelOpenVideoBtn.style.display   = 'none';
        }

        if (modelTitle) modelTitle.textContent = title;
        if (modelMeta)  modelMeta.innerHTML = `<div style="margin-bottom:8px">${location}</div><div style="font-size:13px;color:#6c757d">${year} · ${km}</div>`;
        if (modelDesc)  modelDesc.textContent = desc;
        if (modelPrice) modelPrice.textContent = price;

        const specsDetailsEl = document.getElementById('modelSpecsDetails');
        if (specsDetailsEl) {
            specsDetailsEl.innerHTML = specs.map(s => `
                <div class="model-spec-item">
                    <span class="model-spec-label">Özellik</span>
                    <span class="model-spec-value">${s.icon} ${s.text}</span>
                </div>
            `).join('');
        }

        model?.classList.add('open');
        model?.setAttribute('aria-hidden', 'false');
    });

    function closeModel() {
        model?.classList.remove('open');
        model?.setAttribute('aria-hidden', 'true');
        const modelVideo = document.getElementById('modelVideo');
        if (modelVideo) modelVideo.src = '';
    }

    document.getElementById('modelClose')?.addEventListener('click', closeModel);
    document.getElementById('modelCloseBtn')?.addEventListener('click', closeModel);
    model?.addEventListener('click', e => { if (e.target === model) closeModel(); });

    // ═══════════════════════════════════════════════
    // ESCAPE TUŞU
    // ═══════════════════════════════════════════════

    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        closeModel();
        closeAddListingModal();
        closeDashboardModal();
        loginModal?.classList.remove('open');
        registerModal?.classList.remove('open');
    });

    // ═══════════════════════════════════════════════
    // BAŞLANGIÇ
    // ═══════════════════════════════════════════════

    loadUser();
    loadSavedListings();   // LocalStorage'dan kayıtlı ilanları yükle
    filterGallery('all', '');
    updateStats();         // İstatistikleri güncelle

}); // DOMContentLoaded sonu
