// --- DATABASE ---
let usersDB = JSON.parse(localStorage.getItem('usersDB')) || {};
let validResi = JSON.parse(localStorage.getItem('validResi')) || [];
let currentUser = localStorage.getItem('loggedInUser');
let activeDiscount = 0;
let activeVoucherUsed = false;
let activeGame = 'roblox'; 

let selectedItem = { nama: '', harga: 0, robux: 0 };
const KUNCI_RAHASIA = "ZONA2026BOS";
const KUNCI_UANG = "ZONAUANGCAIR"; // Khusus uang tunai

function simpanDB() { localStorage.setItem('usersDB', JSON.stringify(usersDB)); }

// --- TEMA (SAVE KE LOCALSTORAGE) ---
function initTema() {
    let mode = localStorage.getItem('temaWeb') || 'dark';
    if(mode === 'light') document.body.classList.remove('dark-mode');
    else document.body.classList.add('dark-mode');
}
function toggleTema() { 
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")) localStorage.setItem('temaWeb', 'dark');
    else localStorage.setItem('temaWeb', 'light');
}

// --- SIDEBAR & NAV ---
function toggleSidebar() { document.getElementById("sidebar").classList.toggle("active"); }

function setGame(game) {
    activeGame = game;
    document.querySelectorAll('.game-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + game).classList.add('active');

    if(game === 'mlbb') {
        document.body.classList.add('theme-mlbb');
        document.getElementById('topup-roblox').style.display = 'none';
        document.getElementById('topup-mlbb').style.display = 'block';
    } else {
        document.body.classList.remove('theme-mlbb');
        document.getElementById('topup-roblox').style.display = 'block';
        document.getElementById('topup-mlbb').style.display = 'none';
    }
    
    selectedItem = { nama: '', harga: 0, robux: 0 };
    document.getElementById("infoPajak-card").style.display = "none";
    document.querySelectorAll('.paket-card').forEach(c => c.classList.remove('active'));
    
    document.getElementById("testi-container").innerHTML = '';
    generateLeaderboard();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tabName).style.display = 'block';
    document.getElementById('nav-' + tabName).classList.add('active');
    if (tabName === 'profil' || tabName === 'arcade') refreshProfil();
    if (tabName === 'transaksi' && currentUser) document.getElementById('box-tukar-poin').style.display = 'block';
}

function toggleFaq(el) { el.classList.toggle('active'); }

// --- FITUR CEK PP ROBLOX & MANUAL ROBUX ---
function cekProfilRbx() {
    let user = document.getElementById("username-rbx").value;
    if(!user) return alert("Ketik Username Roblox lu dulu Bos!");
    document.getElementById("img-pp-rbx").src = "https://robohash.org/" + user + "?set=set3"; 
    document.getElementById("nama-pp-rbx").innerText = "✅ " + user + " (Ditemukan)";
    document.getElementById("profil-preview").style.display = "block";
}

function hitungManual() {
    let jumlah = parseInt(document.getElementById("input-robux-manual").value);
    if(!jumlah || jumlah < 10) return alert("Minimal order 10 Robux Bos!");
    
    let harga = jumlah * 150; 
    document.querySelectorAll('.paket-card').forEach(c => c.classList.remove('active'));
    
    selectedItem.nama = jumlah + " Robux (Manual)";
    selectedItem.harga = harga;
    selectedItem.robux = jumlah;
    updateBoxTotal();
}

// --- FITUR RATING & KOMENTAR SULTAN (REALISTIS) ---
let fakeReviews = [
    { nama: "SatriaGaming", star: 5, text: "Gila cepet banget sumpah, kirain nipu taunya real." },
    { nama: "iamking_pro", star: 5, text: "Amanah 100% bos, adminnya mantap!" },
    { nama: "BocilKematian", star: 5, text: "Murah parah, bisa buat modal gacha wkwk" },
    { nama: "xX_Slayer_Xx", star: 3, text: "Masuknya sekitar 5 menitan, kirain se-detik, tapi gapapa lah" },
    { nama: "Andi_Sad", star: 1, text: "Admin balesnya agak lama, mungkin lagi makan" }
];
let userReviews = JSON.parse(localStorage.getItem('userReviews')) || [];

function renderReviews() {
    let container = document.getElementById("review-list");
    container.innerHTML = "";
    let allRevs = userReviews.concat(fakeReviews);
    
    allRevs.forEach(r => {
        let stars = "⭐".repeat(r.star);
        container.innerHTML += `<div class="list-item" style="flex-direction: column; align-items: flex-start; padding: 8px; border-bottom: 1px solid var(--border-color); background: var(--input-bg); margin-bottom: 5px; border-radius: 6px;">
            <div style="font-size: 11px; font-weight: bold; color: var(--text-main);">${r.nama} <span style="font-size:9px;">${stars}</span></div>
            <div style="font-size: 10px; margin-top: 4px; color: #aaa;">"${r.text}"</div>
        </div>`;
    });
}

function tambahKomen() {
    let txt = document.getElementById("input-komen").value;
    let st = parseInt(document.getElementById("input-star").value);
    if(txt.length < 3) return alert("Komentar minimal 3 huruf Bos!");
    
    let nm = currentUser ? currentUser : "Tamu_" + Math.floor(Math.random()*99);
    userReviews.unshift({ nama: nm, star: st, text: txt }); 
    localStorage.setItem('userReviews', JSON.stringify(userReviews));
    
    document.getElementById("input-komen").value = "";
    renderReviews(); alert("✅ Ulasan berhasil ditambahkan!");
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
        usersDB[user] = { pass: pass, point: 999999, topup: 50, voucher: 10, rank: "Sultan", codes: [] }; simpanDB();
    }

    if(isLoginMode) {
        if(usersDB[user] && usersDB[user].pass === pass) {
            tutupModalAuth(); localStorage.setItem("loggedInUser", user); currentUser = user;
            alert("Login Berhasil!"); refreshProfil();
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

function refreshProfil() {
    if (currentUser && usersDB[currentUser]) {
        document.getElementById("view-belum-login").style.display = "none";
        document.getElementById("view-sudah-login").style.display = "block";
        document.getElementById("box-tukar-poin").style.display = "block";
        let u = usersDB[currentUser];
        
        document.getElementById("nama-profil").innerText = currentUser;
        document.getElementById("text-poin").innerText = "🪙 " + u.point;
        document.getElementById("text-topup").innerText = "🛒 " + u.topup + "x";
        document.getElementById("text-voucher").innerText = "🎫 " + u.voucher;
        document.getElementById("arcade-koin").innerText = u.point; // Update Koin Arcade
        
        let badge = document.getElementById("pangkat-badge");
        let ava = document.getElementById("ava-profil-utama");
        ava.className = ""; 
        if(u.point >= 150 || u.topup >= 15) { badge.innerText = "Sultan 👑"; badge.style.background = "#FF4500"; ava.classList.add("ava-sultan"); }
        else if(u.point >= 50 || u.topup >= 5) { badge.innerText = "Jagoan ✨"; badge.style.background = "#00FFFF"; badge.style.color = "#000"; ava.classList.add("ava-jagoan"); }
        else { badge.innerText = "Warga"; badge.style.background = "#8B4513"; ava.classList.add("ava-warga"); }

        if(u.voucher > 0) document.getElementById("box-pakai-voucher").style.display = "block"; 
        else document.getElementById("box-pakai-voucher").style.display = "none";

        if(currentUser === "hanifanbos01") document.getElementById("btn-panel-admin").style.display = "inline-block";
        else document.getElementById("btn-panel-admin").style.display = "none";
    } else {
        document.getElementById("view-belum-login").style.display = "block";
        document.getElementById("view-sudah-login").style.display = "none";
        document.getElementById("box-tukar-poin").style.display = "none";
        document.getElementById("arcade-koin").innerText = "0";
    }
}

// --- TRANSAKSI ---
function pilihPaket(tipeGame, namaItem, hargaAsli, elemen, jumlahRobux) {
    document.querySelectorAll('.paket-card').forEach(c => c.classList.remove('active'));
    elemen.classList.add('active'); 
    if(tipeGame === 'rbx') document.getElementById("input-robux-manual").value = "";
    selectedItem.nama = namaItem; selectedItem.harga = hargaAsli; selectedItem.robux = jumlahRobux;
    updateBoxTotal();
}

function updateBoxTotal() {
    let hargaDiskon = selectedItem.harga - (selectedItem.harga * (activeDiscount / 100));
    document.getElementById("hargaRupiah").innerText = "Rp " + hargaDiskon.toLocaleString("id-ID");
    
    let textDetail = `<span style="color:#2ecc71; font-weight:bold;">✔️ ${selectedItem.nama} | ${activeGame.toUpperCase()}</span>`;
    
    if(activeGame === 'roblox' && selectedItem.robux > 0) {
        let butuhGamepass = Math.ceil(selectedItem.robux / 0.7);
        textDetail += `<br><br><span style="color:#f1c40f; font-weight:bold; font-size:12px; display:block; padding:8px; background:rgba(241,196,15,0.1); border-radius:5px; border:1px dashed #f1c40f;">⚠️ PENTING: Atur Harga Gamepass akun lu senilai <b style="font-size:14px;">${butuhGamepass} Robux</b> biar pajaknya pas.</span>`;
    }

    document.getElementById("detail-item-pilihan").innerHTML = textDetail;
    document.getElementById("infoPajak-card").style.display = "block";
}

function klaimPromo() {
    if(!currentUser) return alert("Login dulu!");
    let code = document.getElementById("input-promo").value.toUpperCase();
    let u = usersDB[currentUser];
    if(["HANIFANTOPUP", "MARITOPUP"].includes(code)) {
        if(u.codes && u.codes.includes(code)) return alert("Kode ini udah pernah dipakai!");
        if(!u.codes) u.codes = [];
        u.codes.push(code); simpanDB(); activeDiscount = 15;
        alert("✅ Diskon 15% aktif."); 
        if(selectedItem.harga > 0) updateBoxTotal();
    } else alert("❌ Kode promo salah!");
}

function pakaiVoucher() {
    if(!currentUser || selectedItem.harga === 0) return;
    let u = usersDB[currentUser];
    if(u.voucher > 0) {
        activeVoucherUsed = true; activeDiscount = 10;
        updateBoxTotal(); alert("🎫 Voucher 10% Diaktifkan!");
    }
}

function pesanWaGlobal() {
    if(selectedItem.harga === 0) return alert("Pilih paket dulu Bos!");
    let userDetail = "";
    if(activeGame === 'roblox') {
        let userRbx = document.getElementById("username-rbx").value;
        let linkRbx = document.getElementById("link-rbx").value;
        if(!userRbx || !linkRbx) return alert("Lengkapi Username & Link Gamepass!");
        userDetail = `👤 Username: ${userRbx}%0A🔗 Link: ${linkRbx}`;
    } else {
        let idMl = document.getElementById("userid-mlbb").value;
        let zoneMl = document.getElementById("zoneid-mlbb").value;
        if(!idMl || !zoneMl) return alert("Lengkapi User ID dan Zone ID!");
        userDetail = `🎮 ID MLBB: ${idMl} (${zoneMl})`;
    }
    
    if(currentUser) {
        usersDB[currentUser].topup += 1;
        if(activeVoucherUsed) { usersDB[currentUser].voucher -= 1; activeVoucherUsed = false; activeDiscount = 0; }
        simpanDB(); refreshProfil();
    }
    
    let total = document.getElementById("hargaRupiah").innerText;
    let teks = `Halo Admin Zona! Order Masuk:%0A%0A📦 Game: ${activeGame.toUpperCase()}%0A💎 Item: ${selectedItem.nama}%0A💰 Total: ${total}%0A${userDetail}%0A%0A(Minta kode resi +25 Koin nya dong min!)`;
    window.open("https://wa.me/62895613282875?text=" + teks, "_blank");
}

// --- ADMIN POIN & TUKAR ---
function generateKodePoin() {
    let resiBaru = "ZN-" + Math.floor(1000 + Math.random() * 9000); 
    validResi.push(resiBaru); localStorage.setItem('validResi', JSON.stringify(validResi));
    document.getElementById("hasil-kode-poin").innerText = resiBaru;
}
function klaimResi() {
    if(!currentUser) return alert("Login dulu!");
    let resi = document.getElementById("input-resi").value.toUpperCase();
    if(validResi.includes(resi)) {
        validResi = validResi.filter(r => r !== resi); localStorage.setItem('validResi', JSON.stringify(validResi));
        usersDB[currentUser].point += 25; simpanDB(); alert("✅ Dapat +25 Koin Arcade!"); refreshProfil();
    } else alert("❌ Kode tidak valid / sudah terpakai!");
}
function verifikasiKode() {
    let kode = document.getElementById("input-kode-admin").value;
    try { let d = atob(kode).split("|"); if(d[2] === KUNCI_RAHASIA) alert(`✅ ASLI!\nUser: ${d[0]}\nItem: ${d[1]}`); else alert("❌ PALSU!"); } catch(e) { alert("❌ RUSAK!"); }
}
function verifikasiUang() {
    let kode = document.getElementById("input-kode-uang").value;
    try { let d = atob(kode).split("|"); if(d[2] === KUNCI_UANG) alert(`💵 ASLI UANG TUNAI!\nUser: ${d[0]}\nItem: ${d[1]}`); else alert("❌ PALSU/BUKAN UANG!"); } catch(e) { alert("❌ RUSAK!"); }
}

// --- MESIN ARCADE GACHA BRUTAL ---
const gachaRates = [
    { type: "cash50", chance: 0.05, color: "#0984e3", text: "50RB", msg: "GOD GAMBLER! 50 RIBU RUPIAH!" },
    { type: "robux100", chance: 0.5, color: "#d63031", text: "100R", msg: "DEWA! 100 Robux Gratis!" },
    { type: "v50", chance: 1.5, color: "#6c5ce7", text: "50%", msg: "MISTIS! Voucher Diskon 50%!" },
    { type: "coinbig", chance: 3.0, color: "#fdcb6e", text: "COIN", msg: "EPIC! Ratusan Koin Ekstra!" },
    { type: "cash2", chance: 5.0, color: "#00b894", text: "2RB", msg: "LUMAYAN! Uang Tunai 2 Ribu!" },
    { type: "v2", chance: 19.95, color: "#00cec9", text: "2%", msg: "TIDAK BIASA! Diskon 2%!" },
    { type: "coinsmall", chance: 25.0, color: "#ffeaa7", text: "COIN", msg: "LANGKA! Dapat Koin Kembalian!" },
    { type: "zonk", chance: 45.0, color: "#b2bec3", text: "ZONK", msg: "AMPAS! Coba lagi wkwk" }
];

let isGachaPlaying = false;

function spinGacha(kali) {
    if(!currentUser) return alert("Login dulu buat main Arcade!");
    let u = usersDB[currentUser];
    let harga = kali * 5;
    if(u.point < harga) return alert("Koin nggak cukup Bos! Top up dulu buat klaim koin.");
    if(isGachaPlaying) return;
    
    isGachaPlaying = true;
    u.point -= harga; simpanDB(); refreshProfil();
    
    // Animasi Capit Turun
    document.getElementById("claw-arm").style.height = "130px";
    document.getElementById("claw-hand").style.top = "150px";
    document.getElementById("particle-container").innerHTML = "";
    
    setTimeout(() => {
        // Tentukan Hasil (Kita ambil 1 hasil terakhir untuk animasi)
        let result;
        for(let i=0; i<kali; i++) {
            let rand = Math.random() * 100;
            let sum = 0;
            for(let r of gachaRates) {
                sum += r.chance;
                if(rand <= sum) { result = r; break; }
            }
        }
        
        let egg = document.getElementById("gacha-egg");
        egg.style.background = result.color;
        egg.innerText = result.text;
        
        if(result.type === 'cash50') egg.style.boxShadow = "0 0 20px #0984e3, inset 0 0 10px #fff";
        else egg.style.boxShadow = "inset 0 -10px 15px rgba(0,0,0,0.5)";

        // Capit naik bawa telur
        document.getElementById("claw-arm").style.height = "20px";
        document.getElementById("claw-hand").style.top = "20px";
        egg.classList.add("grabbed");
        
        setTimeout(() => {
            egg.classList.remove("grabbed");
            ledakanPartikel(result.type, result.color);
            
            // Logika Hadiah Masuk Akun
            if(result.type === 'v50' || result.type === 'v2') u.voucher += 1;
            if(result.type === 'coinbig') u.point += 100;
            if(result.type === 'coinsmall') u.point += 10;
            simpanDB(); refreshProfil();
            
            setTimeout(() => {
                alert(result.msg);
                if(result.type.includes('cash') || result.type === 'robux100') {
                    let kode = btoa(`${currentUser}|${result.text}|${result.type.includes('cash') ? KUNCI_UANG : KUNCI_RAHASIA}`);
                    alert(`Screenshot dan Kirim Kode ini ke Admin buat Cairin Hadiah:\n\n${kode}`);
                }
                isGachaPlaying = false;
            }, 500);
        }, 1000);
    }, 1000);
}

function ledakanPartikel(type, color) {
    let container = document.getElementById("particle-container");
    let amount = type === 'cash50' ? 50 : (type === 'zonk' ? 5 : 15);
    
    for(let i=0; i<amount; i++) {
        let p = document.createElement('div');
        p.className = 'particle';
        p.style.background = color;
        p.style.top = '40px'; p.style.left = '50%';
        let tx = (Math.random() - 0.5) * (type === 'cash50' ? 300 : 100) + 'px';
        let ty = (Math.random() - 0.5) * (type === 'cash50' ? 300 : 100) + 'px';
        p.style.setProperty('--tx', tx); p.style.setProperty('--ty', ty);
        container.appendChild(p);
    }
}

// --- LEADERBOARD ---
const namaSultan = ['iamking_pro', 'xX_Slayer_Xx', 'GachaAddict99', 'Bocil_Pro', 'Sultan_01'];
const warnanya = ['#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#f1c40f'];

function generateLeaderboard() {
    const container = document.getElementById("leaderboard-container");
    container.innerHTML = ''; 
    let topAngka = activeGame === 'roblox' ? [2500, 1500, 1200, 1000, 800] : [15, 10, 8, 5, 3]; 
    let suffix = activeGame === 'roblox' ? 'Robux' : 'x WDP';
    let ikon = activeGame === 'roblox' ? '💎' : '🎟️';

    for (let i = 0; i < 5; i++) {
        let item = document.createElement("div"); item.className = "list-item";
        item.innerHTML = `<div class="rank-badge">${i+1}</div><div class="ava-bulat ava-sultan" style="background:${warnanya[i]}">${namaSultan[i][0].toUpperCase()}</div>
            <div class="list-text"><b>${namaSultan[i]}</b><br><span style="color:#f1c40f; font-size:11px;">${ikon} ${topAngka[i]} ${suffix}</span></div>`;
        container.appendChild(item);
    }
}

function jalankanLiveOrder() {
    let delay = Math.floor(Math.random() * (30000 - 1000)) + 1000;
    setTimeout(() => {
        let inisial = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let hRandom = inisial[Math.floor(Math.random()*inisial.length)] + "***";
        let c = warnanya[Math.floor(Math.random()*warnanya.length)];
        let dibeli = activeGame === 'roblox' ? (Math.floor(Math.random() * 10) + 1) * 50 + " Robux" : (Math.random()>0.5 ? "1x WDP" : "3x WDP");

        let el = document.createElement("div"); el.className = "list-item item-baru";
        el.innerHTML = `<div class="ava-bulat ava-warga" style="background:${c}">${hRandom[0]}</div>
            <div class="list-text"><b>${hRandom}</b> beli <b>${dibeli}</b><br><span style="color:var(--primary); font-size:9px;">Diproses ⏳</span></div>`;
        
        let container = document.getElementById("testi-container");
        if(container) { container.insertBefore(el, container.firstChild); if (container.children.length > 8) container.removeChild(container.lastChild); }
        jalankanLiveOrder();
    }, delay);
}

window.onload = () => { initTema(); generateLeaderboard(); jalankanLiveOrder(); refreshProfil(); renderReviews(); };
