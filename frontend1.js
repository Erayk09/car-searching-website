const API_URL = 'http://localhost:5000/api';

// ── TEMA: Sayfa yüklenmeden önce uygula (beyaz flash önlenir) ──
// NOT: Tüm kodda document.documentElement (html elementi) kullanıyoruz - TUTARLI!
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
}

// ── GLOBAL STATE ──────────────────────────────────────────────
let currentUser = null; // BUG DÜZELTİLDİ: Önceden hiç tanımlanmamıştı

// ══════════════════════════════════════════════════════════════
// DOMContentLoaded - TÜM KOD BURADA, DIŞARIDA HİÇBİR ŞEY YOK!
// BUG DÜZELTİLDİ: Kodun yarısı DOMContentLoaded dışındaydı,
// DOM hazır olmadan getElementById çağırıyordu → crash
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

    // ── ELEMENT TANIMLARI (Sadece birer kez!) ─────────────────
    // BUG DÜZELTİLDİ: Aynı const'lar hem içeride hem dışarıda
    // tanımlanmıştı → "already been declared" hatası
    const loginModal      = document.getElementById('loginModal');
    const registerModal   = document.getElementById('registerModal');
    const loginForm       = document.getElementById('loginForm');
    const registerForm    = document.getElementById('registerForm');
    const themeToggle     = document.getElementById('themeToggle');
    const gallery         = document.getElementById('gallery');
    const search          = document.getElementById('search');
    const filters         = document.querySelectorAll('.filter');
    const model           = document.getElementById('model');
    const modelImg        = document.getElementById('modelImg');
    const modelTitle      = document.getElementById('modelTitle');
    const modelMeta       = document.getElementById('modelMeta');
    const modelDesc       = document.getElementById('modelDesc');
    const modelPrice      = document.getElementById('modelPrice');
    const addListingModal = document.getElementById('addListingModal');
    const addListingForm  = document.getElementById('addListingForm');
    const imageInput      = document.getElementById('carImage');
    const imagePreview    = document.getElementById('imagePreview');
    const previewImg      = document.getElementById('previewImg');

    let selectedImageData = null;

    // ── TEMA ──────────────────────────────────────────────────
    // BUG DÜZELTİLDİ: Önceden 3 farklı tema sistemi vardı:
    //   1) body.classList kullanan (DOMContentLoaded içi)
    //   2) documentElement.classList kullanan (dışarıdaki initTheme/toggleTheme)
    //   3) initTheme() iki kez çağrılıyordu
    // Şimdi tek sistem: document.documentElement (html elementi)

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

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    initTheme(); // Sadece BİR kez çağrılıyor

    // ── KULLANICI YÖNETİMİ ────────────────────────────────────

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

    function updateUIForLoggedIn() {
        const userMenu = document.getElementById('userMenu');
        const authButtons = document.getElementById('authButtons');
        if (userMenu) userMenu.style.display = 'flex';
        if (authButtons) authButtons.style.display = 'none';
        const displayNameEl = document.getElementById('userDisplayName');
        if (displayNameEl && currentUser) displayNameEl.textContent = currentUser.fullName || currentUser.username;
        const addListingEl  = document.getElementById('openAddListing');
        if (addListingEl) addListingEl.style.display = 'block';
        const addListingBtn = document.getElementById('openAddListingBtn');
        if (addListingBtn) addListingBtn.style.display = 'block';
    }

    function updateUIForLoggedOut() {
        const authButtons = document.getElementById('authButtons');
        const userMenu    = document.getElementById('userMenu');
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        const addListingEl = document.getElementById('openAddListing');
        if (addListingEl) addListingEl.style.display = 'block';
    }

    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    function showMessage(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'error' ? '#d73a49' : type === 'success' ? '#28a745' : '#0052cc'};
            color: white;
            border-radius: 6px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 4000);
    }

    // ── İSİMDEN EMAIL/USERNAME ÜRET ───────────────────────────

    function generateEmailFromName(fullName) {
        return fullName.toLowerCase()
            .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
            .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
            .replace(/\s+/g, '.') + '@arabaara.kullanici';
    }

    function generateUsernameFromName(fullName) {
        return fullName.toLowerCase()
            .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
            .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
            .replace(/\s+/g, '_');
    }

    function getLocalUsers() {
        try { return JSON.parse(localStorage.getItem('arabaara_usermap') || '{}'); } catch { return {}; }
    }
    function saveLocalUser(fullName, email) {
        const map = getLocalUsers();
        map[fullName.toLowerCase()] = email;
        localStorage.setItem('arabaara_usermap', JSON.stringify(map));
    }
    function lookupEmailByName(fullName) {
        return getLocalUsers()[fullName.toLowerCase()] || null;
    }

    // ── MODAL AÇMA/KAPAMA ─────────────────────────────────────
    // BUG DÜZELTİLDİ: Hem event delegation hem de doğrudan onclick
    // kullanılıyordu, çakışıyordu. Şimdi sadece doğrudan onclick.

    const openLoginBtn    = document.getElementById('openLoginModal');
    const openRegisterBtn = document.getElementById('openRegisterModal');
    const closeLoginBtn   = document.getElementById('closeLoginModal');
    const closeRegisterBtn = document.getElementById('closeRegisterModal');
    const switchToRegBtn  = document.getElementById('switchToRegister');
    const switchToLogBtn  = document.getElementById('switchToLogin');

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

    if (loginModal)    loginModal.onclick    = (e) => e.target === loginModal    && loginModal.classList.remove('open');
    if (registerModal) registerModal.onclick = (e) => e.target === registerModal && registerModal.classList.remove('open');

    // ── KAYIT OL ──────────────────────────────────────────────
    // BUG DÜZELTİLDİ: registerForm.onsubmit 3 farklı yerde atanıyordu,
    // sadece en sonuncusu geçerliydi ama o da DOMContentLoaded dışındaydı
    // → registerForm tanımsız → crash

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

                const timestamp = Date.now();
                const email     = generateEmailFromName(fullName) + '.' + timestamp;
                const username  = generateUsernameFromName(fullName) + '_' + timestamp;

                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, username, password, fullName })
                });

                const data = await response.json();

                if (response.ok) {
                    saveLocalUser(fullName, data.email || email);
                    const user = { id: data.id, username: data.username, email: data.email || email, fullName: data.fullName || fullName };
                    saveUser(user, data.token);
                    showMessage(`✓ Hoşgeldiniz, ${fullName}!`, 'success');
                    registerModal?.classList.remove('open');
                    registerForm.reset();
                } else {
                    throw new Error('❌ ' + (data.message || 'Kayıt sırasında hata oluştu'));
                }
            } catch (error) {
                if (error.message?.startsWith('❌')) {
                    showMessage(error.message, 'error');
                } else {
                    showMessage('❌ Backend bağlanamadı! (dotnet run)', 'error');
                    console.error(error);
                }
            } finally {
                if (btn) { btn.disabled = false; btn.textContent = 'Kayıt Ol'; }
            }
        };
    }

    // ── GİRİŞ YAP ─────────────────────────────────────────────

    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.textContent = 'Giriş yapılıyor...'; }
            try {
                const fullName = document.getElementById('loginFullName').value.trim();
                const password = document.getElementById('loginPassword').value;

                if (!fullName) throw new Error('❌ Lütfen adınızı soyadınızı girin');

                const email = lookupEmailByName(fullName);
                if (!email) throw new Error('❌ Bu isimle kayıtlı hesap bulunamadı. Önce kayıt olun.');

                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    const user = { id: data.id, username: data.username, email: data.email, fullName: data.fullName || fullName };
                    saveUser(user, data.token);
                    showMessage(`✓ Hoşgeldiniz, ${data.fullName || fullName}!`, 'success');
                    loginModal?.classList.remove('open');
                    loginForm.reset();
                } else {
                    throw new Error('❌ ' + (data.message || 'Ad Soyad veya şifre yanlış'));
                }
            } catch (error) {
                if (error.message?.startsWith('❌')) {
                    showMessage(error.message, 'error');
                } else {
                    showMessage('❌ Backend bağlanamadı! (dotnet run)', 'error');
                    console.error(error);
                }
            } finally {
                if (btn) { btn.disabled = false; btn.textContent = 'Giriş Yap'; }
            }
        };
    }

    // ── ÇIKIŞ ─────────────────────────────────────────────────

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        currentUser = null;
        updateUIForLoggedOut();
        showMessage('Çıkış yapıldı', 'info');
    };

    // ── GALERİ FİLTRE & ARAMA ─────────────────────────────────

    function filterGallery(type, query) {
        query = (query || '').trim().toLowerCase();
        gallery?.querySelectorAll('.card').forEach(card => {
            const cardType    = card.dataset.type || '';
            const title       = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc        = card.querySelector('.desc')?.textContent.toLowerCase() || '';
            const matchesType = type === 'all' || cardType === type;
            const matchesQ    = !query || title.includes(query) || desc.includes(query);
            card.style.display = (matchesType && matchesQ) ? '' : 'none';
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

    // ── DETAY MODALİ ──────────────────────────────────────────

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
            if (modelVideoContainer) { modelVideoContainer.style.display = 'block'; }
            if (modelVideo) modelVideo.src = videoUrl;
            if (modelOpenVideoBtn) {
                modelOpenVideoBtn.style.display = 'inline-block';
                modelOpenVideoBtn.onclick = (ev) => { ev.stopPropagation(); window.open(videoUrl, '_blank'); };
            }
            if (modelVideoContainer && !modelVideoContainer.querySelector('.model-video-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'model-video-overlay';
                modelVideoContainer.appendChild(overlay);
            }
        } else {
            if (modelImg) { modelImg.style.display = 'block'; modelImg.src = img; }
            if (modelVideoContainer) modelVideoContainer.style.display = 'none';
            if (modelOpenVideoBtn) modelOpenVideoBtn.style.display = 'none';
        }

        if (modelTitle) modelTitle.textContent = title;
        if (modelMeta)  modelMeta.innerHTML = `<div style="margin-bottom:8px">${location}</div><div style="font-size:13px;color:#6c757d">${year} · ${km}</div>`;
        if (modelDesc)  modelDesc.textContent = desc;
        if (modelPrice) modelPrice.textContent = price;

        const specsDetailsHtml = specs.map(s => `
            <div class="model-spec-item">
                <span class="model-spec-label">Özellik</span>
                <span class="model-spec-value">${s.icon} ${s.text}</span>
            </div>
        `).join('');
        const specsDetailsEl = document.getElementById('modelSpecsDetails');
        if (specsDetailsEl) specsDetailsEl.innerHTML = specsDetailsHtml;

        model?.classList.add('open');
        model?.setAttribute('aria-hidden', 'false');
    });

    function closeModel() {
        model?.classList.remove('open');
        model?.setAttribute('aria-hidden', 'true');
        const modelVideo = document.getElementById('modelVideo');
        if (modelVideo) modelVideo.src = '';
    }

    document.querySelectorAll('#modelClose').forEach(btn => btn.addEventListener('click', closeModel));
    model?.addEventListener('click', e => { if (e.target === model) closeModel(); });

    // ── İLAN EKLEME MODALİ ────────────────────────────────────

    const openAddListingBtn  = document.getElementById('openAddListing');
    const openAddListingBtn2 = document.getElementById('openAddListingBtn');
    const closeAddListingBtn = document.getElementById('closeAddListing');
    const cancelAddListingBtn = document.getElementById('cancelAddListing');

    function openAddListingModal() {
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

    if (openAddListingBtn)  openAddListingBtn.addEventListener('click', openAddListingModal);
    if (openAddListingBtn2) openAddListingBtn2.addEventListener('click', openAddListingModal);
    if (closeAddListingBtn)  closeAddListingBtn.addEventListener('click', closeAddListingModal);
    if (cancelAddListingBtn) cancelAddListingBtn.addEventListener('click', closeAddListingModal);
    addListingModal?.addEventListener('click', e => { if (e.target === addListingModal) closeAddListingModal(); });

    // ── FOTOĞRAF SEÇİMİ ───────────────────────────────────────

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
                if (previewImg) previewImg.src = selectedImageData;
                if (imagePreview) imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    }

    // ── İLAN FORM SUBMIT ──────────────────────────────────────

    addListingForm?.addEventListener('submit', async e => {
        e.preventDefault();

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
            imageUrl: selectedImageData || `https://via.placeholder.com/400x300?text=${encodeURIComponent(carMake + ' ' + carModel)}`
        };

        try {
            const response = await fetch(`${API_URL}/cars`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(carData)
            });

            if (response.ok) {
                const newCard = document.createElement('article');
                newCard.className = 'card';
                newCard.dataset.type = carType;
                newCard.innerHTML = `
                    <div class="card-image-wrapper">
                        <img src="${carData.imageUrl}" alt="${carMake} ${carModel}">
                        <div class="card-badge">Yeni İlan</div>
                    </div>
                    <div class="card-body">
                        <div class="card-header">
                            <h3>${carMake} ${carModel}</h3>
                            <span class="card-year">${carYear}</span>
                        </div>
                        <div class="card-meta">
                            <span class="meta-item">📍 ${carLocation}</span>
                            <span class="meta-item">⏱️ ${carKm.toLocaleString('tr-TR')} km</span>
                        </div>
                        <div class="card-specs">
                            <div class="spec"><span class="spec-icon">⛽</span><span class="spec-text">${carFuel}</span></div>
                            <div class="spec"><span class="spec-icon">⚙️</span><span class="spec-text">${carTransmission}</span></div>
                            <div class="spec"><span class="spec-icon">🚗</span><span class="spec-text">${carPower} bg</span></div>
                        </div>
                        <div class="desc desc-hidden">${carDescription || 'Detay için tıklayın'}</div>
                        <div class="card-footer">
                            <div class="card-price">₺${carPrice.toLocaleString('tr-TR')}</div>
                            <div class="card-actions">
                                <button class="btn btn-primary details">Detay</button>
                            </div>
                        </div>
                    </div>
                `;
                gallery?.insertBefore(newCard, gallery.firstChild);
                closeAddListingModal();
                showMessage(`✓ "${carMake} ${carModel}" başarıyla yayınlandı!`, 'success');
            } else {
                const error = await response.json();
                showMessage(error.message || 'İlan oluşturulurken hata oluştu', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        }
    });

    // ── ESCAPE TUŞU ───────────────────────────────────────────

    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        closeModel();
        closeAddListingModal();
        loginModal?.classList.remove('open');
        registerModal?.classList.remove('open');
    });

    // ── BAŞLANGITÇ ────────────────────────────────────────────

    loadUser();
    filterGallery('all', '');

}); // DOMContentLoaded sonu
