const API_URL = 'http://localhost:5000/api';

// 1. Sayfa yüklenmeden temayı uygula (Beyaz ekran parlamasını önler)
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

document.addEventListener('DOMContentLoaded', () => {
    // 2. TÜM TANIMLAMALAR (Sadece birer kez!)
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const themeBtn = document.getElementById('themeToggle');
    const registerModal = document.getElementById('registerModal');
    const loginModal = document.getElementById('loginModal');

    // 3. KARANLIK MOD (Ters çalışmayı önleyen mantık)
    if (themeBtn) {
        themeBtn.onclick = () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };
    }

    // 4. KAYIT FORMU (ReferenceError hatasını çözen kısım)
    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            console.log("Kayıt formu gönderiliyor...");

            const formData = {
                fullName: document.getElementById('registerFullName').value,
                username: document.getElementById('registerUsername').value,
                email: document.getElementById('registerEmail').value,
                password: document.getElementById('registerPassword').value
            };

            try {
                const res = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    alert("Kayıt Başarılı!");
                    window.location.reload();
                } else {
                    const error = await res.json();
                    alert("Hata: " + (error.message || "Bilinmeyen hata"));
                }
            } catch (err) {
                alert("Backend kapalı! C# projesini çalıştır.");
            }
        };
    }

    // 5. ARABA DETAYI VE MODAL AÇMA (Delegasyon ile her butona basılır)
    document.addEventListener('click', (e) => {
        // Detay butonu
        if (e.target.closest('.detay-btn')) {
            const carId = e.target.closest('.detay-btn').dataset.id;
            alert("Detaylar yükleniyor... ID: " + carId);
        }
        
        // Modal açan butonlar
        if (e.target.id === 'openRegisterModal') registerModal?.classList.add('open');
        if (e.target.id === 'openLoginModal') loginModal?.classList.add('open');
        
        // Kapatma butonu
        if (e.target.classList.contains('modal-close')) {
            registerModal?.classList.remove('open');
            loginModal?.classList.remove('open');
        }
    });
});

    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault(); // Sayfanın yenilenmesini engeller
            
            // Form verilerini al
            const formData = {
                fullName: document.getElementById('registerFullName').value,
                username: document.getElementById('registerUsername').value,
                email: document.getElementById('registerEmail').value,
                password: document.getElementById('registerPassword').value
            };

            console.log("Gönderilen Veri:", formData); // Konsolda bunu görmelisin

            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert("Kayıt Başarılı!");
                    location.reload(); // Sayfayı yenile veya modalı kapat
                } else {
                    const error = await response.json();
                    alert("Hata: " + (error.message || "Kayıt yapılamadı"));
                }
            } catch (err) {
                console.error("Bağlantı Hatası:", err);
                alert("Sunucuya bağlanılamadı. Backend çalışıyor mu?");
            }
        };
    }

	// Load user from localStorage
	function loadUser() {
		const userData = localStorage.getItem('user');
		const token = localStorage.getItem('token');
		if (userData && token) {
			currentUser = JSON.parse(userData);
			updateUIForLoggedIn();
		} else {
			currentUser = null;
			updateUIForLoggedOut();
		}
	}

	// Save user to localStorage
	function saveUser(user, token) {
		currentUser = user;
		localStorage.setItem('user', JSON.stringify(user));
		localStorage.setItem('token', token);
		updateUIForLoggedIn();
	}

	// Update UI for logged in user
	function updateUIForLoggedIn() {
		document.getElementById('userMenu').style.display = 'flex';
		const displayNameEl = document.getElementById('userDisplayName');
		if (displayNameEl && currentUser) displayNameEl.textContent = currentUser.fullName || currentUser.username;
		const addListingEl = document.getElementById('openAddListing');
		if (addListingEl) addListingEl.style.display = 'block';
		const addListingBtn = document.getElementById('openAddListingBtn');
		if (addListingBtn) addListingBtn.style.display = 'block';
	}

	// Update UI for logged out user
	function updateUIForLoggedOut() {
		document.getElementById('authButtons').style.display = 'flex';
		document.getElementById('userMenu').style.display = 'none';
		document.getElementById('openAddListing').style.display = 'block'; // ✓ Her zaman görünür
	}

	// Get auth headers
	function getAuthHeaders() {
		const token = localStorage.getItem('token');
		return {
			'Content-Type': 'application/json',
			'Authorization': token ? `Bearer ${token}` : ''
		};
	}

	// Show message
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
			z-index: 1000;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
			animation: slideIn 0.3s ease;
		`;
		alertDiv.textContent = message;
		document.body.appendChild(alertDiv);
		setTimeout(() => alertDiv.remove(), 4000);
	}

	// Auth Modal Functions
	const loginModal = document.getElementById('loginModal');
	const registerModal = document.getElementById('registerModal');
	const loginForm = document.getElementById('loginForm');
	const registerForm = document.getElementById('registerForm');

	// Ad Soyad'dan benzersiz email ve username üret
	function generateEmailFromName(fullName) {
		const base = fullName.toLowerCase()
			.replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
			.replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
			.replace(/\s+/g, '.');
		return base + '@arabaara.kullanici';
	}
	function generateUsernameFromName(fullName) {
		return fullName.toLowerCase()
			.replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
			.replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
			.replace(/\s+/g, '_');
	}

	// Kayıtlı kullanıcıları localStorage'da tut (ad → email eşleşmesi için)
	function getLocalUsers() {
		try { return JSON.parse(localStorage.getItem('arabaara_usermap') || '{}'); } catch { return {}; }
	}
	function saveLocalUser(fullName, email) {
		const map = getLocalUsers();
		map[fullName.toLowerCase()] = email;
		localStorage.setItem('arabaara_usermap', JSON.stringify(map));
	}
	function lookupEmailByName(fullName) {
		const map = getLocalUsers();
		return map[fullName.toLowerCase()] || null;
	}

	// Open/close modals
	document.getElementById('openLoginModal').onclick = () => {
		loginModal.classList.add('open');
		registerModal.classList.remove('open');
	};
	document.getElementById('openRegisterModal').onclick = () => {
		registerModal.classList.add('open');
		loginModal.classList.remove('open');
	};
	document.getElementById('closeLoginModal').onclick = () => loginModal.classList.remove('open');
	document.getElementById('closeRegisterModal').onclick = () => registerModal.classList.remove('open');
	document.getElementById('switchToRegister').onclick = (e) => {
		e.preventDefault();
		loginModal.classList.remove('open');
		registerModal.classList.add('open');
	};
	document.getElementById('switchToLogin').onclick = (e) => {
		e.preventDefault();
		registerModal.classList.remove('open');
		loginModal.classList.add('open');
	};

	// Close on backdrop click
	loginModal.onclick = (e) => e.target === loginModal && loginModal.classList.remove('open');
	registerModal.onclick = (e) => e.target === registerModal && registerModal.classList.remove('open');

	// ── KAYIT OL ──────────────────────────────────────────────
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

				// Email ve username otomatik üret
				const timestamp = Date.now();
				const email = generateEmailFromName(fullName) + '.' + timestamp;
				const username = generateUsernameFromName(fullName) + '_' + timestamp;

				const response = await fetch(`${API_URL}/auth/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, username, password, fullName })
				});

				const data = await response.json();

				if (response.ok) {
					// Ad → email eşleşmesini kaydet (giriş için lazım)
					saveLocalUser(fullName, data.email || email);
					const user = { id: data.id, username: data.username, email: data.email || email, fullName: data.fullName || fullName };
					saveUser(user, data.token);
					showMessage(`✓ Hoşgeldiniz, ${fullName}!`, 'success');
					registerModal.classList.remove('open');
					registerForm.reset();
				} else {
					throw new Error('❌ ' + (data.message || 'Kayıt sırasında hata oluştu'));
				}
			} catch (error) {
				if (error.message && error.message.startsWith('❌')) {
					showMessage(error.message, 'error');
				} else {
					showMessage('❌ Backende bağlanılamadı! Backend çalışıyor mu? (dotnet run)', 'error');
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

				// Daha önce kaydolurken oluşturulan emaili bul
				const email = lookupEmailByName(fullName);
				if (!email) throw new Error('❌ Bu isimle kayıtlı bir hesap bulunamadı. Önce kayıt olun.');

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
					loginModal.classList.remove('open');
					loginForm.reset();
				} else {
					throw new Error('❌ ' + (data.message || 'Ad Soyad veya şifre yanlış'));
				}
			} catch (error) {
				if (error.message && error.message.startsWith('❌')) {
					showMessage(error.message, 'error');
				} else {
					showMessage('❌ Backende bağlanılamadı! Backend çalışıyor mu? (dotnet run)', 'error');
					console.error(error);
				}
			} finally {
				if (btn) { btn.disabled = false; btn.textContent = 'Giriş Yap'; }
			}
		};
	}

	// Logout
	document.getElementById('logoutBtn').onclick = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		currentUser = null;
		updateUIForLoggedOut();
		showMessage('Çıkış yapılırken oluşturuldu', 'info');
	};

	const gallery = document.getElementById('gallery');
	const search = document.getElementById('search');
	const filters = document.querySelectorAll('.filter');
	const model = document.getElementById('model');
	const modelImg = document.getElementById('modelImg');
	const modelTitle = document.getElementById('modelTitle');
	const modelMeta = document.getElementById('modelMeta');
	const modelDesc = document.getElementById('modelDesc');
	const modelPrice = document.getElementById('modelPrice');
	const modelClose = document.getElementById('modelClose');

	function filterGallery(type, query){
		query = (query||'').trim().toLowerCase();
		const cards = gallery.querySelectorAll('.card');
		cards.forEach(card => {
			const cardType = card.dataset.type || '';
			const title = card.querySelector('h3').textContent.toLowerCase();
			const desc = (card.querySelector('.desc')?.textContent || '').toLowerCase();
			const matchesType = (type==='all') || (cardType===type);
			const matchesQuery = !query || title.includes(query) || desc.includes(query);
			card.style.display = (matchesType && matchesQuery) ? '' : 'none';
		});
	}

	// Filter buttons
	filters.forEach(btn => btn.addEventListener('click', ()=>{
		filters.forEach(b=>b.classList.remove('active'));
		btn.classList.add('active');
		filterGallery(btn.dataset.type, search.value);
	}));

	// Search
	search.addEventListener('input', ()=>{
		const active = document.querySelector('.filter.active').dataset.type;
		filterGallery(active, search.value);
	});

	// Details model
	gallery.addEventListener('click', e=>{
		const btn = e.target.closest('.details');
		if(!btn) return;
		const card = btn.closest('.card');
		const img = card.querySelector('img').src;
		const title = card.querySelector('h3').textContent;
		const meta = card.querySelector('.card-meta').textContent;
		const desc = card.querySelector('.desc').textContent;
		const price = card.querySelector('.card-price').textContent;
		const videoUrl = card.dataset.video; // Get video URL if exists
		
		// Get specs
		const specs = [];
		card.querySelectorAll('.spec').forEach(spec => {
			const icon = spec.querySelector('.spec-icon').textContent;
			const text = spec.querySelector('.spec-text').textContent;
			specs.push({icon, text});
		});
		
		// Get year
		const year = card.querySelector('.card-year').textContent;
		
		// Get location and km
		const metaItems = card.querySelectorAll('.meta-item');
		let location = '', km = '';
		metaItems.forEach(item => {
			const text = item.textContent;
			if(text.includes('📍')) location = text.replace('📍', '').trim();
			if(text.includes('⏱️')) km = text.replace('⏱️', '').trim();
		});
		
		// Handle video or image
		const modelImg = document.getElementById('modelImg');
		const modelVideoContainer = document.getElementById('modelVideoContainer');
		const modelVideo = document.getElementById('modelVideo');
		
		if(videoUrl) {
			modelImg.style.display = 'none';
			modelVideoContainer.style.display = 'block';
			modelVideo.src = videoUrl;
			// Show fallback "Open Video" button in case iframe is blocked (file:// or CORS)
			const modelOpenVideoBtn = document.getElementById('modelOpenVideo');
			if (modelOpenVideoBtn) {
				modelOpenVideoBtn.style.display = 'inline-block';
				modelOpenVideoBtn.onclick = (ev) => { ev.stopPropagation(); window.open(videoUrl, '_blank'); };
			}
			// Add a subtle overlay to improve text readability over video
			if (!modelVideoContainer.querySelector('.model-video-overlay')) {
				const overlay = document.createElement('div');
				overlay.className = 'model-video-overlay';
				modelVideoContainer.appendChild(overlay);
			}
		} else {
			modelImg.style.display = 'block';
			modelVideoContainer.style.display = 'none';
			modelImg.src = img;
			const modelOpenVideoBtn = document.getElementById('modelOpenVideo');
			if (modelOpenVideoBtn) modelOpenVideoBtn.style.display = 'none';
		}
		
		modelTitle.textContent = title;
		modelMeta.innerHTML = `<div style="margin-bottom:8px">${location}</div><div style="font-size:13px;color:#6c757d">${year} · ${km}</div>`;
		modelDesc.textContent = desc;
		modelPrice.textContent = price;
		
		// Build specs details
		const specsDetailsHtml = specs.map(spec => `
			<div class="model-spec-item">
				<span class="model-spec-label">Özellik</span>
				<span class="model-spec-value">${spec.icon} ${spec.text}</span>
			</div>
		`).join('');
		document.getElementById('modelSpecsDetails').innerHTML = specsDetailsHtml;
		
		model.classList.add('open');
		model.setAttribute('aria-hidden','false');
	});

	function closeModel(){
		model.classList.remove('open');
		model.setAttribute('aria-hidden','true');
		// Clear video
		document.getElementById('modelVideo').src = '';
	}

	// Close button handler
	document.querySelectorAll('#modelClose').forEach(btn => {
		btn.addEventListener('click', closeModel);
	});
	
	model.addEventListener('click', e=>{ if(e.target===model) closeModel(); });
	document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModel(); });

	// Initial layout
	filterGallery('all','');

	// Add Listing Modal functionality
	const addListingModal = document.getElementById('addListingModal');
	const addListingForm = document.getElementById('addListingForm');
	const openAddListingBtn = document.getElementById('openAddListing');
	const openAddListingBtn2 = document.getElementById('openAddListingBtn'); // From user menu
	const closeAddListingBtn = document.getElementById('closeAddListing');
	const cancelAddListingBtn = document.getElementById('cancelAddListing');

	function openAddListingModal() {
		// ✓ Giriş şartını kaldırdı - herkes ilan ekleyebilir
		addListingModal.classList.add('open');
		addListingModal.setAttribute('aria-hidden', 'false');
	}

	function closeAddListingModal() {
		addListingModal.classList.remove('open');
		addListingModal.setAttribute('aria-hidden', 'true');
		addListingForm.reset();
		selectedImageData = null;
		if (imagePreview) imagePreview.style.display = 'none';
	}

	// Event listeners for opening/closing modal
	if (openAddListingBtn) openAddListingBtn.addEventListener('click', openAddListingModal);
	if (openAddListingBtn2) openAddListingBtn2.addEventListener('click', openAddListingModal);
	closeAddListingBtn.addEventListener('click', closeAddListingModal);
	cancelAddListingBtn.addEventListener('click', closeAddListingModal);

	// Close modal when clicking on backdrop
	addListingModal.addEventListener('click', e => {
		if (e.target === addListingModal) closeAddListingModal();
	});

	// Close modal on Escape key
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && addListingModal.classList.contains('open')) {
			closeAddListingModal();
		}
	});

	// 📸 Image handling
	let selectedImageData = null;
	const imageInput = document.getElementById('carImage');
	const imagePreview = document.getElementById('imagePreview');
	const previewImg = document.getElementById('previewImg');

	if (imageInput) {
		imageInput.addEventListener('change', function(e) {
			const file = e.target.files[0];
			if (file) {
				// Dosya boyutu kontrolü (5MB)
				if (file.size > 5 * 1024 * 1024) {
					showMessage('❌ Fotoğraf çok büyük (Max 5MB)', 'error');
					imageInput.value = '';
					selectedImageData = null;
					imagePreview.style.display = 'none';
					return;
				}

				// FileReader ile base64'e dönüştür
				const reader = new FileReader();
				reader.onload = function(event) {
					selectedImageData = event.target.result; // Base64 URL
					previewImg.src = selectedImageData;
					imagePreview.style.display = 'block';
					console.log('📸 Fotoğraf seçildi');
				};
				reader.readAsDataURL(file);
			}
		});
	}

	// Handle form submission
	addListingForm.addEventListener('submit', async e => {
		e.preventDefault();

		// ✓ Giriş şartını kaldırdı - herkes ilan ekleyebilir

		// Get form values
		const carMake = document.getElementById('carMake').value.trim();
		const carModel = document.getElementById('carModel').value.trim();
		const carYear = parseInt(document.getElementById('carYear').value);
		const carType = document.getElementById('carType').value;
		const carPrice = parseInt(document.getElementById('carPrice').value);
		const carKm = parseInt(document.getElementById('carKm').value);
		const carFuel = document.getElementById('carFuel').value;
		const carTransmission = document.getElementById('carTransmission').value;
		const carPower = parseInt(document.getElementById('carPower').value);
		const carLocation = document.getElementById('carLocation').value.trim();
		const carDescription = document.getElementById('carDescription').value.trim();

		const carData = {
			make: carMake,
			model: carModel,
			year: carYear,
			type: carType,
			price: carPrice,
			kilometers: carKm,
			fuelType: carFuel,
			transmission: carTransmission,
			power: carPower,
			location: carLocation,
			description: carDescription,
			imageUrl: selectedImageData || `https://via.placeholder.com/400x300?text=${encodeURIComponent(carMake + ' ' + carModel)}`
		};

		try {
			const response = await fetch(`${API_URL}/cars`, {
				method: 'POST',
				headers: getAuthHeaders(),
				body: JSON.stringify(carData)
			});

			if (response.ok) {
				// Create new card HTML
				const newCard = document.createElement('article');
				newCard.className = 'card';
				newCard.dataset.type = carType;
				
				const priceDisplay = '₺' + carPrice.toLocaleString('tr-TR');
				
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
							<div class="spec">
								<span class="spec-icon">⛽</span>
								<span class="spec-text">${carFuel}</span>
							</div>
							<div class="spec">
								<span class="spec-icon">⚙️</span>
								<span class="spec-text">${carTransmission}</span>
							</div>
							<div class="spec">
								<span class="spec-icon">🚗</span>
								<span class="spec-text">${carPower} bg</span>
							</div>
						</div>
						<div class="desc desc-hidden">${carDescription || 'Detay için tıklayın'}</div>
						<div class="card-footer">
							<div class="card-price">${priceDisplay}</div>
							<div class="card-actions">
								<button class="btn btn-primary details">Detay</button>
							</div>
						</div>
					</div>
				`;

				// Add new card to gallery (at the beginning)
				gallery.insertBefore(newCard, gallery.firstChild);

				// Close modal and reset form
				closeAddListingModal();

				// Show success message
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

	// Theme Toggle Functions
	const themeToggle = document.getElementById('themeToggle');
	
	function initTheme() {
		const savedTheme = localStorage.getItem('theme') || 'light';
		if (savedTheme === 'dark') {
			document.documentElement.classList.add('dark-mode');
			themeToggle.textContent = '☀️';
		}
	}
	
	function toggleTheme() {
		document.documentElement.classList.toggle('dark-mode');
		const isDark = document.documentElement.classList.contains('dark-mode');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
		themeToggle.textContent = isDark ? '☀️' : '🌙';
	}
	
	if (themeToggle) {
		themeToggle.addEventListener('click', toggleTheme);
	}
	
	// Initialize: Load user and theme on page load
	loadUser();
	initTheme();
	initTheme();
