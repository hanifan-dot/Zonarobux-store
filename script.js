let usersDB = JSON.parse(localStorage.getItem('usersDB')) || {};
let validResi = JSON.parse(localStorage.getItem('validResi')) || [];
let currentUser = localStorage.getItem('loggedInUser');
let activeDiscount = 0;
let activeVoucherUsed = false;

// KATA SANDI RAHASIA ADMIN (Jangan disebar ke pelanggan)
const KUNCI_RAHASIA = "ZONA2026BOS";
const kodePromoValid = ["HANIFANTOPUP", "MARITOPUP", "ZONAROBUXAMBYAR"];

function simpanDB() { localStorage.setItem('usersDB', JSON.stringify(usersDB)); }

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tabName).style.display = 'block';
    document.getElementById('nav-' + tabName).classList.add('active');
    if (tabName === 'profil') refreshProfil();
    if (tabName === 'topup' && currentUser) document.getElementById('box-tukar-poin').style.display = 'block';
}
function toggleSidebar() { document.getElementById("sidebar").classList.toggle("active"); }
function toggleTema() { document.body.classList.toggle("light-mode"); }

let isLoginMode = false;
function bukaModalAuth() { toggleSidebar(); document.getElementById("modal-auth").style.display = "flex"; }
function tutupModalAuth() { document.getElementById("modal-auth").style.display = "none"; }
function switchAuth() {
    isLoginMode = !isLoginMode;
    document.getElementById("modal-title").innerText = isLoginMode ? "Login Akun Resmi" : "Buat Akun Resmi";
    document.getElementById("switch-text").innerText = isLoginMode ? "Belum punya akun? Daftar" : "Sudah punya akun? Login";
}

function cekUsername(val) {
    if(isLoginMode) return;
    let error = document.getElementById("error-user");
    let input = document.getElementById("reg-user");
    let kataKasar = ['anjing', 'babi', 'goblok', 'kontol', 'memek'];
    if(kataKasar.some(k => val.toLowerCase().includes(k))) { error.innerText = "❌ Username dilarang!"; input.style.borderColor = "#ff3b30"; } 
    else if(val.length > 0 && val.length < 5) { error.innerText = "⚠️ Minimal 5 karakter."; input.style.borderColor = "yellow"; } 
    else { error.innerText = "✅ Username aman."; input.style.borderColor = "#2ecc71"; }
}

function prosesAuth() {
    let user = document.getElementById("reg-user").value;
    let pass = document.getElementById("reg-pass").value;
    if(user.length < 5) return alert("Min 5 karakter!");
    
    // AKUN SUPER RAHASIA ADMIN
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
            document.querySelector(".teks-hore").innerHTML = `🎉 Selamat Datang!<br>Berhasil Login 🎆`;
            setTimeout(() => { petasan.style.opacity = "0"; setTimeout(() => { petasan.style.display = "none"; refreshProfil(); }, 1000); }, 2000);
        } else alert("❌ Username/Password salah!");
    } else {
        if(usersDB[user]) alert("❌ Username sudah terdaftar!");
        else {
            usersDB[user] = { pass: pass, point: 0, topup: 0, voucher: 0, rank: "Warga", codes: [] };
            simpanDB(); alert("✅ Akun dibuat!"); switchAuth();
        }
    }
}
function logout() { localStorage.removeItem("loggedInUser"); currentUser = null; activeDiscount = 0; alert("Logout!"); refreshProfil(); }

function updateRank(userData) {
    let oldRank = userData.rank;
    if(userData.point >= 150 || userData.topup >= 15) userData.rank = "Sultan";
    else if(userData.point >= 50 || userData.topup >= 5) userData.rank = "Jagoan";
    else userData.rank = "Warga";
    
    if(oldRank !== userData.rank && userData.rank !== "Warga") {
        userData.voucher += 1; 
        alert(`🎉 Selamat! Naik pangkat jadi ${userData.rank}. Dapat 1 Voucher!`);
    }
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

        if(u.voucher > 0) { document.getElementById("box-timer").style.display = "block"; document.getElementById("box-pakai-voucher").style.display = "block"; } 
        else { document.getElementById("box-timer").style.display = "none"; document.getElementById("box-pakai-voucher").style.display = "none"; }

        // MUNCULIN TOMBOL ADMIN CUMA BUAT LU
        if(currentUser === "hanifanbos01") {
            document.getElementById("btn-panel-admin").style.display = "inline-block";
        } else {
            document.getElementById("btn-panel-admin").style.display = "none";
        }
    } else {
        document.getElementById("view-belum-login").style.display = "block";
        document.getElementById("view-sudah-login").style.display = "none";
        document.getElementById("box-tukar-poin").style.display = "none";
    }
}

function klaimPromo() {
    if(!currentUser) return alert("Login dulu Bos!");
    let code = document.getElementById("input-promo").value.toUpperCase();
    let u = usersDB[currentUser];
    if(kodePromoValid.includes(code)) {
        if(u.codes.includes(code)) return alert("Kode ini udah pernah lu pakai!");
        u.codes.push(code); simpanDB(); activeDiscount = 15;
        alert("✅ Berhasil! Diskon 15% aktif."); hitungPajak(document.getElementById("nominal").value);
    } else alert("❌ Kode promo salah/hangus!");
}

function pakaiVoucher() {
    if(!currentUser) return;
    let u = usersDB[currentUser];
    if(u.voucher > 0) {
        activeVoucherUsed = true; activeDiscount = 10;
        alert("🎫 Voucher 10% Diaktifkan!"); hitungPajak(document.getElementById("nominal").value);
    }
}

// --- FUNGSI KRIPTOGRAFI & TUKAR POIN ---
function buatKodeEnkripsi(user, robux) {
    // Format: Username|JumlahRobux|KunciRahasia
    let teksAsli = `${user}|${robux}|${KUNCI_RAHASIA}`;
    return btoa(teksAsli); // btoa adalah fungsi Javascript buat ngubah teks jadi sandi Base64
}

function tukarPoin() {
    if(!currentUser) return;
    let u = usersDB[currentUser];
    let inputPoint = parseInt(document.getElementById("input-tukar-poin").value);
    let notif = document.getElementById("notif-poin");

    if(!inputPoint || inputPoint <= 0) return;
    
    let bisaTukar = Math.floor(inputPoint / 150);
    let butuhPoint = bisaTukar * 150;
    
    if(bisaTukar < 1 || inputPoint < 150) {
        notif.innerText = "Tukar minimal 150 poin untuk 10 Robux!";
    } else if (u.point < butuhPoint) {
        notif.innerText = "Point kamu gak cukup! Ayok top up lagi.";
    } else {
        u.point -= butuhPoint; 
        let dapetRobux = bisaTukar * 10;
        simpanDB(); refreshProfil();
        
        // BIKIN KODE RAHASIA
        let kodeKlaim = buatKodeEnkripsi(currentUser, dapetRobux);
        
        let teksWA = `Halo Admin Zona Robux!%0ASaya mau tukar poin nih.%0A👤 User: ${currentUser}%0A🎁 Klaim: ${dapetRobux} Robux%0A🔑 Kode Rahasia: ${kodeKlaim}%0A%0ATolong dicek ya min!`;
        
        alert(`🎉 Tukar Berhasil! Poin dipotong ${butuhPoint}. Kirim kode rahasia ke WA Admin buat klaim Robux!`);
        window.open("https://wa.me/6289672344059?text=" + teksWA, "_blank");
    }
}

// --- MESIN VERIFIKASI ADMIN ---
function verifikasiKode() {
    let kodeInput = document.getElementById("input-kode-admin").value;
    try {
        // Menerjemahkan sandi
        let teksAsli = atob(kodeInput); 
        let data = teksAsli.split("|"); // Misahin teks pakai garis lurus "|"
        
        // Ngecek apakah Kata Sandinya cocok
        if(data[2] === KUNCI_RAHASIA) {
            alert(`✅ KODE ASLI! \nUser [ ${data[0]} ] berhak dikirimkan [ ${data[1]} Robux ]. \nBuruan proses Bos!`);
        } else {
            alert("❌ KODE PALSU! Bocil ini nyoba nipu lu, sandinya beda!");
        }
    } catch(e) {
        alert("❌ KODE RUSAK/PALSU! Format nggak kebaca sistem.");
    }
}

function klaimResi() {
    if(!currentUser) return alert("Login dulu!");
    let resi = document.getElementById("input-resi").value;
    if(validResi.includes(resi)) {
        validResi = validResi.filter(r => r !== resi); localStorage.setItem('validResi', JSON.stringify(validResi));
        usersDB[currentUser].point += 10; simpanDB(); alert("✅ Resi valid! Dapat +10 Poin."); refreshProfil();
    } else alert("❌ Resi tidak valid / kadaluarsa!");
}

function pilihPaket(jumlah, elemen) {
    document.querySelectorAll('.paket-card').forEach(c => c.classList.remove('active'));
    elemen.classList.add('active'); document.getElementById("nominal").value = jumlah; hitungPajak(jumlah);
}
function hitungPajak(nominal) {
    if(nominal > 0) {
        let hargaGamepass = Math.ceil(nominal / 0.7);
        let hargaAsli = nominal * 150;
        let hargaDiskon = hargaAsli - (hargaAsli * (activeDiscount / 100));
        document.getElementById("hargaGamepass").innerText = hargaGamepass;
        document.getElementById("hargaRupiah").innerText = "Rp " + hargaDiskon.toLocaleString("id-ID");
        if(activeDiscount > 0) document.getElementById("label-diskon").innerText = `(Diskon ${activeDiscount}%)`;
        document.getElementById("infoPajak").style.display = "block";
    }
}

function pesanWa() {
    let user = document.getElementById("username").value;
    let nominal = document.getElementById("nominal").value;
    let link = document.getElementById("link").value;
    if(!user || !nominal || !link) return alert("Lengkapi data!");
    
    if(currentUser) {
        usersDB[currentUser].topup += 1;
        if(usersDB[currentUser].topup % 5 === 0) usersDB[currentUser].voucher += 1; 
        if(activeVoucherUsed) { usersDB[currentUser].voucher -= 1; activeVoucherUsed = false; activeDiscount = 0; }
        simpanDB(); refreshProfil();
    }
    let resiBaru = "ZR-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    validResi.push(resiBaru); localStorage.setItem('validResi', JSON.stringify(validResi));
    
    let total = document.getElementById("hargaRupiah").innerText;
    let teks = `Halo Admin Hanifan!%0A👤 User: ${user}%0A💎 Beli: ${nominal} Robux%0A💰 Total: ${total}%0A🔗 Link: ${link}%0A🧾 Resi: ${resiBaru}`;
    alert(`Pesanan Dibuat! KODE RESI kamu: ${resiBaru}. Copy resi ini dan klaim di tab Transaksi buat dapet 10 Poin!`);
    window.open("https://wa.me/6289672344059?text=" + teks, "_blank");
}

const nDepan = ['M', 'R', 'A', 'K', 'S', 'D', 'B', 'H', 'F', 'L', 'Z', 'N'];
const nBelakang = ['D', 'A', 'N', 'I', 'S', 'O', 'R', 'K', 'L', 'M', 'W', 'Y'];
const warnanya = ['#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#f1c40f'];

function generateLeaderboard() {
    const container = document.getElementById("leaderboard-container");
    const robuxTop = [2000, 1500, 1200, 1000, 1000]; 
    for (let i = 0; i < 5; i++) {
        let hRandom = nDepan[Math.floor(Math.random()*nDepan.length)] + "***";
        let item = document.createElement("div"); item.className = "list-item";
        item.innerHTML = `<div class="rank-badge">${i+1}</div><div class="ava-bulat ava-sultan" style="background:${warnanya[i]}">${hRandom[0]}</div>
            <div class="list-text"><b>${hRandom}</b><br><span style="color:#f1c40f;">💎 ${robuxTop[i]} Robux</span></div>`;
        container.appendChild(item);
    }
}

function jalankanLiveOrder() {
    let delay = Math.floor(Math.random() * (45000 - 1000)) + 1000;
    setTimeout(() => {
        let hRandom = nDepan[Math.floor(Math.random()*nDepan.length)] + "***";
        let rb = (Math.floor(Math.random() * 10) + 1) * 50;
        let c = warnanya[Math.floor(Math.random()*warnanya.length)];
        let html = `<div class="ava-bulat ava-warga" style="background:${c}">${hRandom[0]}</div>
            <div class="list-text"><b>${hRandom}</b> membeli <b>${rb} Robux</b><br><span style="color:#2ecc71; font-size:10px;">Sedang diproses ⏳</span></div>`;
        
        let el = document.createElement("div"); el.className = "list-item item-baru"; el.innerHTML = html;
        let container = document.getElementById("testi-container");
        container.insertBefore(el, container.firstChild);
        if (container.children.length > 20) container.removeChild(container.lastChild);
        jalankanLiveOrder();
    }, delay);
}

// Cek Avatar Roblox 
async function cekProfile() {
    let username = document.getElementById("username").value;
    let profileBox = document.getElementById("profile-box");
    if(!username) return alert("Isi username dulu!");
    try {
        let res = await fetch("https://corsproxy.io/?" + encodeURIComponent("https://users.roblox.com/v1/usernames/users"), {
            method: "POST", headers: { "accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ "usernames": [username], "excludeBannedUsers": true })
        });
        let data = await res.json();
        if (data.data && data.data.length > 0) {
            let id = data.data[0].id, name = data.data[0].name;
            let avaRes = await fetch("https://corsproxy.io/?" + encodeURIComponent(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png&isCircular=true`));
            let avaData = await avaRes.json();
            if (avaData.data && avaData.data.length > 0) {
                document.getElementById("avatar-img").src = avaData.data[0].imageUrl;
                document.getElementById("display-name").innerText = name;
                profileBox.style.display = "flex";
            }
        } else alert("Username tidak ditemukan!");
    } catch (e) { alert("Server sedang sibuk."); }
}

window.onload = () => { generateLeaderboard(); jalankanLiveOrder(); refreshProfil(); };
