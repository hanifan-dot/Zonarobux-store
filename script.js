// --- DATABASE ---
let usersDB = JSON.parse(localStorage.getItem('usersDB')) || {};
let validResi = JSON.parse(localStorage.getItem('validResi')) || [];
let currentUser = localStorage.getItem('loggedInUser');
let activeDiscount = 0;
let activeVoucherUsed = false;
let activeGame = 'roblox'; 

let selectedItem = { nama: '', harga: 0 };
const KUNCI_RAHASIA = "ZONA2026BOS";

function simpanDB() { localStorage.setItem('usersDB', JSON.stringify(usersDB)); }

// --- SIDEBAR & TEMA ---
function toggleSidebar() { document.getElementById("sidebar").classList.toggle("active"); }
function toggleTema() { document.body.classList.toggle("light-mode"); }

function setGame(game) {
    activeGame = game;
    let title = document.getElementById('header-title');
    let titleLead = document.getElementById('title-leaderboard');
    
    document.querySelectorAll('.game-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + game).classList.add('active');

    if(game === 'mlbb') {
        document.body.classList.add('theme-mlbb');
        document.getElementById('topup-roblox').style.display = 'none';
        document.getElementById('topup-mlbb').style.display = 'block';
        title.innerText = "ZONA MLBB";
        titleLead.innerText = "👑 Top 5 Sultan MLBB";
    } else {
        document.body.classList.remove('theme-mlbb');
        document.getElementById('topup-roblox').style.display = 'block';
        document.getElementById('topup-mlbb').style.display = 'none';
        title.innerText = "ZONA ROBUX";
        titleLead.innerText = "👑 Top 5 Sultan Roblox";
    }
    
    selectedItem = { nama: '', harga: 0 };
    document.getElementById("infoPajak").style.display = "none";
    document.querySelectorAll('.paket-card').forEach(c => c.classList.remove('active'));
    
    document.getElementById("testi-container").innerHTML = '';
    document.getElementById("leaderboard-container").innerHTML = '';
    generateLeaderboard();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tabName).style.display = 'block';
    document.getElementById('nav-' + tabName).classList.add('active');
    if (tabName === 'profil') refreshProfil();
    if (tabName === 'transaksi' && currentUser) document.getElementById('box-tukar-poin').style.display = 'block';
}

// --- AKUN ---
let isLoginMode = false;
function bukaModalAuth() { document.getElementById("modal-auth").style.display = "flex"; }
function tutupModalAuth() { document.getElementById("modal-auth").style.display = "none"; }
function switchAuth() {
    isLoginMode = !isLoginMode;
    document.getElementById("modal-title").innerText = isLoginMode ? "Login Akun Resmi" : "Buat Akun Resmi";
    document.getElementById("switch-text").innerText = isLoginMode ? "Belum punya akun? Daftar" : "Sudah punya akun? Login";
}

function prosesAuth() {
    let user = document.getElementById("reg-user").value;
    let pass = document.getElementById("reg-pass").value;
    if(user.length < 5) return alert("Min 5 karakter!");
    
    if(user === "hanifanbos01" && pass === "081228") {
        usersDB[user] = { pass: pass, point: 999999, topup: 50, voucher: 10, rank: "Sultan", codes: [] };
        simpanDB();
    }

    if(isLoginMode) {
        if(usersDB[user] && usersDB[user].pass === pass) {
            tutupModalAuth();
            localStorage.setItem("loggedInUser", user);
            currentUser = user;
            
            let petasan = document.getElementById("animasi-petasan");
            petasan.style.display = "flex"; petasan.style.opacity = "1";
            setTimeout(() => { petasan.style.opacity = "0"; setTimeout(() => { petasan.style.display = "none"; refreshProfil(); }, 1000); }, 2000);
        } else alert("❌ Username/Password salah!");
    } else {
        if(usersDB[user]) alert("❌ Username terdaftar!");
        else {
            usersDB[user] = { pass: pass, point: 0, topup: 0, voucher: 0, rank: "Warga", codes: [] };
            simpanDB(); alert("✅ Akun dibuat!"); switchAuth();
        }
    }
}
function logout() { localStorage.removeItem("loggedInUser"); currentUser = null; activeDiscount = 0; alert("Logout!"); refreshProfil(); }

function updateRank(u) {
    let oldRank = u.rank;
    if(u.point >= 150 || u.topup >= 15) u.rank = "Sultan";
    else if(u.point >= 50 || u.topup >= 5) u.rank = "Jagoan";
    else u.rank = "Warga";
    
    if(oldRank !== u.rank && u.rank !== "Warga") { u.voucher += 1; alert(`🎉 Naik pangkat ke ${u.rank}. Dapat 1 Voucher!`); }
}

function refreshProfil() {
    if (currentUser && usersDB[currentUser]) {
        document.getElementById("view-belum-login").style.display = "none";
        document.getElementById("view-sudah-login").style.display = "block";
        document.getElementById("box-tukar-poin").style.display = "block";
        
        let u = usersDB[currentUser];
        updateRank(u); simpanDB();
        
        document.getElementById("nama-profil").innerText = currentUser;
        document.getElementById("text-poin").innerText = "🪙 " + u.point;
        document.getElementById("text-topup").innerText = "🛒 " + u.topup + "x";
        document.getElementById("text-voucher").innerText = "🎫 " + u.voucher;
        
        let badge = document.getElementById("pangkat-badge");
        let ava = document.getElementById("ava-profil-utama");
        ava.className = ""; 
        if(u.rank === "Sultan") { badge.innerText = "Sultan 👑"; badge.style.background = "#FF4500"; ava.classList.add("ava-sultan"); }
        else if(u.rank === "Jagoan") { badge.innerText = "Jagoan ✨"; badge.style.background = "#00FFFF"; badge.style.color = "#000"; ava.classList.add("ava-jagoan"); }
        else { badge.innerText = "Warga"; badge.style.background = "#8B4513"; ava.classList.add("ava-warga"); }

        if(u.voucher > 0) document.getElementById("box-pakai-voucher").style.display = "block"; 
        else document.getElementById("box-pakai-voucher").style.display = "none";

        if(currentUser === "hanifanbos01") document.getElementById("btn-panel-admin").style.display = "inline-block";
        else document.getElementById("btn-panel-admin").style.display = "none";
    } else {
        document.getElementById("view-belum-login").style.display = "block";
        document.getElementById("view-sudah-login").style.display = "none";
        document.getElementById("box-tukar-poin").style.display = "none";
    }
}

// --- TRANSAKSI ---
function pilihPaket(tipeGame, namaItem, hargaAsli, elemen) {
    document.querySelectorAll('.paket-card').forEach(c => c.classList.remove('active'));
    elemen.classList.add('active'); 
    
    selectedItem.nama = namaItem;
    selectedItem.harga = hargaAsli;
    
    let hargaDiskon = hargaAsli - (hargaAsli * (activeDiscount / 100));
    document.getElementById("hargaRupiah").innerText = "Rp " + hargaDiskon.toLocaleString("id-ID");
    document.getElementById("detail-item-pilihan").innerText = `Item: ${namaItem} | ${activeGame.toUpperCase()}`;
    document.getElementById("infoPajak").style.display = "block";
}

function klaimPromo() {
    if(!currentUser) return alert("Login dulu!");
    let code = document.getElementById("input-promo").value.toUpperCase();
    let u = usersDB[currentUser];
    const kodePromoValid = ["HANIFANTOPUP", "MARITOPUP", "ZONAROBUXAMBYAR"];
    if(kodePromoValid.includes(code)) {
        if(u.codes && u.codes.includes(code)) return alert("Kode ini udah pernah lu pakai!");
        if(!u.codes) u.codes = [];
        u.codes.push(code); simpanDB(); activeDiscount = 15;
        alert("✅ Diskon 15% aktif."); 
        if(selectedItem.harga > 0) pilihPaket(activeGame, selectedItem.nama, selectedItem.harga, document.querySelector('.paket-card.active'));
    } else alert("❌ Kode promo salah!");
}

function pakaiVoucher() {
    if(!currentUser || selectedItem.harga === 0) return;
    let u = usersDB[currentUser];
    if(u.voucher > 0) {
        activeVoucherUsed = true; activeDiscount = 10;
        let hargaDiskon = selectedItem.harga - (selectedItem.harga * 0.10);
        document.getElementById("hargaRupiah").innerText = "Rp " + hargaDiskon.toLocaleString("id-ID");
        alert("🎫 Voucher 10% Diaktifkan!");
    }
}

function pesanWa(game) {
    if(selectedItem.harga === 0) return alert("Pilih paket dulu Bos!");
    
    let userDetail = "";
    if(game === 'roblox') {
        let userRbx = document.getElementById("username-rbx").value;
        let linkRbx = document.getElementById("link-rbx").value;
        if(!userRbx || !linkRbx) return alert("Lengkapi data Roblox!");
        userDetail = `👤 Username: ${userRbx}%0A🔗 Link: ${linkRbx}`;
    } else {
        let idMl = document.getElementById("userid-mlbb").value;
        let zoneMl = document.getElementById("zoneid-mlbb").value;
        if(!idMl || !zoneMl) return alert("Lengkapi User ID dan Zone ID MLBB!");
        userDetail = `🎮 ID MLBB: ${idMl} (${zoneMl})`;
    }
    
    if(currentUser) {
        usersDB[currentUser].topup += 1;
        if(usersDB[currentUser].topup % 5 === 0) usersDB[currentUser].voucher += 1; 
        if(activeVoucherUsed) { usersDB[currentUser].voucher -= 1; activeVoucherUsed = false; activeDiscount = 0; }
        simpanDB(); refreshProfil();
    }
    
    let total = document.getElementById("hargaRupiah").innerText;
    let teks = `Halo Admin Zona! Order Masuk:%0A%0A📦 Game: ${game.toUpperCase()}%0A💎 Item: ${selectedItem.nama}%0A💰 Total: ${total}%0A${userDetail}%0A%0A(Admin, tolong kasih kode poin ke saya kalau sudah diproses ya!)`;
    
    alert(`Pesanan Dibuat! Lanjut ke WA Admin.`);
    window.open("https://wa.me/6289672344059?text=" + teks, "_blank");
}

// --- SISTEM ADMIN BIKIN KODE POIN ---
function generateKodePoin() {
    let resiBaru = "ZN-" + Math.floor(1000 + Math.random() * 9000); // Ex: ZN-4829
    validResi.push(resiBaru); 
    localStorage.setItem('validResi', JSON.stringify(validResi));
    document.getElementById("hasil-kode-poin").innerText = resiBaru;
}

function klaimResi() {
    if(!currentUser) return alert("Login dulu!");
    let resi = document.getElementById("input-resi").value.toUpperCase();
    if(validResi.includes(resi)) {
        validResi = validResi.filter(r => r !== resi); localStorage.setItem('validResi', JSON.stringify(validResi));
        usersDB[currentUser].point += 10; simpanDB(); alert("✅ Kode valid! Dapat +10 Poin."); refreshProfil();
    } else alert("❌ Kode tidak valid atau sudah dipakai!");
}

function tukarPoin() {
    if(!currentUser) return;
    let u = usersDB[currentUser];
    let inputPoint = parseInt(document.getElementById("input-tukar-poin").value);
    
    let bisaTukar = Math.floor(inputPoint / 150);
    let butuhPoint = bisaTukar * 150;
    
    if(bisaTukar < 1) return alert("Tukar kelipatan 150 poin!");
    if(u.point < butuhPoint) return alert("Poin tidak cukup!");
    
    u.point -= butuhPoint; 
    let dapetHadiah = bisaTukar * 10; 
    simpanDB(); refreshProfil();
    
    let teksAsli = `${currentUser}|HADIAH_${bisaTukar}X|${KUNCI_RAHASIA}`;
    let kodeKlaim = btoa(teksAsli);
    alert(`Berhasil! Poin dipotong. Kirim kode rahasia ini ke WA Admin: ${kodeKlaim}`);
}

function verifikasiKode() {
    let kodeInput = document.getElementById("input-kode-admin").value;
    try {
        let data = atob(kodeInput).split("|"); 
        if(data[2] === KUNCI_RAHASIA) alert(`✅ KODE ASLI! \nUser: [${data[0]}] \nKlaim: [${data[1]}].`);
        else alert("❌ KODE PALSU!");
    } catch(e) { alert("❌ KODE RUSAK!"); }
}

// --- PSIKOLOGI MARKETING ---
const inisial = ['B', 'A', 'H', 'Z', 'M', 'R', 'S', 'D', 'W', 'K'];
const warnanya = ['#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#f1c40f'];

function generateLeaderboard() {
    const container = document.getElementById("leaderboard-container");
    container.innerHTML = ''; 
    
    let topAngka = activeGame === 'roblox' ? [2000, 1500, 1200, 1000, 800] : [15, 10, 8, 5, 3]; 
    let suffix = activeGame === 'roblox' ? 'Robux' : 'x WDP';
    let ikon = activeGame === 'roblox' ? '💎' : '🎟️';

    for (let i = 0; i < 5; i++) {
        let hRandom = inisial[Math.floor(Math.random()*inisial.length)] + "***";
        let c = warnanya[i];
        let item = document.createElement("div"); item.className = "list-item";
        item.innerHTML = `<div class="rank-badge">${i+1}</div><div class="ava-bulat ava-sultan" style="background:${c}">${hRandom[0]}</div>
            <div class="list-text"><b>${hRandom}</b><br><span style="color:#f1c40f;">${ikon} ${topAngka[i]} ${suffix}</span></div>`;
        container.appendChild(item);
    }
}

function jalankanLiveOrder() {
    let delay = Math.floor(Math.random() * (30000 - 1000)) + 1000;
    setTimeout(() => {
        let hRandom = inisial[Math.floor(Math.random()*inisial.length)] + "***";
        let c = warnanya[Math.floor(Math.random()*warnanya.length)];
        
        let dibeli = "";
        if(activeGame === 'roblox') {
            dibeli = (Math.floor(Math.random() * 10) + 1) * 50 + " Robux";
        } else {
            // HANYA 1x WDP ATAU 3x WDP (DIAMOND DIHAPUS)
            let itemMl = ["1x WDP", "3x WDP"];
            dibeli = itemMl[Math.floor(Math.random() * itemMl.length)];
        }

        let html = `<div class="ava-bulat ava-warga" style="background:${c}">${hRandom[0]}</div>
            <div class="list-text"><b>${hRandom}</b> baru membeli <b>${dibeli}</b><br><span style="color:var(--primary); font-size:10px;">Sedang diproses ⏳</span></div>`;
        
        let el = document.createElement("div"); el.className = "list-item item-baru"; el.innerHTML = html;
        let container = document.getElementById("testi-container");
        if(container) {
            container.insertBefore(el, container.firstChild);
            if (container.children.length > 15) container.removeChild(container.lastChild);
        }
        jalankanLiveOrder();
    }, delay);
}

window.onload = () => { generateLeaderboard(); jalankanLiveOrder(); refreshProfil(); };
