"use strict";
/* Dunia Kotak v3 — senjata, granat, gore, kendaraan, markas, kedai, dll */
const EX2=(function(){
const A=EX.api,S=A.S,TYPES=A.TYPES,NAMES=A.NAMES,SFX=A.SFX,B=A.B;
const $$=id=>document.getElementById(id);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
function el(tag,at,parent){const e=document.createElement(tag);if(at)for(const k in at){if(k==="text")e.textContent=at[k];else if(k==="class")e.className=at[k];else e.setAttribute(k,at[k]);}if(parent)parent.appendChild(e);return e;}
const X={gore:"full",ok18:false,look:{skin:1,hair:0,shirt:0,pants:0,shoes:0,hat:0,face:0,naked:0,preset:-1},q:{day:0,list:[],prog:{},done:{}},chestOpen:{},stolen:{},stolenDay:0,bossDead:false,chests:{},cur:0,wasDead:false,w:{al:0,ar:0,ll:0,lr:0,eye:0,n:0,sp:[],heal:0,bl:0},cr:{},drive:0,alertT:0,fish:null,chute:false,holdFire:false,fuel:100,bloodMoon:false,nightPrev:false,sirenT:0,bmT:0,gT:0};
const mobs=()=>A.mobs();
const count=id=>A.count(id);

/* ================= Data barang ================= */
// [id,nama,ammo,dmg,cd,pel,spread,range,snd,warna,panjang,auto,efek,warna peluru]
const GL=[
[129,"Pistol",130,7,.34,1,.01,60,"pistol",[.12,.12,.14],5,0,null,[1,.9,.5]],
[150,"Revolver",130,14,.7,1,.005,70,"rev",[.3,.3,.34],6,0,null,[1,.9,.5]],
[151,"Pistol Gurun",130,18,.8,1,.008,70,"rev",[.8,.7,.35],7,0,null,[1,.9,.5]],
[152,"Pistol Ganda",130,6,.16,1,.03,50,"pistol",[.2,.2,.24],5,0,null,[1,.9,.5]],
[153,"SMG",130,4,.09,1,.04,45,"smg",[.15,.15,.18],7,1,null,[1,.9,.5]],
[154,"Uzi",130,3.5,.07,1,.05,40,"smg",[.25,.25,.28],6,1,null,[1,.9,.5]],
[155,"Senapan Serbu",138,6,.11,1,.025,70,"rifle",[.2,.25,.2],11,1,null,[1,.85,.4]],
[156,"AK",138,8,.13,1,.035,70,"rifle",[.45,.3,.15],11,1,null,[1,.85,.4]],
[157,"Senapan Tempur",138,10,.2,1,.015,80,"rifle",[.3,.32,.3],12,1,null,[1,.85,.4]],
[158,"Karabin",138,9,.25,1,.01,80,"rifle",[.4,.3,.2],10,0,null,[1,.85,.4]],
[159,"Runduk",138,35,1.2,1,0,150,"sniper",[.15,.2,.15],14,0,null,[1,1,.8]],
[160,"Shotgun",137,5,.9,8,.12,22,"shotgun",[.4,.25,.12],11,0,null,[1,.8,.4]],
[161,"Shotgun Ganda",137,5,.7,10,.14,20,"shotgun",[.3,.2,.1],11,0,null,[1,.8,.4]],
[162,"Pump",137,6,.6,7,.1,25,"shotgun",[.35,.35,.38],12,0,null,[1,.8,.4]],
[163,"Minigun",138,3,.045,1,.07,60,"mini",[.25,.25,.28],13,1,null,[1,.85,.4]],
[164,"LMG",138,5,.08,1,.045,70,"rifle",[.2,.2,.24],13,1,null,[1,.85,.4]],
[165,"Pistol Laser",139,8,.3,1,0,80,"laser",[.2,.3,.5],6,0,null,[1,.2,.2]],
[166,"Senapan Plasma",139,12,.35,1,0,80,"plasma",[.3,.2,.5],10,0,null,[.4,1,.5]],
[167,"Pistol Es",139,6,.3,1,.01,60,"ice",[.5,.75,.9],6,0,"slow",[.6,.9,1]],
[168,"Pistol Api",139,5,.15,1,.04,18,"fire",[.8,.3,.1],6,1,"burn",[1,.5,.1]],
[169,"Pistol Racun",139,4,.4,1,.01,50,"poison",[.3,.6,.2],6,0,"poison",[.5,1,.2]],
[170,"Pistol Petir",139,9,.6,1,0,60,"zap",[.9,.8,.2],6,0,"chain",[1,1,.5]],
[171,"Railgun",139,60,1.6,1,0,200,"rail",[.2,.2,.3],13,0,null,[.5,.8,1]],
[172,"Pistol Konfeti",130,1,.2,1,.02,40,"pop",[.9,.4,.7],5,0,"confetti",[1,.5,.8]],
[173,"Pistol Ayam",130,2,.5,1,.02,40,"cluck",[.95,.95,.9],5,0,"chicken",[1,1,1]]];
const GUN={};for(const g of GL)GUN[g[0]]={id:g[0],n:g[1],ammo:g[2],dmg:g[3],cd:g[4],pel:g[5],spr:g[6],rng:g[7],snd:g[8],col:g[9],len:g[10],auto:g[11],fx:g[12],tc:g[13]};
const AMMO={130:"Peluru",137:"Peluru shotgun",138:"Peluru senapan",139:"Sel energi"};
// granat [id,nama,fuse,warna]
const GRL=[[180,"Granat Biasa",2.2,[.3,.4,.25]],[181,"Granat Asap",1.8,[.6,.6,.65]],[182,"Granat Kilat",1.6,[.95,.95,.7]],[183,"Granat Api",2,[.9,.4,.1]],[184,"Granat Es",2,[.5,.8,1]],
[185,"Granat Lengket",2.4,[.4,.7,.2]],[186,"Granat Magnet",2.6,[.7,.2,.2]],[187,"Granat Racun",2,[.4,.8,.2]],[188,"Granat Badut",1.8,[1,.4,.8]],[189,"Granat Ayam",2,[.95,.9,.8]]];
const GR={};for(const g of GRL)GR[g[0]]={id:g[0],n:g[1],fuse:g[2],col:g[3]};
const VEH={car:{n:"Mobil",max:24,acc:2.2,turn:1.9,hp:120,item:195},jeep:{n:"Jip",max:19,acc:2.0,turn:1.8,hp:160,item:196},truck:{n:"Truk",max:16,acc:1.4,turn:1.4,hp:240,item:198},skate:{n:"Skateboard",max:21,acc:3.5,turn:2.8,hp:45,item:199,board:1,jump:7.5},bike:{n:"Motor",max:28,acc:3.0,turn:2.6,hp:70,item:197},
  horse:{n:"Kuda",max:12,acc:3.0,turn:2.4,hp:0,jump:9.5,animal:1},pig:{n:"Babi",max:5.5,acc:3.0,turn:2.8,hp:0,jump:6.5,animal:1}};
const VITEM={199:"skate",195:"car",196:"jeep",197:"bike",198:"truck"};

const N2={137:"Peluru shotgun",138:"Peluru senapan",139:"Sel energi",140:"Koin",190:"Parasut",191:"Jetpack",192:"Pancing",193:"Ikan mentah",194:"Ikan bakar",195:"Mobil",196:"Jip",197:"Motor",198:"Truk",199:"Skateboard",18:"TNT",19:"Peti",20:"Rak toko",21:"Trampolin"};
for(const g of GL)N2[g[0]]=g[1];for(const g of GRL)N2[g[0]]=g[1];Object.assign(NAMES,N2);
A.FOOD[193]=3;A.FOOD[194]=7;A.SMELT[193]=194;
Object.assign(A.HARD,{18:0.3,19:1.0,20:0.8,21:0.5});
for(const b of[18,19,20,21])A.PLAIN.add(b);
A.PASSIVE.pig=1;A.PASSIVE.horse=1;
const C=A.CAT_IDS;
C.Blok.push(18,19,20,21);C.Senjata.push(...GL.map(g=>g[0]).filter(i=>i!==129),137,138,139);C.Granat=GRL.map(g=>g[0]);
C.Lainnya.push(199,140,190,191,192,193,194,195,196,197,198);A.CATS.push("Granat");
C.Semua=[].concat(C.Blok,C.Alat,C.Senjata,C.Granat,C.Armor,C.Lainnya);
(function recipes(){
  const R=(out,n,cost,cat)=>A.RECIPES.push({out,n,cost,table:1,cat});
  const gc={150:{111:4,8:1},151:{111:6,8:1},152:{111:6,8:2},153:{111:7,109:2},154:{111:6,109:2},155:{111:10,109:2,8:2},156:{111:10,109:3,8:3},157:{111:12,109:3},158:{111:8,8:3},159:{111:14,10:4,8:2},
   160:{111:7,8:4},161:{111:9,8:5},162:{111:8,8:4,109:1},163:{111:24,109:6},164:{111:16,109:4},165:{111:6,10:3,109:2},166:{111:12,10:5,109:3},167:{111:6,10:2,109:1},168:{111:6,109:4},
   169:{111:6,109:2,132:2},170:{111:8,10:3,109:3},171:{111:30,10:8,109:8},172:{111:4,15:3},173:{111:4,101:3,132:2}};
  for(const id in gc)R(+id,1,gc[id],"Senjata");
  R(137,4,{111:1,109:1},"Senjata");R(138,10,{111:1,109:1},"Senjata");R(139,6,{111:1,10:1},"Senjata");
  const gr={180:{111:2,109:2},181:{111:1,109:1,4:2},182:{111:1,10:2},183:{111:1,109:3},184:{111:1,15:1,10:1},185:{111:2,109:2,102:1},186:{111:3,109:1},187:{111:1,109:1,132:2},188:{111:1,15:2,109:1},189:{111:1,109:1,101:2}};
  for(const id in gr)R(+id,1,gr[id],"Granat");
  R(18,2,{109:4,4:4},"Blok");R(19,1,{8:8},"Blok");R(20,2,{8:4},"Blok");R(21,1,{15:4,111:2},"Blok");
  R(190,1,{15:6,108:4},"Lainnya");R(191,1,{111:12,109:4,10:2},"Lainnya");R(192,1,{108:3,15:1},"Lainnya");
  R(195,1,{111:24,10:8},"Lainnya");R(196,1,{111:30,8:12},"Lainnya");R(197,1,{111:10,8:4},"Lainnya");R(199,1,{8:3,111:2},"Lainnya");R(198,1,{111:40,8:20,10:10},"Lainnya");
})();

/* ================= Tekstur blok baru ================= */
function tiles(g){
  let rs=4242;const r=()=>{rs=(Math.imul(rs,1103515245)+12345)&0x7fffffff;return rs/0x7fffffff;};
  const T=(t,fn)=>{const im=g.createImageData(16,16);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const c=fn(x,y,r()),i=(y*16+x)*4;im.data[i]=c[0];im.data[i+1]=c[1];im.data[i+2]=c[2];im.data[i+3]=c.length>3?c[3]:255;}g.putImageData(im,(t%4)*16,(t>>2)*16);};
  const v=(c,n,a)=>[c[0]+n*a,c[1]+n*a,c[2]+n*a];
  T(28,(x,y,n)=>{if(y<3||y>12)return v([230,230,225],n-.5,10);if(y===7&&x>4&&x<11)return[30,30,30];return v([200,40,40],n-.5,24);});
  T(29,(x,y,n)=>{const d=Math.hypot(x-7.5,y-7.5);return d<3?v([240,240,240],n-.5,10):d<4.5?v([30,30,30],n-.5,10):v([200,40,40],n-.5,24);});
  T(30,(x,y,n)=>{const e=x===0||y===0||x===15||y===15;if(x>=6&&x<=9&&y>=6&&y<=9)return v([220,190,60],n-.5,20);if(y===7||y===8)return v([60,40,20],n-.5,12);return v(e?[90,60,30]:[150,100,50],n-.5,28);});
  T(31,(x,y,n)=>{const e=x===0||y===0||x===15||y===15;return v(e?[90,60,30]:[150,100,50],n-.5,28);});
  T(32,(x,y,n)=>{if(y===5||y===10||y===15||y===0)return v([100,70,40],n-.5,20);const cols=[[190,50,50],[50,120,190],[60,170,70],[220,190,60]];return v(cols[(x>>2)%4],n-.5,24);});
  T(33,(x,y,n)=>{const e=x<2||y<2||x>13||y>13;return e?v([40,40,48],n-.5,14):((x+y)%4===0?v([230,230,235],n-.5,10):v([40,110,210],n-.5,24));});
  T(34,(x,y,n)=>v(y<4?[40,110,210]:[50,50,58],n-.5,18));
  Object.assign(TILES,{18:[29,28,29],19:[31,30,31],20:[9,32,9],21:[33,34,34]});
}

/* ================= Ikon barang ================= */
const px=(g,c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w||1,h||1);};
const css=c=>"rgb("+(c[0]*255|0)+","+(c[1]*255|0)+","+(c[2]*255|0)+")";
const shd=(c,k)=>css([Math.min(1,c[0]*k),Math.min(1,c[1]*k),Math.min(1,c[2]*k)]);
function icon(g,id){
  const gn=GUN[id];
  if(gn){const c=gn.col,L=Math.min(13,gn.len);
    px(g,shd(c,.6),1+(14-L>>1),6,L,4);px(g,css(c),1+(14-L>>1),6,L,2);px(g,shd(c,.5),3,10,3,5);px(g,shd(c,.8),2+(14-L>>1)+L-1,5,2,2);
    if(gn.fx||gn.snd==="laser"||gn.snd==="plasma"||gn.snd==="zap"||gn.snd==="rail"){px(g,css(gn.tc),4,7,5,1);}
    if(L>=10){px(g,"#222",L-3,10,2,3);}
    return true;}
  const gr=GR[id];
  if(gr){const c=gr.col;for(let y=4;y<=14;y++)for(let x=3;x<=13;x++){const d=Math.hypot(x-8,y-9.5);if(d<5)px(g,d>3.8?shd(c,.55):css(c),x,y);}
    px(g,"#777",7,3,3,2);px(g,"#bbb",10,3,3,1);px(g,"#bbb",12,3,1,3);px(g,shd(c,1.4),6,7,2,2);return true;}
  switch(id){
    case 137:for(let k=0;k<2;k++){px(g,"#c0392b",4+k*5,6,4,8);px(g,"#d4a63a",4+k*5,12,4,2);}return true;
    case 138:for(let k=0;k<3;k++){px(g,"#c9a24a",3+k*4,8,3,6);px(g,"#8a8a90",3+k*4,4,3,4);}return true;
    case 139:for(let k=0;k<2;k++){px(g,"#2ad4e6",4+k*5,5,4,9);px(g,"#fff",5+k*5,6,1,5);}return true;
    case 140:for(let y=3;y<=14;y++)for(let x=3;x<=13;x++){const d=Math.hypot(x-8,y-8.5);if(d<5.2)px(g,d>4?"#a67c00":d>2.6?"#f0c030":"#ffe066",x,y);}px(g,"#a67c00",7,6,2,5);return true;
    case 190:for(let x=2;x<=13;x++){px(g,x%4<2?"#e03030":"#f4f4f4",x,3+(Math.abs(x-7.5)>4?1:0),1,3);}for(const x of[3,7,12])px(g,"#eee",x,8,1,5);px(g,"#3a6ad0",6,13,3,2);return true;
    case 191:px(g,"#7a7d85",3,3,4,10);px(g,"#7a7d85",9,3,4,10);px(g,"#555",3,12,4,2);px(g,"#555",9,12,4,2);px(g,"#e8742a",4,14,2,2);px(g,"#e8742a",10,14,2,2);return true;
    case 192:for(let i=0;i<10;i++)px(g,"#7a5230",3+i,12-i,1,1);for(let i=0;i<5;i++)px(g,"#ddd",13,3+i,1,1);px(g,"#e03030",12,9,2,2);return true;
    case 193:case 194:{const c=id===193?["#8aa8c0","#c8dff0"]:["#a8683c","#d09050"];px(g,c[0],3,6,9,5);px(g,c[1],4,6,6,2);px(g,c[0],12,5,2,2);px(g,c[0],12,10,2,2);px(g,"#111",5,7,1,1);return true;}
    case 199:px(g,"#d8a030",2,9,12,2);px(g,"#c03030",3,8,10,1);px(g,"#222",3,11,3,3);px(g,"#222",10,11,3,3);return true;
    case 195:case 196:case 197:case 198:{const c=id===195?"#d03030":id===196?"#4a6a3a":id===197?"#3a3a40":"#c08030";
      if(id===197){px(g,c,3,9,10,2);px(g,"#222",2,10,4,4);px(g,"#222",10,10,4,4);px(g,"#d03030",6,6,4,3);}
      else{px(g,c,2,7,12,5);px(g,shd([.8,.8,.8],1),5,4,6,3);px(g,"#9cd",6,5,4,2);px(g,"#222",3,12,3,3);px(g,"#222",10,12,3,3);}return true;}
  }
  return false;
}
function describe(id){
  const g=GUN[id];if(g)return g.n+" · damage "+g.dmg+(g.pel>1?" ×"+g.pel:"")+" · jarak "+g.rng+" · "+AMMO[g.ammo]+(g.auto?" · otomatis (tahan Serang)":"")+(g.fx?" · efek "+({slow:"beku",burn:"api",poison:"racun",chain:"petir",confetti:"konfeti",chicken:"ayam"})[g.fx]:"");
  const r=GR[id];if(r)return r.n+" · tekan Serang untuk melempar";
  const D={140:"Koin · mata uang kedai",190:"Parasut · otomatis terbuka saat jatuh jauh",191:"Jetpack · tahan Lompat di udara, bahan bakar batu bara",192:"Pancing · bidik air lalu tekan Pasang",193:"Ikan mentah · bisa dimasak di tungku",194:"Ikan bakar · makan: +7 lapar",
   195:"Mobil · tekan Pasang untuk menaruh",196:"Jip · tekan Pasang untuk menaruh",197:"Motor · tekan Pasang untuk menaruh",198:"Truk · tekan Pasang untuk menaruh",199:"Skateboard · Lompat = ollie",18:"TNT · tekan Pasang pada TNT untuk menyalakan",19:"Peti",20:"Rak toko",21:"Trampolin · pantulkan dirimu",137:"Peluru shotgun",138:"Peluru senapan",139:"Sel energi · amunisi senjata energi"};
  return D[id]||null;
}
function gunInfo(h,surv){const g=GUN[h];if(g)return" · 🔫 "+(surv?count(g.ammo):"∞");if(GR[h])return" · 💣 "+(surv?count(h):"∞");return"";}
const weapon=()=>{const h=A.held();return !!(GUN[h]||GR[h]);};

/* ================= Suara ================= */
let bus=null,voices=0;
function makeIR(ac){const n=Math.floor(ac.sampleRate*0.8),b=ac.createBuffer(2,n,ac.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);let lp=0;for(let i=0;i<n;i++){const t=i/n;lp+=(Math.random()*2-1-lp)*0.35;d[i]=lp*Math.pow(1-t,3.2)*(i<200?i/200:1);}}return b;}
function getBus(){
  const ac=A.ac();if(!ac)return null;if(bus&&bus.ctx===ac)return bus;
  const g=ac.createGain();g.gain.value=0.85;const sh=ac.createWaveShaper(),cv=new Float32Array(256);for(let i=0;i<256;i++)cv[i]=Math.tanh((i/128-1)*2.6);sh.curve=cv;
  const cp=ac.createDynamicsCompressor();cp.threshold.value=-18;cp.knee.value=8;cp.ratio.value=8;cp.attack.value=0.002;cp.release.value=0.2;
  g.connect(sh);sh.connect(cp);cp.connect(A.master());
  const cn=ac.createConvolver();cn.buffer=makeIR(ac);const send=ac.createGain();send.gain.value=0.3;cp.connect(send);send.connect(cn);cn.connect(A.master());
  bus={ctx:ac,in:g};return bus;
}
function snd(fn){try{if(!S.sound)return;const ac=A.ac();if(!ac)return;if(ac.state==="suspended"||ac.state==="interrupted")ac.resume();if(ac.state==="closed")return;fn(ac);}catch(e){}}
function voice(ac,out,src,dur){voices++;src.onended=()=>{voices--;};}
function mkN(ac,out,t,dur,type,f0,f1,vol){if(voices>64)return;const s=ac.createBufferSource();s.buffer=A.noiseBuf();const f=ac.createBiquadFilter();f.type=type;f.Q.value=type==="bandpass"?1.5:0.7;
  f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(Math.max(40,f1),t+dur);const g=ac.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  s.connect(f);f.connect(g);g.connect(out);voice(ac,out,s,dur);s.start(t,Math.random()*0.5,dur+0.02);}
function mkO(ac,out,t,dur,type,f0,f1,vol){if(voices>64)return;const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  const g=ac.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.connect(g);g.connect(out);voice(ac,out,o,dur);o.start(t);o.stop(t+dur+0.02);}
function shotSound(kind,vol,pan){
  snd(ac=>{const b=getBus();if(!b)return;vol=vol===undefined?1:vol;if(vol<0.03)return;
    const t=ac.currentTime+0.001;let out=b.in;
    if(ac.createStereoPanner&&pan){const p=ac.createStereoPanner();p.pan.value=clamp(pan,-1,1);p.connect(b.in);out=p;}
    const v=vol;
    const N=(dt,d,ty,a,c,vv)=>mkN(ac,out,t+dt,d,ty,a,c,vv*v),O=(dt,d,ty,a,c,vv)=>mkO(ac,out,t+dt,d,ty,a,c,vv*v);
    switch(kind){
      case"pistol":N(0,.012,"highpass",4000,9000,1);N(0,.06,"bandpass",3200,1400,.9);N(0,.2,"lowpass",4000,250,1);O(0,.25,"sine",210,38,1);N(.01,.45,"lowpass",1500,120,.3);if(v>.5){N(.07,.03,"bandpass",3500,2500,.2);}break;
      case"rev":N(0,.012,"highpass",3500,8000,1);N(0,.1,"bandpass",2500,900,1);N(0,.3,"lowpass",3000,150,1.1);O(0,.35,"sine",150,28,1.2);N(.02,.7,"lowpass",1200,90,.4);break;
      case"smg":N(0,.01,"highpass",5000,9000,.9);N(0,.05,"bandpass",3000,1500,.8);O(0,.1,"sine",230,60,.7);break;
      case"rifle":N(0,.012,"highpass",3500,8500,1);N(0,.08,"bandpass",2800,1100,.9);N(0,.22,"lowpass",3500,200,1);O(0,.2,"sine",180,35,1);N(.02,.5,"lowpass",1300,100,.35);break;
      case"sniper":N(0,.015,"highpass",3000,8000,1.2);N(0,.12,"bandpass",2200,700,1);N(0,.4,"lowpass",3000,100,1.2);O(0,.5,"sine",140,25,1.3);N(.05,1.2,"lowpass",1000,80,.5);break;
      case"shotgun":N(0,.015,"highpass",2500,7000,1.1);N(0,.18,"lowpass",3000,150,1.3);O(0,.3,"sine",120,24,1.3);N(.03,.6,"lowpass",900,90,.5);N(.45,.02,"bandpass",2500,1800,.3);break;
      case"mini":N(0,.01,"highpass",4500,9000,.8);N(0,.04,"bandpass",2500,1200,.7);O(0,.07,"sine",200,70,.6);break;
      case"laser":O(0,.2,"sawtooth",2600,300,.5);O(0,.12,"square",1800,400,.25);break;
      case"plasma":O(0,.3,"sine",200,1200,.5);O(0,.25,"sawtooth",900,150,.4);N(0,.15,"bandpass",1500,500,.3);break;
      case"ice":O(0,.25,"sine",2500,3500,.3);O(.05,.25,"triangle",3000,2000,.25);N(0,.1,"highpass",5000,9000,.4);break;
      case"fire":N(0,.25,"bandpass",600,2500,.8);N(0,.2,"lowpass",1500,300,.6);break;
      case"poison":O(0,.15,"sine",300,120,.5);O(.1,.15,"sine",420,160,.4);N(0,.1,"lowpass",900,300,.4);break;
      case"zap":N(0,.2,"highpass",3000,9000,.9);O(0,.15,"square",1400,200,.4);O(.04,.1,"sawtooth",900,100,.3);break;
      case"rail":O(0,.35,"sine",120,2400,.5);N(.3,.02,"highpass",3000,9000,1);N(.32,.5,"lowpass",3500,100,1.2);O(.32,.5,"sine",100,22,1.3);break;
      case"pop":O(0,.1,"sine",600,150,.8);N(0,.05,"bandpass",2000,900,.5);break;
      case"cluck":O(0,.07,"square",950,720,.4);O(.09,.07,"square",1050,800,.4);O(.18,.08,"square",900,650,.35);break;
      case"boom":N(0,.04,"highpass",2000,8000,1.2);N(0,.5,"lowpass",3000,120,1.6);N(0,1.3,"lowpass",900,50,1.2);O(0,1,"sine",95,22,1.6);O(0,.6,"triangle",150,30,.8);N(.2,.5,"bandpass",1500,300,.3);break;
      case"smallboom":N(0,.3,"lowpass",2500,150,1.1);O(0,.4,"sine",120,30,1.1);break;
    }
  });
}
function scream(pan,vol){
  snd(ac=>{const b=getBus();if(!b)return;const t=ac.currentTime,o=ac.createOscillator(),o2=ac.createOscillator(),lfo=ac.createOscillator(),lg=ac.createGain();
    o.type="sawtooth";o2.type="square";lfo.frequency.value=9;lg.gain.value=40;lfo.connect(lg);lg.connect(o.frequency);
    const f0=rnd(520,760);o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f0*0.55,t+0.9);o2.frequency.setValueAtTime(f0*1.01,t);o2.frequency.linearRampToValueAtTime(f0*0.56,t+0.9);
    const f=ac.createBiquadFilter();f.type="bandpass";f.frequency.setValueAtTime(1100,t);f.frequency.linearRampToValueAtTime(700,t+0.9);f.Q.value=2.2;
    const g=ac.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.5*vol,t+0.06);g.gain.exponentialRampToValueAtTime(0.0002,t+0.95);
    o.connect(f);o2.connect(f);f.connect(g);let out=g;if(ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=clamp(pan||0,-1,1);g.connect(p);out=p;}out.connect(b.in);
    voices+=3;const dn=()=>{voices--;};o.onended=dn;o2.onended=dn;lfo.onended=dn;o.start(t);o2.start(t);lfo.start(t);o.stop(t+1);o2.stop(t+1);lfo.stop(t+1);});
}
function shout(){snd(ac=>{A.tone("square",330,260,.18,.3);A.tone("square",420,300,.2,.3,0,.2);});}
function boing(){A.tone("sine",200,900,.35,.5);}
function coinSnd(){A.tone("square",988,988,.07,.25);A.tone("square",1319,1319,.2,.25,0,.07);}
function spatial(x,z){return A.spat(x,z);}
function shotAt(kind,x,z,gain){const sp=spatial(x,z);shotSound(kind,Math.min(1,sp[1]*(gain||1.2)),sp[0]);}

/* ================= Partikel ================= */
const ptc=[];let decals=0;
function addP(x,y,z,vx,vy,vz,s,col,life,o){
  if(ptc.length>=560){const d=ptc.shift();if(d.decal)decals--;}
  const p={x,y,z,vx,vy,vz,sx:s,sy:s,sz:s,s,col,life,g:18,b:0.35,fr:0.7,decal:false,blood:false,fade:0};
  if(o)Object.assign(p,o);ptc.push(p);return p;
}
const BLOOD=[[.72,.04,.04],[.55,0,0],[.86,.1,.1]];
const CONF=[[1,.3,.4],[.3,.8,1],[1,.9,.2],[.5,1,.4],[.9,.4,1]];
function burst(x,y,z,n,spd,colf,size,life,o){for(let i=0;i<n;i++){const a=Math.random()*6.283,u=rnd(-0.2,1),r=Math.sqrt(1-u*u)*spd*rnd(.3,1);addP(x,y,z,Math.cos(a)*r,u*spd*rnd(.4,1)+2,Math.sin(a)*r,size*rnd(.7,1.3),colf(),life*rnd(.7,1.2),o);}}
function updP(dt){
  for(let i=ptc.length-1;i>=0;i--){
    const p=ptc[i];p.life-=dt;if(p.life<=0){if(p.decal)decals--;ptc.splice(i,1);continue;}
    if(p.decal)continue;
    const ox=p.x,oy=p.y,oz=p.z;p.vy-=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;
    if(p.g>0&&solid(Math.floor(p.x),Math.floor(p.y),Math.floor(p.z))){
      p.x=ox;p.z=oz;p.y=oy;p.vx*=-0.3;p.vz*=-0.3;
      if(p.vy<0){p.vy=-p.vy*p.b;p.vx*=p.fr;p.vz*=p.fr;
        if(Math.abs(p.vy)<1.2){p.vy=0;p.vx*=0.3;p.vz*=0.3;
          if(p.blood&&decals<120&&Math.random()<0.7){p.decal=true;decals++;p.sy=0.04;p.sx=p.sz=p.s*rnd(1.8,3);p.y=Math.floor(p.y)+1.02;p.life=rnd(14,26);p.vx=p.vz=0;}}}
      else p.vy=0;
    }
  }
}
const pm={x:0,y:0,z:0,yaw:0,sc:1},pp={c:[0,0,0],s:[1,1,1],col:null,rot:0,leg:0,py:0};
function box(x,y,z,sx,sy,sz,col,yaw){pm.x=x;pm.y=y;pm.z=z;pm.yaw=yaw||0;pp.s[0]=sx;pp.s[1]=sy;pp.s[2]=sz;A.emitBox(pm,pp,0,col);}
function emitParts(){
  for(const p of ptc){let c=p.col;if(p.fade&&p.life<p.fade){const k=p.life/p.fade;c=[c[0]*k,c[1]*k,c[2]*k];}box(p.x,p.y,p.z,p.sx,p.sy,p.sz,c);}
}

/* ================= Langit: matahari, bulan, awan, bintang ================= */
const STARS=[];for(let i=0;i<90;i++){const a=Math.random()*6.283,u=rnd(0.08,1),r=Math.sqrt(1-u*u);STARS.push([Math.cos(a)*r,u,Math.sin(a)*r,rnd(.8,1.8)]);}
const CLOUDS=[];for(let i=0;i<22;i++)CLOUDS.push([rnd(0,300),rnd(0,300),rnd(18,40),rnd(10,22),58+rnd(0,6)]);
function emitSky(cp){
  const a=DAY.tod*Math.PI*2,sx=Math.cos(a),sy=Math.sin(a),sz=0.25,len=Math.hypot(sx,sy,sz),R=150;
  if(sy>-0.3){const warm=clamp(1-sy*2.2,0,1);box(cp[0]+sx/len*R,cp[1]+sy/len*R,cp[2]+sz/len*R,20,20,4,[1,1-warm*.35,.65-warm*.35],0);}
  if(sy<0.3){const mx=cp[0]-sx/len*R,my=cp[1]-sy/len*R,mz=cp[2]-sz/len*R;box(mx,my,mz,15,15,3,[.88,.9,.95],0);box(mx+2,my+2,mz-.5,4,4,3.2,[.7,.72,.8],0);box(mx-3,my-2,mz-.5,3,3,3.2,[.72,.74,.8],0);box(mx+1,my-4,mz-.5,3,2,3.2,[.74,.76,.82],0);}
  if(DAY.dayf<0.45){const k=clamp((0.45-DAY.dayf)*2.6,0,1);for(const s of STARS)box(cp[0]+s[0]*165,cp[1]+s[1]*165,cp[2]+s[2]*165,s[3],s[3],s[3],[k,k,k*.95],0);}
  const t=performance.now()/1000*1.6,b=0.5+0.5*DAY.dayf,bm=X.bloodMoon?1:0;
  for(const c of CLOUDS){
    const x=((c[0]+t-P.x)%320+480)%320-160+P.x,z=((c[1]-P.z*0.2)%320+480)%320-160+P.z;
    box(x,c[4],z,c[2],3,c[3],[b*(1-bm*.1),b*(1-bm*.4),b*(1-bm*.4)],0);
    box(x+c[2]*.2,c[4]+2.4,z,c[2]*.5,2,c[3]*.6,[b,b*(1-bm*.35),b*(1-bm*.35)],0);
  }
}

/* ================= Karakter ================= */
const SKINS=[[.96,.8,.69],[.88,.68,.52],[.76,.57,.41],[.6,.42,.3],[.42,.28,.2],[.99,.86,.74],[.55,.8,.5],[.6,.7,.95]];
const HAIRS=[[.16,.1,.06],[.45,.3,.15],[.85,.7,.3],[.7,.2,.1],[.08,.08,.1],[.8,.8,.82],[.3,.5,.9]];
const SHIRTS=[[.2,.5,.85],[.85,.2,.2],[.2,.7,.35],[.95,.8,.2],[.6,.3,.8],[.15,.15,.18],[.95,.95,.95],[.95,.5,.15],[.95,.55,.7],[.15,.65,.65],[.5,.33,.2],[.55,.56,.6]];
const PANTSC=[[.25,.25,.55],[.2,.2,.22],[.45,.32,.2],[.3,.4,.25],[.3,.45,.7],[.9,.9,.92],[.7,.2,.2],[.75,.65,.4]];
const SHOES=[[.1,.1,.12],[.35,.22,.12],[.92,.92,.94],[.8,.15,.15],[.2,.3,.7],[.95,.8,.2]];
const HATN=["Tanpa","Baseball","Koboi","Helm","Penyihir","Mahkota","Kupluk","Koki"];
const FACEN=["Normal","Senyum","Marah","Kaget","Kacamata","Kumis","Mata tutup"];
// [nama,kulit,rambut,baju,celana,sepatu,topi,muka]
const PRESETS=[["Petualang",0,0,0,0,1,0,0],["Ninja",1,4,5,1,0,6,2],["Koboi",2,1,10,4,1,2,5],["Dokter",0,0,6,5,2,0,1],["Koki",1,4,6,5,2,7,5],["Pelaut",0,2,0,5,2,1,1],["Penyihir",0,5,4,1,0,4,0],["Ksatria",1,0,11,1,0,3,2],["Pembalap",2,4,1,1,3,1,4],["Atlet",3,4,7,6,2,0,1],
 ["Bajak laut",1,4,5,6,1,2,5],["Mekanik",2,1,9,4,1,1,0],["Tentara",1,0,2,3,1,3,0],["Sultan",2,4,3,6,5,5,5],["Hantu",5,5,6,5,2,6,6],["Zombie",6,0,9,3,1,2,2],["Robot",7,5,11,1,0,4,4],["Vampir",5,4,5,1,0,0,2],["Anak pantai",1,2,3,7,5,0,1],["Tukang pizza",0,1,1,5,3,1,1]];
const sc=(c,k)=>[c[0]*k,c[1]*k,c[2]*k];
function lookCols(L,na){
  const skin=SKINS[L.skin|0]||SKINS[0];let shirt=SHIRTS[L.shirt|0]||SHIRTS[0],pants=PANTSC[L.pants|0]||PANTSC[0],sleeve=shirt;const ap=A.armorPts();
  if(L.naked){shirt=sleeve=sc(skin,.97);pants=sc(skin,.93);}
  if(ap>0&&!na){const ac=ap>=14?[.78,.8,.84]:ap>=10?[.55,.56,.6]:[.62,.42,.24];shirt=ac;sleeve=ac;pants=sc(ac,.8);}
  return{skin,hair:HAIRS[L.hair|0]||HAIRS[0],shirt,sleeve,pants,shoe:SHOES[L.shoes|0]||SHOES[0]};
}
function faceParts(f,skin,hair,hd){
  const W=[1,1,1],E=[.1,.2,.5],K=[.06,.06,.08],M=[.62,.25,.25],hairD=sc(hair,.7),o=[];
  const brow=(y,c)=>o.push(B(-.12,y,-.258,.15,.03,.02,c,hd),B(.12,y,-.258,.15,.03,.02,c,hd));
  const nose=()=>o.push(B(0,1.58,-.265,.06,.09,.03,sc(skin,.85),hd));
  if(f===3){o.push(B(-.12,1.67,-.255,.15,.16,.02,W,hd),B(.12,1.67,-.255,.15,.16,.02,W,hd),B(-.12,1.67,-.267,.05,.05,.02,K,hd),B(.12,1.67,-.267,.05,.05,.02,K,hd),B(0,1.49,-.262,.1,.1,.02,[.25,.05,.05],hd));brow(1.79,hairD);nose();}
  else if(f===6){o.push(B(-.12,1.65,-.258,.13,.025,.02,K,hd),B(.12,1.65,-.258,.13,.025,.02,K,hd),B(0,1.5,-.256,.16,.03,.02,M,hd));brow(1.73,hairD);nose();}
  else{o.push(B(-.12,1.66,-.255,.13,.1,.02,W,hd),B(.12,1.66,-.255,.13,.1,.02,W,hd),B(-.1,1.66,-.265,.06,.08,.02,E,hd),B(.1,1.66,-.265,.06,.08,.02,E,hd));
    brow(f===2?1.72:1.75,f===2?K:hairD);nose();
    if(f===1)o.push(B(0,1.48,-.256,.18,.03,.02,M,hd),B(-.1,1.5,-.256,.03,.04,.02,M,hd),B(.1,1.5,-.256,.03,.04,.02,M,hd));
    else if(f===2)o.push(B(0,1.47,-.256,.14,.03,.02,M,hd),B(-.08,1.45,-.256,.03,.04,.02,M,hd),B(.08,1.45,-.256,.03,.04,.02,M,hd));
    else o.push(B(0,1.5,-.256,.14,.03,.02,M,hd));
    if(f===4)o.push(B(0,1.66,-.268,.5,.11,.03,K,hd));
    if(f===5)o.push(B(0,1.545,-.268,.22,.05,.03,hairD,hd));}
  return o;
}
function hatParts(h,col,hd){
  if(h===1)return[B(0,1.93,0,.56,.1,.56,col,hd),B(0,1.89,-.34,.5,.04,.2,sc(col,.8),hd)];
  if(h===2)return[B(0,1.9,0,.95,.04,.95,[.5,.33,.18],hd),B(0,2.02,0,.5,.2,.5,[.45,.3,.15],hd)];
  if(h===3)return[B(0,1.94,0,.6,.28,.6,[.35,.4,.3],hd),B(0,1.86,-.3,.6,.05,.05,[.2,.25,.18],hd)];
  if(h===4){const p=[.45,.2,.65];return[B(0,1.92,0,.85,.05,.85,p,hd),B(0,2.05,0,.5,.2,.5,p,hd),B(0,2.26,0,.32,.24,.32,p,hd),B(0,2.46,0,.16,.2,.16,p,hd)];}
  if(h===5){const g=[.95,.8,.2];return[B(0,1.95,0,.56,.12,.56,g,hd),B(-.2,2.07,-.2,.1,.14,.1,g,hd),B(.2,2.07,-.2,.1,.14,.1,g,hd),B(-.2,2.07,.2,.1,.14,.1,g,hd),B(.2,2.07,.2,.1,.14,.1,g,hd),B(0,2.08,0,.1,.16,.1,g,hd)];}
  if(h===6)return[B(0,1.96,0,.56,.2,.56,col,hd),B(0,2.11,0,.14,.14,.14,[1,1,1],hd)];
  if(h===7)return[B(0,1.96,0,.58,.12,.58,[1,1,1],hd),B(0,2.12,0,.5,.34,.5,[1,1,1],hd)];
  return[];
}
function playerParts(L,opt){
  const c=lookCols(L,opt.na),skin=c.skin,hair=c.hair,hd=opt.hd,sk=sc(skin,.85),naked=!!L.naked,T=(p,l)=>{p.limb=l;return p;};
  const parts=[B(0,1.62,0,.5,.5,.5,skin,hd),B(0,1.9,0,.54,.12,.54,hair,hd),B(0,1.72,.26,.54,.42,.06,hair,hd),B(-.27,1.8,0,.06,.28,.54,hair,hd),B(.27,1.8,0,.06,.28,.54,hair,hd),B(0,1.84,-.26,.54,.1,.06,hair,hd)];
  parts.push(...faceParts(L.face|0,skin,hair,hd),B(-.26,1.6,0,.03,.1,.1,sk,hd),B(.26,1.6,0,.03,.1,.1,sk,hd),...hatParts(L.hat|0,c.shirt,hd));
  parts.push(B(0,1.35,0,.2,.1,.2,sk),B(0,1.02,0,.54,.68,.28,c.shirt));
  if(!naked)parts.push(B(0,1.31,-.141,.3,.06,.02,sc(c.shirt,.7)),B(0,.72,0,.56,.1,.3,[.15,.1,.07]),B(0,.72,-.152,.1,.08,.02,[.9,.75,.2]),B(0,1.08,.25,.4,.52,.16,[.5,.32,.14]),B(0,.9,.34,.3,.2,.04,[.4,.25,.1]));
  parts.push(T(B(-.37,1.08,0,.2,.5,.2,c.sleeve,{rot:opt.la,py:1.38}),"al"),T(B(-.37,.74,0,.19,.18,.19,skin,{rot:opt.la,py:1.38}),"al"),
   T(B(.37,1.08,0,.2,.5,.2,c.sleeve,{rot:opt.ra,py:1.38}),"ar"),T(B(.37,.74,0,.19,.18,.19,skin,{rot:opt.ra,py:1.38}),"ar"),
   T(B(-.14,.35,0,.24,.7,.26,c.pants,{rot:opt.lg,py:.7}),"ll"),T(B(.14,.35,0,.24,.7,.26,c.pants,{rot:-opt.lg,py:.7}),"lr"),
   T(B(-.14,.06,-.03,.26,.12,.34,c.shoe,{rot:opt.lg,py:.7}),"ll"),T(B(.14,.06,-.03,.26,.12,.34,c.shoe,{rot:-opt.lg,py:.7}),"lr"));
  return parts;
}
function drawPlayer(){
  if(DV.m&&VEH[DV.m.type]&&!VEH[DV.m.type].animal&&!VEH[DV.m.type].board)return;
  const spd=Math.hypot(P.vx,P.vz),lg=Math.sin(S.walkPh)*0.8*Math.min(1,spd/3);
  const h=A.held(),gun=GUN[h],gr=GR[h],T=A.TOOL[h];
  const hr=clamp(P.pitch,-1,1)*0.6,atk=S.swing>0?Math.sin((1-S.swing/0.25)*Math.PI)*1.7:0;
  const ra=gun?1.5+hr*0.5:gr?(S.swing>0?-2.4+(1-S.swing/.25)*3:0.3):(-lg+atk),la=gun&&gun.snd!=="rev"?1.3:lg;
  const parts=playerParts(X.look,{hd:{rot:hr,py:1.4},ar:{rot:ra,py:1.38},al:{rot:la,py:1.38},la,ra,lg}),arm={rot:ra,py:1.38},n0=parts.length;
  if(gun){const L=.18+gun.len*.036;parts.push(B(.37,.74,-.1-L/2,.08,.13,L,gun.col,arm),B(.37,.64,-.06,.07,.17,.08,sc(gun.col,.6),arm));}
  else if(gr)parts.push(B(.37,.68,-.12,.15,.15,.15,gr.col,arm));
  else if(T&&T.k==="sword")parts.push(B(.37,.6,-.42,.06,.08,.72,[.8,.82,.86],arm));
  else if(T){const c=T.t===1?[.7,.55,.3]:T.t===2?[.6,.6,.62]:[.85,.87,.9];parts.push(B(.37,.62,-.3,.05,.05,.5,[.45,.3,.15],arm),B(.37,.62,-.58,.06,.2,.1,c,arm));}
  for(let i=n0;i<parts.length;i++)parts[i].limb="ar";
  for(let i=0;i<X.w.n;i++){const q=X.w.sp[i]||[50,50];parts.push(B((q[0]-50)/200,.8+q[1]/220,-.15,.1,.08,.02,[.6,.03,.03]));}
  if(count(191)>0)parts.push(B(-.12,1.05,.37,.15,.55,.13,[.5,.52,.58]),B(.12,1.05,.37,.15,.55,.13,[.5,.52,.58]));
  if(X.chute)parts.push(B(0,3.5,0,2.6,.25,2.6,[.9,.2,.2]),B(0,3.35,0,2.2,.2,2.2,[.95,.95,.95]),B(-.7,2.5,0,.04,1.9,.04,[.9,.9,.9]),B(.7,2.5,0,.04,1.9,.04,[.9,.9,.9]));
  const m={x:P.x,y:P.y+((DV.m&&VEH[DV.m.type].animal)?1.0:0),z:P.z,yaw:P.yaw};
  const hurt=S.hurtT>0;
  for(const p of parts){if(p.limb&&X.w[p.limb])continue;A.emitBox(m,p,0,hurt?[p.col[0]*.5+.5,p.col[1]*.5,p.col[2]*.5]:p.col);}
}
function drawChar(cv){
  const g=cv.getContext("2d");if(!g)return false;g.clearRect(0,0,cv.width,cv.height);g.imageSmoothingEnabled=false;
  const L=X.look,c=lookCols(L),skin=c.skin,hair=c.hair,shirt=c.shirt,sleeve=c.sleeve,pants=c.pants,shoe=c.shoe,naked=!!L.naked;
  const k=cv.width/84,R=(col,x,y,w,h)=>{g.fillStyle=css(col);g.fillRect(x*k,y*k,w*k,h*k);},W=[1,1,1],K=[.06,.06,.08],M=[.62,.25,.25],E=[.1,.2,.5],hb=sc(hair,.7),F=L.face|0;
  g.fillStyle="rgba(0,0,0,.3)";g.beginPath();g.ellipse(42*k,110*k,26*k,4*k,0,0,6.3);g.fill();
  if(!naked){R([.5,.32,.14],20,40,44,36);R([.4,.25,.1],24,44,36,10);}
  R(pants,26,72,14,34);R(sc(pants,.8),26,72,3,34);R(pants,42,72,14,34);R(sc(pants,.8),53,72,3,34);R(shoe,25,102,16,6);R(shoe,41,102,16,6);
  R(shirt,24,34,34,40);R(sc(shirt,.8),24,34,4,40);if(!naked){R(sc(shirt,.7),34,34,14,4);R([.15,.1,.07],24,68,34,5);R([.9,.75,.2],38,68,6,5);}
  R(sleeve,10,34,14,24);R(sc(sleeve,.8),10,34,3,24);R(skin,10,58,14,12);R(sleeve,58,34,14,24);R(sc(sleeve,.8),69,34,3,24);R(skin,58,58,14,12);
  R(sc(skin,.85),36,30,10,6);R(skin,27,6,28,28);R(sc(skin,.9),27,28,28,6);
  R(hair,25,2,32,10);R(hair,25,8,4,16);R(hair,53,8,4,16);R(sc(hair,.8),27,12,28,3);
  if(F===3){R(W,30,16,10,9);R(W,42,16,10,9);R(K,34,19,3,4);R(K,46,19,3,4);R(hb,31,11,9,2);R(hb,43,11,9,2);R([.25,.05,.05],38,27,6,6);}
  else if(F===6){R(K,31,21,8,2);R(K,43,21,8,2);R(hb,31,16,9,2);R(hb,43,16,9,2);R(M,36,28,10,2);}
  else{R(W,31,18,8,6);R(W,43,18,8,6);R(E,34,19,4,5);R(E,46,19,4,5);R(K,35,20,2,3);R(K,47,20,2,3);
    R(F===2?K:hb,31,F===2?16:14,9,2);R(F===2?K:hb,43,F===2?16:14,9,2);R(sc(skin,.82),40,22,4,6);
    if(F===1){R(M,35,28,12,2);R(M,33,26,3,2);R(M,46,26,3,2);}else if(F===2){R(M,36,29,10,2);R(M,34,31,3,2);R(M,45,31,3,2);}else R(M,36,28,10,2);
    if(F===4)R(K,29,17,24,8);if(F===5)R(hb,34,25,14,3);
    if(F<2){R([1,.6,.6],29,25,4,3);R([1,.6,.6],49,25,4,3);}}
  const H=L.hat|0;
  if(H===1){R(shirt,25,0,32,9);R(sc(shirt,.75),22,8,38,3);}
  else if(H===2){R([.5,.33,.18],12,6,58,5);R([.45,.3,.15],26,0,30,8);}
  else if(H===3){R([.35,.4,.3],24,0,34,14);R([.2,.25,.18],24,12,34,3);}
  else if(H===4){R([.45,.2,.65],10,8,62,4);R([.45,.2,.65],26,2,30,7);R([.45,.2,.65],33,0,16,4);}
  else if(H===5){const gd=[.95,.8,.2];R(gd,25,4,32,7);R(gd,25,0,6,5);R(gd,38,0,6,5);R(gd,51,0,6,5);}
  else if(H===6){R(shirt,25,0,32,10);R(W,37,0,8,3);}
  else if(H===7){R(W,24,0,34,10);R(W,22,6,38,6);}
  const h=A.held();if(h){g.drawImage(A.iconCanvas(h),56*k,50*k,30*k,30*k);}
  return true;
}

/* ================= UI ================= */
const CSS3=`
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:6px 0}.pgrid button{padding:8px 2px;font-size:12px}
.opts{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}.opts button{padding:8px 10px;font-size:12px}
.pgrid button.on,.opts button.on{outline:2px solid #7dff7d}
#start .card.menu{max-width:360px;max-height:94vh;overflow-y:auto;padding:22px 18px 16px;background:linear-gradient(#24374e,#172333);border:1px solid #3b5575}
.menu h1{font-size:32px;letter-spacing:3px;margin:0 0 2px;background:linear-gradient(#b4ff8c,#4fb83a);-webkit-background-clip:text;background-clip:text;color:transparent}
.menu .tag{font-size:12px;color:#9fb2c8;margin:0 0 16px}
.menu #play{width:100%;padding:16px;font-size:20px;border-radius:12px;margin:0 0 10px;box-shadow:0 4px 0 #2d6a20}
.menu #play::before{content:"▶  "}
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}.mgrid button{margin:0;width:100%;padding:13px 6px;font-size:14px}.mgrid button:first-child{background:#2f6fb5;box-shadow:0 3px 0 #1f4a7c}
.menu #modeRow{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:0 0 6px}.menu #modeRow button{margin:0;width:100%}
.menu #modeDesc{font-size:12px;color:#9fb2c8;margin:4px 2px 4px;min-height:34px}
.mdet{border-top:1px solid #33475f;margin-top:8px;padding-top:4px;text-align:left}
.mdet summary{cursor:pointer;font-size:14px;color:#c9d6e4;padding:9px 2px;list-style:none}.mdet summary::-webkit-details-marker{display:none}
.mdet summary::before{content:"▸  "}.mdet[open] summary::before{content:"▾  "}
.mdet .lbl{font-size:12px;color:#8ea3ba;margin:6px 0 4px}
.mdet ul{margin:0;padding-left:18px;font-size:13px;line-height:1.5;color:#b9c6d4}
.menu #goreRow{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0 0 8px}.menu #goreRow button{margin:0;width:100%;padding:10px 2px;font-size:12px}
.menu #sndBtn{width:100%;margin:0 0 6px;padding:11px}
.menu #newWorld{width:100%;margin-top:10px;font-size:13px;padding:11px;background:#4a2d2d}
#mpInfo{background:rgba(125,255,125,.12);border:1px solid #3d7a3d;border-radius:8px;padding:8px;font-size:13px;margin:0 0 10px}
.inp{width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:2px solid #456;background:#0e1824;color:#fff;font-size:15px;margin:6px 0}.bigid{font-size:38px;letter-spacing:6px;text-align:center;font-weight:800;color:#7dff7d;margin:8px 0}
#wsplats{position:fixed;inset:0;pointer-events:none;z-index:3}
.ws{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(150,0,0,.85),rgba(120,0,0,.5) 55%,rgba(100,0,0,0) 72%)}
#blind{position:fixed;top:0;bottom:0;width:46%;pointer-events:none;z-index:3;background:linear-gradient(to right,#000 72%,rgba(0,0,0,0));display:none}
#blind.on{display:block}#blind.L{left:0}#blind.R{right:0;transform:scaleX(-1)}
`;
const CSS2=`
.panel.hide{display:none!important}
.pbody{overflow-y:auto;touch-action:pan-y;-webkit-overflow-scrolling:touch;max-height:62vh}
.eatBtn{display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(95,168,58,.7)!important;border-color:#fff!important;padding:0!important}
.eatBtn.hide{display:none!important}
#bExit{right:166px;bottom:100px;width:56px;height:56px;display:none!important;background:rgba(150,60,30,.55)}
.touch #bExit.show{display:flex!important}
#gate{position:fixed;inset:0;z-index:9;background:#120808;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;font-family:system-ui,sans-serif}
#gate h1{font-size:46px;margin:0;color:#e33}#gate p{max-width:340px;line-height:1.5;color:#ccc}
#gate button{margin-top:14px;padding:14px 40px;border:0;border-radius:12px;font-size:17px;font-weight:700;background:#c22;color:#fff}
#gate button.alt{background:#333}
#goreRow{display:flex;gap:8px}#goreRow button{margin-top:8px;padding:10px 4px;font-size:13px}#goreRow button.on{background:#c0392b}
.sw{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 10px}.sw i{width:34px;height:34px;border-radius:8px;border:3px solid transparent;box-sizing:border-box}.sw i.on{border-color:#fff}
.qrow{padding:8px 0;border-top:1px solid #34465b;font-size:14px}.qrow small{color:#9fb0c2}
.qbar{height:8px;background:#111a26;border-radius:4px;overflow:hidden;margin-top:5px}.qbar i{display:block;height:100%;background:#5fa83a}
.qrow.done .qbar i{background:#e9a23a}
#flashw{position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:4}
#chip{position:fixed;left:50%;top:104px;transform:translateX(-50%);padding:4px 12px;border-radius:12px;background:rgba(160,20,20,.85);color:#fff;font:700 13px system-ui,sans-serif;opacity:0;transition:opacity .3s;pointer-events:none;z-index:3}
#chip.show{opacity:1}
`;
function tapEl(e,fn){e.addEventListener("touchstart",ev=>{ev.preventDefault();ev.stopPropagation();fn();},{passive:false});e.addEventListener("mousedown",ev=>{ev.preventDefault();ev.stopPropagation();fn();});}
const panels={};
function makePanel(id,title){
  const p=el("div",{id,class:"panel hide"},document.body),c=el("div",{class:"card wide"},p),tb=el("div",{class:"tabs"},c);
  const t=el("button",{class:"on",text:title,style:"cursor:default"},tb),x=el("button",{text:"✕",style:"flex:0 0 46px;background:#7a2f2f"},tb),body=el("div",{class:"pbody"},c);
  p.addEventListener("touchmove",e=>e.stopPropagation(),{passive:true});
  const o={p,body,title:t,open(){A.pauseOn();p.classList.remove("hide");},close(){p.classList.add("hide");A.pauseOff();if(o.onClose)o.onClose();}};
  x.addEventListener("click",()=>{SFX.click();o.close();});panels[id]=o;return o;
}
function anyPanel(){for(const k in panels)if(!panels[k].p.classList.contains("hide"))return true;return false;}
function chip(msg){const c=$$("chip");c.textContent=msg;c.classList.add("show");clearTimeout(chip.t);chip.t=setTimeout(()=>c.classList.remove("show"),1800);}
function flashWhite(a){const f=$$("flashw");f.style.transition="none";f.style.opacity=a;requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.transition="opacity 2.2s";f.style.opacity=0;}));}
function eatNow(){if(S.mode!=="survival")return;const id=A.bestFood();if(!id){A.toast("Tidak ada makanan");return;}A.eatItem(id);}
function hotExtra(hb){
  const b=el("button",{id:"tbEat",class:"slot eatBtn",text:"🍖"},hb);tapEl(b,eatNow);
  if(!(S.mode==="survival"&&A.bestFood()))b.classList.add("hide");
}
function dirText(dx,dz){const d=Math.hypot(dx,dz)|0,ang=Math.atan2(dz,dx)*180/Math.PI,names=["Timur","Tenggara","Selatan","Barat Daya","Barat","Barat Laut","Utara","Timur Laut"];return d+" m "+names[Math.round(((ang+360)%360)/45)%8];}
function renderQuests(){
  const b=panels.qp.body;b.innerHTML="";checkQuestDay();
  el("p",{class:"note",text:"🪙 Koin kamu: "+count(140)},b);
  for(const q of X.q.list){const pr=Math.min(q.n,X.q.prog[q.k]|0),done=!!X.q.done[q.k];
    const r=el("div",{class:"qrow"+(done?" done":"")},b);el("div",{text:(done?"✔ ":"")+q.t+" · +"+q.r+" 🪙"},r);el("small",{text:pr+" / "+q.n},r);el("i",{},el("div",{class:"qbar"},r)).style.width=(pr/q.n*100)+"%";}
  el("p",{class:"note",text:"Misi baru tiap hari."},b);
  const v=A.VIL(),lines=[];
  if(v)lines.push("🏘 Desa: "+dirText(v.x-P.x,v.z-P.z));
  if(BASE)lines.push("🏰 Markas Pasukan Besi: "+dirText(BASE.x-P.x,BASE.z-P.z));
  let bs=null,bd=1e9;for(const s of SHOPS){const d=Math.hypot(s.x-P.x,s.z-P.z);if(d<bd){bd=d;bs=s;}}
  if(bs)lines.push("🏪 Kedai terdekat: "+dirText(bs.x-P.x,bs.z-P.z));
  for(const l of lines)el("div",{class:"qrow",text:l},b);
}
function applyPreset(i){const p=PRESETS[i],L=X.look;L.skin=p[1];L.hair=p[2];L.shirt=p[3];L.pants=p[4];L.shoes=p[5];L.hat=p[6];L.face=p[7];L.naked=0;L.preset=i;}
function renderLook(){
  const b=panels.lk.body;b.innerHTML="";const L=X.look;
  const cv=el("canvas",{width:126,height:174,style:"display:block;margin:0 auto 8px;background:linear-gradient(#32506e,#1d2d40);border-radius:10px;image-rendering:pixelated"},b);drawChar(cv);
  const ch=()=>{L.preset=-1;SFX.click();A.savePlayer();renderLook();};
  el("div",{text:"Skin siap pakai (20)"},b);const gr=el("div",{class:"pgrid"},b);
  PRESETS.forEach((p,i)=>{const x=el("button",{class:"alt"+(L.preset===i?" on":""),text:p[0]},gr);x.addEventListener("click",()=>{applyPreset(i);SFX.click();A.savePlayer();renderLook();});});
  const nb=el("button",{class:"alt"+(L.naked?" on":""),text:L.naked?"👕 Pakai baju lagi":"🚿 Telanjang (tanpa baju & celana)",style:"width:100%;margin:6px 0"},b);
  nb.addEventListener("click",()=>{L.naked=L.naked?0:1;L.preset=-1;SFX.click();A.savePlayer();renderLook();});
  for(const r of[["Warna kulit",SKINS,"skin"],["Rambut",HAIRS,"hair"],["Baju",SHIRTS,"shirt"],["Celana",PANTSC,"pants"],["Sepatu",SHOES,"shoes"]]){
    el("div",{text:r[0]},b);const w=el("div",{class:"sw"},b);
    r[1].forEach((c,i)=>{const s=el("i",{class:(L[r[2]]|0)===i?"on":"",style:"background:"+css(c)},w);s.addEventListener("click",()=>{L[r[2]]=i;ch();});});}
  for(const r of[["Topi",HATN,"hat"],["Muka",FACEN,"face"]]){
    el("div",{text:r[0]},b);const w=el("div",{class:"opts"},b);
    r[1].forEach((n,i)=>{const s=el("button",{class:"alt"+((L[r[2]]|0)===i?" on":""),text:n},w);s.addEventListener("click",()=>{L[r[2]]=i;ch();});});}
}
function tidyMenu(){
  const card=$$("start").firstElementChild;if(!card||card.dataset.tidy)return;card.dataset.tidy=1;card.classList.add("menu");
  const h1=card.querySelector("h1"),tag=card.querySelector("p"),btns=[...card.querySelectorAll("button")];
  const mp=btns.find(b=>b.textContent.includes("Multiplayer")),sk=btns.find(b=>b.textContent.includes("Skin")),chb=btns.find(b=>b.textContent.includes("Chaos"));
  tag.textContent="Sandbox balok 3D · survival · chaos bareng teman · v2.1";tag.className="tag";
  const grid=el("div",{class:"mgrid"});grid.appendChild(mp);grid.appendChild(sk);if(chb){chb.style.gridColumn="1 / -1";chb.style.background="#b5391f";grid.appendChild(chb);}
  const st=el("details",{class:"mdet"});el("summary",{text:"⚙ Pengaturan"},st);el("div",{class:"lbl",text:"Tingkat darah / gore"},st);st.appendChild($$("goreRow"));st.appendChild($$("sndBtn"));
  const hp=el("details",{class:"mdet"});el("summary",{text:"📖 Cara bermain"},hp);hp.appendChild($$("help"));
  for(const e of[h1,tag,$$("mpInfo"),$$("play"),grid,$$("modeRow"),$$("modeDesc"),st,hp,$$("newWorld"),$$("err")])card.appendChild(e);
}
function initUI(){
  const st=document.createElement("style");st.textContent=CSS2+CSS3;document.head.appendChild(st);
  const b=document.body;el("div",{id:"flashw"},b);el("div",{id:"chip"},b);
  const ex=el("div",{id:"bExit",class:"btn"},b);ex.innerHTML="<b>⬇</b><small>Turun</small>";tapEl(ex,()=>dismount());
  const tbs=$$("tbs"),more=el("button",{id:"tbMore",class:"tb",text:"⋯"}),qb=el("button",{id:"tbQuest",class:"tb sec",text:"📜"},tbs),lb=el("button",{id:"tbLook",class:"tb sec",text:"🎨"},tbs);
  tbs.insertBefore(more,$$("tbCam"));tbs.appendChild(qb);tbs.appendChild(lb);
  tapEl(more,()=>tbs.classList.toggle("open"));
  makePanel("qp","📜 Misi & Peta");makePanel("ch","📦 Peti");makePanel("mpp","🌐 Multiplayer");makePanel("cht","💬 Obrolan");makePanel("chs","💥 Chaos");el("p",{id:"mpInfo",style:"display:none;color:#7dff7d;font-weight:700;margin:8px 0"},$$("start").firstElementChild||b);const mb=el("button",{text:"🌐 Multiplayer"});const chb=el("button",{text:"💥 Chaos"});$$("play").insertAdjacentElement("afterend",chb);chb.addEventListener("click",()=>{SFX.click();chaosPanel();panels.chs.open();});$$("play").insertAdjacentElement("afterend",mb);mb.addEventListener("click",()=>{SFX.click();mpRender();panels.mpp.open();});const cb=el("button",{id:"tbChat",class:"tb sec",text:"💬"},$$("tbs"));cb.addEventListener("click",()=>{if(S.paused)return;renderChat();panels.cht.open();$$("tbs").classList.remove("open");});panels.ch.onClose=()=>A.savePlayer();el("div",{id:"wsplats"},b);el("div",{id:"blind"},b);const sb=el("button",{class:"alt",text:"🎨 Desain Skin"});$$("play").insertAdjacentElement("afterend",sb);sb.addEventListener("click",()=>{SFX.click();renderLook();panels.lk.open();});makePanel("lk","🎨 Karakter");makePanel("shp","🏪 Kedai");
  tapEl(qb,()=>{if(S.paused)return;renderQuests();panels.qp.open();tbs.classList.remove("open");});
  tapEl(lb,()=>{if(S.paused)return;renderLook();panels.lk.open();tbs.classList.remove("open");});
  // gerbang 18+
  if(!localStorage.getItem("dk18")){
    const g=el("div",{id:"gate"},b);el("h1",{text:"18+"},g);
    el("p",{text:"Game ini berisi kekerasan dan darah bergaya kotak-kotak (musuh fiktif). Hanya untuk usia 18 tahun ke atas. Gore bisa diubah di menu awal."},g);
    const y=el("button",{text:"Saya 18+"},g);y.addEventListener("click",()=>{try{localStorage.setItem("dk18","1");}catch(e){}g.remove();});
    const n=el("button",{class:"alt",text:"Keluar"},g);n.addEventListener("click",()=>{g.innerHTML="<p>Sampai jumpa 👋</p>";});
  }
  // pilihan gore di menu awal
  const row=el("div",{id:"goreRow"}),anchor=$$("sndBtn");anchor.parentNode.insertBefore(row,anchor);
  for(const m of[["full","🩸 Gore penuh"],["mid","Sedang"],["fun","🎉 Lucu"]]){
    const x=el("button",{class:"alt","data-g":m[0],text:m[1]},row);x.addEventListener("click",()=>{X.gore=m[0];SFX.click();for(const q of row.children)q.classList.toggle("on",q.dataset.g===X.gore);A.savePlayer();});}
  for(const q of row.children)q.classList.toggle("on",q.dataset.g===X.gore);
  addEventListener("keydown",e=>{if(e.code==="KeyQ")dismount();});
  tidyMenu();
  renderWounds();
}
/* ================= Misi harian ================= */
const QPOOL=[{k:"zombie",t:"Kalahkan 5 zombie",n:5,r:60},{k:"soldier",t:"Kalahkan 3 tentara",n:3,r:120},{k:"wheat",t:"Kumpulkan 10 gandum",n:10,r:50},{k:"fish",t:"Tangkap 3 ikan",n:3,r:50},
 {k:"drive",t:"Berkendara 300 m",n:300,r:60},{k:"shoot",t:"Tembak 30 kali",n:30,r:40},{k:"buy",t:"Beli 1 barang di kedai",n:1,r:30},{k:"boom",t:"Ledakkan 2 granat/TNT",n:2,r:40}];
function checkQuestDay(){
  if(X.q.day===DAY.day&&X.q.list.length)return;
  X.q={day:DAY.day,list:[],prog:{},done:{}};const arr=QPOOL.slice();let sd=(seed*31+DAY.day*7919)|0;
  for(let i=arr.length-1;i>0;i--){sd=(Math.imul(sd,1103515245)+12345)&0x7fffffff;const j=sd%(i+1);[arr[i],arr[j]]=[arr[j],arr[i]];}
  X.q.list=arr.slice(0,4);
}
function track(k,n){
  checkQuestDay();const q=X.q.list.find(z=>z.k===k);if(!q||X.q.done[k])return;
  X.q.prog[k]=(X.q.prog[k]||0)+(n||1);
  if(X.q.prog[k]>=q.n){X.q.done[k]=1;A.give(140,q.r,true);coinSnd();A.toast("✔ Misi selesai: "+q.t+" (+"+q.r+" 🪙)");}
}
function onGive(id,n){if(id===132)track("wheat",n);}
function save(){return{gore:X.gore,look:X.look,q:X.q,chestOpen:X.chestOpen,stolen:X.stolen,stolenDay:X.stolenDay,bossDead:X.bossDead,chests:X.chests,w:X.w};}
function load(o,same){
  if(!o)return;if(o.gore)X.gore=o.gore;if(o.look)Object.assign(X.look,o.look);
  if(!same)return;if(o.q)X.q=o.q;X.chestOpen=o.chestOpen||{};X.stolen=o.stolen||{};X.stolenDay=o.stolenDay|0;X.bossDead=!!o.bossDead;X.chests=o.chests||{};if(o.w)X.w=Object.assign(defW(),o.w);
}
function newWorld(){X.chests={};X.w=defW();renderWounds();X.chestOpen={};X.stolen={};X.stolenDay=0;X.bossDead=false;X.q={day:0,list:[],prog:{},done:{}};ptc.length=0;decals=0;grens.length=0;prim.length=0;dismount(true);}
const hudKey=()=>count(140)+"|"+(DV.m?1:0)+"|"+(X.chute?1:0)+"|"+(DV.m&&DV.m.veh?Math.round(DV.m.hpv||0):0);
function infoExtra(){let s="";if(count(140))s+=" · 🪙 "+count(140);if(DV.m&&DV.m.veh&&DV.m.veh.hp)s+=" · 🚗 "+Math.max(0,Math.round(DV.m.hpv))+"%";return s;}

/* ================= Model manusia (tentara, boss, penjaga) ================= */
function mkHuman(o){
  const k=o.k||1,P0=[],add=(cx,cy,cz,sx,sy,sz,col,op)=>{const b=B(cx*k,cy*k,cz*k,sx*k,sy*k,sz*k,col,op);if(op&&op.py!==undefined)b.py=op.py*k;P0.push(b);return P0.length-1;};
  const head=[add(0,1.62,0,.5,.5,.5,o.skin),add(0,1.88,0,.58,.2,.58,o.helm),add(-.12,1.66,-.255,.1,.07,.02,[.05,.05,.08]),add(.12,1.66,-.255,.1,.07,.02,[.05,.05,.08])];
  if(o.visor)head.push(add(0,1.64,-.27,.5,.12,.02,[.9,.1,.1]));
  add(0,1.05,0,.52,.7,.28,o.top);add(0,1.12,-.03,.54,.42,.3,o.vest||o.top);
  if(o.apron)add(0,.95,-.16,.44,.6,.04,[.95,.95,.92]);
  const arms=[add(-.36,1.0,0,.2,.7,.2,o.top,{rot:(o.gun||o.zarms)?1.25:0,leg:(o.gun||o.zarms)?.08:1,py:1.35}),add(.36,1.0,0,.2,.7,.2,o.top,{rot:(o.gun||o.zarms)?1.3:0,leg:(o.gun||o.zarms)?-.08:-1,py:1.35})];
  add(-.13,.35,0,.22,.7,.22,o.pants,{leg:1,py:.7});add(.13,.35,0,.22,.7,.22,o.pants,{leg:-1,py:.7});
  if(o.gun)add(0,1.13,-.52,.1,.13,.8*(o.glen||1),[.1,.1,.12]);
  if(o.hat)add(0,1.95,0,.7,.06,.7,o.hat);
  return{parts:P0,head,arms};
}
function defHuman(name,o,hp,sp,snd){const h=mkHuman(o);TYPES[name]={hp,r:.3*(o.k||1),h:1.8*(o.k||1),sp,snd,hs:snd,keep:true,parts:h.parts,head:h.head,arms:h.arms,human:1};}
SFX.shout=(p,v)=>A.tone("square",330,250,.2,.3*v,p);SFX.none=()=>{};
defHuman("soldier",{skin:[.85,.65,.5],helm:[.22,.3,.18],top:[.32,.38,.25],vest:[.2,.24,.18],pants:[.2,.24,.18],gun:1},25,2.5,"shout");
defHuman("soldier2",{skin:[.85,.65,.5],helm:[.15,.25,.55],top:[.2,.35,.65],vest:[.12,.2,.45],pants:[.12,.2,.4],gun:1},25,2.5,"shout");
defHuman("boss",{k:1.5,skin:[.55,.45,.4],helm:[.1,.1,.12],top:[.15,.15,.18],vest:[.3,.05,.05],pants:[.1,.1,.12],gun:1,glen:1.2,visor:1},300,2.1,"shout");
defHuman("shopkeeper",{skin:[.82,.62,.5],helm:[.5,.35,.2],top:[.7,.55,.3],pants:[.3,.25,.2],apron:1,hat:[.45,.3,.15],gun:0},40,1.5,"shout");
TYPES.villager.parts.push(B(0,1.12,-.5,.1,.13,.62,[.12,.12,.14]));
TYPES.zombie.head=[0,1,2];TYPES.zombie.arms=[4,5];TYPES.zombie.human=1;TYPES.villager.head=[0,1,2];TYPES.villager.human=1;
TYPES.creeper={hp:20,r:.32,h:1.7,sp:2.2,snd:"hiss",hs:"hiss",keep:false,parts:[B(0,1.45,0,.5,.5,.5,[.3,.7,.3]),B(-.12,1.5,-.255,.12,.12,.02,[.05,.12,.05]),B(.12,1.5,-.255,.12,.12,.02,[.05,.12,.05]),B(0,1.36,-.255,.14,.16,.02,[.05,.12,.05]),
  B(0,.95,0,.44,.8,.3,[.26,.62,.26]),B(-.12,.22,-.18,.2,.44,.2,[.22,.55,.22],{leg:1,py:.44}),B(.12,.22,-.18,.2,.44,.2,[.22,.55,.22],{leg:-1,py:.44}),B(-.12,.22,.18,.2,.44,.2,[.22,.55,.22],{leg:-1,py:.44}),B(.12,.22,.18,.2,.44,.2,[.22,.55,.22],{leg:1,py:.44})]};
TYPES.pig={hp:8,r:.4,h:.9,sp:1.0,snd:"squeak",hs:"squeak",parts:[B(0,.6,0,.6,.5,.95,[.95,.7,.7]),B(0,.7,-.62,.42,.4,.4,[.95,.72,.72]),B(0,.62,-.85,.22,.16,.06,[.9,.55,.55]),B(-.12,.78,-.84,.05,.05,.02,[.1,.1,.1]),B(.12,.78,-.84,.05,.05,.02,[.1,.1,.1]),
  B(-.2,.2,.3,.16,.4,.16,[.9,.65,.65],{leg:1,py:.4}),B(.2,.2,.3,.16,.4,.16,[.9,.65,.65],{leg:-1,py:.4}),B(-.2,.2,-.3,.16,.4,.16,[.9,.65,.65],{leg:-1,py:.4}),B(.2,.2,-.3,.16,.4,.16,[.9,.65,.65],{leg:1,py:.4})]};
TYPES.horse={hp:20,r:.5,h:1.9,sp:1.2,snd:"squeak",hs:"squeak",parts:[B(0,1.2,0,.62,.72,1.5,[.45,.28,.15]),B(0,1.78,-.72,.3,.75,.34,[.45,.28,.15],{rot:-.35,py:1.4}),B(0,2.05,-1.0,.3,.4,.6,[.42,.26,.14]),B(0,1.85,-.55,.1,.6,.1,[.12,.08,.05]),B(0,1.1,.85,.14,.6,.1,[.12,.08,.05]),
  B(-.2,.5,.55,.2,1.0,.2,[.4,.25,.13],{leg:1,py:1.0}),B(.2,.5,.55,.2,1.0,.2,[.4,.25,.13],{leg:-1,py:1.0}),B(-.2,.5,-.55,.2,1.0,.2,[.4,.25,.13],{leg:-1,py:1.0}),B(.2,.5,-.55,.2,1.0,.2,[.4,.25,.13],{leg:1,py:1.0}),B(0,1.6,.1,.6,.1,.6,[.5,.1,.1])]};
const WHEEL=[.1,.1,.12],GLASS=[.6,.8,.92],HL=[1,.95,.6];
function veh(name,hp,r,h,parts){TYPES[name]={hp,r,h,sp:0,snd:"none",hs:"none",keep:true,noblood:true,metal:true,parts};}
veh("car",150,1.0,1.3,[B(0,.55,0,1.8,.6,3.4,[.8,.1,.1]),B(0,1.1,.3,1.5,.5,1.6,[.7,.08,.08]),B(0,1.15,-.52,1.46,.4,.06,GLASS),B(0,1.15,1.1,1.46,.4,.06,GLASS),B(-.76,1.15,.3,.04,.38,1.4,GLASS),B(.76,1.15,.3,.04,.38,1.4,GLASS),
  B(-.6,.62,-1.72,.3,.2,.06,HL),B(.6,.62,-1.72,.3,.2,.06,HL),B(-.6,.62,1.72,.3,.2,.06,[.9,.1,.1]),B(.6,.62,1.72,.3,.2,.06,[.9,.1,.1]),
  B(-.95,.3,-1.0,.3,.62,.62,WHEEL),B(.95,.3,-1.0,.3,.62,.62,WHEEL),B(-.95,.3,1.0,.3,.62,.62,WHEEL),B(.95,.3,1.0,.3,.62,.62,WHEEL)]);
veh("jeep",200,1.1,1.5,[B(0,.7,0,2.0,.7,3.2,[.3,.42,.25]),B(0,1.25,.4,1.9,.5,.1,[.25,.35,.2]),B(-.95,1.3,.2,.1,.9,.1,[.2,.2,.2]),B(.95,1.3,.2,.1,.9,.1,[.2,.2,.2]),B(0,1.7,.2,2.0,.08,.1,[.2,.2,.2]),B(0,1.2,-.7,1.8,.4,.06,GLASS),
  B(-.65,.8,-1.62,.3,.25,.06,HL),B(.65,.8,-1.62,.3,.25,.06,HL),B(-1.05,.38,-1.0,.36,.76,.76,WHEEL),B(1.05,.38,-1.0,.36,.76,.76,WHEEL),B(-1.05,.38,1.0,.36,.76,.76,WHEEL),B(1.05,.38,1.0,.36,.76,.76,WHEEL)]);
veh("truck",300,1.3,2.2,[B(0,.9,-.9,2.2,1.0,1.4,[.9,.65,.15]),B(0,1.5,-.95,2.0,.6,1.0,[.85,.6,.12]),B(0,1.55,-1.46,1.9,.4,.06,GLASS),B(0,.95,1.2,2.3,.12,2.4,[.4,.28,.15]),B(-1.1,1.3,1.2,.1,.6,2.4,[.45,.3,.15]),B(1.1,1.3,1.2,.1,.6,2.4,[.45,.3,.15]),B(0,1.3,2.38,2.3,.6,.1,[.45,.3,.15]),
  B(-.7,.9,-1.62,.4,.25,.06,HL),B(.7,.9,-1.62,.4,.25,.06,HL),B(-1.2,.45,-1.0,.4,.9,.9,WHEEL),B(1.2,.45,-1.0,.4,.9,.9,WHEEL),B(-1.2,.45,1.6,.4,.9,.9,WHEEL),B(1.2,.45,1.6,.4,.9,.9,WHEEL)]);
veh("skate",45,.45,.4,[B(0,.16,0,.34,.05,.95,[.85,.62,.2]),B(0,.19,0,.3,.01,.9,[.15,.15,.18]),B(-.12,.07,-.34,.07,.12,.12,[.9,.9,.9]),B(.12,.07,-.34,.07,.12,.12,[.9,.9,.9]),B(-.12,.07,.34,.07,.12,.12,[.9,.9,.9]),B(.12,.07,.34,.07,.12,.12,[.9,.9,.9]),B(0,.2,-.5,.3,.05,.08,[.85,.62,.2]),B(0,.2,.5,.3,.05,.08,[.85,.62,.2])]);
veh("bike",60,.5,1.3,[B(0,.55,0,.3,.35,1.3,[.15,.15,.2]),B(0,.8,-.2,.34,.2,.5,[.8,.1,.1]),B(0,1.0,-.6,.9,.08,.08,[.2,.2,.2]),B(0,.35,-.9,.16,.7,.7,WHEEL),B(0,.35,.9,.16,.7,.7,WHEEL),B(0,.6,-.95,.12,.08,.1,HL),B(0,.95,.2,.3,.1,.5,[.1,.1,.12])]);
for(const k in VEH)if(VEH[k].hp){TYPES[k].hp=VEH[k].hp;}
TYPES.pig.keep=false;

/* ================= Gore ================= */
const PEND={head:false};
function partWorld(m,p){const c0=Math.cos(m.yaw),s0=Math.sin(m.yaw),k=m.sc||1,x=p.c[0]*k,z=p.c[2]*k;return[m.x+x*c0+z*s0,m.y+p.c[1]*k,m.z-x*s0+z*c0];}
function bloodAt(x,y,z,n,vx,vz,spd){
  if(X.gore==="fun"){burst(x,y,z,n+6,4,()=>CONF[ri(0,4)],.1,1.4,{b:.4});return;}
  for(let i=0;i<n;i++)addP(x,y,z,vx+rnd(-1,1)*spd,rnd(1,5),vz+rnd(-1,1)*spd,rnd(.08,.17),BLOOD[ri(0,2)],rnd(1.5,2.6),{blood:true,b:.1,fr:.4});
}
function blood(m,dmg,fx,fz){
  const T=TYPES[m.type];if(!T)return;const cy=m.y+T.h*0.6;
  if(T.metal){burst(m.x,cy,m.z,6,5,()=>[1,.8,.3],.07,.4,{g:20,b:.4});return;}
  const dx=m.x-fx,dz=m.z-fz,L=Math.hypot(dx,dz)||1,n=X.gore==="full"?Math.min(14,3+(dmg*.7|0)):X.gore==="mid"?Math.min(6,2+(dmg*.25|0)):4;
  bloodAt(m.x,cy,m.z,n,dx/L*3,dz/L*3,2);
}
function preHurt(m,dmg,byP){
  const T=TYPES[m.type];
  if(m.type==="villager"&&byP&&S.mode==="survival")aggro(m);
  if(PEND.head){dmg*=2.2;if(byP)chip("💀 HEADSHOT!");m.headHit=true;PEND.head=false;}
  if(T.arms&&X.gore!=="fun"&&dmg>=6&&m.type!=="boss"&&Math.random()<0.3)loseArm(m,T);
  return dmg;
}
function loseArm(m,T){
  m.hide=m.hide||{};const idx=T.arms.find(i=>!m.hide[i]);if(idx===undefined)return;m.hide[idx]=true;
  const p=T.parts[idx],w=partWorld(m,p);
  addP(w[0],w[1],w[2],rnd(-3,3),rnd(4,8),rnd(-3,3),.2,p.col,12,{sx:p.s[0],sy:p.s[1],sz:p.s[2],b:.3,fr:.5});
  bloodAt(w[0],w[1]+.3,w[2],X.gore==="full"?16:7,0,0,3);m.armLost=(m.armLost||0)+1;
  if(X.gore==="full"){const sp=spatial(m.x,m.z);scream(sp[0],Math.max(.5,sp[1]));}
}
function goreDeath(m){
  const T=TYPES[m.type],cy=m.y+T.h*0.55;
  if(X.gore==="fun"){
    burst(m.x,cy,m.z,50,6,()=>CONF[ri(0,4)],.12,2,{b:.4});burst(m.x,cy+.3,m.z,6,5,()=>[1,.9,.2],.28,1.6,{b:.4});
    shotSound("pop",.8,spatial(m.x,m.z)[0]);
    if(Math.random()<0.4&&countT("chicken")<16){const c=A.makeMob("chicken",m.x,m.y+.2,m.z);c.sc=.55;c.flee=5;c.moving=true;A.mobs().push(c);}
    return;}
  if(T.metal){burst(m.x,cy,m.z,16,6,()=>[.3,.3,.32],.2,1.2,{g:16,b:.4});}
  const parts=T.parts.map((p,i)=>({p,i,v:p.s[0]*p.s[1]*p.s[2]})).filter(q=>!(m.hide&&m.hide[q.i]));
  parts.sort((a,b)=>b.v-a.v);const use=X.gore==="full"?parts.slice(0,14):parts.slice(0,5);
  for(const q of use){const w=partWorld(m,q.p),head=T.head&&T.head.includes(q.i),up=head&&m.headHit?9:rnd(3,7);
    addP(w[0],w[1],w[2],rnd(-4,4)+m.vx,up,rnd(-4,4)+m.vz,.2,q.p.col,14,{sx:q.p.s[0],sy:q.p.s[1],sz:q.p.s[2],b:.3,fr:.5});}
  if(!T.metal){
    bloodAt(m.x,cy,m.z,X.gore==="full"?34:14,0,0,4);
    if(T.head&&m.headHit)for(let i=0;i<18;i++)addP(m.x,m.y+T.h*.85,m.z,rnd(-1.3,1.3),rnd(5,9),rnd(-1.3,1.3),rnd(.09,.16),BLOOD[ri(0,2)],rnd(1.4,2.2),{blood:true,b:.1,fr:.4});
    if(X.gore==="full")for(let i=0;i<8;i++)addP(m.x+rnd(-1.5,1.5),m.y+.1,m.z+rnd(-1.5,1.5),0,0,0,rnd(.2,.4),BLOOD[ri(0,1)],rnd(14,24),{decal:true,sy:.04,sx:rnd(.4,.9),sz:rnd(.4,.9),g:0}),decals++;
    if(T.human&&X.gore==="full"){const sp=spatial(m.x,m.z);scream(sp[0],Math.max(.55,sp[1]));}
  }
}
const countT=t=>{let n=0;for(const m of mobs())if(m.type===t)n++;return n;};
function kill(m,byP){
  const T=TYPES[m.type];if(m.xdead)return;m.xdead=true;if(DV.m===m)dismount();
  if(m.cz)zKill(m,byP);else if(m.team)wKill(m,byP);
  if(byP){
    if(m.type==="zombie"){track("zombie");if(Math.random()<(X.bloodMoon?.8:.35))coins(X.bloodMoon?2:1);}
    else if(m.type==="soldier"){track("soldier");coins(ri(2,5));}
    else if(m.type==="boss"){track("soldier");coins(250);A.give(171,1);A.toast("Jenderal Besi kalah! +250 🪙 + Railgun");X.bossDead=true;}
    else if(m.type==="creeper")coins(1);
  }
  if(m.type==="shopkeeper"&&byP)for(const s of SHOPS)if(s.keeper===m){s.dead=true;}
  if(VEH[m.type]&&VEH[m.type].hp){explode(m.x,m.y+1,m.z,4,28,2,{byP:!!byP});}
  else goreDeath(m);
}
function coins(n){if(S.mode!=="survival")return;A.give(140,n,true);coinSnd();}

/* ================= Efek status ================= */
function applyFx(m,fx){
  m.fx=m.fx||{};
  if(fx==="slow"){m.fx.slow=6;if(!m.sp0)m.sp0=m.sp;}
  else if(fx==="burn")m.fx.burn=5;
  else if(fx==="poison")m.fx.poison=6;
  else if(fx==="confetti"){burst(m.x,m.y+TYPES[m.type].h*.6,m.z,22,5,()=>CONF[ri(0,4)],.1,1.6,{b:.4});m.vy=Math.max(m.vy,4);}
  else if(fx==="chicken"){if(countT("chicken")<20){const c=A.makeMob("chicken",m.x+rnd(-.5,.5),m.y+1.5,m.z+rnd(-.5,.5));c.flee=6;c.moving=true;c.vy=5;A.mobs().push(c);burst(m.x,m.y+1,m.z,8,3,()=>[1,1,1],.07,1,{b:.3});}}
}
function tickFx(dt){
  for(const m of mobs().slice()){
    if(m.spin>0){m.spinA=(m.spinA||0)+m.spin*dt;m.spin=Math.max(0,m.spin-dt*5);if(!m.spin)m.spinA=0;}
    const f=m.fx;if(!f)continue;
    if(f.burn>0){f.burn-=dt;m.hp-=dt*2.2;m.hurt=Math.max(m.hurt,0.05);if(Math.random()<dt*14)addP(m.x+rnd(-.3,.3),m.y+rnd(.2,1.4),m.z+rnd(-.3,.3),0,rnd(1,2.5),0,.12,[1,rnd(.3,.7),.1],.5,{g:-2});if(m.hp<=0){A.killMob(m,true);continue;}}
    if(f.poison>0){f.poison-=dt;m.hp-=dt*1.6;if(Math.random()<dt*8)addP(m.x+rnd(-.3,.3),m.y+rnd(.3,1.5),m.z+rnd(-.3,.3),0,rnd(.5,1.5),0,.1,[.4,.9,.2],.7,{g:-1});if(m.hp<=0){A.killMob(m,true);continue;}}
    if(f.slow>0){f.slow-=dt;m.sp=(m.sp0||m.sp)*0.35;if(f.slow<=0&&m.sp0){m.sp=m.sp0;m.sp0=0;}}
  }
}

/* ================= Senjata ================= */
const PEND2={};
function mflash(){const m=$$("mflash");if(!m)return;m.style.transition="none";m.style.opacity=1;requestAnimationFrame(()=>requestAnimationFrame(()=>{m.style.transition="opacity .12s";m.style.opacity=0;}));}
function dryClick(){A.tone("square",900,600,.03,.12);}
function fire(g){
  const surv=S.mode==="survival";
  if(surv&&count(g.ammo)<=0){S.atkCd=.4;dryClick();A.toast("Amunisi habis: "+AMMO[g.ammo]);return;}
  if(surv){A.take(g.ammo,1);if(count(g.ammo)<=0)A.refreshHotbar();A.updateHUD(true);}
  S.atkCd=g.cd;S.swing=.18;shotSound(g.snd,1);mflash();track("shoot");
  P.pitch=Math.min(1.5,P.pitch+(g.cd<.1?.01:g.pel>1?.06:.03));
  const o=A.eyePos(),base=lookDir();
  for(let i=0;i<g.pel;i++){
    let d=base;if(g.spr){d=[base[0]+rnd(-g.spr,g.spr),base[1]+rnd(-g.spr,g.spr),base[2]+rnd(-g.spr,g.spr)];const l=Math.hypot(d[0],d[1],d[2]);d=[d[0]/l,d[1]/l,d[2]/l];}
    bullet(o,d,g,i===0);
  }
}
function bullet(o,d,g,first){
  const w=raycast(o,d,g.rng);let wd=g.rng;if(w)wd=Math.max(1,Math.hypot(w.x+.5-o[0],w.y+.5-o[1],w.z+.5-o[2])-.6);
  const hit=A.pickMob(g.rng,0.05,d);let dist=wd,mh=null;
  if(hit&&hit.t<=wd+.3){mh=hit;dist=hit.t;}
  const right=[Math.cos(P.yaw),0,-Math.sin(P.yaw)],mp=[o[0]+d[0]*.8+right[0]*.25,o[1]+d[1]*.8-.22,o[2]+d[2]*.8+right[2]*.25];
  if(first||g.pel===1||Math.random()<.35){const sp=170;addP(mp[0],mp[1],mp[2],d[0]*sp,d[1]*sp,d[2]*sp,g.snd==="rail"?.18:.07,g.tc,Math.max(.02,dist/sp),{g:0});}
  if(g.snd==="rail"&&first){for(let k=2;k<dist;k+=2.2)addP(o[0]+d[0]*k,o[1]+d[1]*k-.1,o[2]+d[2]*k,0,0,0,.14,[.5,.8,1],.5,{g:0,fade:.5});}
  const px2=o[0]+d[0]*dist,py2=o[1]+d[1]*dist,pz2=o[2]+d[2]*dist;
  const pv=MP.on?mpRay(o,d,dist):null;
  if(pv){mpDmg(pv.pid,g.dmg*(pv.head?2:1),pv.head);bloodAt(pv.x,pv.y,pv.z,5,0,0,2);return;}
  if(mh){
    const m=mh.m,T=TYPES[m.type],hy=o[1]+d[1]*mh.t;
    if(T.head&&hy>m.y+T.h*.76)PEND.head=true;
    A.hurtMob(m,S.mode==="creative"?Math.max(g.dmg*3,20):g.dmg,P.x,P.z,true);PEND.head=false;
    if(g.fx)applyFx(m,g.fx);
    if(g.fx==="chain")chain(m,g);
  }else if(w){burst(px2,py2,pz2,4,3,()=>[.9,.8,.5],.05,.35,{g:14,b:.4});}
}
function chain(m,g){
  let n=0;for(const o of mobs()){if(o===m||n>=3)continue;if(Math.hypot(o.x-m.x,o.z-m.z)<7&&Math.abs(o.y-m.y)<3&&!VEH[o.type]){n++;
    for(let k=0;k<=1;k+=.12)addP(m.x+(o.x-m.x)*k+rnd(-.2,.2),m.y+1+(o.y-m.y)*k+rnd(-.2,.2),m.z+(o.z-m.z)*k+rnd(-.2,.2),0,0,0,.09,[1,1,.5],.25,{g:0});
    A.hurtMob(o,g.dmg*.6,m.x,m.z,true);}}
}
/* ================= Granat & ledakan ================= */
const grens=[],zones=[],prim=[];
function throwG(gr){
  if(S.mode==="survival"){if(count(gr.id)<=0)return;A.take(gr.id,1);A.refreshHotbar();}
  else{X.cr[gr.id]=(X.cr[gr.id]||64)-1;if(X.cr[gr.id]<=0)X.cr[gr.id]=64;A.refreshHotbar();}
  S.atkCd=.6;S.swing=.25;const o=A.eyePos(),d=lookDir();
  grens.push({gr,x:o[0]+d[0]*.6,y:o[1]-.2,z:o[2]+d[2]*.6,vx:d[0]*15+P.vx*.5,vy:d[1]*15+3.5,vz:d[2]*15+P.vz*.5,t:gr.fuse,stuck:null});
  A.tone("triangle",420,260,.08,.25);
}
function updG(dt){
  for(let i=grens.length-1;i>=0;i--){
    const g=grens[i];g.t-=dt;
    if(g.stuck){if(mobs().includes(g.stuck)){g.x=g.stuck.x;g.y=g.stuck.y+1;g.z=g.stuck.z;}else g.stuck=null;}
    else if(!g.still){
      g.vy-=22*dt;const ox=g.x,oy=g.y,oz=g.z;g.x+=g.vx*dt;g.y+=g.vy*dt;g.z+=g.vz*dt;
      if(solid(Math.floor(g.x),Math.floor(g.y),Math.floor(g.z))){
        if(g.gr.id===185){g.still=true;g.x=ox;g.y=oy;g.z=oz;}
        else{if(Math.floor(g.x)!==Math.floor(ox)){g.vx*=-.45;g.x=ox;}if(Math.floor(g.z)!==Math.floor(oz)){g.vz*=-.45;g.z=oz;}
          if(Math.floor(g.y)!==Math.floor(oy)){g.vy*=-.4;g.y=oy;g.vx*=.7;g.vz*=.7;if(Math.abs(g.vy)<1.5)g.vy=0;}}}
      if(g.gr.id===185)for(const m of mobs()){if(!VEH[m.type]&&Math.hypot(m.x-g.x,m.z-g.z)<.8&&Math.abs(m.y+1-g.y)<1.4){g.stuck=m;break;}}
    }
    if(g.t<=0){grens.splice(i,1);detonate(g);}
  }
  for(let i=prim.length-1;i>=0;i--){const p=prim[i];p.t-=dt;p.vy-=20*dt;p.y+=p.vy*dt;if(solid(Math.floor(p.x),Math.floor(p.y),Math.floor(p.z))){p.y=Math.floor(p.y)+1;p.vy=0;}
    if(p.t<=0){prim.splice(i,1);explode(p.x,p.y+.5,p.z,4.6,55,3,{byP:true});}}
  for(let i=zones.length-1;i>=0;i--){
    const z=zones[i];z.t-=dt;if(z.t<=0){zones.splice(i,1);if(z.kind==="magnet")explode(z.x,z.y,z.z,3.6,35,1.5,{byP:true});continue;}
    const fxz=z.kind;
    if(fxz==="smoke"){if(Math.random()<dt*30)addP(z.x+rnd(-2,2),z.y+rnd(0,1.5),z.z+rnd(-2,2),rnd(-.3,.3),rnd(.3,.8),rnd(-.3,.3),rnd(.9,1.6),[.65,.65,.68],3.5,{g:0,fade:1});
      for(const m of mobs())if(Math.hypot(m.x-z.x,m.z-z.z)<5&&!VEH[m.type]){m.fx=m.fx||{};m.fx.stun=Math.max(m.fx.stun||0,.6);}}
    else if(fxz==="fire"){if(Math.random()<dt*50)addP(z.x+rnd(-2.5,2.5),z.y+.1,z.z+rnd(-2.5,2.5),0,rnd(1.5,4),0,rnd(.2,.4),[1,rnd(.35,.85),.1],.7,{g:-2,fade:.4});
      for(const m of mobs())if(Math.hypot(m.x-z.x,m.z-z.z)<3.2&&Math.abs(m.y-z.y)<2.5&&!VEH[m.type]){m.fx=m.fx||{};m.fx.burn=Math.max(m.fx.burn||0,4);}
      if(Math.hypot(P.x-z.x,P.z-z.z)<2.6&&Math.abs(P.y-z.y)<2.5&&(z.hd=(z.hd||0)+dt)>.8){z.hd=0;A.hurtPlayer(2);}}
    else if(fxz==="poison"){if(Math.random()<dt*30)addP(z.x+rnd(-2.2,2.2),z.y+rnd(.1,1.2),z.z+rnd(-2.2,2.2),rnd(-.2,.2),rnd(.2,.6),rnd(-.2,.2),rnd(.5,.9),[.4,.8,.2],2.5,{g:0,fade:1});
      for(const m of mobs())if(Math.hypot(m.x-z.x,m.z-z.z)<4.5&&!VEH[m.type]){m.fx=m.fx||{};m.fx.poison=Math.max(m.fx.poison||0,3);}
      if(Math.hypot(P.x-z.x,P.z-z.z)<4&&(z.hd=(z.hd||0)+dt)>1){z.hd=0;A.hurtPlayer(1);}}
    else if(fxz==="magnet"){for(const m of mobs()){const dx=z.x-m.x,dz=z.z-m.z,d=Math.hypot(dx,dz);if(d<9&&d>.8&&!VEH[m.type]){m.vx+=dx/d*18*dt;m.vz+=dz/d*18*dt;m.fx=m.fx||{};m.fx.stun=Math.max(m.fx.stun||0,.3);}}
      if(Math.random()<dt*25)addP(z.x+rnd(-4,4),z.y+rnd(0,2),z.z+rnd(-4,4),0,0,0,.1,[.9,.2,.2],.4,{g:0,fade:.3});}
  }
}
function detonate(g){
  const gr=g.gr,x=g.x,y=g.y,z=g.z;
  switch(gr.id){
    case 180:explode(x,y,z,4.6,45,2,{byP:true});track("boom");break;
    case 185:explode(x,y,z,3.8,62,1.5,{byP:true});track("boom");break;
    case 181:zones.push({kind:"smoke",x,y,z,t:8});shotSound("smallboom",.4,spatial(x,z)[0]);break;
    case 182:{const dx=x-P.x,dz=z-P.z,dist=Math.hypot(dx,dz),f=lookDir(),facing=(dx*f[0]+dz*f[2])/(dist||1);
      if(dist<22)flashWhite(facing>0?1:.35);A.tone("sine",6500,5200,1.6,.18);shotSound("pop",.9,spatial(x,z)[0]);
      for(const m of mobs())if(Math.hypot(m.x-x,m.z-z)<14&&!VEH[m.type]){m.fx=m.fx||{};m.fx.stun=5;}
      burst(x,y,z,16,5,()=>[1,1,.85],.25,.5,{g:2});break;}
    case 183:zones.push({kind:"fire",x,y,z,t:6});shotSound("fire",.9,spatial(x,z)[0]);burst(x,y,z,20,5,()=>[1,.6,.1],.3,.8,{g:-2});break;
    case 184:burst(x,y+.5,z,50,6,()=>[.6,.85,1],.16,1.4,{b:.4});shotSound("ice",.9,spatial(x,z)[0]);
      for(const m of mobs())if(Math.hypot(m.x-x,m.z-z)<6&&!VEH[m.type]){m.fx=m.fx||{};m.fx.slow=8;if(!m.sp0)m.sp0=m.sp;}break;
    case 186:zones.push({kind:"magnet",x,y:y+.5,z,t:2.2});A.tone("sine",200,700,.8,.3);break;
    case 187:zones.push({kind:"poison",x,y,z,t:7});shotSound("poison",.8,spatial(x,z)[0]);break;
    case 188:burst(x,y+.5,z,90,7,()=>CONF[ri(0,4)],.13,2.4,{b:.4});A.tone("square",330,330,.15,.3);A.tone("square",250,250,.3,.3,0,.15);
      for(const m of mobs())if(Math.hypot(m.x-x,m.z-z)<7&&!VEH[m.type]){m.fx=m.fx||{};m.fx.dance=5;}break;
    case 189:{for(let k=0;k<5;k++){const c=A.makeMob("chicken",x+rnd(-1,1),y+.5,z+rnd(-1,1));c.vy=rnd(4,8);c.vx=rnd(-4,4);c.vz=rnd(-4,4);c.flee=7;c.moving=true;A.mobs().push(c);}
      burst(x,y+.5,z,30,6,()=>[1,1,1],.1,1.5,{b:.3});explode(x,y,z,2.6,10,0,{byP:true,quiet:true});SFX.cluck(0,1);break;}
  }
}
function setAir(x,y,z){const i=idx(x,y,z);blocks[i]=0;edits[i]=0;markDirty(x,z);mpBlock(x,y,z,0);save();}
function breakBlocks(x,y,z,r){
  let cnt=0;const cols=new Set(),cx=Math.floor(x),cy=Math.floor(y),cz=Math.floor(z);
  for(let dy=-r;dy<=r;dy++)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){
    if(dx*dx+dy*dy+dz*dz>r*r+Math.random()*1.2)continue;
    const bx=cx+dx,by=cy+dy,bz=cz+dz;if(by<=0||by>=H||bx<1||bz<1||bx>=W-1||bz>=D-1)continue;
    const id=get(bx,by,bz);if(id===AIR||id===WATER||id===19)continue;
    if(id===18){ignite(bx,by,bz,rnd(.3,1));continue;}
    const i=idx(bx,by,bz);blocks[i]=0;edits[i]=0;mpBlock(bx,by,bz,0);cols.add(bx*1000+bz);if(cnt++<14&&Math.random()<.5)addP(bx+.5,by+.5,bz+.5,rnd(-4,4),rnd(2,7),rnd(-4,4),.2,[.45,.35,.25],1.2,{b:.3});
  }
  for(const c of cols)markDirty(Math.floor(c/1000),c%1000);if(cols.size)save();
}
function ignite(x,y,z,t){if(get(x,y,z)!==18)return;setAir(x,y,z);prim.push({x:x+.5,y,z:z+.5,vy:4,t:t||3});A.tone("sawtooth",900,300,.5,.15);}
function explode(x,y,z,r,dmg,br,o){
  o=o||{};const sp=spatial(x,z);if(!o.quiet)shotSound("boom",Math.max(.25,sp[1]),sp[0]);
  burst(x,y,z,34,r*2.2,()=>[1,rnd(.45,.95),.1],.35,.9,{g:-3,b:.2});burst(x,y,z,22,r*1.4,()=>{const c=rnd(.25,.5);return[c,c,c];},.55,1.8,{g:-1.5,b:.2,fade:.8});
  const rr=r*1.5;
  for(const m of mobs().slice()){
    const dx=m.x-x,dz=m.z-z,dy=m.y+TYPES[m.type].h*.5-y,d=Math.hypot(dx,dy,dz);if(d>=rr)continue;
    const f=1-d/rr;if(!VEH[m.type]||o.byP||true){const L=Math.hypot(dx,dz)||1;m.vx+=dx/L*14*f;m.vz+=dz/L*14*f;m.vy=Math.max(m.vy,5+7*f);m.spin=13;
      A.hurtMob(m,dmg*f,x,z,!!o.byP);}
  }
  const pd=Math.hypot(P.x-x,P.y+.9-y,P.z-z);
  if(pd<rr&&!(DV.m&&DV.m.exploding)){const f=1-pd/rr,L=Math.hypot(P.x-x,P.z-z)||1;P.vx+=(P.x-x)/L*10*f;P.vz+=(P.z-z)/L*10*f;P.vy=Math.max(P.vy,6*f);if(S.mode==="survival")A.hurtPlayer(Math.max(1,Math.round(dmg*.5*f)));if(pd<rr*.7)flashWhite(.4*f+.1);}
  if(MP.on)for(const k in MP.rp){const r=MP.rp[k];if(r.dead||r.y<-50)continue;const d2=Math.hypot(r.x-x,r.y+.9-y,r.z-z);if(d2<rr)mpDmg(k,Math.max(1,Math.round(dmg*.5*(1-d2/rr))),false);}
  if(br>0)breakBlocks(x,y,z,br);
}
/* ================= Creeper ================= */
function creeperAI(m,dt,dist,dx,dz){
  const surv=S.mode==="survival";
  if(surv&&dist<22){m.yaw=Math.atan2(-dx,-dz);m.moving=dist>2.4;
    if(dist<3.4){if(!m.fuse){m.fuse=.01;shotSound("smallboom",.0,0);const s=spatial(m.x,m.z);SFX.hiss(s[0],Math.max(.6,s[1]));}m.fuse+=dt;m.hurt=Math.floor(m.fuse*8)%2?.12:0;m.sc=1+Math.min(.25,m.fuse*.15);
      if(m.fuse>1.4){const arr=mobs(),i=arr.indexOf(m);if(i>=0)arr.splice(i,1);explode(m.x,m.y+.8,m.z,3.8,24,2,{byP:false});}}
    else if(m.fuse){m.fuse=0;m.sc=1;}
  }else{m.t-=dt;if(m.t<=0){m.moving=Math.random()<.5;m.yaw=Math.random()*6.283;m.t=rnd(1.5,4);}}
}

/* ================= Kendaraan & tunggangan ================= */
const DV={m:null,spd:0,prevThird:false};
let eng=null;
function engineStart(){snd(ac=>{if(eng)return;const o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();o.type="sawtooth";o2.type="square";f.type="lowpass";f.frequency.value=500;g.gain.value=0;o.connect(f);o2.connect(f);f.connect(g);g.connect(A.master());o.start();o2.start();eng={o,o2,g,f};});}
function engineSet(spd,max){if(!eng)return;try{const t=A.ac().currentTime,k=clamp(Math.abs(spd)/max,0,1);eng.o.frequency.setTargetAtTime(48+k*110,t,.1);eng.o2.frequency.setTargetAtTime(24+k*55,t,.1);eng.g.gain.setTargetAtTime(S.sound?(.05+.09*k):0,t,.1);eng.f.frequency.setTargetAtTime(350+k*900,t,.1);}catch(e){}}
function engineStop(){if(!eng)return;try{eng.g.gain.setTargetAtTime(0,A.ac().currentTime,.05);}catch(e){}const e=eng;eng=null;setTimeout(()=>{try{e.o.stop();e.o2.stop();}catch(x){}},400);}
function honk(){A.tone("square",420,420,.35,.35);A.tone("square",530,530,.35,.3);}
function spawnVeh(type,x,y,z){const m=A.makeMob(type,x,y,z);m.veh=VEH[type];m.hpv=100;m.spd=0;A.mobs().push(m);return m;}
function mount(m){
  if(DV.m)return;const v=VEH[m.type];m.veh=v;DV.m=m;DV.spd=0;m.riden=true;m.drv=true;m.spd=0;DV.prevThird=S.third;S.third=true;
  $$("bExit").classList.add("show");if(!v.animal&&!v.board)engineStart();
  A.toast("Naik "+v.n+" · joystick: gas/setir · Lompat: "+(v.animal?"lompat":"rem")+(v.animal?"":" · Serang: klakson")+" · tombol Turun");A.updateHUD(true);
}
function dismount(quiet){
  const m=DV.m;if(!m)return;m.riden=false;m.drv=false;m.moving=false;m.spd=0;DV.m=null;DV.spd=0;engineStop();
  const c=Math.cos(m.yaw),s=Math.sin(m.yaw);let ok=false;
  for(const q of[[2,0],[-2,0],[0,2.2],[0,-2.2]]){const x=m.x+c*q[0]+s*q[1]*0,z=m.z-s*q[0]+c*q[1];if(!hits(x,m.y+.1,z)){P.x=x;P.z=z;P.y=m.y+.1;ok=true;break;}}
  if(!ok){P.x=m.x;P.z=m.z;P.y=m.y+2.5;}
  P.vx=P.vy=P.vz=0;S.fallTop=P.y;S.third=DV.prevThird;const b=$$("bExit");if(b)b.classList.remove("show");if(!quiet)A.updateHUD(true);
}
function ride(m,dt){
  const v=VEH[m.type],k=input.keys;
  let f=-input.fz+((k.KeyW||k.ArrowUp)?1:0)-((k.KeyS||k.ArrowDown)?1:0),s=input.fx+((k.KeyD||k.ArrowRight)?1:0)-((k.KeyA||k.ArrowLeft)?1:0);
  f=clamp(f,-1,1);s=clamp(s,-1,1);const jump=input.jump||k.Space;
  let tgt=f>0?v.max*f:f<0?v.max*.35*f:0;if(!v.animal&&!v.board&&jump)tgt=0;
  const rate=Math.abs(tgt)>Math.abs(DV.spd)?v.acc:(v.animal?4:(jump?6:1.1));
  DV.spd+=(tgt-DV.spd)*Math.min(1,dt*rate);
  const tf=v.animal?(.35+.65*clamp(Math.abs(DV.spd)/3,0,1)):clamp(Math.abs(DV.spd)/5,0,1);
  m.yaw-=s*v.turn*dt*tf*(DV.spd<-.3?-1:1);m.spd=DV.spd;m.drv=true;m.moving=Math.abs(DV.spd)>.4;
  if((v.animal||v.board)&&jump&&m.ground)m.vy=v.jump;
  if(Math.abs(DV.spd)>2.5){let dy=m.yaw-P.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));P.yaw+=dy*Math.min(1,dt*(v.animal?1.5:2.5));}
}
function vehicleStep(dt){
  const m=DV.m;if(!m)return;
  if(!mobs().includes(m)){dismount();return;}
  const v=VEH[m.type];
  m.speedNow=Math.hypot(m.x-(m.lx===undefined?m.x:m.lx),m.z-(m.lz===undefined?m.z:m.lz))/Math.max(dt,.001);m.lx=m.x;m.lz=m.z;
  if(!v.animal){
    if(Math.abs(DV.spd)>7&&m.speedNow<Math.abs(DV.spd)*.35){
      const sp=Math.abs(DV.spd);m.hp-=sp*3.2;m.hurt=.3;DV.spd*=.2;burst(m.x,m.y+.8,m.z,12,6,()=>[1,.8,.3],.08,.5,{g:16,b:.4});shotSound("smallboom",.7,0);
      if(sp>13)A.hurtPlayer(Math.round(sp*.22));
      if(m.hp<=0){dismount();A.killMob(m,false);return;}
    }
    if(Math.abs(DV.spd)>4)for(const o of mobs()){
      if(o===m)continue;const ot=TYPES[o.type];if(VEH[o.type]&&VEH[o.type].hp)continue;if(o.runCd>0){o.runCd-=dt;continue;}
      if(Math.hypot(o.x-m.x,o.z-m.z)<v.r+ot.r+.35&&Math.abs(o.y-m.y)<1.7){o.runCd=.5;A.hurtMob(o,Math.abs(DV.spd)*2.6,m.x,m.z,true);o.vx+=Math.sin(-m.yaw)*0;o.vx+=-Math.sin(m.yaw)*DV.spd*.7;o.vz+=-Math.cos(m.yaw)*DV.spd*.7;o.vy=Math.max(o.vy,6);o.spin=14;DV.spd*=.9;}
    }
    m.hpv=m.hp/v.hp*100;
    if(m.hpv<35&&Math.random()<dt*14)addP(m.x+rnd(-.5,.5),m.y+1.2,m.z+rnd(-.5,.5),0,rnd(1,2),0,.35,[.2,.2,.2],1.2,{g:-1,fade:.6});
    X.drive+=Math.abs(DV.spd)*dt;if(X.drive>=10){track("drive",Math.floor(X.drive));X.drive%=10;}
    engineSet(DV.spd,v.max);
  }
  P.x=m.x;P.z=m.z;P.y=m.y+(v.animal?(m.type==="horse"?1.15:.7):v.board?.2:.55);P.vx=P.vy=P.vz=0;S.fallTop=P.y;
}
/* ================= Ternak, pancing ================= */
const BREED={cow:1,sheep:1,pig:1,chicken:1,horse:1},births=[];
function feed(m,h){
  if(m.baby||m.love>0)return;if(S.mode==="survival"){A.take(h,1);A.refreshHotbar();}
  m.love=20;burst(m.x,m.y+(TYPES[m.type].h||1)+.2,m.z,7,2,()=>[1,.3,.5],.12,1,{g:-1});A.tone("sine",700,1100,.2,.25);
  for(const o of mobs())if(o!==m&&o.type===m.type&&o.love>0&&!o.baby&&Math.hypot(o.x-m.x,o.z-m.z)<12){m.love=o.love=0;births.push({t:3,type:m.type,x:(m.x+o.x)/2,y:m.y,z:(m.z+o.z)/2});break;}
}
function fishUse(){
  const f=X.fish;
  if(f){if(f.bite>0)catchFish();else{X.fish=null;A.toast("Pancing ditarik");}return;}
  const o=A.eyePos(),d=lookDir();
  for(let t=1;t<=9;t+=.25){const x=o[0]+d[0]*t,y=o[1]+d[1]*t,z=o[2]+d[2]*t;if(get(Math.floor(x),Math.floor(y),Math.floor(z))===WATER){X.fish={x,y:Math.floor(y)+.88,z,t:rnd(4,9),bite:0};A.toast("Memancing… tunggu ikan menggigit");A.tone("triangle",500,200,.2,.3);return;}}
  A.toast("Bidik ke air dulu");
}
function catchFish(){
  const f=X.fish;X.fish=null;const r=Math.random();burst(f.x,f.y,f.z,14,3,()=>[.7,.85,1],.08,.8,{b:.2});
  if(r<.05){A.give(111,1);}else if(r<.09){A.give(140,ri(10,30));coinSnd();}else A.give(193,1);track("fish");
}
/* ================= Peti & rak ================= */
const LOOT={},SHELF={};
function openChest(t){
  const key=idx(t.x,t.y,t.z);
  if(X.chests[key]===undefined){const first=LOOT[key]&&!X.chestOpen[key];X.chests[key]=first?Object.assign({},LOOT[key]):{};X.chestOpen[key]=1;if(first){burst(t.x+.5,t.y+1,t.z+.5,30,5,()=>[1,rnd(.7,.95),.1],.14,1.4,{b:.4});coinSnd();}}
  X.cur=key;renderChest();panels.ch.open();
}
function renderChest(){
  const b=panels.ch.body;b.innerHTML="";const C=X.chests[X.cur]||(X.chests[X.cur]={});
  const rowOf=(id,n,btns)=>{const r=el("div",{class:"rrow"},b);r.appendChild(A.iconCanvas(+id));const i=el("div",{class:"rinfo"},r);el("b",{text:NAMES[id]+" ×"+n},i);
    for(const bt of btns){const x=el("button",{text:bt[0],style:"margin-left:4px"},r);x.addEventListener("click",()=>{bt[1]();renderChest();});}};
  const toInv=(id,n)=>{n=Math.min(n,C[id]|0);if(n<=0)return;C[id]-=n;if(!C[id])delete C[id];A.give(+id,n,true);SFX.pick();A.refreshHotbar();};
  const toChest=(id,n)=>{n=Math.min(n,S.inv[id]|0);if(n<=0)return;A.take(+id,n);C[id]=(C[id]|0)+n;SFX.click();A.refreshHotbar();};
  const ids=Object.keys(C).filter(i=>C[i]>0),inv=Object.keys(S.inv).filter(i=>S.inv[i]>0);
  const all=el("button",{text:"⬇ Ambil semua isi peti",style:"width:100%;margin-bottom:6px"},b);all.addEventListener("click",()=>{for(const id of ids)toInv(id,C[id]);renderChest();});
  el("div",{class:"qrow",text:"Isi peti"},b);
  if(!ids.length)el("p",{class:"note",text:"Peti kosong. Taruh barang dari tasmu di bawah."},b);
  for(const id of ids)rowOf(id,C[id],[["Ambil 1",()=>toInv(id,1)],["Semua",()=>toInv(id,C[id])]]);
  el("div",{class:"qrow",text:"Tasmu"},b);
  if(!inv.length)el("p",{class:"note",text:"Tasmu kosong."},b);
  for(const id of inv)rowOf(id,S.inv[id],[["Taruh 1",()=>toChest(id,1)],["Semua",()=>toChest(id,S.inv[id])]]);
}
function takeShelf(t){
  const key=idx(t.x,t.y,t.z),sh=SHELF[key];
  if(!sh||X.stolen[key]){A.toast("Rak kosong (stok baru besok)");return;}
  X.stolen[key]=1;const s=SHOPS[sh.shop];
  if(S.mode==="survival"&&s&&s.keeper&&!s.dead&&mobs().includes(s.keeper)){
    const k=s.keeper,d=Math.hypot(k.x-P.x,k.z-P.z),asleep=DAY.night&&!(k.angry>0);
    if(asleep){if(Math.random()<.4){k.angry=60;chip("Penjaga terbangun!");shout();}else A.toast("Kamu mencuri diam-diam…");}
    else if(d<16&&los(k,d)){k.angry=60;chip("🗣 Hei, maling!");shout();}
  }
  A.give(sh.item,sh.n);
}
const WARES={warung:[{id:133,n:1,p:6},{id:107,n:1,p:8},{id:194,n:1,p:7},{id:132,n:3,p:6},{id:131,n:3,p:4}],
 senjata:[{id:130,n:10,p:18},{id:137,n:6,p:24},{id:138,n:15,p:32},{id:139,n:10,p:36},{id:150,n:1,p:110},{id:160,n:1,p:190},{id:180,n:1,p:55},{id:182,n:1,p:40}],
 alat:[{id:116,n:1,p:90},{id:119,n:1,p:90},{id:128,n:1,p:60},{id:192,n:1,p:25},{id:190,n:1,p:70},{id:191,n:1,p:250},{id:197,n:1,p:180}]};
WARES.mega=[].concat(WARES.warung,WARES.senjata,WARES.alat);
const SELL={111:8,132:2,101:2,107:3,15:3,193:2,194:4,109:3,102:3,8:1,3:1};
function openShop(m){
  const s=SHOPS.find(q=>q.keeper===m);if(!s)return;
  if(S.mode!=="survival"){A.toast("Kedai hanya di mode Survival");return;}
  if(DAY.night&&!(m.angry>0)){A.toast("Zzz… penjaga tidur. Kembali besok pagi");return;}
  renderShop(s);panels.shp.open();
}
function renderShop(s){
  const b=panels.shp.body;b.innerHTML="";const k=s.keeper;
  panels.shp.title.textContent="🏪 "+({warung:"Warung",senjata:"Toko Senjata",alat:"Toko Alat",mega:"Toko Serba Ada"})[s.kind]+" · "+(s.mood<1?"ramah":s.mood>1?"pelit":"biasa");
  el("p",{class:"note",text:"🪙 Koin: "+count(140)},b);
  if(k&&k.angry>0){const r=el("div",{class:"rrow"},b);el("div",{class:"rinfo",text:"Penjaga marah! Bayar denda 50 🪙 agar damai."},r);const x=el("button",{text:"Bayar"},r);x.addEventListener("click",()=>{if(count(140)>=50){A.take(140,50);k.angry=0;SFX.craft();A.toast("Penjaga memaafkanmu");renderShop(s);}else A.toast("Koin kurang");});}
  el("div",{class:"qrow",text:"Beli"},b);
  for(const w of WARES[s.kind]){const pr=Math.max(1,Math.round(w.p*s.mood)),r=el("div",{class:"rrow"},b);r.appendChild(A.iconCanvas(w.id));
    const i=el("div",{class:"rinfo"},r);el("b",{text:NAMES[w.id]+(w.n>1?" ×"+w.n:"")},i);el("small",{text:pr+" 🪙"},i);
    const x=el("button",{text:"Beli"},r);if(count(140)<pr)x.disabled=true;x.addEventListener("click",()=>{if(count(140)<pr)return;A.take(140,pr);A.give(w.id,w.n,true);coinSnd();track("buy");A.refreshHotbar();renderShop(s);});}
  el("div",{class:"qrow",text:"Jual"},b);let any=false;
  for(const id in SELL){if(count(id)<=0)continue;any=true;const pr=SELL[id],r=el("div",{class:"rrow"},b);r.appendChild(A.iconCanvas(+id));
    const i=el("div",{class:"rinfo"},r);el("b",{text:NAMES[id]+" (punya "+count(id)+")"},i);el("small",{text:"jual 1 = "+pr+" 🪙"},i);
    const x=el("button",{text:"Jual"},r);x.addEventListener("click",()=>{if(count(id)<=0)return;A.take(+id,1);A.give(140,pr,true);coinSnd();A.refreshHotbar();renderShop(s);});}
  if(!any)el("p",{class:"note",text:"Tidak ada barang yang bisa dijual."},b);
}
/* ================= Tentara, boss & penjaga ================= */
function los(m,dist){const ax=m.x,ay=m.y+1.5,az=m.z,bx=P.x,by=P.y+1.4,bz=P.z,n=Math.max(2,Math.ceil(dist/.8));for(let i=1;i<n;i++){const t=i/n;if(solid(Math.floor(ax+(bx-ax)*t),Math.floor(ay+(by-ay)*t),Math.floor(az+(bz-az)*t)))return false;}return true;}
function npcShoot(m,dist,kind,dmg,acc){
  const k=m.type==="boss"?1.5:1,ex=P.x-m.x,ey=P.y+1.3-(m.y+1.2*k),ez=P.z-m.z,L=Math.hypot(ex,ey,ez)||1,sp=65;
  addP(m.x+ex/L*.8,m.y+1.2*k,m.z+ez/L*.8,ex/L*sp,ey/L*sp,ez/L*sp,.07,[1,.8,.3],Math.min(.6,L/sp),{g:0});
  burst(m.x+ex/L*.9,m.y+1.2*k,m.z+ez/L*.9,3,2,()=>[1,.7,.2],.1,.12,{g:0});
  shotAt(kind,m.x,m.z,1.5);
  if(Math.random()<clamp(acc-dist*.018,.12,.8)){
    if(DV.m&&!VEH[DV.m.type].animal){DV.m.hp-=dmg*2;DV.m.hurt=.2;burst(P.x,P.y+1,P.z,5,4,()=>[1,.8,.3],.07,.4,{g:16});}
    else hitPlayer(dmg,m.x,m.z,kind);
  }
}
/* ================= Perang antar pasukan ================= */
const FAC={soldier:1,boss:1,soldier2:2,zombie:0,creeper:0,spider:0};
function losM(a,b){const ax=a.x,ay=a.y+1.5,az=a.z,bx=b.x,by=b.y+1.2,bz=b.z,d=Math.hypot(bx-ax,bz-az),n=Math.max(2,Math.ceil(d/.8));for(let i=1;i<n;i++){const t=i/n;if(solid(Math.floor(ax+(bx-ax)*t),Math.floor(ay+(by-ay)*t),Math.floor(az+(bz-az)*t)))return false;}return true;}
function findEnemy(m){
  const fm=FAC[m.type];let best=null,bd=32;
  for(const o of mobs()){const fo=FAC[o.type];if(fo===undefined||fo===fm||o.hp<=0)continue;const d=Math.hypot(o.x-m.x,o.z-m.z);if(d<bd&&Math.abs(o.y-m.y)<8&&losM(m,o)){bd=d;best=o;}}
  return best?{o:best,d:bd}:null;
}
function fight(m,dt,te){
  const o=te.o;m.cd=(m.cd||0)-dt;m.yaw=Math.atan2(-(m.x-o.x),-(m.z-o.z));m.moving=te.d>11;
  if(m.cd<=0&&te.d<34){m.cd=(m.type==="boss"?.55:1.1)*rnd(.9,1.3);
    const ex=o.x-m.x,ey=o.y+1-(m.y+1.2),ez=o.z-m.z,L=Math.hypot(ex,ey,ez)||1;
    addP(m.x+ex/L*.8,m.y+1.2,m.z+ez/L*.8,ex/L*65,ey/L*65,ez/L*65,.07,[1,.8,.3],Math.min(.5,L/65),{g:0});
    burst(m.x+ex/L*.9,m.y+1.2,m.z+ez/L*.9,2,2,()=>[1,.7,.2],.09,.1,{g:0});shotAt("rifle",m.x,m.z,1.2);
    if(Math.random()<.7)A.hurtMob(o,m.type==="boss"?9:6,m.x,m.z,false);}
  return true;
}
function allyAI(m,dt){
  if(!m.home)m.home=[m.x,m.z];
  const te=findEnemy(m);if(te&&fight(m,dt,te))return;
  m.t=(m.t||0)-dt;
  if(m.raid){if(Math.hypot(m.x-m.raid[0],m.z-m.raid[1])<12){m.raid=null;m.home=[m.x,m.z];}else{goToward(m,m.raid[0],m.raid[1]);return;}}
  if(Math.hypot(m.x-m.home[0],m.z-m.home[1])>5)goToward(m,m.home[0],m.home[1]);
  else if(m.t<=0){m.moving=Math.random()<.4;m.yaw=Math.random()*6.283;m.t=rnd(1.5,4);}
}
function raidTick(dt){
  X.raidT=(X.raidT===undefined?50:X.raidT)-dt;if(X.raidT>0||!BASE||!BASE2)return;X.raidT=70;
  const fromB2=(X.raidN=(X.raidN|0)+1)%2===1,a=fromB2?BASE2:BASE,b=fromB2?BASE:BASE2;
  if(Math.hypot(a.cx-P.x,a.cz-P.z)>130&&Math.hypot(b.cx-P.x,b.cz-P.z)>130)return;
  let n=0;for(const m of mobs())if(FAC[m.type]>0)n++;if(n>75)return;
  for(let i=0;i<5;i++){const m=A.makeMob(fromB2?"soldier2":"soldier",a.cx+rnd(-3,3),a.h0+.05,a.cz+14+rnd(-1,1));m.raid=[b.cx,b.cz+10];A.mobs().push(m);}
  chip(fromB2?"⚔ Pasukan Biru menyerang Markas Besi!":"⚔ Pasukan Besi menyerang Pos Biru!");
}
function soldierAI(m,dt,dist,dx,dz){
  const surv=S.mode==="survival",boss=m.type==="boss";m.cd=(m.cd||0)-dt;
  const see=surv&&dist<34&&los(m,dist);
  if(!see){const te=findEnemy(m);if(te&&fight(m,dt,te))return;}
  if(see){if(X.alertT<=0){chip("🚨 ALARM! Pasukan Besi menyerang!");sirenStart();}X.alertT=22;}
  const alerted=surv&&(see||(X.alertT>0&&dist<75));
  if(alerted){
    m.yaw=Math.atan2(-dx,-dz);const want=boss?10:12;m.moving=dist>want;
    if(see&&m.cd<=0&&dist<36){m.cd=(boss?.55:1.2+(m.armLost||0)*.6)*rnd(.9,1.3);npcShoot(m,dist,boss?"mini":"rifle",boss?4:3,boss?.8:.65);}
  }else{
    m.t-=dt;if(!m.home)m.home=[m.x,m.z];
    if(m.raid){if(Math.hypot(m.x-m.raid[0],m.z-m.raid[1])<12){m.raid=null;m.home=[m.x,m.z];}else{goToward(m,m.raid[0],m.raid[1]);return;}}
    const hd=Math.hypot(m.x-m.home[0],m.z-m.home[1]);
    if(hd>5){goToward(m,m.home[0],m.home[1]);}
    else if(m.t<=0){m.moving=Math.random()<.4;m.yaw=Math.random()*6.283;m.t=rnd(1.5,4);}
  }
}
const goToward=(m,x,z)=>{m.yaw=Math.atan2(-(x-m.x),-(z-m.z));m.moving=true;};
let siren=0;function sirenStart(){siren=6;}
function keeperAI(m,dt,dist,dx,dz){
  const surv=S.mode==="survival";m.cd=(m.cd||0)-dt;
  if(m.angry>0&&surv){m.angry-=dt;m.sleeping=false;
    m.yaw=Math.atan2(-dx,-dz);m.moving=dist>5;
    if(dist<18&&m.cd<=0&&los(m,dist)){m.cd=1.6;
      for(let i=0;i<3;i++){const ex=P.x-m.x+rnd(-.8,.8),ey=P.y+1.3-(m.y+1.3)+rnd(-.5,.5),ez=P.z-m.z+rnd(-.8,.8),L=Math.hypot(ex,ey,ez)||1;addP(m.x+ex/L*.8,m.y+1.3,m.z+ez/L*.8,ex/L*55,ey/L*55,ez/L*55,.07,[1,.8,.4],Math.min(.5,L/55),{g:0});}
      shotAt("shotgun",m.x,m.z,1.6);
      if(Math.random()<clamp(.9-dist*.04,.2,.85)){if(DV.m&&!VEH[DV.m.type].animal)DV.m.hp-=18;else hitPlayer(7,m.x,m.z,"shotgun");}}
    return;}
  m.sleeping=DAY.night;
  if(m.sleeping){m.moving=false;return;}
  m.t-=dt;if(!m.home)m.home=[m.x,m.z];
  if(Math.hypot(m.x-m.home[0],m.z-m.home[1])>2.5)goToward(m,m.home[0],m.home[1]);
  else if(m.t<=0){m.moving=Math.random()<.35;m.yaw=Math.random()*6.283;m.t=rnd(1.5,4);}
}
/* ================= Luka & anggota tubuh pemain ================= */
const defW=()=>({al:0,ar:0,ll:0,lr:0,eye:0,n:0,sp:[],heal:0,bl:0});
function resetW(){X.w=defW();renderWounds();}
function renderWounds(){
  const c=$$("wsplats"),bl=$$("blind");if(!c)return;const w=X.w;c.innerHTML="";
  for(const p of w.sp){const d=el("div",{class:"ws",style:"left:"+p[0]+"%;top:"+p[1]+"%;width:"+p[2]+"px;height:"+p[2]+"px"},c);}
  bl.className=w.eye===1?"L on":w.eye===2?"R on":"";
}
function hitPlayer(dmg,sx,sz,kind,forceR){
  if(S.mode!=="survival"||S.dead)return;const w=X.w,hp0=S.hp,ap=A.armorPts(),big=(kind==="shotgun"||kind==="mini")?1.3:1;
  let reg=Math.random(),R=forceR||(reg<.1?"head":reg<.55?"torso":reg<.75?"arm":"leg");
  if(R==="head"&&ap>=10&&Math.random()<.5)R="torso";
  if(R==="head"){
    if(Math.random()<.5){
      const sk=SKINS[X.look.skin|0]||SKINS[0];
      burst(P.x,P.y+1.6,P.z,10,6,()=>sk,.2,1.4,{b:.4});bloodAt(P.x,P.y+1.6,P.z,22,0,0,3);scream(1);
      chip("💀 Kepalamu tertembak!");A.hurtPlayer(999);return;}
    w.eye=Math.random()<.5?1:2;chip("👁 Matamu tertembak! Buta sebelah");dmg*=1.3;renderWounds();
  }
  A.hurtPlayer(dmg,sx,sz);if(S.hp>=hp0)return;
  bloodAt(P.x,P.y+1.1,P.z,6,0,0,2);
  if(w.n<8){w.n++;w.sp.push([Math.random()*80+5,Math.random()*70+10,Math.random()*60+50]);renderWounds();}
  if(R==="arm"&&Math.random()<.3*big&&!(w.al&&w.ar)){
    const k=w.ar?"al":w.al?"ar":Math.random()<.5?"al":"ar";w[k]=1;const sk=SKINS[X.look.skin|0]||SKINS[0];
    burst(P.x,P.y+1,P.z,7,5,()=>sk,.2,1.4,{b:.4});bloodAt(P.x,P.y+1,P.z,14,0,0,3);scream(1);chip("💥 Lengan "+(k==="ar"?"kanan":"kiri")+" putus!");
  }else if(R==="leg"&&Math.random()<.25*big&&!(w.ll&&w.lr)){
    const k=w.lr?"ll":w.ll?"lr":Math.random()<.5?"ll":"lr";w[k]=1;const sk=SKINS[X.look.skin|0]||SKINS[0];
    burst(P.x,P.y+.4,P.z,7,5,()=>sk,.2,1.4,{b:.4});bloodAt(P.x,P.y+.4,P.z,14,0,0,3);scream(1);chip("💥 Kaki "+(k==="lr"?"kanan":"kiri")+" putus! Kamu pincang");
  }else chip(R==="arm"?"🩸 Lenganmu tertembak":R==="leg"?"🩸 Kakimu tertembak":R==="head"?"🩸 Kepalamu tergores":"🩸 Badanmu tertembak");
}
function woundTick(dt){
  const w=X.w;
  if(S.mode==="survival"){
    if(w.n>0){w.bl+=dt*.22*w.n;if(w.bl>=1){w.bl-=1;if(S.hp>3){S.hp--;A.updateHUD(true);}}
      if(Math.random()<dt*4*w.n)bloodAt(P.x+rnd(-.2,.2),P.y+rnd(.3,1.4),P.z+rnd(-.2,.2),1,0,0,.6);}
    const dm=w.n||w.eye||w.al||w.ar||w.ll||w.lr;
    if(S.hp>=20&&dm){w.heal+=dt;const need=w.n?4:w.eye?8:15;
      if(w.heal>=need){w.heal=0;
        if(w.n){w.n--;w.sp.pop();renderWounds();chip("🩹 Luka menutup");}
        else if(w.eye){w.eye=0;renderWounds();chip("👁 Matamu pulih");}
        else for(const k of["al","ar","ll","lr"])if(w[k]){w[k]=0;chip("✨ Anggota tubuhmu tumbuh lagi");break;}}}
    else w.heal=0;
  }
  const nl=w.ll+w.lr;
  if(nl&&!DV.m){const mx=nl===1?2.4:1.0,sp=Math.hypot(P.vx,P.vz);if(sp>mx){P.vx*=mx/sp;P.vz*=mx/sp;}const jm=nl===1?5.8:3.5;if(P.vy>jm&&!X.chute&&h191())P.vy=jm;}
}
const h191=()=>A.held()!==191;
/* ================= Benda di tangan (sudut pandang orang pertama) ================= */
const SPR={};
function spriteOf(id){
  if(SPR[id])return SPR[id];
  const cv=A.iconCanvas(id),w=cv.width,h=cv.height,gs=8,cw=w/gs,ch=h/gs,cells=[];let tr=0,tg=0,tb=0,tn=0,d;
  try{d=cv.getContext("2d").getImageData(0,0,w,h).data;}catch(e){return SPR[id]={cells,avg:[.5,.5,.5]};}
  for(let gy=0;gy<gs;gy++)for(let gx=0;gx<gs;gx++){let r=0,g=0,b=0,n=0;
    for(let y=Math.floor(gy*ch);y<Math.floor((gy+1)*ch);y++)for(let x=Math.floor(gx*cw);x<Math.floor((gx+1)*cw);x++){const i=(y*w+x)*4;if(d[i+3]>60){r+=d[i];g+=d[i+1];b+=d[i+2];n++;}}
    if(n>0){const c=[r/n/255,g/n/255,b/n/255];cells.push([gx-3.5,3.5-gy,c]);tr+=c[0];tg+=c[1];tb+=c[2];tn++;}}
  return SPR[id]={cells,avg:tn?[tr/tn,tg/tn,tb/tn]:[.5,.5,.5]};
}
function drawHeld(){
  const w=X.w;if(w.ar&&w.al)return;
  const h=A.held(),e=A.eyePos(),y=P.yaw,cp=Math.cos(P.pitch),sp=Math.sin(P.pitch);
  const f=[-Math.sin(y)*cp,sp,-Math.cos(y)*cp],r=[Math.cos(y),0,-Math.sin(y)],u=[-r[2]*f[1],r[2]*f[0]-r[0]*f[2],r[0]*f[1]];
  let sw=0;if(S.swing>0){sw=Math.sin(clamp(1-S.swing/.25,0,1)*Math.PI);}
  const bob=Math.min(1,Math.hypot(P.vx,P.vz)/4)*(P.ground?1:0),ph=S.walkPh||0;
  const rr=.05-sw*.03+Math.cos(ph)*.006*bob,uu=-.15-sw*.06+Math.abs(Math.sin(ph))*.01*bob;
  const pt=(a,b,c)=>[e[0]+f[0]*a+r[0]*b+u[0]*c,e[1]+f[1]*a+r[1]*b+u[1]*c,e[2]+f[2]*a+r[2]*b+u[2]*c];
  const cl=lookCols(X.look);let q=pt(.33-sw*.03,rr+.03,uu-.1);box(q[0],q[1],q[2],.05,.05,.2,cl.sleeve,y);
  const gun=GUN[h],gr=GR[h];
  if(!h){q=pt(.42,rr,uu);box(q[0],q[1],q[2],.06,.06,.14,cl.skin,y);return;}
  if(gun){const L=(.18+gun.len*.036)*.5;q=pt(.46-sw*.04,rr,uu+.02);box(q[0],q[1],q[2],.045,.06,L,gun.col,y);q=pt(.4-sw*.04,rr,uu-.03);box(q[0],q[1],q[2],.04,.08,.04,sc(gun.col,.6),y);return;}
  if(gr){q=pt(.45,rr,uu+.02);box(q[0],q[1],q[2],.09,.09,.09,gr.col||[.25,.32,.22],y);return;}
  const sp2=spriteOf(h);
  if(h<100){q=pt(.45,rr,uu+.03);box(q[0],q[1],q[2],.14,.14,.14,sp2.avg,y+.6);return;}
  for(const c of sp2.cells){q=pt(.45,rr+c[0]*.03,uu+.06+c[1]*.03);box(q[0],q[1],q[2],.032,.032,.02,c[2],y);}
}
/* ================= Warga desa melawan ================= */
const GI=()=>TYPES.villager.parts.length-1;
function aggro(m){
  const first=!(m.angry>0);
  for(const o of mobs())if(o.type==="villager"&&(o===m||Math.hypot(o.x-m.x,o.z-m.z)<50)&&!(o.angry>0)){o.angry=50;if(o.ammo===undefined)o.ammo=20;o.flee=0;}
  m.angry=50;if(m.ammo===undefined)m.ammo=20;
  if(first){shout();chip("🗣 \"Dia menyerang! Semua tembak dia!\"");}
}
function vgun(m,dt,dist,dx,dz){
  m.angry-=dt;m.cd=(m.cd||0)-dt;
  if(m.ammo<=0){if(!m.dry){m.dry=1;chip("Warga kehabisan peluru, kabur!");}goToward(m,2*m.x-P.x,2*m.z-P.z);m.angry-=dt*2;return true;}
  if(dist<34&&los(m,dist)){
    m.yaw=Math.atan2(-dx,-dz);m.moving=dist>8;if(dist<5){m.yaw+=3.14;m.moving=true;}
    if(m.cd<=0){m.cd=rnd(1.1,1.9);m.ammo--;npcShoot(m,dist,"rev",3,.6);if(Math.random()<.2)shout();}
  }else goToward(m,P.x,P.z);
  return true;
}
/* ================= AI dispatcher ================= */
function ai(m,dt,dist,dx,dz){
  const t=m.type;
  if(m.love>0)m.love-=dt;
  if(m.baby){m.sc=Math.min(1,(m.sc||.5)+dt/150);if(m.sc>=1){m.baby=false;m.sc=1;}}
  if(m.fx){
    if(m.fx.stun>0){m.fx.stun-=dt;m.moving=false;return true;}
    if(m.fx.dance>0){m.fx.dance-=dt;if(m.ground&&Math.random()<dt*3)m.vy=6;m.spin=Math.max(m.spin||0,6);m.moving=false;return true;}
  }
  if(m.cz)return zAI(m,dt,dist,dx,dz);if(m.team)return wAI(m,dt,dist,dx,dz);if(m.xflag){m.moving=false;return true;}
  const v=VEH[t];
  if(v){if(DV.m===m){ride(m,dt);return true;}if(!v.animal){m.moving=false;m.spd=0;m.drv=false;return true;}return false;}
  if(t==="villager"){m.hide=m.hide||[];m.hide[GI()]=!(m.angry>0);if(m.angry>0&&S.mode==="survival")return vgun(m,dt,dist,dx,dz);if(m.angry>0)m.angry=0;return false;}
  if(t==="soldier2"){allyAI(m,dt);return true;}
  if(t==="soldier"||t==="boss"){soldierAI(m,dt,dist,dx,dz);return true;}
  if(t==="shopkeeper"){keeperAI(m,dt,dist,dx,dz);return true;}
  if(t==="creeper"){creeperAI(m,dt,dist,dx,dz);return true;}
  return false;
}
function attack(){
  if(DV.m){const v=VEH[DV.m.type];if(!v.animal){honk();S.atkCd=.4;}return true;}
  const h=A.held(),g=GUN[h];
  if((g||GR[h])&&X.w.ar&&X.w.al){A.toast("Tanganmu putus semua!");S.atkCd=.5;return true;}
  if(g){if(!g.auto&&X.holdFire&&S.atkHeld)return true;if(S.atkHeld)X.holdFire=true;fire(X.w.ar?Object.assign({},g,{spr:(g.spr||0)*2+.04,cd:g.cd*1.6}):g);return true;}
  const gr=GR[h];if(gr){if(X.holdFire&&S.atkHeld)return true;if(S.atkHeld)X.holdFire=true;throwG(gr);return true;}
  return false;
}
function use(){
  if(DV.m)return true;
  const h=A.held(),hit=A.pickMob(3.8,.2);
  if(hit){const m=hit.m,t=m.type;
    if(VEH[t]){if(BREED[t]&&(h===132)){feed(m,h);return true;}mount(m);return true;}
    if(t==="shopkeeper"){openShop(m);return true;}
    if(BREED[t]&&(h===132||(t==="chicken"&&h===131))){feed(m,h);return true;}}
  if(VITEM[h]&&target){const t=VITEM[h];if(S.mode==="survival"){A.take(h,1);A.refreshHotbar();}spawnVeh(t,target.px+.5,target.py+.05,target.pz+.5);A.toast(VEH[t].n+" ditaruh · tekan Pasang padanya untuk naik");return true;}
  if(h===192){fishUse();return true;}
  if(target){const id=get(target.x,target.y,target.z);
    if(id===18){ignite(target.x,target.y,target.z,3);return true;}
    if(id===19){openChest(target);return true;}
    if(id===20){takeShelf(target);return true;}}
  return false;
}
const driving=()=>!!DV.m;
function softLand(){const b=get(Math.floor(P.x),Math.floor(P.y-.1),Math.floor(P.z));return b===21||X.chute;}

/* ================= Markas Pasukan Besi & kedai (generasi dunia) ================= */
let BASE=null,BASE2=null;const SHOPS=[];
function gen(){
  BASE=null;SHOPS.length=0;for(const k in LOOT)delete LOOT[k];for(const k in SHELF)delete SHELF[k];
  if(chaosOn()){chaosGen();return;}
  const S3=(x,y,z,id)=>{if(x>=0&&z>=0&&x<W&&z<D&&y>=0&&y<H)blocks[idx(x,y,z)]=id;};
  const vil=A.VIL(),vx=vil?vil.x:128,vz=vil?vil.z:128;
  const flat=(cx,cz,rx,rz,bad0)=>{let mn=99,mx=0,bad=0;for(let dz=-rz;dz<=rz;dz+=4)for(let dx=-rx;dx<=rx;dx+=4){const x=cx+dx,z=cz+dz;if(x<2||z<2||x>=W-2||z>=D-2)return null;const h=hm[z*W+x];if(h<=SEA+2){if(++bad>(bad0||0))return null;continue;}mn=Math.min(mn,h);mx=Math.max(mx,h);}return mx-mn;};
  const level=(cx,cz,rx,rz,h0,top)=>{for(let z=cz-rz;z<=cz+rz;z++)for(let x=cx-rx;x<=cx+rx;x++){for(let y=0;y<=top;y++){const i=idx(x,y,z);if(y<h0-1){if(blocks[i]===AIR||blocks[i]===WATER)blocks[i]=y>=h0-4?DIRT:STONE;}else if(y===h0-1)blocks[i]=GRASS;else blocks[i]=AIR;}hm[z*W+x]=h0;}};
  // ---- markas ----
  let best=null,bs=1e9;
  for(let t=0;t<900;t++){
    const cx=Math.floor(40+hash(t,3,seed+300)*(W-80)),cz=Math.floor(40+hash(t,5,seed+301)*(D-80));
    if(Math.hypot(cx-vx,cz-vz)<80)continue;const f=flat(cx,cz,28,22,6);if(f===null)continue;if(f<bs){bs=f;best=[cx,cz];}
  }
  if(!best)for(let t=0;t<600;t++){
    const cx=Math.floor(40+hash(t,13,seed+310)*(W-80)),cz=Math.floor(40+hash(t,15,seed+311)*(D-80));
    if(Math.hypot(cx-vx,cz-vz)<60)continue;const f=flat(cx,cz,28,22,999);if(f===null)continue;if(f<bs){bs=f;best=[cx,cz];}
  }
  if(best){
    const cx=best[0],cz=best[1];let sum=0,n=0;for(let dz=-20;dz<=20;dz+=4)for(let dx=-26;dx<=26;dx+=4){sum+=hm[(cz+dz)*W+cx+dx];n++;}
    const h0=Math.max(SEA+2,Math.round(sum/n));level(cx,cz,28,22,h0,Math.min(H-1,h0+14));
    const WALL=BRICK;BASE={cx,cz,h0,soldiers:[],boss:null,chest:null,cars:[]};
    for(let z=-20;z<=20;z++)for(let x=-26;x<=26;x++)S3(cx+x,h0-1,cz+z,(x+z)%7===0?STONE:DIRT);
    // pagar
    for(let x=-24;x<=24;x++)for(let z=-18;z<=18;z++){const e=Math.abs(x)===24||Math.abs(z)===18;if(!e)continue;
      if(z===18&&Math.abs(x)<=2)continue;for(let y=0;y<5;y++)S3(cx+x,h0+y,cz+z,(y===4&&(x+z)%2===0)?STONE:WALL);}
    for(let x=-3;x<=3;x++){S3(cx+x,h0+4,cz+18,WALL);S3(cx+x,h0+5,cz+18,STONE);}
    // menara sudut
    for(const c of[[-24,-18],[24,-18],[-24,18],[24,18]]){
      for(let y=0;y<9;y++)for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){const e=Math.abs(dx)===2||Math.abs(dz)===2;S3(cx+c[0]+dx,h0+y,cz+c[1]+dz,e?(y===5&&(dx===0||dz===0)?GLASS:WALL):AIR);}
      for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){S3(cx+c[0]+dx,h0+8,cz+c[1]+dz,PLANKS);if(Math.abs(dx)===2||Math.abs(dz)===2){S3(cx+c[0]+dx,h0+9,cz+c[1]+dz,(dx+dz)%2?AIR:WALL);}}
      for(let y=0;y<9;y++)S3(cx+c[0]+(c[0]<0?1:-1),h0+y,cz+c[1],AIR);
      BASE.soldiers.push([cx+c[0]+.5,h0+9,cz+c[1]+.5]);
    }
    // bangunan utama
    const bx0=-13,bx1=13,bz0=-11,bz1=5;
    for(let x=bx0;x<=bx1;x++)for(let z=bz0;z<=bz1;z++){
      const e=x===bx0||x===bx1||z===bz0||z===bz1;S3(cx+x,h0-1,cz+z,PLANKS);
      for(let y=0;y<6;y++)S3(cx+x,h0+y,cz+z,e?((y===2||y===3)&&((x+z)%4===0)&&!(z===bz1&&Math.abs(x)<=1)?GLASS:WALL):AIR);
      S3(cx+x,h0+6,cz+z,STONE);}
    for(let y=0;y<3;y++)for(let x=-1;x<=1;x++)S3(cx+x,h0+y,cz+bz1,AIR);
    // sekat ruangan
    for(let z=bz0+1;z<bz1;z++)for(let y=0;y<5;y++){for(const wx of[-5,5]){if(z>=-1&&z<=1&&y<3)continue;S3(cx+wx,h0+y,cz+z,WALL);}}
    for(let x=bx0+1;x<bx1;x++)for(let y=0;y<5;y++){if(x>=-5&&x<=5){const wz=-3;if(Math.abs(x)<=1&&y<3)continue;S3(cx+x,h0+y,cz+wz,WALL);}}
    // ruang bos (utara tengah)
    for(let x=-4;x<=4;x++)for(let z=-10;z<=-4;z++)S3(cx+x,h0-1,cz+z,(x+z)%2?BRICK:PLANKS);
    S3(cx,h0,cz-10,19);LOOT[idx(cx,h0,cz-10)]={140:500,111:12,109:10,139:12};BASE.chest=[cx,h0,cz-10];
    for(const c of[[-3,-10],[3,-10],[-3,-5],[3,-5]])for(let y=0;y<4;y++)S3(cx+c[0],h0+y,cz+c[1],LOG);
    BASE.boss=[cx+.5,h0,cz-7.5];
    // meja & peti perbekalan
    for(const o of[[-9,-9],[-8,-9],[9,-9],[8,-9],[-9,3],[9,3]]){S3(cx+o[0],h0,cz+o[1],PLANKS);}
    for(const o of[[-9,-5],[9,-5]]){S3(cx+o[0],h0,cz+o[1],19);LOOT[idx(cx+o[0],h0,cz+o[1])]={140:ri(15,40),111:ri(2,5),109:ri(2,4)};}
    // tiang bendera
    for(let y=0;y<10;y++)S3(cx,h0+y,cz+14,LOG);for(let y=7;y<10;y++)for(let x=1;x<=3;x++)S3(cx+x,h0+y,cz+14,PLANKS);
    // karung pasir & peti di halaman
    for(const o of[[-6,12],[-5,12],[6,12],[5,12],[-14,0],[-14,1],[14,0],[14,1],[-18,-10],[-17,-10],[18,-10],[17,-10]]){S3(cx+o[0],h0,cz+o[1],PLANKS);S3(cx+o[0],h0+1,cz+o[1],AIR);}
    // pasukan: 30 orang
    const inside=[[-9,-8],[-8,-6],[-9,-1],[-10,3],[-7,3],[-11,-9],[-7,-9],[9,-8],[8,-6],[9,-1],[10,3],[7,3],[11,-9],[7,-9],[-2,-6],[2,-6],[0,-1],[-2,2],[2,2],[0,-8]];
    for(const o of inside)BASE.soldiers.push([cx+o[0]+.5,h0,cz+o[1]+.5]);
    for(const o of[[-3,16],[3,16],[-8,13],[8,13],[-16,-6],[16,-6]])BASE.soldiers.push([cx+o[0]+.5,h0,cz+o[1]+.5]);
    BASE.cars=[["jeep",cx-9.5,h0,cz+11],["truck",cx+10,h0,cz+11],["bike",cx+16,h0,cz-2]];
  }
  if(vil&&vil.homes){
    const h0=vil.y,vcx=Math.floor(vil.x),vcz=Math.floor(vil.z);
    [[-17,-2,"e"],[13,-2,"w"],[-3,-17,"s"],[-3,11,"n"]].forEach((o,hi)=>{
      const ox=vcx+o[0],oz=vcz+o[1];let clash=false;
      for(const fm of(vil.farm||[]))if(fm[0]>=ox-1&&fm[0]<=ox+5&&fm[2]>=oz-1&&fm[2]<=oz+5)clash=true;
      if(clash)return;
      for(let z=0;z<5;z++)for(let x=0;x<5;x++){const e=x===0||x===4||z===0||z===4,corner=(x===0||x===4)&&(z===0||z===4);
        S3(ox+x,h0-1,oz+z,PLANKS);for(let y=0;y<3;y++)S3(ox+x,h0+y,oz+z,e?(corner?LOG:PLANKS):AIR);S3(ox+x,h0+3,oz+z,PLANKS);}
      for(const w of[[0,2],[4,2],[2,0],[2,4]])S3(ox+w[0],h0+1,oz+w[1],GLASS);
      const door=o[2]==="e"?[4,2]:o[2]==="w"?[0,2]:o[2]==="s"?[2,4]:[2,0];
      S3(ox+door[0],h0,oz+door[1],AIR);S3(ox+door[0],h0+1,oz+door[1],AIR);
      S3(ox+1,h0,oz+1,40);S3(ox+3,h0,oz+3,hi%2?14:11);
      vil.homes.push([ox+2,oz+2]);
    });
  }
  // ---- pos Pasukan Biru (sekutu) ----
  BASE2=null;
  if(BASE){
    let b2=null,s2=1e9;
    for(let t=0;t<600;t++){
      const cx=Math.floor(30+hash(t,23,seed+330)*(W-60)),cz=Math.floor(30+hash(t,25,seed+331)*(D-60));
      if(Math.hypot(cx-BASE.cx,cz-BASE.cz)<70||Math.hypot(cx-vx,cz-vz)<50)continue;const f=flat(cx,cz,16,12,8);if(f===null)continue;if(f<s2){s2=f;b2=[cx,cz];}
    }
    if(b2){
      const cx=b2[0],cz=b2[1];let sum=0,n=0;for(let dz=-12;dz<=12;dz+=4)for(let dx=-16;dx<=16;dx+=4){sum+=hm[(cz+dz)*W+cx+dx];n++;}
      const h0=Math.max(SEA+2,Math.round(sum/n));level(cx,cz,18,14,h0,Math.min(H-1,h0+10));
      BASE2={cx,cz,h0,soldiers:[]};
      for(let z=-13;z<=13;z++)for(let x=-17;x<=17;x++)S3(cx+x,h0-1,cz+z,(x+z)%5===0?DIRT:STONE);
      for(let x=-15;x<=15;x++)for(let z=-11;z<=11;z++){if(Math.abs(x)!==15&&Math.abs(z)!==11)continue;if(z===11&&Math.abs(x)<=2)continue;for(let y=0;y<4;y++)S3(cx+x,h0+y,cz+z,STONE);}
      for(const c of[[-15,-11],[15,-11],[-15,11],[15,11]])for(let y=0;y<6;y++)for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)S3(cx+c[0]+dx,h0+y,cz+c[1]+dz,y===5?PLANKS:STONE);
      for(let x=-6;x<=6;x++)for(let z=-7;z<=1;z++){const e=Math.abs(x)===6||z===-7||z===1;S3(cx+x,h0-1,cz+z,PLANKS);for(let y=0;y<4;y++)S3(cx+x,h0+y,cz+z,e?((y===1||y===2)&&(x+z)%3===0?GLASS:PLANKS):AIR);S3(cx+x,h0+4,cz+z,PLANKS);}
      for(let x=-1;x<=1;x++)for(let y=0;y<3;y++)S3(cx+x,h0+y,cz+1,AIR);
      for(let y=0;y<9;y++)S3(cx,h0+y,cz+8,LOG);for(let y=6;y<9;y++)for(let x=1;x<=3;x++)S3(cx+x,h0+y,cz+8,GLASS);
      for(const o of[[-4,-4],[0,-5],[4,-4],[-8,4],[8,4],[-11,-6],[11,-6],[-5,7],[5,7],[-9,9],[9,9],[0,4]])BASE2.soldiers.push([cx+o[0]+.5,h0,cz+o[1]+.5]);
    }
  }
  // ---- kedai ----
  const kinds=["mega","mega"];
  let tries=0;
  for(let i=0;i<kinds.length&&tries<900;tries++){
    const cx=Math.floor(24+hash(tries,i,seed+410)*(W-48)),cz=Math.floor(24+hash(tries,i+9,seed+411)*(D-48));
    if(Math.hypot(cx-vx,cz-vz)<26||(BASE&&Math.hypot(cx-BASE.cx,cz-BASE.cz)<45))continue;
    let ok=true;for(const o of SHOPS)if(Math.hypot(o.cx-cx,o.cz-cz)<45)ok=false;if(!ok)continue;
    const f=flat(cx,cz,11,9);if(f===null||f>4)continue;
    const h0=hm[cz*W+cx];level(cx,cz,12,10,h0,Math.min(H-1,h0+13));
    for(let z=-9;z<=9;z++)for(let x=-11;x<=11;x++)S3(cx+x,h0-1,cz+z,(Math.abs(x)<=8&&Math.abs(z)<=6)?(((x+z)&1)?PLANKS:BRICK):((x+z)%2===0?STONE:DIRT));
    for(let x=-2;x<=2;x++)for(let z=7;z<=9;z++)S3(cx+x,h0-1,cz+z,STONE);
    for(let z=-6;z<=6;z++)for(let x=-8;x<=8;x++){
      const ex=Math.abs(x)===8,ez=Math.abs(z)===6,e=ex||ez,corner=ex&&ez;
      for(let y=0;y<5;y++){let id=AIR;
        if(e){id=corner?LOG:(y===4?BRICK:PLANKS);
          if(y>=1&&y<=3&&!corner){if(z===6&&Math.abs(x)>=3&&!ex)id=GLASS;if(ex&&(z===-3||z===0||z===3))id=GLASS;if(z===-6&&(x===-5||x===0||x===5))id=GLASS;}
          if(z===6&&Math.abs(x)<=2&&y<4)id=AIR;}
        S3(cx+x,h0+y,cz+z,id);}
      S3(cx+x,h0+5,cz+z,PLANKS);}
    for(let l=0;l<7;l++)for(let z=-7+l;z<=7-l;z++)for(let x=-9;x<=9;x++)S3(cx+x,h0+5+l,cz+z,l===0?PLANKS:BRICK);
    for(let x=-8;x<=8;x++){S3(cx+x,h0+4,cz+7,(x&1)?PLANKS:BRICK);S3(cx+x,h0+4,cz+8,(x&1)?BRICK:PLANKS);}
    for(const px of[-8,-4,4,8])for(let y=0;y<4;y++)S3(cx+px,h0+y,cz+8,LOG);
    for(let x=-4;x<=4;x++)S3(cx+x,h0+5,cz+7,PLANKS);
    for(const o of[[-4,3],[4,3],[-4,-2],[4,-2]])for(let y=0;y<5;y++)S3(cx+o[0],h0+y,cz+o[1],LOG);
    for(let x=-7;x<=6;x++)S3(cx+x,h0,cz+2,PLANKS);
    for(const o of[[-10,8],[10,8],[-10,-8],[10,-8],[-10,-4],[10,-4]]){S3(cx+o[0],h0,cz+o[1],PLANKS);S3(cx+o[0],h0+1,cz+o[1],PLANKS);}
    for(const o of[[-10,4],[10,4],[-6,9],[6,9]]){for(let y=0;y<3;y++)S3(cx+o[0],h0+y,cz+o[1],LOG);S3(cx+o[0],h0+3,cz+o[1],GLASS);}
    
const kind=kinds[i],wl=WARES[kind],sh={cx,cz,h0,kind,mood:[.8,1,1.3][Math.floor(hash(i,7,seed+420)*3)],keeper:null,dead:false,keeperPos:[cx+5.5,h0,cz-.5]};
    const sl=[];for(let x=-7;x<=7;x+=2)sl.push([x,-5]);for(const z of[-3,-1,1])sl.push([-7,z],[7,z]);
    sl.forEach((o,k)=>{const w=wl[(k*3)%wl.length];S3(cx+o[0],h0,cz+o[1],20);SHELF[idx(cx+o[0],h0,cz+o[1])]={shop:SHOPS.length,item:w.id,n:w.n};});
    SHOPS.push(sh);i++;
  }
}
/* ================= Populasi ================= */
function populate(){
  if(chaosOn()){chaosPop();return;}
  const L=A.mobs(),sp=(type,x,y,z,ex)=>{const m=A.makeMob(type,x,y+.02,z);if(ex)Object.assign(m,ex);L.push(m);return m;};
  if(BASE){
    for(const s of BASE.soldiers)sp("soldier",s[0],s[1],s[2],{home:[s[0],s[2]]});
    if(!X.bossDead&&BASE.boss)sp("boss",BASE.boss[0],BASE.boss[1],BASE.boss[2],{home:[BASE.boss[0],BASE.boss[2]]});
    for(const c of BASE.cars)spawnVeh(c[0],c[1],c[2],c[3]);
  }
  const vl=A.VIL();if(vl&&vl.homes)for(let hi=4;hi<vl.homes.length;hi++)for(let k=0;k<2;k++){const m=sp("villager",vl.homes[hi][0]+.5+k*.6,vl.y,vl.homes[hi][1]+.5);m.hi=hi;}
  if(BASE2)for(const s of BASE2.soldiers)sp("soldier2",s[0],s[1],s[2],{home:[s[0],s[2]]});
  SHOPS.forEach(s=>{if(s.dead)return;s.keeper=sp("shopkeeper",s.keeperPos[0],s.keeperPos[1],s.keeperPos[2],{home:[s.keeperPos[0],s.keeperPos[2]]});});
  for(let k=0,n=0;k<300&&n<8;k++){const x=Math.floor(rnd(20,236)),z=Math.floor(rnd(20,236)),gy=A.groundY(x,z);if(gy<SEA+1)continue;sp(n<4?"horse":"pig",x+.5,gy,z+.5);n++;}
  for(let k=0,n=0;k<300&&n<4;k++){const x=Math.floor(rnd(20,236)),z=Math.floor(rnd(20,236)),gy=A.groundY(x,z);if(gy<SEA+1)continue;sp("pig",x+.5,gy,z+.5);n++;}
  const gy=A.groundY(Math.floor(P.x+6),Math.floor(P.z+6));if(gy>0)spawnVeh("bike",P.x+6,gy,P.z+6);const g2=A.groundY(Math.floor(P.x-4),Math.floor(P.z+5));if(g2>0)spawnVeh("skate",P.x-4,g2,P.z+5);
}
/* ================= CHAOS: Kota Zombie & Perang Parit ================= */
const chaosOn=()=>!!X.world&&X.world!=="normal";
const sb3=(x,y,z,id)=>{if(x>=0&&z>=0&&x<W&&z<D&&y>=0&&y<H)blocks[idx(x,y,z)]=id;};
const fillB=(x0,y0,z0,x1,y1,z1,id)=>{for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)sb3(x,y,z,id);};
const shellB=(x0,z0,w,d,h,y0,wall,roof)=>{fillB(x0,y0,z0,x0+w-1,y0+h-1,z0+d-1,wall);fillB(x0+1,y0,z0+1,x0+w-2,y0+h-1,z0+d-2,0);fillB(x0,y0+h,z0,x0+w-1,y0+h,z0+d-1,roof);};
const ZR=40;
/* ---- jenis zombie ---- */
const ZT={
 walker:{n:"Zombie",hp:20,sp:2.2,dmg:3,skin:[.45,.6,.4],top:[.3,.35,.4],pants:[.25,.28,.4]},
 runner:{n:"Runner",hp:14,sp:5.4,dmg:3,skin:[.6,.5,.4],top:[.55,.15,.15],pants:[.2,.2,.25]},
 gendut:{n:"Gendut Asam",hp:75,sp:1.5,dmg:6,k:1.35,skin:[.55,.68,.35],top:[.5,.55,.3],pants:[.3,.3,.2],w:"acid"},
 muntah:{n:"Muntah Darah",hp:22,sp:2.2,dmg:3,skin:[.6,.6,.45],top:[.45,.1,.1],pants:[.25,.2,.2],w:"spit"},
 tank:{n:"Tank",hp:160,sp:2.7,dmg:12,k:1.55,skin:[.5,.45,.4],top:[.25,.25,.3],pants:[.2,.2,.2],w:"charge"},
 bocah:{n:"Bocah",hp:8,sp:4.2,dmg:2,k:.6,skin:[.7,.62,.5],top:[.3,.5,.7],pants:[.4,.3,.2]},
 perayap:{n:"Perayap",hp:12,sp:3.2,dmg:3,k:.5,skin:[.4,.5,.35],top:[.3,.25,.2],pants:[.2,.2,.2]},
 lompat:{n:"Pelompat",hp:24,sp:3,dmg:4,skin:[.5,.55,.35],top:[.2,.4,.2],pants:[.15,.3,.15],w:"leap"},
 racun:{n:"Racun",hp:26,sp:2.4,dmg:3,skin:[.5,.75,.3],top:[.35,.6,.2],pants:[.2,.35,.15],w:"poison"},
 bom:{n:"Bom Jalan",hp:16,sp:4.4,dmg:0,skin:[.7,.5,.4],top:[.8,.7,.1],pants:[.5,.1,.1],w:"bomb"},
 api:{n:"Api",hp:28,sp:2.8,dmg:3,skin:[.35,.2,.15],top:[.95,.45,.1],pants:[.6,.2,.05],w:"fire"},
 es:{n:"Es",hp:28,sp:2.4,dmg:3,skin:[.7,.85,.95],top:[.5,.75,.95],pants:[.35,.55,.8],w:"ice"},
 listrik:{n:"Listrik",hp:30,sp:2.8,dmg:3,skin:[.6,.6,.5],top:[.95,.9,.2],pants:[.3,.3,.35],w:"shock"},
 penjerit:{n:"Penjerit",hp:22,sp:2.6,dmg:2,skin:[.8,.75,.7],top:[.9,.9,.95],pants:[.3,.3,.4],w:"scream"},
 pemburu:{n:"Pemburu",hp:45,sp:4.6,dmg:6,skin:[.55,.2,.2],top:[.3,.1,.1],pants:[.15,.1,.1],w:"leap"},
 tentara:{n:"Tentara Mayat",hp:85,sp:2.6,dmg:5,skin:[.5,.55,.45],top:[.28,.34,.22],pants:[.2,.25,.17]},
 dokter:{n:"Dokter Gila",hp:30,sp:2.5,dmg:3,skin:[.6,.7,.55],top:[.95,.95,.95],pants:[.4,.6,.7],w:"heal"},
 raksasa:{n:"Raksasa",hp:340,sp:2.2,dmg:16,k:2.3,skin:[.45,.4,.38],top:[.35,.3,.28],pants:[.2,.2,.22],w:"slam",boss:1},
 bayangan:{n:"Bayangan",hp:30,sp:3.2,dmg:5,skin:[.1,.1,.14],top:[.06,.06,.1],pants:[.05,.05,.08],w:"blink"},
 ratu:{n:"Ratu Zombie",hp:260,sp:2.4,dmg:8,k:1.5,skin:[.55,.4,.6],top:[.5,.1,.45],pants:[.3,.1,.3],w:"summon",boss:1},
 anjing:{n:"Anjing Zombie",hp:16,sp:6,dmg:3,k:.55,skin:[.4,.28,.2],top:[.35,.25,.18],pants:[.3,.2,.15]},
 kembar:{n:"Kembar",hp:36,sp:2.8,dmg:4,skin:[.65,.55,.7],top:[.6,.3,.65],pants:[.3,.2,.4],w:"split"},
 pelempar:{n:"Pelempar",hp:24,sp:2.4,dmg:3,skin:[.5,.5,.4],top:[.5,.35,.2],pants:[.3,.25,.15],w:"throw"}
};
for(const k in ZT){const z=ZT[k],c=z.top;defHuman("z_"+k,{skin:z.skin,helm:[c[0]*.5,c[1]*.5,c[2]*.5],top:z.top,pants:z.pants,zarms:1,k:z.k||1,visor:k==="bayangan"||k==="ratu"},z.hp,z.sp,TYPES.zombie&&TYPES.zombie.snd||"hmm");TYPES["z_"+k].far=110;}
const ZNAME=n=>ZT[n]?ZT[n].n:n;
/* ---- tim perang ---- */
const WCOL={1:{top:[.2,.35,.7],helm:[.12,.2,.45],pants:[.18,.22,.35]},2:{top:[.65,.15,.15],helm:[.4,.1,.1],pants:[.3,.17,.17]}};
for(const t of[1,2]){const c=WCOL[t],nm=t===1?"ally":"foe";
 defHuman(nm,{skin:[.85,.65,.5],helm:c.helm,top:c.top,vest:[c.top[0]*.6,c.top[1]*.6,c.top[2]*.6],pants:c.pants,gun:1},40,3.1,"shout");
 defHuman(nm+"M",{skin:[.85,.65,.5],helm:[.95,.95,.95],top:c.top,vest:[.95,.95,.95],pants:c.pants,gun:1},35,3.3,"shout");
 TYPES[nm].far=TYPES[nm+"M"].far=400;}
function defFlag(name,col){const P0=[B(0,1.4,0,.12,2.8,.12,[.4,.28,.15]),B(.5,2.35,0,.9,.6,.06,col),B(.5,1.95,0,.9,.1,.06,[.95,.95,.95])];TYPES[name]={hp:1e9,r:.3,h:2.8,sp:0,snd:"none",hs:"none",keep:true,parts:P0,head:[],arms:[],far:400};}
defFlag("flag1",[.2,.4,.95]);defFlag("flag2",[.95,.15,.15]);
/* ---- generator ---- */
function chaosGen(){
  const h0=16;X.cy=h0;blocks.fill(0);
  for(let z=0;z<D;z++)for(let x=0;x<W;x++){hm[z*W+x]=h0;for(let y=0;y<h0-1;y++)blocks[idx(x,y,z)]=y<h0-4?STONE:DIRT;blocks[idx(x,h0-1,z)]=GRASS;}
  X.cars=[];X.marts=[];X.zsp=null;
  if(X.world==="zombie")genCity(h0);else genWar(h0);
}
function genCity(h0){
  for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(x%ZR<7||z%ZR<7)blocks[idx(x,h0-1,z)]=STONE;
  const MART=[[1,1],[4,1],[1,4],[4,4],[2,3]];
  for(let lz=0;lz<6;lz++)for(let lx=0;lx<6;lx++){
    const bx=lx*ZR+7,bz=lz*ZR+7,sx=ZR-7,sz=ZR-7;if(bx+sx>W-2||bz+sz>D-2)continue;
    const r=hash(lx,lz,seed+11),mart=MART.some(a=>a[0]===lx&&a[1]===lz);
    if(mart){genMart(bx,bz,h0);continue;}
    if(lx===3&&lz===3||r<.14){ // taman
      for(let i=0;i<14;i++){const tx=bx+ri(2,sx-3),tz=bz+ri(2,sz-3);if(lx===3&&lz===3&&Math.abs(tx-123)<8&&Math.abs(tz-123)<8)continue;const th=ri(4,6);fillB(tx,h0,tz,tx,h0+th-1,tz,LOG);fillB(tx-2,h0+th-2,tz-2,tx+2,h0+th-1,tz+2,LEAVES);fillB(tx,h0+th,tz,tx,h0+th,tz,LEAVES);}
      continue;}
    if(r<.26){for(let k=0;k<5;k++)X.cars.push([bx+ri(3,sx-4),bz+ri(3,sz-4)]);continue;}
    const w=ri(14,26),d=ri(14,26),x0=bx+ri(1,sx-w-1),z0=bz+ri(1,sz-d-1),f=ri(1,4),h=f*4;
    const wall=hash(lx,lz,seed+12)<.6?BRICK:PLANKS;
    shellB(x0,z0,w,d,h,h0,wall,STONE);
    for(let y=h0+1;y<h0+h;y++)if((y-h0)%4===1||(y-h0)%4===2)for(let i=2;i<w-2;i+=3){sb3(x0+i,y,z0,GLASS);sb3(x0+i,y,z0+d-1,GLASS);}
    const cx=x0+(w>>1),cz=z0+(d>>1);
    fillB(cx-1,h0,z0,cx+1,h0+2,z0,0);fillB(cx-1,h0,z0+d-1,cx+1,h0+2,z0+d-1,0);fillB(x0,h0,cz-1,x0,h0+2,cz+1,0);fillB(x0+w-1,h0,cz-1,x0+w-1,h0+2,cz+1,0);
    for(let k=1;k<f;k++){const y=h0+4*k-1;fillB(x0+1,y,z0+1,x0+w-2,y,z0+d-2,PLANKS);}
    for(let k=1;k<f;k++){const sx2=x0+2,sz2=z0+2,yb=h0+4*(k-1);fillB(sx2,h0+4*k-1,sz2,sx2+2,h0+4*k-1,sz2+1,0);for(let i=0;i<4;i++)fillB(sx2+i,yb,sz2,sx2+i,yb+i,sz2+1,PLANKS);}
    for(let k=0;k<f;k++)for(let t=0;t<3;t++){const tx=x0+ri(6,w-3),tz=z0+ri(4,d-3),ty=h0+4*k;if(t===0&&get(tx,ty,tz)===0)sb3(tx,ty,tz,11);}
    for(let t=0;t<3;t++){const tx=x0+ri(6,w-3),tz=z0+d-2,ty=h0;sb3(tx,ty,tz,20);const it=Math.random()<.5?{item:130,n:ri(10,24)}:{item:Math.random()<.5?133:107,n:2};SHELF[idx(tx,ty,tz)]={shop:-1,item:it.item,n:it.n};}
  }
  // lampu & barikade
  for(let k=0;k<6;k++)for(let i=10;i<W-10;i+=20){const zz=k*ZR+3;sb3(i,h0,zz-2,LOG);sb3(i,h0+1,zz-2,LOG);sb3(i,h0+2,zz-2,LOG);sb3(i,h0+3,zz-2,GLASS);sb3(zz-2,h0,i,LOG);sb3(zz-2,h0+1,i,LOG);sb3(zz-2,h0+2,i,LOG);sb3(zz-2,h0+3,i,GLASS);}
  for(let n=0;n<40;n++){const rx=ri(8,W-10),rz=ri(8,D-10);const onR=(rx%ZR<7)!==(rz%ZR<7);if(!onR)continue;fillB(rx,h0,rz,rx+2,h0+1,rz,PLANKS);}
  for(let n=0;n<26;n++){const k=ri(0,5),i=ri(10,W-14),vertical=Math.random()<.5;X.cars.push(vertical?[k*ZR+ri(1,5),i]:[i,k*ZR+ri(1,5)]);}
  X.sp=[123.5,h0+.02,123.5];
}
function genMart(bx,bz,h0){
  const w=20,d=14,x0=bx+6,z0=bz+1;
  fillB(x0,h0-1,z0,x0+w-1,h0-1,z0+d-1,PLANKS);
  shellB(x0,z0,w,d,5,h0,BRICK,STONE);
  fillB(x0+2,h0,z0,x0+w-3,h0+2,z0,GLASS);fillB(x0+w/2-2,h0,z0,x0+w/2+1,h0+2,z0,0);
  for(let i=0;i<4;i++)sb3(x0+4+i*4,h0+3,z0,GLASS);
  for(const row of[4,7,10])for(let x=x0+2;x<x0+w-2;x++){if((x-x0)%6===0)continue;sb3(x,h0,z0+row,20);
    const pool=[[133,3],[107,2],[135,2],[133,2],[130,12],[107,3]],p=pool[ri(0,pool.length-1)];SHELF[idx(x,h0,z0+row)]={shop:-1,item:p[0],n:p[1]};}
  for(let x=x0+2;x<x0+8;x++)sb3(x,h0,z0+2,11);
  X.marts.push([x0,z0,w,d]);
}
function genWar(h0){
  const trench=(x0,z0,x1,z1,wid)=>{ // jalur lurus sumbu x atau z
    const horiz=Math.abs(x1-x0)>Math.abs(z1-z0);
    if(horiz){for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)for(let dz=0;dz<wid;dz++){const z=z0+dz;fillB(x,h0-3,z,x,h0+3,z,0);sb3(x,h0-3,z,PLANKS);sb3(x,h0-4,z,DIRT);if(x%7<2&&(dz===0||dz===wid-1))sb3(x,h0-2,z,DIRT);}}
    else for(let z=Math.min(z0,z1);z<=Math.max(z0,z1);z++){const xo=Math.round(Math.sin(z/9+x0)*2.5);for(let dx=0;dx<wid;dx++){const x=x0+xo+dx;fillB(x,h0-3,z,x,h0+3,z,0);sb3(x,h0-3,z,PLANKS);sb3(x,h0-4,z,DIRT);if(z%7<2&&(dx===0||dx===wid-1))sb3(x,h0-2,z,DIRT);
      if(dx===0){sb3(x-1,h0,z,DIRT);if(z%5===0)sb3(x-2,h0,z,BRICK);}if(dx===wid-1){sb3(x+1,h0,z,DIRT);if(z%5===0)sb3(x+2,h0,z,BRICK);}}}
  };
  for(const bx of[46,62,194,210])trench(bx,0,bx,D-1,4);
  for(const zc of[30,78,126,174,222]){trench(14,zc,66,zc,3);trench(190,zc,244,zc,3);}
  // area tanpa-pria: kawah & pohon mati
  for(let n=0;n<110;n++){const cx=ri(76,180),cz=ri(6,D-7),r=ri(2,5);for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){const dd=Math.hypot(dx,dz);if(dd>r)continue;const dep=Math.round((1-dd/r)*2.4);for(let y=h0-1;y>=h0-1-dep;y--)sb3(cx+dx,y,cz+dz,0);sb3(cx+dx,h0-2-dep,cz+dz,DIRT);}}
  for(let n=0;n<45;n++){const x=ri(76,180),z=ri(6,D-7),t=ri(4,7);if(get(x,h0-1,z)===GRASS)fillB(x,h0,z,x,h0+t-1,z,LOG);}
  for(let n=0;n<70;n++){const x=ri(72,184),z=ri(4,D-6);if(get(x,h0-1,z)===GRASS)fillB(x,h0,z,x+ri(1,3),h0,z,BRICK);}
  // markas
  const base=(cx,col)=>{
    fillB(cx-12,h0-1,104,cx+12,h0-1,152,STONE);
    shellB(cx-6,110,12,9,5,h0,BRICK,STONE);fillB(cx-1,h0,110+8,cx+1,h0+2,110+8,0);
    shellB(cx-6,138,12,9,5,h0,BRICK,STONE);fillB(cx-1,h0,138,cx+1,h0+2,138,0);
    fillB(cx-1,h0,127,cx+1,h0,129,STONE);
    for(let i=0;i<6;i++){sb3(cx-5+i*2,h0,121,20);SHELF[idx(cx-5+i*2,h0,121)]={shop:-1,item:i%3===0?138:i%3===1?133:130,n:i%3===0?40:i%3===1?3:20};}
  };
  base(18);base(238);
  X.sp=[22,h0+.02,128];
  X.flagPos={1:[22,128],2:[234,128]};
}
/* ---- populate ---- */
function spawnTyped(type,x,z,ex){const gy=X.cy,m=A.makeMob(type,x,gy+.02,z);if(ex)Object.assign(m,ex);A.mobs().push(m);return m;}
function openAt(x,z){x=Math.floor(x);z=Math.floor(z);if(x<3||z<3||x>=W-3||z>=D-3)return false;const gy=X.cy;for(let y=gy;y<gy+4;y++)if(get(x,y,z)!==AIR)return false;for(let y=gy+4;y<gy+24;y++)if(get(x,y,z)!==AIR)return false;return get(x,gy-1,z)!==AIR&&get(x,gy-1,z)!==WATER;}
function chaosPop(){
  const L=A.mobs();L.length=0;WR=null;ZS={kills:0,boss:0,t:0,bossT:40,N:0,shots:0};
  if(X.world==="zombie"){
    for(const c of X.cars)if(openAt(c[0],c[1]))spawnVeh(Math.random()<.5?"car":"jeep",c[0]+.5,X.cy,c[1]+.5);
    for(let n=0;n<26;n++){const a=Math.random()*6.283,d=rnd(18,70),x=123.5+Math.cos(a)*d,z=123.5+Math.sin(a)*d;if(openAt(x,z))spawnZ("walker",x,z);}
    for(const mt of X.marts)for(let k=0;k<3;k++){const m=spawnTyped("z_walker",mt[0]+rnd(3,mt[2]-3),mt[1]+rnd(3,mt[3]-3),{cz:1,zt:"walker"});}
  }else initWar();
  chaosHud();
}
/* ---- zombie ---- */
let ZS={kills:0,boss:0,t:0,bossT:40,N:0};
const zp=[],zc=[];
function spawnZ(zt,x,z,ex){if(A.mobs().length>150||!openAt(x,z))return null;const m=spawnTyped("z_"+zt,Math.floor(x)+.5,Math.floor(z)+.5,ex);m.cz=1;m.zt=zt;return m;}
function zPick(){
  const L=Math.min(1,ZS.kills/70),w=[["walker",30],["runner",11+L*8],["bocah",8],["anjing",7],["perayap",7],["muntah",6],["gendut",5+L*3],["lompat",5],["racun",4],["bom",5],["api",3+L*2],["es",3+L*2],["listrik",3+L*2],["penjerit",3],["pemburu",L*6],["tentara",2+L*6],["dokter",3],["bayangan",L*5],["kembar",4],["pelempar",4],["tank",L*6]];
  let s=0;for(const a of w)s+=a[1];let r=Math.random()*s;for(const a of w){r-=a[1];if(r<=0)return a[0];}return"walker";
}
function zSpawnTick(dt){
  ZS.t-=dt;ZS.bossT-=dt;const L=A.mobs();let n=0,boss=0;for(const m of L)if(m.cz){n++;if(ZT[m.zt].boss)boss++;}
  const cap=Math.min(48,16+Math.floor(ZS.kills/5));
  if(ZS.t<=0){ZS.t=.4;if(n<cap)for(let k=0;k<3;k++){const fa=Math.atan2(-Math.cos(P.yaw),-Math.sin(P.yaw)),a=Math.random()<.75?fa+(Math.random()-.5)*1.7:Math.random()*6.283,d=rnd(12,30);const t=zPick();if(spawnZ(t,P.x+Math.cos(a)*d,P.z+Math.sin(a)*d))break;}}
  if(ZS.bossT<=0&&boss<1){ZS.bossT=rnd(75,110);const t=Math.random()<.5?"raksasa":"ratu";for(let k=0;k<12;k++){const a=Math.random()*6.283;if(spawnZ(t,P.x+Math.cos(a)*34,P.z+Math.sin(a)*34)){chip("☠ "+ZNAME(t)+" muncul!");A.tone("sawtooth",90,50,1.2,.35);break;}}}
}
function zBite(m,Z){
  A.hurtPlayer(Z.dmg,m.x,m.z);const w=Z.w,PZ=X.pz;
  if(w==="poison"||m.zt==="muntah")PZ.poison=Math.max(PZ.poison,5);
  if(w==="fire"){PZ.burn=Math.max(PZ.burn,3);chip("🔥 Kamu terbakar!");}
  if(w==="ice"){PZ.slow=Math.max(PZ.slow,4);}
  if(w==="charge"){const L=Math.hypot(P.x-m.x,P.z-m.z)||1;P.vx+=(P.x-m.x)/L*12;P.vz+=(P.z-m.z)/L*12;P.vy=Math.max(P.vy,5);}
}
function zProj(m,kind,col,dmg,pz){
  const ex=P.x-m.x,ey=P.y+1.1-(m.y+1.4),ez=P.z-m.z,L=Math.hypot(ex,ey,ez)||1,sp=17;
  zp.push({x:m.x,y:m.y+1.5,z:m.z,vx:ex/L*sp,vy:ey/L*sp+4.5*(L/sp),vz:ez/L*sp,col,dmg,pz,kind,t:4});
}
function zAI(m,dt,dist,dx,dz){
  const Z=ZT[m.zt],surv=S.mode==="survival"&&!S.dead,k=Z.k||1;m.cd=(m.cd||0)-dt;m.ab=(m.ab===undefined?rnd(1,4):m.ab)-dt;
  if(dist>82&&!Z.boss){const L=A.mobs(),i=L.indexOf(m);if(i>=0)L.splice(i,1);return true;}
  if(!surv){m.moving=false;return true;}
  m.yaw=Math.atan2(-dx,-dz);m.moving=dist>.95*k;m.sp=Z.sp;
  const w=Z.w;
  if(m.chg>0){m.chg-=dt;m.sp=Z.sp*2.7;}
  if(w==="spit"||w==="throw"){if(dist>5&&dist<(w==="spit"?20:24)&&m.ab<=0){m.ab=rnd(2.2,3.6);if(w==="spit")zProj(m,"vomit",[.55,.05,.05],3,1);else zProj(m,"rock",[.4,.35,.3],5,0);}if(dist<11)m.moving=false;}
  else if(w==="leap"){if(dist>3.5&&dist<12&&m.ab<=0&&m.ground){m.ab=rnd(2.5,4);m.vy=7.5;m.lv=[dx/dist*(dist*1.5),dz/dist*(dist*1.5),.6];}}
  else if(w==="charge"){if(dist>6&&dist<18&&m.ab<=0){m.ab=rnd(4,6);m.chg=1.4;chip("🐂 Tank menyeruduk!");}}
  else if(w==="shock"){if(dist<8&&m.ab<=0&&los(m,dist)){m.ab=rnd(2.2,3.5);A.hurtPlayer(4,m.x,m.z);X.pz.shock=.7;burst(P.x,P.y+1,P.z,10,4,()=>[1,1,.4],.09,.3,{g:0});A.tone("sawtooth",1400,300,.2,.25);}}
  else if(w==="scream"){if(dist<32&&m.ab<=0){m.ab=rnd(9,13);A.tone("sawtooth",1100,250,.9,.4);chip("😱 Penjerit memanggil gerombolan!");for(let n=0;n<4;n++){const a=Math.random()*6.283;spawnZ(Math.random()<.5?"walker":"runner",P.x+Math.cos(a)*rnd(14,22),P.z+Math.sin(a)*rnd(14,22));}}}
  else if(w==="heal"){if(m.ab<=0){m.ab=2;for(const o of A.mobs())if(o.cz&&o!==m&&o.hp>0&&o.hp<TYPES[o.type].hp&&Math.hypot(o.x-m.x,o.z-m.z)<8){o.hp=Math.min(TYPES[o.type].hp,o.hp+10);burst(o.x,o.y+1.4,o.z,4,1.2,()=>[.4,1,.5],.09,.6,{g:-1});}}}
  else if(w==="slam"){if(dist<7&&m.ab<=0){m.ab=3.2;burst(m.x,m.y+.2,m.z,24,7,()=>[.5,.45,.4],.35,.8,{g:3});A.tone("sine",90,40,.5,.5);if(Math.abs(P.y-m.y)<2.5){A.hurtPlayer(14,m.x,m.z);const L=Math.hypot(dx,dz)||1;P.vx+=dx/L*10;P.vz+=dz/L*10;P.vy=Math.max(P.vy,7);}}}
  else if(w==="blink"){if(dist>9&&m.ab<=0){m.ab=rnd(4,6);const a=Math.random()*6.283,nx=P.x+Math.cos(a)*5,nz=P.z+Math.sin(a)*5;if(openAt(nx,nz)){burst(m.x,m.y+1,m.z,12,2,()=>[.5,.2,.9],.12,.5,{g:-1});m.x=nx;m.z=nz;m.y=X.cy;burst(m.x,m.y+1,m.z,12,2,()=>[.5,.2,.9],.12,.5,{g:-1});}}}
  else if(w==="summon"){if(dist<40&&m.ab<=0){m.ab=rnd(7,10);chip("👑 Ratu memanggil pasukan!");A.tone("sawtooth",300,120,.8,.35);for(let n=0;n<4;n++){const a=Math.random()*6.283;spawnZ(["walker","runner","bocah","anjing"][ri(0,3)],m.x+Math.cos(a)*3,m.z+Math.sin(a)*3);}}}
  else if(w==="bomb"){if(dist<2.4&&!m.boomed){m.boomed=true;explode(m.x,m.y+1,m.z,3.4,18,1.2,{});A.killMob(m,false);return true;}}
  else if(w==="fire"){if(Math.random()<dt*10)burst(m.x,m.y+1,m.z,1,.6,()=>[1,rnd(.3,.7),.1],.1,.4,{g:-3});}
  else if(w==="ice"){if(Math.random()<dt*6)burst(m.x,m.y+1,m.z,1,.5,()=>[.7,.9,1],.08,.5,{g:-1});}
  else if(w==="poison"){if(Math.random()<dt*6)burst(m.x,m.y+1,m.z,1,.5,()=>[.4,.9,.2],.1,.6,{g:-1});}
  if(m.lv&&m.lv[2]>0){m.lv[2]-=dt;m.vx=m.lv[0];m.vz=m.lv[1];}
  if(dist<1.35*k+.2&&Math.abs(P.y-m.y)<2.4*k&&m.cd<=0){m.cd=w==="slam"?2:1.1;if(w!=="bomb")zBite(m,Z);}
  return true;
}
function zKill(m,byP){
  const Z=ZT[m.zt],w=Z.w;ZS.kills++;
  if(byP){coins(Z.boss?40:Math.random()<.4?1:0);const r=Math.random();if(Z.boss){A.give(138,40);A.give(133,3);A.give(130,30);chip("☠ "+Z.n+" tumbang! +hadiah");ZS.boss++;}else if(r<.18)A.give(130,8);else if(r<.26)A.give(133,1);else if(r<.3)A.give(138,10);}
  if(w==="acid"){burst(m.x,m.y+1,m.z,46,7,()=>[.55,rnd(.8,1),.1],.3,.9,{g:3,b:.3});const d=Math.hypot(P.x-m.x,P.z-m.z);if(d<6&&S.mode==="survival")A.hurtPlayer(Math.max(2,Math.round(11*(1-d/6.5))),m.x,m.z);for(const o of A.mobs())if(o!==m&&o.cz&&Math.hypot(o.x-m.x,o.z-m.z)<5)A.hurtMob(o,25,m.x,m.z,false);zc.push({x:m.x,y:m.y,z:m.z,t:6,r:2.6,k:"acid"});A.tone("sine",200,60,.5,.5);chip("🤢 Asam lambung meledak!");}
  else if(w==="poison"){zc.push({x:m.x,y:m.y,z:m.z,t:7,r:3.2,k:"poison"});burst(m.x,m.y+1,m.z,22,3,()=>[.4,.9,.2],.3,1,{g:-.5});}
  else if(w==="bomb"&&!m.boomed){m.boomed=true;explode(m.x,m.y+1,m.z,3.4,18,1.2,{});}
  else if(w==="fire"){burst(m.x,m.y+1,m.z,30,5,()=>[1,rnd(.3,.8),.1],.3,.8,{g:-2});if(Math.hypot(P.x-m.x,P.z-m.z)<3.5)X.pz.burn=Math.max(X.pz.burn,3);}
  else if(w==="ice"){burst(m.x,m.y+1,m.z,26,4,()=>[.7,.9,1],.25,.8,{g:2});if(Math.hypot(P.x-m.x,P.z-m.z)<4)X.pz.slow=Math.max(X.pz.slow,3);}
  else if(w==="split"){for(let n=0;n<2;n++){const c=spawnZ("bocah",m.x+rnd(-.8,.8),m.z+rnd(-.8,.8));if(c)c.hp=12;}}
}
function chaosEffects(dt){
  const PZ=X.pz,surv=S.mode==="survival"&&!S.dead;
  if(PZ.poison>0){PZ.poison-=dt;PZ.pt=(PZ.pt||0)-dt;if(PZ.pt<=0&&surv){PZ.pt=.8;A.hurtPlayer(1);burst(P.x,P.y+1.4,P.z,3,1,()=>[.4,.9,.2],.08,.5,{g:-1});}}
  if(PZ.burn>0){PZ.burn-=dt;PZ.bt=(PZ.bt||0)-dt;if(get(Math.floor(P.x),Math.floor(P.y+.3),Math.floor(P.z))===WATER)PZ.burn=0;if(PZ.bt<=0&&surv){PZ.bt=.5;A.hurtPlayer(1);}burst(P.x,P.y+1.2,P.z,1,1,()=>[1,rnd(.3,.7),.1],.1,.4,{g:-3});}
  if(PZ.slow>0){PZ.slow-=dt;const f=Math.pow(.9,dt*60);P.vx*=f;P.vz*=f;}
  if(PZ.shock>0){PZ.shock-=dt;P.yaw+=(Math.random()-.5)*.3;}
  for(let i=zp.length-1;i>=0;i--){const q=zp[i];q.t-=dt;q.vy-=9*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;addP(q.x,q.y,q.z,0,0,0,.16,q.col,.3,{g:0});
    let hit=solid(Math.floor(q.x),Math.floor(q.y),Math.floor(q.z)),hp=false;
    if(surv&&Math.hypot(P.x-q.x,P.z-q.z)<.9&&q.y>P.y-.2&&q.y<P.y+2){hit=true;hp=true;}
    if(hit||q.t<=0){if(hp){A.hurtPlayer(q.dmg,q.x,q.z);if(q.pz)PZ.poison=Math.max(PZ.poison,4);}burst(q.x,q.y,q.z,10,3,()=>q.col,.12,.5,{g:6});zp.splice(i,1);}}
  for(let i=zc.length-1;i>=0;i--){const c=zc[i];c.t-=dt;c.tk=(c.tk||0)-dt;burst(c.x+rnd(-c.r,c.r)*.8,c.y+.3,c.z+rnd(-c.r,c.r)*.8,1,.5,()=>c.k==="acid"?[.5,.9,.1]:[.4,.8,.2],.25,1,{g:-.4});
    if(c.tk<=0){c.tk=.5;if(surv&&Math.hypot(P.x-c.x,P.z-c.z)<c.r&&Math.abs(P.y-c.y)<2){A.hurtPlayer(1);if(c.k==="poison")PZ.poison=Math.max(PZ.poison,3);}}
    if(c.t<=0)zc.splice(i,1);}
}
/* ---- perang ---- */
let WR=null;
function initWar(){
  const h0=X.cy;WR={l:[[],[],[]],fl:[null,null,null],sc:[0,0,0],pool:[0,70,70],post:[0,"push","push"],pt:[0,30,35],lt:0,rt:0,over:false,pl:{x:P.x,y:P.y,z:P.z,isP:1,hp:20,team:1},carryP:0,gt:[],ot:0};
  for(const t of[1,2]){const fp=X.flagPos[t],m=spawnTyped("flag"+t,fp[0]+.5,fp[1]+.5);m.xflag=1;WR.fl[t]={home:fp,m,car:null};}
  for(const t of[1,2])for(let i=0;i<50;i++){const role=i<6?"medic":i<12?"grenadier":i<16?"sniper":i<22?"raider":"rifle";warSpawn(t,role,true,i);}
}
function warSpawn(t,role,init,i){
  const z=init?clamp(14+i*4.6+rnd(-2,2),6,248):128+rnd(-14,14),x=init?(t===1?rnd(40,66):rnd(190,216)):(t===1?rnd(14,26):rnd(230,242));
  const nm=(t===1?"ally":"foe")+(role==="medic"?"M":"");
  const m=spawnTyped(nm,init?(t===1?[48,64][i%2]:[196,212][i%2])+.5+rnd(0,1):x,init?clamp(z,6,248):z,{team:t,role,lz:clamp(z,10,246),home:[t===1?20:236,128]});
  if(!init)WR.pool[t]--;return m;
}
function wTarget(m){
  const R=m.role==="sniper"?72:42;let best=null,bd=R;const L=WR.l[m.team===1?2:1];
  for(let i=0;i<L.length;i++){const o=L[i];if(o.hp<=0)continue;const d=Math.hypot(o.x-m.x,o.z-m.z)*(o.carry?.4:1);if(d<bd&&Math.abs(o.y-m.y)<10&&losM(m,o)){bd=d;best=o;}}
  if(m.team===2&&!S.dead&&S.mode==="survival"){const d=Math.hypot(P.x-m.x,P.z-m.z)*(WR.carryP?.4:1);if(d<bd&&los(m,Math.hypot(P.x-m.x,P.z-m.z))){best=WR.pl;}}
  return best;
}
function wShoot(m,tg,d){
  const hurt=m.hp<TYPES[m.type].hp*.4,ey=tg.y+1.1-(m.y+1.3),ex=tg.x-m.x,ez=tg.z-m.z,L=Math.hypot(ex,ey,ez)||1,sp=70,sn=m.role==="sniper";
  addP(m.x+ex/L*.8,m.y+1.3,m.z+ez/L*.8,ex/L*sp,ey/L*sp,ez/L*sp,.07,[1,.85,.35],Math.min(.7,L/sp),{g:0});
  burst(m.x+ex/L*.9,m.y+1.3,m.z+ez/L*.9,2,2,()=>[1,.7,.2],.09,.1,{g:0});shotAt(sn?"sniper":"rifle",m.x,m.z,1.1);
  const acc=clamp((sn?.9:.6)-d*.009,.08,.88)*(hurt?.6:1);
  if(Math.random()<acc){const dmg=(sn?14:5)*rnd(.8,1.25);if(tg.isP){if(!(DV.m&&!VEH[DV.m.type].animal))hitPlayer(dmg*.8,m.x,m.z,"rifle");else{DV.m.hp-=dmg;DV.m.hurt=.2;}}else A.hurtMob(tg,dmg,m.x,m.z,false);}
}
function wGren(m,tg){
  const d=Math.hypot(tg.x-m.x,tg.z-m.z);WR.gt.push({t:1.1,x:tg.x+rnd(-2,2),y:tg.y+.5,z:tg.z+rnd(-2,2)});
  for(let i=0;i<6;i++)addP(m.x+(tg.x-m.x)*i/6,m.y+2+Math.sin(i/6*3.14)*2,m.z+(tg.z-m.z)*i/6,0,0,0,.14,[.3,.4,.25],.5+i*.05,{g:0});
}
function wAI(m,dt,dist,dx,dz){
  const T=TYPES[m.type],W2=WR;if(!W2||W2.over){m.moving=false;return true;}
  m.cd=(m.cd||0)-dt;m.gc=(m.gc||rnd(3,8))-dt;m.tt=(m.tt||0)-dt;
  const base=m.role==="medic"?3.3:3.1,hpf=m.hp/T.hp,hurt=hpf<.4;m.sp=base*(hurt?.55:1);
  if(hurt&&Math.random()<dt*2)burst(m.x,m.y+1,m.z,1,.6,()=>[.6,0,0],.06,.4,{g:6});
  if(m.tt<=0){m.tt=rnd(.3,.6);m.tg=wTarget(m);}
  let tg=m.tg;if(tg&&(tg.hp<=0||(!tg.isP&&!A.mobs().includes(tg))))tg=m.tg=null;
  const own=m.team,enemy=own===1?2:1,F=W2.fl[enemy],OF=W2.fl[own];
  const fdist=(o)=>Math.hypot(o.x-m.x,o.z-m.z);
  let d=tg?Math.hypot(tg.x-m.x,tg.z-m.z):0,go=null;
  if(tg){m.yaw=Math.atan2(-(tg.x-m.x),-(tg.z-m.z));}
  if(m.carry){go=OF.home;}
  else if(m.role==="medic"){
    let inj=null,bd=45;for(const o of W2.l[own]){if(o===m||o.hp>=TYPES[o.type].hp*.75)continue;const dd=fdist(o);if(dd<bd){bd=dd;inj=o;}}
    if(own===1&&!S.dead&&S.hp<13){const dd=Math.hypot(P.x-m.x,P.z-m.z);if(dd<bd&&dd<40){inj=W2.pl;bd=dd;}}
    if(inj){go=[inj.x,inj.z];if(bd<2.6&&m.cd<=0){m.cd=1.5;if(inj.isP){S.hp=Math.min(20,S.hp+5);A.updateHUD(true);chip("⛑ Medis menyembuhkanmu");}else inj.hp=Math.min(TYPES[inj.type].hp,inj.hp+12);burst(inj.x,inj.y+1.5,inj.z,6,1.5,()=>[.4,1,.5],.1,.7,{g:-1});}}
    else if(tg&&d<22&&m.cd<=0){m.cd=rnd(1.2,2);wShoot(m,tg,d);}
  }
  else if(hurt){go=OF.home;if(tg&&d<26&&m.cd<=0){m.cd=rnd(1.4,2.2);wShoot(m,tg,d);}if(Math.hypot(m.x-OF.home[0],m.z-OF.home[1])<14&&Math.random()<dt)m.hp=Math.min(T.hp,m.hp+1.5);}
  else if(m.role==="raider"&&!F.car){
    go=F.home;if(tg&&d<14&&m.cd<=0){m.cd=rnd(.9,1.4);wShoot(m,tg,d);}
  }
  else{
    if(tg){
      if(m.cd<=0){m.cd=rnd(.8,1.5)*(m.role==="sniper"?2.4:1);wShoot(m,tg,d);}
      if(m.role==="grenadier"&&m.gc<=0&&d>10&&d<32){m.gc=rnd(7,12);wGren(m,tg);}
      const adv=m.role==="sniper"?false:W2.post[own]==="push"?d>13:d>28;
      if(adv)go=[tg.x,tg.z];else m.moving=false;
    }else{
      m.ot=(m.ot||0)-dt;if(m.ot<=0||!m.obj){m.ot=rnd(8,14);const push=W2.post[own]==="push";const ox=own===1?(push?rnd(150,200):rnd(52,66)):(push?rnd(56,106):rnd(190,204));m.obj=[ox,clamp(m.lz+rnd(-14,14),6,250)];}
      go=m.obj;if(m.role==="sniper"&&Math.abs(m.x-go[0])<8)go=null;
    }
  }
  if(go){m.yaw=Math.atan2(-(go[0]-m.x),-(go[1]-m.z));m.moving=Math.hypot(go[0]-m.x,go[1]-m.z)>2.2;}
  else if(!tg)m.moving=false;
  m.sT=(m.sT||0)-dt;
  if(m.sT<=0){m.sT=.45;if(m.moving&&Math.hypot(m.x-(m.lx||0),m.z-(m.lz2||0))<.2){m.stk=(m.stk||0)+1;if(m.ground)m.vy=9.6;if(m.stk>2){m.dodge=1;m.dyaw=m.yaw+rnd(-1.8,1.8);m.stk=0;}}else m.stk=0;m.lx=m.x;m.lz2=m.z;}
  if(m.dodge>0){m.dodge-=dt;m.yaw=m.dyaw;m.moving=true;}
  return true;
}
function wKill(m,byP){
  if(!WR)return;const fl=m.carry;if(fl){fl.car=null;m.carry=null;wFlagHome(fl);chip("🚩 Pembawa bendera tewas — bendera kembali");}
  if(byP){coins(m.role==="raider"?3:1);WR.k=(WR.k||0)+1;}
}
function wFlagHome(F){F.m.x=F.home[0]+.5;F.m.z=F.home[1]+.5;F.m.y=X.cy+.02;F.m.vx=F.m.vz=F.m.vy=0;}
function warTick(dt){
  const W2=WR;if(!W2||W2.over)return;
  W2.lt-=dt;
  if(W2.lt<=0){W2.lt=.3;W2.l=[[],[],[]];for(const m of A.mobs())if(m.team&&m.hp>0)W2.l[m.team].push(m);}
  W2.pl.x=P.x;W2.pl.y=P.y;W2.pl.z=P.z;W2.pl.hp=S.hp;
  for(const t of[1,2]){W2.pt[t]-=dt;if(W2.pt[t]<=0){W2.pt[t]=rnd(30,50);const a=W2.l[t].length,b=W2.l[t===1?2:1].length;W2.post[t]=(a>=b*.9&&Math.random()<.85)||Math.random()<.3?"push":"hold";}}
  W2.rt-=dt;if(W2.rt<=0){W2.rt=3;for(const t of[1,2]){const alive=W2.l[t].length;if(alive<50&&W2.pool[t]>0){const rc=W2.l[t].filter(o=>o.role==="raider").length,rm=W2.l[t].filter(o=>o.role==="medic").length;warSpawn(t,rc<4?"raider":rm<4?"medic":Math.random()<.2?"grenadier":"rifle",false);}}}
  for(let i=W2.gt.length-1;i>=0;i--){const g=W2.gt[i];g.t-=dt;if(g.t<=0){explode(g.x,g.y,g.z,3.6,15,1.1,{});W2.gt.splice(i,1);}}
  // bendera
  for(const t of[1,2]){
    const F=W2.fl[t],e=t===1?2:1;if(!F)continue;
    if(F.car){
      const c=F.car;let alive=true,cx,cz,cy;
      if(c==="P"){alive=!S.dead&&S.mode==="survival";cx=P.x+Math.sin(P.yaw)*.9;cz=P.z+Math.cos(P.yaw)*.9;cy=P.y+.4;}
      else{alive=c.hp>0&&A.mobs().includes(c);cx=c.x+Math.sin(c.yaw)*.9;cz=c.z+Math.cos(c.yaw)*.9;cy=c.y+.4;}
      if(!alive){F.car=null;W2.carryP=c==="P"?0:W2.carryP;wFlagHome(F);chip("🚩 Bendera "+(t===1?"Biru":"Merah")+" kembali ke markas");}
      else{F.m.x=cx;F.m.z=cz;F.m.y=cy;F.m.vy=0;F.m.vx=F.m.vz=0;
        const own=W2.fl[e],ox=own.home[0],oz=own.home[1],px=c==="P"?P.x:c.x,pz=c==="P"?P.z:c.z;
        if(Math.hypot(px-ox,pz-oz)<4){W2.sc[e]++;F.car=null;if(c==="P")W2.carryP=0;else c.carry=null;wFlagHome(F);
          chip((e===1?"🔵 Biru":"🔴 Merah")+" mencuri bendera! "+W2.sc[e]+"/3");A.tone("sine",500,1000,.5,.4);A.tone("sine",750,1500,.5,.3);
          if(W2.sc[e]>=3){warEnd(e===1);}}}
    }else{
      // pengambilan oleh musuh tim t -> tim e
      if(e===1&&!S.dead&&S.mode==="survival"&&Math.hypot(P.x-F.m.x,P.z-F.m.z)<2.4&&Math.abs(P.y-F.m.y)<3){F.car="P";W2.carryP=1;chip("🚩 Kamu membawa bendera musuh! Lari ke markas biru!");A.tone("square",440,880,.3,.3);}
      else{for(const o of W2.l[e]){if(o.carry||o.hp<=0)continue;if(Math.hypot(o.x-F.m.x,o.z-F.m.z)<2.4&&Math.abs(o.y-F.m.y)<3&&(o.role==="raider"||Math.random()<.02)){F.car=o;o.carry=F;chip("🚩 "+(e===1?"Pasukan Biru":"Pasukan Merah")+" mengambil bendera "+(t===1?"Biru":"Merah")+"!");break;}}}
    }
  }
}
function warEnd(win){
  WR.over=true;const d=el("div",{id:"cend",style:"position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.72);color:#fff;font:800 30px sans-serif;text-align:center;gap:14px"},document.body);
  d.textContent=win?"🏆 MENANG! 3 bendera direbut":"💀 KALAH — musuh merebut 3 bendera";
  const b=el("button",{text:"Kembali ke menu",style:"font-size:18px;padding:12px 22px;border-radius:12px;border:0;background:#5fa83a;color:#fff"},d);b.addEventListener("click",()=>location.reload());
}
/* ---- HUD & tick ---- */
function chaosHud(){
  let h=$$("warhud");if(!h)h=el("div",{id:"warhud",style:"position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:20;background:rgba(0,0,0,.55);color:#fff;font:700 13px sans-serif;padding:5px 12px;border-radius:10px;pointer-events:none;text-align:center;white-space:nowrap"},document.body);
  h.style.display=chaosOn()?"block":"none";if(!chaosOn())return;
  if(X.world==="zombie")h.textContent="🧟 Bunuh: "+ZS.kills+" · Boss: "+ZS.boss+" · Zombie: "+A.mobs().filter(m=>m.cz).length;
  else if(WR){const a=WR.l[1].length,b=WR.l[2].length;h.textContent="🔵 "+WR.sc[1]+"/3  ⚔  "+a+" vs "+b+"  ⚔  "+WR.sc[2]+"/3 🔴"+(WR.carryP?"  🚩 Bawa bendera → markas biru!":"")+"  · cadangan "+WR.pool[1];}
}
function chaosTick(dt){
  if(!chaosOn()||(typeof started!=="undefined"&&!started))return;
  X.pz=X.pz||{poison:0,burn:0,slow:0,shock:0};
  chaosEffects(dt);
  X.hudT=(X.hudT||0)-dt;if(X.hudT<=0){X.hudT=.5;chaosHud();}
  if(X.world==="zombie"){if(!S.dead)zSpawnTick(dt);}else warTick(dt);
}
function chaosRespawn(){
  if(!chaosOn())return;X.pz={poison:0,burn:0,slow:0,shock:0};
  if(X.sp){P.x=X.sp[0];P.y=X.sp[1]+.5;P.z=X.sp[2];P.vx=P.vy=P.vz=0;}
  if(WR&&WR.fl[2]&&WR.fl[2].car==="P"){WR.fl[2].car=null;WR.carryP=0;wFlagHome(WR.fl[2]);}
  if(count(130)<30)A.give(130,40);if(X.world==="war"&&count(138)<60)A.give(138,80);
}
function giveKit(){
  const g=A.give;g(129,1);g(130,90);g(133,4);
  if(X.world==="zombie"){g(160,1);g(137,24);g(156,1);g(138,120);}
  else{g(157,1);g(138,220);g(180,4);g(133,3);}
  A.refreshHotbar();A.updateHUD(true);
}
function startChaos(kind){
  wrapWorld();MP.noSave=true;X.world=kind;X.pz={poison:0,burn:0,slow:0,shock:0};zp.length=0;zc.length=0;
  const sb=document.querySelector('#modeRow button[data-m="survival"]');if(sb)sb.click();
  seed=Math.floor(Math.random()*1e9);edits={};generate();chunks.forEach(c=>{c.dirty=true;});spawn();EX.newWorld();
  P.x=X.sp[0];P.y=X.sp[1]+.5;P.z=X.sp[2];P.vx=P.vy=P.vz=0;P.yaw=kind==="war"?-Math.PI/2:0;
  S.mode="survival";giveKit();
  if(!X.nwHook){X.nwHook=1;const nb=$$("newWorld");if(nb)nb.addEventListener("click",e=>{if(chaosOn()){e.stopImmediatePropagation();e.preventDefault();location.reload();}},true);}
  panels.chs.close();startGame();
  chip(kind==="zombie"?"🧟 Bertahan hidup! Cari makanan di minimarket":"🪖 Rebut bendera musuh 3 kali!");
}
function chaosPanel(){
  const b=panels.chs.body;b.innerHTML="";
  const card=(h,p,k)=>{const c=el("div",{class:"rrow",style:"flex-direction:column;align-items:stretch;gap:6px"},b);el("b",{text:h},c);el("small",{text:p,style:"white-space:normal;line-height:1.35"},c);const bt=el("button",{text:"Mulai",style:"padding:12px;font-size:16px"},c);bt.addEventListener("click",()=>{SFX.click();startChaos(k);});};
  card("🧟 Kota Zombie Apokalips","Kota besar dengan 23 jenis zombie (gendut asam, runner, muntah darah, penjerit, tank, ratu, raksasa…). Cari makanan di minimarket, bertahan selama mungkin.","zombie");
  card("🪖 Perang Parit 50 vs 50","Peta luas penuh parit. Rebut bendera musuh 3 kali sebelum mereka merebut bendera kita. Pasukan pintar: medis, granat, penembak jitu, perebut bendera.","war");
  el("small",{text:"Dunia Chaos tidak disimpan. Muat ulang halaman untuk kembali ke dunia biasa.",style:"display:block;margin-top:8px;opacity:.7"},b);
}

SFX.eat=function(){
  for(let i=0;i<6;i++){const t=i*.17+rnd(0,.04),p=(i%2?.3:-.3);A.noise(rnd(.05,.09),"bandpass",rnd(1500,3300),rnd(700,1400),.75,p,t);A.noise(.12,"lowpass",700,260,.55,p*.5,t);A.noise(.02,"highpass",5000,3500,.3,p,t+.02);}
  A.tone("sine",190,80,.2,.4,0,1.15);A.noise(.12,"bandpass",900,500,.3,0,1.17);S.eatCd=Math.max(S.eatCd,1.3);
};

/* ================= Update per frame ================= */
function update(dt){
  mpTick(dt);
  if(S.dead)X.wasDead=true;else if(X.wasDead){X.wasDead=false;resetW();chaosRespawn();}
  if(typeof started!=="undefined"&&!started)return;
  woundTick(dt);raidTick(dt);chaosTick(dt);
  updP(dt);updG(dt);tickFx(dt);vehicleStep(dt);
  if(!S.atkHeld)X.holdFire=false;
  if(X.alertT>0)X.alertT-=dt;
  if(siren>0){siren-=dt;X.sirenT-=dt;if(X.sirenT<=0){X.sirenT=.55;A.tone("sawtooth",620,880,.5,.1);}}
  if(DAY.day!==X.stolenDay){X.stolen={};X.stolenDay=DAY.day;}
  for(let i=births.length-1;i>=0;i--){const b=births[i];b.t-=dt;if(b.t<=0){births.splice(i,1);const m=A.makeMob(b.type,b.x,b.y+.1,b.z);m.baby=true;m.sc=.5;A.mobs().push(m);burst(b.x,b.y+.8,b.z,10,2,()=>[1,.5,.7],.1,1,{g:-1});A.tone("sine",900,1500,.2,.25);track("breed");}}
  const f=X.fish;if(f){f.t-=dt;if(!f.bite&&f.t<=0){f.bite=1.4;burst(f.x,f.y,f.z,8,2,()=>[.7,.85,1],.07,.6,{b:.2});A.tone("sine",300,700,.15,.3);chip("🎣 Ikan menggigit! Tarik sekarang!");}else if(f.bite>0){f.bite-=dt;if(f.bite<=0){X.fish=null;A.toast("Ikan lepas…");}}
    if(f&&Math.hypot(f.x-P.x,f.z-P.z)>12){X.fish=null;A.toast("Terlalu jauh");}}
  // blood moon
  const night=!!DAY.night;
  if(night&&!X.nightPrev){X.bloodMoon=S.mode==="survival"&&DAY.day%3===0;if(X.bloodMoon){chip("🌑 BULAN DARAH! Gelombang monster datang");flashWhite(.35);A.tone("sawtooth",90,50,1.4,.3);}}
  if(!night)X.bloodMoon=false;X.nightPrev=night;
  if(X.bloodMoon&&!DV.m||X.bloodMoon){X.bmT-=dt;if(X.bmT<=0){X.bmT=2.6;if(countT("zombie")+countT("creeper")<30){const a=Math.random()*6.283,d=rnd(16,28),x=P.x+Math.cos(a)*d,z=P.z+Math.sin(a)*d,gy=A.groundY(Math.floor(x),Math.floor(z));if(gy>0){const m=A.makeMob(Math.random()<.25?"creeper":"zombie",x,gy+.05,z);A.mobs().push(m);}}}}
  // parasut, jetpack, trampolin
  const h=A.held(),jump=input.jump||input.keys.Space,surv=S.mode==="survival";
  if(!DV.m&&!EX.flying){
    const hasC=!surv||count(190)>0;
    if(!X.chute&&hasC&&!P.ground&&P.vy<-15&&P.y>get_h(P)+6)X.chute=true;
    if(X.chute){if(P.ground||get(Math.floor(P.x),Math.floor(P.y+.5),Math.floor(P.z))===WATER){X.chute=false;}else{if(P.vy<-3.6)P.vy=-3.6;S.fallTop=P.y;}}
    if(h===191&&jump&&(!surv||X.fuel>0)){P.vy=Math.min(8,P.vy+34*dt);S.fallTop=P.y;if(surv)X.fuel-=dt*22;if(Math.random()<dt*40)addP(P.x+rnd(-.2,.2),P.y+.1,P.z+rnd(-.2,.2),rnd(-1,1),rnd(-6,-3),rnd(-1,1),.14,[1,rnd(.4,.8),.1],.4,{g:0});if(X.gT<=0){X.gT=.15;A.noise(.12,.12,1800);}}
    if(X.fuel<100&&(P.ground||h!==191))X.fuel=Math.min(100,X.fuel+dt*(P.ground?30:0));
    X.gT-=dt;
    const ub=get(Math.floor(P.x),Math.floor(P.y-.12),Math.floor(P.z));
    if(ub===21&&P.vy<=0&&!jump){P.vy=Math.max(15,-P.vy*.95+4);S.fallTop=P.y;boing();burst(P.x,P.y,P.z,6,3,()=>[.4,.8,1],.1,.5,{b:.3});track("bounce");}
    else if(ub===21)S.fallTop=P.y;
  }
}
function get_h(p){const g=A.groundY(Math.floor(p.x),Math.floor(p.z));return g<0?0:g;}
/* ================= Gambar tambahan ================= */
function emit(){
  emitParts();
  for(const k in MP.rp)drawRemote(MP.rp[k]);
  if(!S.third&&!S.dead&&!DV.m)drawHeld();
  for(const g of grens)box(g.x,g.y,g.z,.22,.3,.22,g.gr.col||[.25,.32,.22]);
  for(const p of prim){const fl=Math.floor(p.t*6)%2===0,s=.98+(3-p.t)*.01;box(p.x,p.y+.5,p.z,s,s,s,fl?[1,1,1]:[.85,.12,.08]);}
  const f=X.fish;if(f)box(f.x,f.y+(f.bite>0?-.1:0),f.z,.16,.16,.16,[.95,.15,.1]);
}
/* ================= Multiplayer P2P (PeerJS) ================= */
const MP={on:false,host:false,peer:null,conns:{},code:"",me:"host",name:"Pemain"+ri(10,99),rp:{},started:false,noSave:false,t:0,cfg:null,status:"",log:[],wrapped:false,applying:false};
const MPCOL=[[.9,.2,.2],[.2,.5,.95],[.95,.8,.2],[.2,.8,.4]];
const pcount=()=>Object.keys(MP.rp).length+1;
function loadPeer(cb,fail){
  if(window.Peer){cb();return;}
  const srcs=["peerjs.min.js?v=1794648371","https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js","https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js"];
  const tryN=i=>{if(i>=srcs.length){if(fail)fail();return;}const sc=document.createElement("script");sc.src=srcs[i];sc.onload=()=>window.Peer?cb():tryN(i+1);sc.onerror=()=>tryN(i+1);document.head.appendChild(sc);};tryN(0);
}
function bcast(d,except){for(const k in MP.conns){if(k===except)continue;try{MP.conns[k].send(d);}catch(e){}}}
function wrapWorld(){
  if(MP.wrapped)return;MP.wrapped=true;MP.cfg=window.DK_PEER_CFG||{debug:0,config:{iceTransportPolicy:"all",iceCandidatePoolSize:4,iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"},{urls:["turn:openrelay.metered.ca:80","turn:openrelay.metered.ca:443","turn:openrelay.metered.ca:443?transport=tcp","turns:openrelay.metered.ca:443?transport=tcp"],username:"openrelayproject",credential:"openrelayproject"},{urls:"turn:0.peerjs.com:3478",username:"peerjs",credential:"peerjsp"}]}};
  const sb=setBlock;setBlock=function(x,y,z,id){sb(x,y,z,id);if(MP.on&&!MP.applying)bcast({t:"b",x,y,z,id});};
  const sv=save;save=function(){if(!MP.noSave)sv();};
}
function mpBlock(x,y,z,id){if(MP.on&&!MP.applying)bcast({t:"b",x,y,z,id});}
function mpStatus(s){MP.status=s;mpRender();}
function mpLog(m,chat){MP.log.push(m);if(MP.log.length>40)MP.log.shift();chip(m);if(panels.cht&&!panels.cht.p.classList.contains("hide"))renderChat();}
function newRP(r){return{x:0,y:-99,z:0,tx:undefined,ty:0,tz:0,yaw:0,tyaw:0,pitch:0,held:0,look:r.look||X.look,name:r.name||"Tamu",ph:0,sp:0,col:Object.keys(MP.rp).length+(MP.host?1:0),w:[0,0,0,0],dead:0};}
function mpHost(){
  mpStatus("Menghubungkan…");
  loadPeer(()=>{
    wrapWorld();
    const code=Array.from({length:5},()=>"ABCDEFGHJKMNPQRSTUVWXYZ23456789"[ri(0,30)]).join("");
    const p=new window.Peer("dkotak-"+code,MP.cfg||undefined);MP.peer=p;
    p.on("open",()=>{MP.on=true;MP.host=true;MP.me="host";MP.code=code;mpRender();mpInfo();});
    p.on("connection",c=>{
      if(pcount()>=4){c.on("open",()=>{c.send({t:"full"});setTimeout(()=>c.close(),300);});return;}
      c.on("open",()=>{MP.conns[c.peer]=c;});
      c.on("data",d=>onMsg(c,d,c.peer));
      c.on("close",()=>{delete MP.conns[c.peer];const r=MP.rp[c.peer];delete MP.rp[c.peer];if(r)mpLog(r.name+" keluar");bcast({t:"left",pid:c.peer});mpRender();mpInfo();});
    });
    p.on("disconnected",()=>{try{p.reconnect();}catch(e){}});p.on("error",e=>{if(e.type==="unavailable-id")mpHost();else mpStatus("Gagal: "+e.type);});
  },()=>mpStatus("Gagal memuat PeerJS (butuh internet)"));
}
function mpJoin(code,tries){
  code=(code||"").trim().toUpperCase().replace(/^DKOTAK-/,"").replace(/[^A-Z0-9]/g,"");if(!code)return;tries=tries||0;mpStatus(tries?"Mencoba lagi ("+tries+")…":"Menyambung…");
  loadPeer(()=>{
    wrapWorld();if(MP.peer){try{MP.peer.destroy();}catch(e){}}
    const p=new window.Peer(undefined,MP.cfg||undefined);MP.peer=p;let done=false;
    const retry=msg=>{if(done)return;done=true;try{p.destroy();}catch(e){}if(tries<2)setTimeout(()=>mpJoin(code,tries+1),800);else mpStatus(msg);};
    p.on("open",id=>{MP.me=id;const c=p.connect("dkotak-"+code,{reliable:true});
      const to=setTimeout(()=>retry("Gagal tersambung. Pastikan host sudah buka Multiplayer & ID benar ("+code+"). Coba ganti jaringan (Wi-Fi/data)."),25000);
      c.on("open",()=>{if(done)return;done=true;clearTimeout(to);MP.on=true;MP.host=false;MP.code=code;MP.conns.host=c;c.send({t:"hi",name:MP.name,look:X.look});mpRender();mpInfo();});
      c.on("error",()=>{clearTimeout(to);retry("Koneksi ke host gagal");});
      c.on("data",d=>onMsg(c,d,"host"));
      c.on("close",()=>{if(!done)return;mpLog("Host keluar dari dunia");MP.on=false;MP.rp={};mpInfo();mpRender();});
    });
    p.on("error",e=>{if(e.type==="peer-unavailable")retry("ID "+code+" tidak ditemukan. Host harus menekan Buat Dunia dulu & biarkan layarnya tetap terbuka.");else retry("Gagal: "+e.type);});
  },()=>mpStatus("Gagal memuat PeerJS (butuh internet)"));
}
const startPayload=()=>({t:"start",seed,edits,pos:[P.x,P.y,P.z]});
function startGame(){const st=$$("start");if(st&&!st.classList.contains("hide"))$$("play").click();}
function mpStart(){MP.started=true;bcast(startPayload());panels.mpp.close();startGame();}
function enterWorld(d){
  MP.noSave=true;MP.started=true;seed=d.seed;edits=d.edits||{};generate();chunks.forEach(c=>{c.dirty=true;});spawn();EX.newWorld();
  panels.mpp.close();startGame();mpLog("Masuk dunia "+MP.code);
}
function onMsg(c,d,from){
  if(!d||!d.t)return;
  if(d.t==="hi"){
    const r=MP.rp[from]=newRP(d);
    bcast({t:"join",pid:from,name:d.name,look:d.look},from);
    c.send({t:"roster",list:[{pid:"host",name:MP.name,look:X.look}].concat(Object.keys(MP.rp).filter(k=>k!==from).map(k=>({pid:k,name:MP.rp[k].name,look:MP.rp[k].look})))});
    if(MP.started)c.send(startPayload());
    mpLog(d.name+" masuk");mpRender();mpInfo();
  }else if(d.t==="roster"){for(const r of d.list)if(r.pid!==MP.me)MP.rp[r.pid]=newRP(r);mpRender();mpInfo();}
  else if(d.t==="join"){if(d.pid!==MP.me){MP.rp[d.pid]=newRP(d);mpLog(d.name+" masuk");}mpRender();mpInfo();}
  else if(d.t==="left"){const r=MP.rp[d.pid];delete MP.rp[d.pid];if(r)mpLog(r.name+" keluar");mpRender();mpInfo();}
  else if(d.t==="full"){mpStatus("Dunia penuh (maks 4 pemain)");}
  else if(d.t==="start"){if(!MP.host)enterWorld(d);}
  else if(d.t==="p"){const pid=MP.host?from:d.pid,r=MP.rp[pid];if(r){r.tx=d.x;r.ty=d.y;r.tz=d.z;r.tyaw=d.yaw;r.pitch=d.pitch;r.held=d.held;r.look=d.look||r.look;r.w=d.w||r.w;r.dead=d.dead;if(r.y<-50){r.x=d.x;r.y=d.y;r.z=d.z;r.yaw=d.yaw;}}
    if(MP.host)bcast({t:"p",pid:from,x:d.x,y:d.y,z:d.z,yaw:d.yaw,pitch:d.pitch,held:d.held,look:d.look,w:d.w,dead:d.dead},from);}
  else if(d.t==="b"){MP.applying=true;setBlock(d.x,d.y,d.z,d.id);MP.applying=false;if(MP.host)bcast(d,from);}
  else if(d.t==="chat"){mpLog("💬 "+d.n+": "+d.m);if(MP.host)bcast(d,from);}
  else if(d.t==="msg"){mpLog(d.m);if(MP.host)bcast(d,from);}
  else if(d.t==="dmg"){if(d.to===MP.me)takeDmg(d);else if(MP.host&&MP.conns[d.to])MP.conns[d.to].send(d);}
}
function mpDmg(to,dmg,head){const d={t:"dmg",to,dmg,fx:P.x,fz:P.z,from:MP.name,head:head?1:0};if(MP.host){if(MP.conns[to])MP.conns[to].send(d);}else if(MP.conns.host)MP.conns.host.send(d);}
function takeDmg(d){
  if(S.dead||S.mode!=="survival")return;
  hitPlayer(d.dmg,d.fx,d.fz,"rifle",d.head?"head":null);
  if(S.dead){const m="💀 "+MP.name+" dibunuh "+d.from;mpLog(m);bcast({t:"msg",m});}
}
function mpRay(o,d,maxd){
  let best=null;
  for(const k in MP.rp){const r=MP.rp[k];if(r.dead||r.y<-50)continue;
    const t=(r.x-o[0])*d[0]+(r.y+.9-o[1])*d[1]+(r.z-o[2])*d[2];if(t<.3||t>maxd)continue;
    const px=o[0]+d[0]*t,py=o[1]+d[1]*t,pz=o[2]+d[2]*t;
    if(Math.hypot(px-r.x,pz-r.z)<.5&&py>r.y&&py<r.y+1.9&&(!best||t<best.t))best={pid:k,t,head:py>r.y+1.45,x:px,y:py,z:pz};}
  return best;
}
function mpTick(dt){
  if(!MP.on)return;MP.t+=dt;
  if(MP.t>=.1){MP.t=0;const w=X.w;bcast({t:"p",pid:MP.me,x:P.x,y:P.y,z:P.z,yaw:P.yaw,pitch:P.pitch,held:A.held(),look:X.look,w:[w.al,w.ar,w.ll,w.lr],dead:S.dead?1:0});}
  const a=Math.min(1,dt*12);
  for(const k in MP.rp){const r=MP.rp[k];if(r.tx===undefined)continue;const ox=r.x,oz=r.z;
    r.x+=(r.tx-r.x)*a;r.y+=(r.ty-r.y)*a;r.z+=(r.tz-r.z)*a;
    const dy=((r.tyaw-r.yaw+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;r.yaw+=dy*a;
    r.sp=Math.hypot(r.x-ox,r.z-oz)/Math.max(dt,.001);r.ph+=r.sp*dt*1.6;}
}
function drawRemote(r){
  if(r.tx===undefined||r.dead)return;
  const lg=Math.sin(r.ph)*.8*Math.min(1,r.sp/3),h=r.held,gun=GUN[h],hr=clamp(r.pitch,-1,1)*.6,ra=gun?1.5+hr*.5:-lg,la=gun&&gun.snd!=="rev"?1.3:lg;
  const parts=playerParts(r.look||X.look,{hd:{rot:hr,py:1.4},la,ra,lg,na:true}),arm={rot:ra,py:1.38},n0=parts.length;
  if(gun){const L=.18+gun.len*.036;parts.push(B(.37,.74,-.1-L/2,.08,.13,L,gun.col,arm));}
  else if(h){const cs=h<100?.22:.14;parts.push(B(.37,.62,-.3,cs,cs,cs,spriteOf(h).avg,arm));}
  for(let i=n0;i<parts.length;i++)parts[i].limb="ar";
  parts.push(B(0,2.6,0,.2,.2,.2,MPCOL[(r.col|0)%4]));
  const m={x:r.x,y:r.y,z:r.z,yaw:r.yaw},w=r.w||[0,0,0,0],lm={al:w[0],ar:w[1],ll:w[2],lr:w[3]};
  for(const p of parts){if(p.limb&&lm[p.limb])continue;A.emitBox(m,p,0,p.col);}
}
function mpRender(){
  const pn=panels.mpp;if(!pn)return;const b=pn.body;b.innerHTML="";
  const nm=el("input",{type:"text",value:MP.name,maxlength:12,class:"inp"},b);nm.addEventListener("input",()=>{MP.name=nm.value.trim()||"Pemain";});
  if(!MP.on){
    const h=el("button",{text:"🌍 Buat Dunia (jadi host)",style:"width:100%;margin:6px 0"},b);h.addEventListener("click",mpHost);
    el("div",{class:"qrow",text:"Atau gabung pakai ID dunia"},b);
    const ci=el("input",{type:"text",placeholder:"ID 5 huruf",maxlength:5,class:"inp",style:"text-transform:uppercase"},b);
    const j=el("button",{class:"alt",text:"➡ Gabung",style:"width:100%"},b);j.addEventListener("click",()=>mpJoin(ci.value));
    if(MP.status)el("p",{class:"note",text:MP.status},b);
  }else{
    el("div",{class:"bigid",text:MP.code},b);
    el("p",{class:"note",text:MP.host?"Bagikan ID ini ke temanmu. Maksimal 4 pemain.":"Terhubung ke dunia "+MP.code},b);
    const cp=el("button",{class:"alt",text:"📋 Salin ID",style:"width:100%;margin-bottom:6px"},b);cp.addEventListener("click",()=>{try{navigator.clipboard.writeText(MP.code);}catch(e){}A.toast("ID disalin");});
    el("div",{class:"qrow",text:"Pemain ("+pcount()+"/4)"},b);
    el("p",{class:"note",text:"● "+MP.name+" (kamu)"},b);for(const k in MP.rp)el("p",{class:"note",text:"● "+MP.rp[k].name},b);
    if(MP.host){const s=el("button",{text:MP.started?"▶ Lanjut main":"▶ Mulai Dunia",style:"width:100%;margin-top:8px"},b);s.addEventListener("click",mpStart);}
    else el("p",{class:"note",text:MP.started?"Dunia sudah jalan":"Menunggu host memulai…"},b);
  }
}
function mpInfo(){const e=$$("mpInfo");if(!e)return;e.style.display=MP.on?"block":"none";e.textContent="🌐 ID Dunia: "+MP.code+" · "+pcount()+"/4 pemain"+(MP.host?" (kamu host)":"");}
function renderChat(){
  const b=panels.cht.body;b.innerHTML="";
  const lg=el("div",{style:"max-height:34vh;overflow-y:auto;font-size:13px;margin-bottom:8px"},b);for(const m of MP.log)el("div",{text:m,style:"padding:2px 0"},lg);lg.scrollTop=1e5;
  const ip=el("input",{type:"text",placeholder:MP.on?"Ketik pesan…":"Belum terhubung multiplayer",maxlength:120,class:"inp"},b);
  const s=el("button",{text:"Kirim",style:"width:100%"},b);
  const go=()=>{const m=ip.value.trim();if(!m||!MP.on)return;bcast({t:"chat",n:MP.name,m});MP.log.push("💬 "+MP.name+": "+m);ip.value="";renderChat();};
  s.addEventListener("click",go);ip.addEventListener("keydown",e=>{if(e.key==="Enter")go();});
}
function init(){initUI();}
const crCount=id=>GR[id]?(X.cr[id]||64):0;
return{crCount,ai,preHurt,blood,kill,use,attack,weapon,driving,update,hudKey,gunInfo,infoExtra,save,load,newWorld,populate,init,tiles,icon,describe,onGive,drawChar,hotExtra,drawPlayer,emit,emitSky,gen,noSave:()=>MP.noSave,
  chaos:chaosOn,dbg:{startChaos,ZT,get WR(){return WR},get ZS(){return ZS},zAI,MP,onMsg,mpHost,mpJoin,mpStart,mpRay,hitPlayer,aggro,renderLook,applyPreset,PRESETS,openChest:openChest,W:()=>X.w,X,DV,SHOPS,get BASE(){return BASE;},LOOT,SHELF,GUN,GR,fire,throwG,explode,spawnVeh,mount,dismount,openChest,takeShelf,openShop,feed,fishUse,catchFish,ignite,ptc,grens,VEH,renderShop}};
})();
