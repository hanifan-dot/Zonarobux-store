"use strict";
/* Dunia Kotak v2 - tas, racik, tungku, mob, pistol, tempat tidur, karakter, siang/malam, suara */
const DAY={tod:0.04,day:1,br:1,fog:1,dayf:1,night:false,sky:[0.53,0.75,0.95]};
const EX=(function(){
const $$=id=>document.getElementById(id);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const rnd=(a,b)=>a+Math.random()*(b-a);
function el(tag,at,parent){const e=document.createElement(tag);if(at)for(const k in at){if(k==="text")e.textContent=at[k];else if(k==="class")e.className=at[k];else e.setAttribute(k,at[k]);}if(parent)parent.appendChild(e);return e;}
const S={mode:"survival",hp:20,food:20,inv:{},order:[],hotS:[0,0,0,0,0,0,0,0,0],hotC:[1,2,3,8,6,10,9,11,14],
  dead:false,flying:false,third:false,sound:true,paused:false,atkHeld:false,tab:"inv",filter:"Semua",furnOpen:null,furnT:0,furnSig:"",
  hurtT:0,regenT:0,starveT:0,foodT:0,mining:false,mineT:0,mineKey:"",mineSnd:0,atkCd:0,eatCd:0,pvy:0,pgr:true,stepAcc:0,
  fallTop:0,wasAir:false,wasNight:false,saveT:0,uiT:0,spawnT:0,zSpawnT:0,cropT:1,swing:0,walkPh:0,bed:null,sleeping:false,heldT:0};

/* ---------- Data barang ---------- */
const NAMES={1:"Rumput",2:"Tanah",3:"Batu",4:"Pasir",6:"Kayu",7:"Daun",8:"Papan",9:"Bata",10:"Kaca",11:"Meja kerja",12:"Bijih batu bara",13:"Bijih besi",14:"Tungku",15:"Wol",
 101:"Daging mentah",102:"Kulit",103:"Pedang kayu",104:"Pedang batu",105:"Armor kulit",106:"Armor batu",107:"Daging matang",108:"Tongkat",109:"Batu bara",110:"Besi mentah",111:"Besi",
 112:"Pedang besi",113:"Armor besi",114:"Beliung kayu",115:"Beliung batu",116:"Beliung besi",117:"Kapak kayu",118:"Kapak batu",119:"Kapak besi",
 121:"Tangga kayu",122:"Tangga batu",123:"Balok setengah kayu",124:"Balok setengah batu",125:"Tempat tidur",126:"Cangkul kayu",127:"Cangkul batu",128:"Cangkul besi",
 129:"Pistol",130:"Peluru",131:"Bibit",132:"Gandum",133:"Roti",134:"Paha kodok mentah",135:"Paha kodok matang"};
const TOOL={114:{k:"pick",t:1,d:2},115:{k:"pick",t:2,d:3},116:{k:"pick",t:3,d:4},117:{k:"axe",t:1,d:3},118:{k:"axe",t:2,d:4},119:{k:"axe",t:3,d:5},
 126:{k:"hoe",t:1,d:1},127:{k:"hoe",t:2,d:1},128:{k:"hoe",t:3,d:1},103:{k:"sword",t:1,d:4},104:{k:"sword",t:2,d:5},112:{k:"sword",t:3,d:6}};
const MULT=[1,2,4,6],TIERC=["","#c8a060","#9a9da2","#e6e8ec"];
const ARMOR={105:6,106:10,113:16};
const FOOD={101:3,107:8,133:6,134:2,135:5};
const SMELT={110:111,4:10,101:107,134:135};
const FUEL={109:80,6:15,8:15,108:5};
const HARD={1:0.5,2:0.45,3:1.2,4:0.4,6:1.0,7:0.2,8:0.8,9:1.4,10:0.35,11:0.9,12:1.4,13:1.8,14:1.4,15:0.5,17:0.5};
const PLAIN=new Set([1,2,3,4,6,7,8,9,10,11,12,13,14,15]);
const RECIPES=[
 {out:8,n:4,cost:{6:1},table:0,cat:"Blok"},{out:108,n:4,cost:{8:2},table:0,cat:"Lainnya"},{out:11,n:1,cost:{8:4},table:0,cat:"Blok"},
 {out:14,n:1,cost:{3:8},table:1,cat:"Blok"},
 {out:114,n:1,cost:{8:3,108:2},table:1,cat:"Alat"},{out:115,n:1,cost:{3:3,108:2},table:1,cat:"Alat"},{out:116,n:1,cost:{111:3,108:2},table:1,cat:"Alat"},
 {out:117,n:1,cost:{8:3,108:2},table:1,cat:"Alat"},{out:118,n:1,cost:{3:3,108:2},table:1,cat:"Alat"},{out:119,n:1,cost:{111:3,108:2},table:1,cat:"Alat"},
 {out:126,n:1,cost:{8:2,108:2},table:1,cat:"Alat"},{out:127,n:1,cost:{3:2,108:2},table:1,cat:"Alat"},{out:128,n:1,cost:{111:2,108:2},table:1,cat:"Alat"},
 {out:103,n:1,cost:{8:2,108:1},table:1,cat:"Senjata"},{out:104,n:1,cost:{3:2,108:1},table:1,cat:"Senjata"},{out:112,n:1,cost:{111:2,108:1},table:1,cat:"Senjata"},
 {out:129,n:1,cost:{111:2},table:1,cat:"Senjata"},{out:130,n:5,cost:{111:1},table:1,cat:"Senjata"},
 {out:105,n:1,cost:{102:5},table:1,cat:"Armor"},{out:106,n:1,cost:{3:12},table:1,cat:"Armor"},{out:113,n:1,cost:{111:8},table:1,cat:"Armor"},
 {out:121,n:4,cost:{8:6},table:1,cat:"Blok"},{out:122,n:4,cost:{3:6},table:1,cat:"Blok"},{out:123,n:6,cost:{8:3},table:1,cat:"Blok"},{out:124,n:6,cost:{3:3},table:1,cat:"Blok"},
 {out:9,n:4,cost:{3:4},table:1,cat:"Blok"},{out:125,n:1,cost:{15:3,8:3},table:1,cat:"Blok"},{out:133,n:1,cost:{132:3},table:1,cat:"Lainnya"}];
const CATS=["Semua","Alat","Senjata","Armor","Blok","Lainnya"];
const CAT_IDS={Blok:[1,2,3,4,6,7,8,9,10,11,12,13,14,15,121,122,123,124,125],Alat:[114,115,116,117,118,119,126,127,128],Senjata:[103,104,112,129,130],
 Armor:[105,106,113],Lainnya:[101,107,108,109,110,111,131,132,133,134,135]};
CAT_IDS.Semua=[].concat(CAT_IDS.Blok,CAT_IDS.Alat,CAT_IDS.Senjata,CAT_IDS.Armor,CAT_IDS.Lainnya);

/* ---------- Blok sebagian (tangga, balok setengah, kasur, tanaman) ---------- */
const PD={};
function stairB(f){return[[0,0,0,1,0.5,1],[[0.5,0.5,0,1,1,1],[0,0.5,0,0.5,1,1],[0,0.5,0.5,1,1,1],[0,0.5,0,1,1,0.5]][f]];}
for(let f=0;f<4;f++){PD[30+f]={b:stairB(f),c:stairB(f),t:[9,9,9]};PD[34+f]={b:stairB(f),c:stairB(f),t:[3,3,3]};}
PD[38]={b:[[0,0,0,1,0.5,1]],c:[[0,0,0,1,0.5,1]],t:[9,9,9]};
PD[39]={b:[[0,0,0,1,0.5,1]],c:[[0,0,0,1,0.5,1]],t:[3,3,3]};
PD[40]={b:[[0,0,0,1,0.56,1]],c:[[0,0,0,1,0.56,1]],t:[22,23,9]};
for(let s=0;s<4;s++)PD[41+s]={b:[[0.06,0,0.06,0.94,[0.28,0.5,0.78,1][s],0.94]],c:null,t:[24+s,24+s,24+s]};
const opaqueFull=id=>id>0&&id<30&&id!==5&&id!==10;
function partial(o,id,x,y,z){
  const d=PD[id];if(!d)return;
  for(const b of d.b)for(let fi=0;fi<6;fi++){
    const f=FACES[fi],n=f.n;
    const edge=n[0]>0?b[3]>=1:n[0]<0?b[0]<=0:n[1]>0?b[4]>=1:n[1]<0?b[1]<=0:n[2]>0?b[5]>=1:b[2]<=0;
    if(edge&&opaqueFull(get(x+n[0],y+n[1],z+n[2])))continue;
    const t=d.t[f.t],tx=t%4,ty=t>>2,vt=[];
    for(let i=0;i<4;i++){const c=f.c[i],lx=b[0]+c[0]*(b[3]-b[0]),ly=b[1]+c[1]*(b[4]-b[1]),lz=b[2]+c[2]*(b[5]-b[2]);
      let u,v;if(n[0])u=lz,v=1-ly;else if(n[2])u=lx,v=1-ly;else u=lx,v=lz;
      vt.push([x+lx,y+ly,z+lz,(tx+0.01+u*0.98)/4,(ty+0.01+v*0.98)/16]);}
    for(const k of[0,1,2,0,2,3]){const q=vt[k];o.push(q[0],q[1],q[2],q[3],q[4],f.s);}
  }
}
function pHit(i,j,k,px,py,pz,r,h){
  const d=PD[get(i,j,k)];if(!d||!d.c)return false;
  for(const b of d.c)if(px+r>i+b[0]&&px-r<i+b[3]&&py+h>j+b[1]&&py<j+b[4]&&pz+r>k+b[2]&&pz-r<k+b[5])return true;
  return false;
}
function slide(o,n,test){let lo=o,hi=n;if(test(lo))return o;for(let i=0;i<9;i++){const m=(lo+hi)*0.5;if(test(m))hi=m;else lo=m;}return lo;}

/* ---------- Tekstur tambahan & bijih ---------- */
function tiles(g){
  let rs=777;const r=()=>{rs=(Math.imul(rs,1103515245)+12345)&0x7fffffff;return rs/0x7fffffff;};
  const T=(t,fn)=>{const im=g.createImageData(16,16);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const c=fn(x,y,r()),i=(y*16+x)*4;
    im.data[i]=c[0];im.data[i+1]=c[1];im.data[i+2]=c[2];im.data[i+3]=c.length>3?c[3]:255;}g.putImageData(im,(t%4)*16,(t>>2)*16);};
  const v=(c,n,a)=>[c[0]+n*a,c[1]+n*a,c[2]+n*a];
  const stone=(x,y,n)=>v([128,128,130],(n-.5)+(((x>>2)+(y>>1))%3===0?-.25:0),30);
  const spots=[[3,3],[4,3],[3,4],[10,6],[11,6],[11,7],[5,11],[6,11],[6,12],[12,12],[13,2]];
  const isS=(x,y)=>spots.some(s=>s[0]===x&&s[1]===y);
  T(14,(x,y,n)=>isS(x,y)?v([28,28,32],n-.5,20):stone(x,y,n));
  T(15,(x,y,n)=>isS(x,y)?v([206,152,112],n-.5,26):stone(x,y,n));
  T(16,(x,y,n)=>{if(x>=4&&x<=11&&y>=5&&y<=11)return y>=9?v([235,125,30],n-.5,50):v([30,28,28],n-.5,10);const e=x===0||y===0||x===15||y===15;return v([112,112,115],(n-.5)+(e?-.3:0),26);});
  T(17,(x,y,n)=>v([105,105,108],(n-.5)+((x===0||y===0||x===15||y===15)?-.3:0),24));
  T(18,(x,y,n)=>v([232,232,228],n-.5,16));
  T(19,(x,y,n)=>v([88,58,36],(n-.5)+(y%4===0?-0.3:0),28));
  T(22,(x,y,n)=>y<5?v([240,240,240],n-.5,14):v([196,50,50],n-.5,26));
  T(23,(x,y,n)=>y<6?v([196,50,50],n-.5,26):v([176,142,88],n-.5,26));
  const hs=[4,8,12,15];
  for(let s=0;s<4;s++)T(24+s,(x,y,n)=>{if(x%3===1&&y>=16-hs[s])return s===3?v([208,172,64],n-.5,30):v([70+s*8,150-s*5,50],n-.5,30);return[0,0,0,0];});
  Object.assign(TILES,{12:[14,14,14],13:[15,15,15],14:[17,16,17],15:[18,18,18],17:[19,2,2]});if(typeof EX2!=="undefined")EX2.tiles(g);
}
function ores(){
  for(let z=1;z<D-1;z++)for(let x=1;x<W-1;x++){
    const h=hm[z*W+x];
    for(let y=1;y<h-3;y++){
      const i=idx(x,y,z);if(blocks[i]!==STONE)continue;
      const r=hash(x*31+y*7,z*17+y*13,seed+50);let ore=0;
      if(r<0.006)ore=12;else if((y<=26&&r>0.9965)||r>0.9992)ore=13;
      if(ore){blocks[i]=ore;const j=idx(x+1,y,z);if(blocks[j]===STONE&&hash(x,z,seed+y)<0.5)blocks[j]=ore;}
    }
  }
}

/* ---------- Suara (WebAudio sintetis) ---------- */
let ac=null,master=null,noiseBuf=null,irBuf=null;
function audioInit(){
  try{
    if(ac){if(ac.state!=="running")ac.resume();return;}
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
    ac=new AC();master=ac.createGain();master.gain.value=S.sound?0.6:0;master.connect(ac.destination);
    const n=ac.sampleRate;noiseBuf=ac.createBuffer(1,n,n);const d=noiseBuf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
    if(ac.state!=="running")ac.resume();
  }catch(e){ac=null;}
}
function route(node,pan){if(pan!==undefined&&ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=clamp(pan,-1,1);node.connect(p);p.connect(master);}else node.connect(master);}
function env(g,t,vol,dur){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(0.0002,vol),t+0.012);g.gain.exponentialRampToValueAtTime(0.0002,t+dur);}
function tone(type,f0,f1,dur,vol,pan,delay,lp){
  if(!ac||!S.sound||vol<0.01)return;const t=ac.currentTime+(delay||0);
  const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  const g=ac.createGain();env(g,t,vol,dur);let n=o;
  if(lp){const f=ac.createBiquadFilter();f.type="lowpass";f.frequency.value=lp;o.connect(f);n=f;}
  n.connect(g);route(g,pan);o.start(t);o.stop(t+dur+0.05);
}
function noise(dur,ft,f0,f1,vol,pan,delay){
  if(!ac||!S.sound||vol<0.01)return;const t=ac.currentTime+(delay||0);
  const s=ac.createBufferSource();s.buffer=noiseBuf;
  const f=ac.createBiquadFilter();f.type=ft;f.Q.value=ft==="bandpass"?2:0.7;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(Math.max(40,f1),t+dur);
  const g=ac.createGain();env(g,t,vol,dur);
  s.connect(f);f.connect(g);route(g,pan);s.start(t,Math.random()*0.5,dur+0.05);
}
function ir(){
  if(irBuf)return irBuf;const n=Math.floor(ac.sampleRate*0.9);irBuf=ac.createBuffer(2,n,ac.sampleRate);
  for(let c=0;c<2;c++){const d=irBuf.getChannelData(c);let lp=0;for(let i=0;i<n;i++){const t=i/n;lp+=(Math.random()*2-1-lp)*0.35;d[i]=lp*Math.pow(1-t,3.2)*(i<200?i/200:1);}}
  return irBuf;
}
function gunshot(){
  if(!ac||!S.sound)return;
  const t=ac.currentTime+0.001,bus=ac.createGain();bus.gain.value=0.9;
  const sh=ac.createWaveShaper(),cv=new Float32Array(256);for(let i=0;i<256;i++){const x=i/128-1;cv[i]=Math.tanh(x*3.5);}sh.curve=cv;
  const cp=ac.createDynamicsCompressor();cp.threshold.value=-20;cp.knee.value=6;cp.ratio.value=10;cp.attack.value=0.001;cp.release.value=0.15;
  bus.connect(sh);sh.connect(cp);cp.connect(master);
  const cn=ac.createConvolver();cn.buffer=ir();const send=ac.createGain();send.gain.value=0.5;cp.connect(send);send.connect(cn);cn.connect(master);
  const nz=(dt,dur,type,f0,f1,vol)=>{const s=ac.createBufferSource();s.buffer=noiseBuf;const f=ac.createBiquadFilter();f.type=type;
    f.frequency.setValueAtTime(f0,t+dt);f.frequency.exponentialRampToValueAtTime(f1,t+dt+dur);
    const g=ac.createGain();g.gain.setValueAtTime(vol,t+dt);g.gain.exponentialRampToValueAtTime(0.001,t+dt+dur);
    s.connect(f);f.connect(g);g.connect(bus);s.start(t+dt,Math.random()*0.5,dur+0.02);};
  const os=(dt,type,f0,f1,dur,vol)=>{const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t+dt);o.frequency.exponentialRampToValueAtTime(f1,t+dt+dur);
    const g=ac.createGain();g.gain.setValueAtTime(vol,t+dt);g.gain.exponentialRampToValueAtTime(0.001,t+dt+dur);o.connect(g);g.connect(bus);o.start(t+dt);o.stop(t+dt+dur+0.02);};
  nz(0,0.012,"highpass",4000,9000,1.0);   // retakan tajam
  nz(0,0.06,"bandpass",3200,1400,0.9);
  nz(0,0.2,"lowpass",4000,250,1.0);       // ledakan gas
  os(0,"sine",210,38,0.25,1.0);           // dentuman
  os(0,"triangle",120,40,0.2,0.6);
  nz(0.01,0.5,"lowpass",1500,120,0.35);   // ekor
  noise(0.015,"bandpass",3500,2500,0.25,0,0.07);               // klik mekanik
  tone("sine",4200,3100,0.09,0.10,0,0.32);tone("sine",5200,3900,0.06,0.07,0,0.42); // selongsong jatuh
}
function mat(id){return id===1||id===2||id===17||id===15?"dirt":id===4?"sand":id===3||id===9||id===12||id===13||id===14||(id>=34&&id<=37)||id===39?"stone":id===7?"leaf":id===10?"glass":"wood";}
const MF={dirt:500,sand:1500,stone:1100,leaf:2000,glass:3500,wood:700};
const SFX={
  break(id){const m=mat(id),f=MF[m];noise(0.18,"lowpass",f*1.6,f*0.4,0.85);if(m==="glass")tone("triangle",2600,1500,0.14,0.2);if(m==="stone")tone("square",160,90,0.08,0.12);},
  hit(id){noise(0.07,"lowpass",MF[mat(id)],MF[mat(id)]*0.5,0.4);},
  place(){tone("triangle",220,130,0.09,0.5);noise(0.06,"lowpass",700,300,0.35);},
  step(id){const m=mat(id);noise(0.07,"lowpass",m==="stone"?1000:m==="sand"?1400:450,200,0.22);},
  land(v){noise(0.14,"lowpass",500,120,Math.min(0.8,0.25+v*0.03));},
  hurt(){tone("square",320,110,0.25,0.35,0,0,1200);noise(0.12,"lowpass",900,200,0.3);},
  die(){tone("sawtooth",380,45,0.9,0.45,0,0,900);},
  eat(){for(let i=0;i<3;i++)noise(0.08,"bandpass",1900,1300,0.5,0,i*0.13);},
  pick(){tone("sine",520,980,0.09,0.22);},
  click(){tone("sine",900,700,0.04,0.15);},
  craft(){tone("triangle",523,523,0.1,0.3);tone("triangle",784,784,0.16,0.3,0,0.1);},
  swing(){noise(0.1,"highpass",1500,3500,0.2);},
  hitMob(){noise(0.1,"lowpass",1400,300,0.5);tone("square",180,90,0.08,0.2);},
  till(){noise(0.12,"lowpass",900,300,0.6);tone("triangle",150,100,0.1,0.3);},
  dry(){noise(0.02,"bandpass",2500,1800,0.4);tone("square",900,600,0.03,0.12,0,0.02);},
  shot:gunshot,
  hiss(p,v){noise(0.45,"highpass",3000,6000,0.45*v,p);},
  hmm(p,v){tone("sine",190,150,0.28,0.4*v,p,0,700);tone("sine",170,140,0.22,0.3*v,p,0.18,700);},
  clang(p,v){tone("square",420,300,0.2,0.35*v,p,0,1800);noise(0.15,"bandpass",2500,1500,0.3*v,p);},
  moo(p,v){tone("sawtooth",150,92,0.75,0.5*v,p,0,700);},
  cluck(p,v){tone("square",950,720,0.05,0.3*v,p);tone("square",1050,800,0.05,0.3*v,p,0.09);tone("square",900,700,0.06,0.25*v,p,0.18);},
  squeak(p,v){tone("sine",1800,2600,0.07,0.3*v,p);},
  croak(p,v){tone("square",190,130,0.08,0.4*v,p,0,500);tone("square",200,140,0.09,0.4*v,p,0.12,500);},
  bleat(p,v){
    if(!ac||!S.sound||v<0.02)return;const t=ac.currentTime,o=ac.createOscillator();o.type="sawtooth";
    o.frequency.setValueAtTime(400,t);o.frequency.linearRampToValueAtTime(330,t+0.6);
    const lfo=ac.createOscillator();lfo.frequency.value=26;const lg=ac.createGain();lg.gain.value=28;lfo.connect(lg);lg.connect(o.frequency);
    const f=ac.createBiquadFilter();f.type="bandpass";f.frequency.value=900;f.Q.value=2;const g=ac.createGain();env(g,t,0.5*v,0.65);
    o.connect(f);f.connect(g);route(g,p);o.start(t);lfo.start(t);o.stop(t+0.7);lfo.stop(t+0.7);
  },
  groan(p,v){tone("sawtooth",118,66,1.0,0.55*v,p,0,420);tone("sawtooth",126,72,1.0,0.35*v,p,0,420);},
  zhurt(p,v){tone("sawtooth",160,70,0.3,0.5*v,p,0,500);}
};
function spat(x,z){const dx=x-P.x,dz=z-P.z,d=Math.hypot(dx,dz);let v=clamp(1-d/30,0,1);v*=v;const rx=Math.cos(P.yaw),rz=-Math.sin(P.yaw);return[d>0.1?(dx*rx+dz*rz)/d:0,v];}

/* ---------- Model mob ---------- */
const B=(cx,cy,cz,sx,sy,sz,col,o)=>Object.assign({c:[cx,cy,cz],s:[sx,sy,sz],col,rot:0,leg:0,py:cy},o||{});
const BR=[0.38,0.24,0.14],BR2=[0.3,0.19,0.11],WH=[0.9,0.9,0.86],HORN=[0.9,0.9,0.8],PINK=[0.85,0.7,0.65];
const CH=[0.95,0.95,0.92],RED=[0.85,0.15,0.15],YEL=[0.95,0.75,0.2],RB=[0.62,0.5,0.38],RB2=[0.55,0.42,0.3];
const SKIN=[0.4,0.62,0.32],SHIRT=[0.15,0.5,0.55],PANTS=[0.2,0.22,0.55];
const WOOL=[0.93,0.93,0.9],SFACE=[0.5,0.45,0.4],SLEG=[0.72,0.62,0.52],FG=[0.28,0.58,0.22],FG2=[0.22,0.48,0.18],FBELLY=[0.72,0.8,0.5];
const TYPES={
 cow:{hp:10,r:0.45,h:1.3,sp:1.1,snd:"moo",hs:"moo",parts:[
  B(0,0.85,0.05,0.7,0.6,1.1,BR),B(0,0.82,0.15,0.72,0.34,0.5,WH),B(0,1.05,-0.7,0.5,0.45,0.45,[0.34,0.21,0.13]),
  B(0,0.93,-0.95,0.34,0.22,0.1,PINK),B(-0.27,1.3,-0.62,0.08,0.14,0.08,HORN),B(0.27,1.3,-0.62,0.08,0.14,0.08,HORN),
  B(-0.22,0.27,0.38,0.2,0.54,0.2,BR2,{leg:1,py:0.54}),B(0.22,0.27,0.38,0.2,0.54,0.2,BR2,{leg:-1,py:0.54}),
  B(-0.22,0.27,-0.28,0.2,0.54,0.2,BR2,{leg:-1,py:0.54}),B(0.22,0.27,-0.28,0.2,0.54,0.2,BR2,{leg:1,py:0.54})]},
 sheep:{hp:8,r:0.45,h:1.15,sp:1.0,snd:"bleat",hs:"bleat",parts:[
  B(0,0.8,0.05,0.8,0.68,1.05,WOOL),B(0,0.95,-0.7,0.38,0.38,0.4,SFACE),B(0,1.17,-0.64,0.44,0.14,0.44,WOOL),
  B(-0.2,0.27,0.34,0.16,0.54,0.16,SLEG,{leg:1,py:0.54}),B(0.2,0.27,0.34,0.16,0.54,0.16,SLEG,{leg:-1,py:0.54}),
  B(-0.2,0.27,-0.26,0.16,0.54,0.16,SLEG,{leg:-1,py:0.54}),B(0.2,0.27,-0.26,0.16,0.54,0.16,SLEG,{leg:1,py:0.54})]},
 chicken:{hp:4,r:0.25,h:0.7,sp:1.0,snd:"cluck",hs:"cluck",parts:[
  B(0,0.42,0.02,0.32,0.3,0.46,CH),B(0,0.68,-0.2,0.2,0.24,0.18,CH),B(0,0.64,-0.32,0.1,0.06,0.1,[0.95,0.62,0.15]),
  B(0,0.55,-0.29,0.06,0.08,0.05,RED),B(0,0.82,-0.2,0.05,0.06,0.1,RED),B(0,0.55,0.28,0.1,0.18,0.08,[0.85,0.85,0.8]),
  B(-0.18,0.45,0.02,0.05,0.2,0.34,[0.88,0.88,0.85]),B(0.18,0.45,0.02,0.05,0.2,0.34,[0.88,0.88,0.85]),
  B(-0.08,0.15,0,0.05,0.3,0.05,YEL,{leg:1,py:0.3}),B(0.08,0.15,0,0.05,0.3,0.05,YEL,{leg:-1,py:0.3})]},
 rabbit:{hp:3,r:0.25,h:0.5,sp:1.6,hop:5.8,snd:"squeak",hs:"squeak",parts:[
  B(0,0.22,0.02,0.26,0.24,0.4,RB),B(0,0.36,-0.24,0.2,0.2,0.2,RB),B(-0.05,0.55,-0.22,0.05,0.24,0.05,RB2),B(0.05,0.55,-0.22,0.05,0.24,0.05,RB2),
  B(0,0.34,-0.35,0.06,0.05,0.04,PINK),B(0,0.26,0.26,0.1,0.1,0.1,[0.95,0.95,0.95]),
  B(-0.1,0.1,0.14,0.08,0.2,0.2,RB2,{leg:1,py:0.2}),B(0.1,0.1,0.14,0.08,0.2,0.2,RB2,{leg:-1,py:0.2}),
  B(-0.08,0.1,-0.12,0.06,0.2,0.06,RB2,{leg:-1,py:0.2}),B(0.08,0.1,-0.12,0.06,0.2,0.06,RB2,{leg:1,py:0.2})]},
 frog:{hp:6,r:0.2,h:0.4,sp:1.3,hop:5.2,snd:"croak",hs:"croak",parts:[
  B(0,0.16,0.02,0.34,0.22,0.4,FG),B(0,0.1,0.02,0.3,0.1,0.34,FBELLY),B(0,0.2,-0.22,0.3,0.16,0.18,FG),
  B(-0.1,0.32,-0.26,0.1,0.1,0.1,[0.95,0.85,0.2]),B(0.1,0.32,-0.26,0.1,0.1,0.1,[0.95,0.85,0.2]),
  B(-0.17,0.08,0.18,0.1,0.14,0.2,FG2,{leg:1,py:0.16}),B(0.17,0.08,0.18,0.1,0.14,0.2,FG2,{leg:-1,py:0.16}),
  B(-0.11,0.08,-0.14,0.06,0.16,0.06,FG2,{leg:-1,py:0.16}),B(0.11,0.08,-0.14,0.06,0.16,0.06,FG2,{leg:1,py:0.16})]},
 spider:{hp:16,r:0.5,h:0.9,sp:2.7,snd:"hiss",hs:"hiss",parts:[
  B(0,0.5,0.35,0.7,0.5,0.8,[0.2,0.17,0.17]),B(0,0.52,-0.3,0.55,0.45,0.5,[0.27,0.23,0.22]),
  B(-0.14,0.6,-0.58,0.12,0.1,0.04,[0.9,0.1,0.1]),B(0.14,0.6,-0.58,0.12,0.1,0.04,[0.9,0.1,0.1]),
  ...[-0.3,-0.05,0.2,0.45].flatMap((z,i)=>[-1,1].flatMap(sd=>[B(sd*0.55,0.45,z+0.1,0.5,0.09,0.09,[0.16,0.14,0.14]),
   B(sd*0.85,0.22,z+0.1,0.1,0.45,0.1,[0.16,0.14,0.14],{leg:(i%2?1:-1)*sd*0.5,py:0.45})]))]},
 villager:{hp:20,r:0.3,h:1.8,sp:1.2,snd:"hmm",hs:"hmm",parts:[
  B(0,1.62,0,0.5,0.5,0.5,[0.78,0.6,0.48]),B(0,1.55,-0.3,0.11,0.2,0.12,[0.7,0.52,0.4]),B(0,1.72,-0.26,0.52,0.07,0.04,[0.3,0.2,0.12]),
  B(0,1.0,0,0.52,0.9,0.3,[0.46,0.32,0.2]),B(0,1.08,-0.2,0.64,0.24,0.24,[0.4,0.28,0.18]),
  B(-0.14,0.3,0,0.24,0.6,0.26,[0.4,0.28,0.18],{leg:1,py:0.6}),B(0.14,0.3,0,0.24,0.6,0.26,[0.4,0.28,0.18],{leg:-1,py:0.6})]},
 golem:{hp:60,r:0.7,h:2.7,sp:1.5,snd:"clang",hs:"clang",parts:[
  B(0,1.75,0,1.2,0.95,0.7,[0.72,0.72,0.7]),B(0,1.2,0,0.7,0.5,0.45,[0.66,0.66,0.64]),
  B(0,2.45,-0.05,0.5,0.45,0.5,[0.7,0.7,0.68]),B(0,2.38,-0.33,0.12,0.26,0.12,[0.55,0.42,0.35]),
  B(-0.16,2.52,-0.31,0.1,0.06,0.03,[0.75,0.12,0.12]),B(0.16,2.52,-0.31,0.1,0.06,0.03,[0.75,0.12,0.12]),
  B(-0.8,1.55,0,0.28,1.5,0.32,[0.68,0.68,0.66],{leg:0.15,py:2.3}),B(0.8,1.55,0,0.28,1.5,0.32,[0.68,0.68,0.66],{leg:-0.15,py:2.3}),
  B(0.3,1.9,-0.36,0.35,0.3,0.03,[0.3,0.5,0.25]),
  B(-0.25,0.5,0,0.4,1.0,0.4,[0.62,0.62,0.6],{leg:1,py:1.0}),B(0.25,0.5,0,0.4,1.0,0.4,[0.62,0.62,0.6],{leg:-1,py:1.0})]},
 zombie:{hp:20,r:0.3,h:1.8,sp:2.3,snd:"groan",hs:"zhurt",parts:[
  B(0,1.62,0,0.5,0.5,0.5,SKIN),B(-0.12,1.65,-0.26,0.1,0.06,0.02,[0.1,0.1,0.1]),B(0.12,1.65,-0.26,0.1,0.06,0.02,[0.1,0.1,0.1]),
  B(0,1.05,0,0.5,0.7,0.26,SHIRT),
  B(-0.36,1.0,0,0.2,0.7,0.2,SKIN,{rot:Math.PI/2,leg:0.12,py:1.35}),B(0.36,1.0,0,0.2,0.7,0.2,SKIN,{rot:Math.PI/2,leg:-0.12,py:1.35}),
  B(-0.13,0.35,0,0.22,0.7,0.22,PANTS,{leg:1,py:0.7}),B(0.13,0.35,0,0.22,0.7,0.22,PANTS,{leg:-1,py:0.7})]}
};
let mobs=[],mprog=null,mbuf=null,camPos=[0,0,0];const mU={};
const mArr=new Float32Array(700000);let mN=0;const tmp=new Float32Array(24);
const FACEI=[[1,3,7,5],[0,4,6,2],[2,6,7,3],[0,1,5,4],[4,5,7,6],[0,2,3,1]],FSH=[0.8,0.8,1,0.5,0.68,0.68],TRI=[0,1,2,0,2,3];
function emitBox(m,p,sw,col){
  const k=m.sc||1,cx=p.c[0]*k,cy=p.c[1]*k,cz=p.c[2]*k,sx=p.s[0]*k,sy=p.s[1]*k,sz=p.s[2]*k,py=p.py*k;
  const ang=p.rot+p.leg*sw,ca=Math.cos(ang),sa=Math.sin(ang),c0=Math.cos(m.yaw),s0=Math.sin(m.yaw);
  for(let i=0;i<8;i++){
    const x=cx+((i&1)?sx:-sx)/2;let y=cy+((i&2)?sy:-sy)/2,z=cz+((i&4)?sz:-sz)/2;
    if(ang!==0){const dy=y-py,dz=z-cz;y=py+dy*ca-dz*sa;z=cz+dy*sa+dz*ca;}
    tmp[i*3]=m.x+x*c0+z*s0;tmp[i*3+1]=m.y+y;tmp[i*3+2]=m.z-x*s0+z*c0;
  }
  if(mN+216>mArr.length)return;
  for(let f=0;f<6;f++){const q=FACEI[f],sh=FSH[f],r=col[0]*sh,g=col[1]*sh,b=col[2]*sh;
    for(let k2=0;k2<6;k2++){const v=q[TRI[k2]]*3;mArr[mN++]=tmp[v];mArr[mN++]=tmp[v+1];mArr[mN++]=tmp[v+2];mArr[mN++]=r;mArr[mN++]=g;mArr[mN++]=b;}}
}
function initMobGL(){
  const vs="attribute vec3 aPos;attribute vec3 aCol;uniform mat4 uM;uniform vec3 uEye;uniform vec2 uFog;varying vec3 vC;varying float vF;void main(){gl_Position=uM*vec4(aPos,1.0);vC=aCol;vF=clamp((distance(aPos,uEye)-uFog.x)/(uFog.y-uFog.x),0.0,1.0);}";
  const fs="precision mediump float;uniform vec3 uSky;uniform float uBr;varying vec3 vC;varying float vF;void main(){gl_FragColor=vec4(mix(vC*uBr,uSky,vF),1.0);}";
  const mk=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o;};
  mprog=gl.createProgram();gl.attachShader(mprog,mk(gl.VERTEX_SHADER,vs));gl.attachShader(mprog,mk(gl.FRAGMENT_SHADER,fs));
  gl.bindAttribLocation(mprog,0,"aPos");gl.bindAttribLocation(mprog,1,"aCol");gl.linkProgram(mprog);
  if(!gl.getProgramParameter(mprog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(mprog));
  for(const n of["uM","uEye","uFog","uSky","uBr"])mU[n]=gl.getUniformLocation(mprog,n);
  mbuf=gl.createBuffer();
}
/* karakter pemain (kamera orang ketiga) */
function emitPlayer(){
  const spd=Math.hypot(P.vx,P.vz),sw=Math.sin(S.walkPh)*0.8*Math.min(1,spd/3);
  const pm={x:P.x,y:P.y,z:P.z,yaw:P.yaw},h=held(),T=TOOL[h],gun=h===129,a=armorPts();
  const ac=a>=14?[0.78,0.8,0.84]:a>=10?[0.55,0.56,0.6]:a>0?[0.62,0.42,0.24]:null;
  const skin=[0.88,0.68,0.52],hair=[0.24,0.14,0.07],shirt=ac||[0.2,0.5,0.85],pants=ac?[ac[0]*.8,ac[1]*.8,ac[2]*.8]:[0.25,0.25,0.55];
  const hr=clamp(P.pitch,-1,1)*0.7,atk=S.swing>0?Math.sin((1-S.swing/0.25)*Math.PI)*1.9:0,ra=gun?1.45:-sw+atk,la=gun?1.3:sw;
  const hd={rot:hr,py:1.4},arm={rot:ra,py:1.35};
  const parts=[B(0,1.62,0,0.5,0.5,0.5,skin,hd),B(0,1.84,-0.02,0.52,0.14,0.54,ac||hair,hd),B(-0.12,1.66,-0.26,0.09,0.08,0.02,[0.15,0.25,0.6],hd),B(0.12,1.66,-0.26,0.09,0.08,0.02,[0.15,0.25,0.6],hd),
   B(0,1.05,0,0.5,0.7,0.26,shirt),B(-0.36,1.0,0,0.2,0.7,0.2,ac||skin,{rot:la,py:1.35}),B(0.36,1.0,0,0.2,0.7,0.2,ac||skin,arm),
   B(-0.13,0.35,0,0.22,0.7,0.22,pants,{rot:sw,py:0.7}),B(0.13,0.35,0,0.22,0.7,0.22,pants,{rot:-sw,py:0.7})];
  if(gun)parts.push(B(0.36,0.66,-0.28,0.07,0.12,0.36,[0.12,0.12,0.14],arm));
  else if(T&&T.k==="sword")parts.push(B(0.36,0.6,-0.42,0.06,0.08,0.72,[0.8,0.82,0.86],arm));
  else if(T){const c=T.t===1?[0.7,0.55,0.3]:T.t===2?[0.6,0.6,0.62]:[0.85,0.87,0.9];parts.push(B(0.36,0.62,-0.3,0.05,0.05,0.5,[0.45,0.3,0.15],arm),B(0.36,0.62,-0.58,0.06,0.2,0.1,c,arm));}
  const col=p=>S.hurtT>0?[p.col[0]*0.5+0.5,p.col[1]*0.5,p.col[2]*0.5]:p.col;
  for(const p of parts)emitBox(pm,p,0,col(p));
}
function flush(M,sky,fogOn,br){
  if(!mN)return;
  gl.useProgram(mprog);gl.uniformMatrix4fv(mU.uM,false,M);gl.uniform3f(mU.uEye,camPos[0],camPos[1],camPos[2]);
  gl.uniform2f(mU.uFog,fogOn?46*DAY.fog:1e6,fogOn?92*DAY.fog:2e6);gl.uniform3f(mU.uSky,sky[0],sky[1],sky[2]);gl.uniform1f(mU.uBr,br);
  gl.bindBuffer(gl.ARRAY_BUFFER,mbuf);gl.bufferData(gl.ARRAY_BUFFER,mArr.subarray(0,mN),gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
  gl.disable(gl.CULL_FACE);gl.drawArrays(gl.TRIANGLES,0,mN/6);gl.enable(gl.CULL_FACE);
  gl.useProgram(prog);
}
function drawMobs(M,sky){
  mN=0;
  for(const m of mobs){
    if(Math.abs(m.x-P.x)>100||Math.abs(m.z-P.z)>100)continue;
    const T=TYPES[m.type],sw=Math.sin(m.ph)*0.8*Math.min(1,m.speedNow/1.5),hid=m.hide,hot=m.hurt>0,fz=m.fx&&m.fx.slow>0,bn=m.fx&&m.fx.burn>0,y0=m.yaw;
    if(m.spinA)m.yaw+=m.spinA;
    for(let i=0;i<T.parts.length;i++){
      if(hid&&hid[i])continue;const p=T.parts[i];let col=p.col;
      if(hot)col=[col[0]*0.5+0.5,col[1]*0.5,col[2]*0.5];
      else if(fz)col=[col[0]*0.5,col[1]*0.7+0.2,col[2]*0.6+0.4];
      else if(bn)col=[Math.min(1,col[0]+0.35),col[1]*0.6,col[2]*0.4];
      emitBox(m,p,sw,col);
    }
    m.yaw=y0;
  }
  if(S.third)EX2.drawPlayer();
  EX2.emit();
  flush(M,sky,true,Math.max(DAY.br,0.38));
  mN=0;EX2.emitSky(camPos);flush(M,sky,false,1);
}
/* kamera */
const eyePos=()=>[P.x,P.y+EYE,P.z];
function cam(){
  const e=eyePos();if(!S.third){camPos=e;return e;}
  const d=lookDir();let t=0.3;
  for(;t<=3.6;t+=0.2){if(solid(Math.floor(e[0]-d[0]*t),Math.floor(e[1]-d[1]*t),Math.floor(e[2]-d[2]*t)))break;}
  t=Math.max(0.4,t-0.3);camPos=[e[0]-d[0]*t,e[1]-d[1]*t,e[2]-d[2]*t];return camPos;
}

/* ---------- Mob: spawn & AI ---------- */
function makeMob(type,x,y,z){const T=TYPES[type];return{type,x,y,z,vx:0,vy:0,vz:0,yaw:Math.random()*6.283,hp:T.hp,ground:false,moving:false,t:rnd(0.5,3),flee:0,hurt:0,ph:Math.random()*6,speedNow:0,cd:1,snd:rnd(3,12),sp:T.sp*rnd(0.9,1.1),angry:0,stuck:0,hi:0,goal:null};}
function groundY(x,z){for(let y=H-1;y>=0;y--){const b=get(x,y,z);if(b===WATER)return-1;if(b!==AIR)return y+1;}return-1;}
function nearWater(x,z){for(let dz=-6;dz<=6;dz+=2)for(let dx=-6;dx<=6;dx+=2)if(get(x+dx,SEA-1,z+dz)===WATER)return true;return false;}
function spawnAt(type,fx,fz){
  const x=Math.floor(fx),z=Math.floor(fz);if(x<2||z<2||x>=W-2||z>=D-2)return false;
  const gy=groundY(x,z);if(gy<0)return false;const below=get(x,gy-1,z);
  if(type==="frog"){if(below!==GRASS&&below!==SAND)return false;if(!nearWater(x,z))return false;}
  else if(type!=="zombie"&&type!=="spider"&&below!==GRASS)return false;
  if((type==="zombie"||type==="spider")&&below===LEAVES)return false;
  if(get(x,gy,z)!==AIR||get(x,gy+1,z)!==AIR||get(x,gy+2,z)!==AIR)return false;
  mobs.push(makeMob(type,x+0.5,gy+0.02,z+0.5));return true;
}
function spawnHerd(minD,maxD){
  const r=Math.random(),type=r<0.22?"cow":r<0.44?"sheep":r<0.66?"chicken":r<0.8?"rabbit":"frog";
  const a=Math.random()*6.283,d=rnd(minD,maxD),cx=P.x+Math.cos(a)*d,cz=P.z+Math.sin(a)*d,want=(rnd(1,3.5)|0);let n=0;
  for(let k=0;k<want*3&&n<want;k++)if(spawnAt(type,cx+rnd(-4,4),cz+rnd(-4,4)))n++;
  return n>0;
}
function countType(t){let n=0;for(const m of mobs)if(m.type===t)n++;return n;}
function mhit(T,x,y,z){const r=T.r;for(let j=Math.floor(y);j<=Math.floor(y+T.h);j++)for(let k=Math.floor(z-r);k<=Math.floor(z+r);k++)for(let i=Math.floor(x-r);i<=Math.floor(x+r);i++)
  if(solid(i,j,k)||(get(i,j,k)>=30&&pHit(i,j,k,x,y,z,r,T.h)))return true;return false;}
function stepMob(m,dt){
  const T=TYPES[m.type],sp=m.sp*(m.flee>0?2.1:1);
  let tx=m.moving?-Math.sin(m.yaw)*sp:0,tz=m.moving?-Math.cos(m.yaw)*sp:0;if(m.drv){tx=-Math.sin(m.yaw)*m.spd;tz=-Math.cos(m.yaw)*m.spd;}
  const wet=get(Math.floor(m.x),Math.floor(m.y+0.2),Math.floor(m.z))===WATER,a=m.drv?Math.min(1,dt*8):Math.min(1,dt*(m.ground?10:3));
  m.vx+=(tx-m.vx)*a;m.vz+=(tz-m.vz)*a;
  if(wet)m.vy=Math.min(m.vy+30*dt,2.2);else{m.vy-=26*dt;if(m.vy<-20)m.vy=-20;}
  let blocked=false;
  let nx=m.x+m.vx*dt;if(mhit(T,nx,m.y,m.z)){nx=m.x;m.vx=0;blocked=true;}m.x=nx;
  let nz=m.z+m.vz*dt;if(mhit(T,m.x,m.y,nz)){nz=m.z;m.vz=0;blocked=true;}m.z=nz;
  let ny=m.y+m.vy*dt;m.ground=false;
  if(mhit(T,m.x,ny,m.z)){const down=m.vy<0;ny=slide(m.y,ny,t=>mhit(T,m.x,t,m.z));if(down)m.ground=true;m.vy=0;}m.y=ny;
  if(mhit(T,m.x,m.y,m.z))m.y+=0.3;
  if(blocked&&m.type==="spider"&&m.moving)m.vy=4.5;else if(blocked&&m.ground&&m.moving)m.vy=7.6;
  m.speedNow=Math.hypot(m.vx,m.vz);
}

const HOSTILEX={zombie:1,spider:1,villager:1,golem:1},PASSIVE={cow:1,sheep:1,chicken:1,rabbit:1,frog:1,villager:1};
let VIL=null;
function villageGen(){
  VIL=null;let best=null,bs=1e9;
  for(let t=0;t<260;t++){
    const cx=Math.floor(128+(hash(t,7,seed+90)-0.5)*150),cz=Math.floor(128+(hash(t,9,seed+91)-0.5)*150);
    if(cx<30||cz<30||cx>W-31||cz>D-31)continue;
    let mn=99,mx=0,ok=true;
    for(let dz=-18;dz<=18&&ok;dz+=6)for(let dx=-18;dx<=18;dx+=6){const h=hm[(cz+dz)*W+cx+dx];if(h<=SEA+2){ok=false;break;}mn=Math.min(mn,h);mx=Math.max(mx,h);}
    if(!ok)continue;const sc=(mx-mn)*10+Math.hypot(cx-128,cz-128)*0.05;if(sc<bs){bs=sc;best=[cx,cz];}
  }
  if(!best)return;
  const cx=best[0],cz=best[1],h0=hm[cz*W+cx];
  const S3=(x,y,z,id)=>{if(x>=0&&z>=0&&x<W&&z<D&&y>=0&&y<H)blocks[idx(x,y,z)]=id;};
  for(let z=cz-21;z<=cz+21;z++)for(let x=cx-21;x<=cx+21;x++){
    if((x-cx)*(x-cx)+(z-cz)*(z-cz)>440)continue;
    for(let y=0;y<H;y++){const i=idx(x,y,z);
      if(y<h0-1){if(blocks[i]===AIR||blocks[i]===WATER)blocks[i]=y>=h0-4?DIRT:STONE;}
      else if(y===h0-1)blocks[i]=GRASS;else blocks[i]=AIR;}
    hm[z*W+x]=h0;
  }
  for(let x=cx-20;x<=cx+20;x++)S3(x,h0-1,cz,SAND);
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
    if(!dx&&!dz){S3(cx,h0-1,cz,WATER);continue;}S3(cx+dx,h0,cz+dz,STONE);S3(cx+dx,h0+3,cz+dz,PLANKS);}
  S3(cx,h0+3,cz,PLANKS);
  for(const c of[[-1,-1],[1,-1],[-1,1],[1,1]])for(let y=1;y<=2;y++)S3(cx+c[0],h0+y,cz+c[1],LOG);
  const homes=[];
  [[-10,-9],[8,-9],[-10,5],[8,5]].forEach((o,hi)=>{
    const ox=cx+o[0],oz=cz+o[1],east=o[0]<0;
    for(let z=0;z<5;z++)for(let x=0;x<5;x++){
      const X=ox+x,Z=oz+z,edge=x===0||x===4||z===0||z===4,corner=(x===0||x===4)&&(z===0||z===4);
      S3(X,h0-1,Z,PLANKS);for(let y=0;y<3;y++)S3(X,h0+y,Z,edge?(corner?LOG:PLANKS):AIR);S3(X,h0+3,Z,PLANKS);}
    for(const w of[[0,2],[4,2],[2,0],[2,4]])S3(ox+w[0],h0+1,oz+w[1],GLASS);
    const dx=east?4:0;S3(ox+dx,h0,oz+2,AIR);S3(ox+dx,h0+1,oz+2,AIR);
    S3(ox+1,h0,oz+1,40);S3(ox+3,h0,oz+1,hi%2?14:11);homes.push([ox+2,oz+2]);
  });
  const farm=[];
  for(const zo of[-14,7])for(let dz=0;dz<7;dz++)for(let dx=-3;dx<=3;dx++){
    const X=cx+dx,Z=cz+zo+dz;if(dx===0&&dz===3){S3(X,h0-1,Z,WATER);continue;}
    S3(X,h0-1,Z,17);S3(X,h0,Z,41+(hash(X,Z,seed+60)*4|0));farm.push([X,h0,Z]);}
  VIL={x:cx+0.5,z:cz+0.5,y:h0,farm,homes};
}
function regVillage(){if(!VIL)return;for(const f of VIL.farm){const k=idx(f[0],f[1],f[2]),b=blocks[k];if(b>=41&&b<=44)crops.set(k,(b-41)*35);}}
function spawnVillage(){
  if(!VIL)return;
  for(let i=0;i<4;i++){const h=VIL.homes[i],m=makeMob("villager",h[0]+0.5,VIL.y+0.02,h[1]+0.5);m.hi=i;mobs.push(m);}
  mobs.push(makeMob("golem",VIL.x+3,VIL.y+0.02,VIL.z+4));
}
const goToward=(m,x,z)=>{m.yaw=Math.atan2(-(x-m.x),-(z-m.z));m.moving=true;};
function villagerAI(m,dt){
  if(!VIL){m.moving=false;return;}
  if(m.flee>0){m.flee-=dt;return;}
  let zz=null,dd=9;for(const o of mobs)if(o.type==="zombie"){const d=Math.hypot(o.x-m.x,o.z-m.z);if(d<dd){dd=d;zz=o;}}
  if(zz){goToward(m,2*m.x-zz.x,2*m.z-zz.z);m.flee=0.25;return;}
  const hr=Math.hypot(m.x-VIL.x,m.z-VIL.z);m.t-=dt;
  if(DAY.night){const h=VIL.homes[m.hi%VIL.homes.length];if(Math.hypot(h[0]+0.5-m.x,h[1]+0.5-m.z)>1.2)goToward(m,h[0]+0.5,h[1]+0.5);else m.moving=false;return;}
  if(m.goal){const g=m.goal;
    if(Math.hypot(g[0]+0.5-m.x,g[2]+0.5-m.z)<1.3){const c=get(g[0],g[1],g[2]);
      if(c===44)setBlock(g[0],g[1],g[2],41);else if(c===AIR&&get(g[0],g[1]-1,g[2])===17)setBlock(g[0],g[1],g[2],41);
      m.goal=null;m.moving=false;m.t=rnd(1.5,3);m.stuck=0;}
    else{goToward(m,g[0]+0.5,g[2]+0.5);m.stuck+=dt;if(m.stuck>10){m.goal=null;m.stuck=0;}}
    return;}
  if(m.t<=0){
    if(Math.random()<0.55&&VIL.farm.length){let pk=null;
      for(let k=0;k<14;k++){const f=VIL.farm[Math.random()*VIL.farm.length|0];if(get(f[0],f[1],f[2])===44){pk=f;break;}}
      m.goal=pk||VIL.farm[Math.random()*VIL.farm.length|0];m.stuck=0;}
    else if(Math.random()<0.5){m.moving=false;m.t=rnd(1.5,4);}
    else{m.moving=true;m.yaw=Math.random()*6.283;m.t=rnd(1,3);}
  }
  if(hr>26&&!m.goal)goToward(m,VIL.x,VIL.z);
}
function golemAI(m,dt,dist){
  m.cd-=dt;if(m.angry>0)m.angry-=dt;
  let tg=null,td=16;
  if(m.angry>0&&S.mode==="survival"&&dist<22){tg={p:1,x:P.x,y:P.y,z:P.z};td=dist;}
  else for(const o of mobs)if(o.type==="zombie"||(o.type==="spider"&&(o.angry>0||DAY.night))){const d=Math.hypot(o.x-m.x,o.z-m.z);if(d<td){td=d;tg=o;}}
  if(tg){goToward(m,tg.x,tg.z);m.moving=td>1.8;
    if(td<2.6&&m.cd<=0&&Math.abs(tg.y-m.y)<2.5){m.cd=1.2;if(tg.p)hurtPlayer(9,m.x,m.z);else hurtMob(tg,12,m.x,m.z);}
    return;}
  m.t-=dt;
  if(VIL&&Math.hypot(m.x-VIL.x,m.z-VIL.z)>20){goToward(m,VIL.x,VIL.z);return;}
  if(m.t<=0){if(Math.random()<0.6){m.moving=false;m.t=rnd(2,6);}else{m.moving=true;m.yaw=Math.random()*6.283;m.t=rnd(1,3);}}
}
function spiderAI(m,dt,dist,dx,dz){
  if(m.angry>0)m.angry-=dt;
  const aggr=S.mode==="survival"&&(m.angry>0||DAY.night);
  if(aggr&&dist<26){m.yaw=Math.atan2(-dx,-dz);m.moving=dist>1.2;m.cd-=dt;
    if(dist<1.7&&Math.abs(P.y-m.y)<1.6&&m.cd<=0){m.cd=0.9;hurtPlayer(3,m.x,m.z);}}
  else{m.t-=dt;if(m.t<=0){m.moving=Math.random()<0.5;m.yaw=Math.random()*6.283;m.t=rnd(1.5,4);}}
}
const TRADES=[{g:{132:3},r:[111,1],t:"3 Gandum → 1 Besi"},{g:{4:0,15:4},r:[111,1],t:"4 Wol → 1 Besi"},{g:{111:1},r:[133,3],t:"1 Besi → 3 Roti"}];
function trade(m){
  if(m.tcd>0)return;m.tcd=1;const sp=spat(m.x,m.z);SFX.hmm(sp[0],Math.max(sp[1],0.6));
  if(S.mode!=="survival"){toast("Warga: Halo!");return;}
  for(const t of TRADES){let ok=true;for(const id in t.g)if(t.g[id]>0&&count(id)<t.g[id])ok=false;
    if(ok){for(const id in t.g)if(t.g[id]>0)take(id,t.g[id]);give(t.r[0],t.r[1],true);SFX.craft();toast("Tukar: "+t.t);refreshHotbar();return;}}
  toast("Warga mau: 3 Gandum→Besi · 4 Wol→Besi · 1 Besi→3 Roti");
}
function updateMobs(dt){
  for(let i=mobs.length-1;i>=0;i--){
    const m=mobs[i],T=TYPES[m.type],dx=P.x-m.x,dz=P.z-m.z,dist=Math.hypot(dx,dz);
    if(T.keep||m.type==="villager"||m.type==="golem"){if(dist>(T.far||110))continue;}else if(dist>125||((m.type==="zombie"||m.type==="spider")&&dist>90)){mobs.splice(i,1);continue;}
    if(m.hurt>0)m.hurt-=dt;if(m.tcd>0)m.tcd-=dt;
    if(EX2.ai(m,dt,dist,dx,dz)){}else if(m.type==="spider")spiderAI(m,dt,dist,dx,dz);else if(m.type==="villager")villagerAI(m,dt);else if(m.type==="golem")golemAI(m,dt,dist);else if(m.type==="zombie"){
      if(DAY.dayf>0.75&&get(Math.floor(m.x),Math.floor(m.y+0.2),Math.floor(m.z))!==WATER){m.hp-=dt*3;m.hurt=Math.max(m.hurt,0.1);if(m.hp<=0){mobs.splice(i,1);continue;}}
      if(S.mode==="survival"&&dist<(m.aggro||24)){
        m.yaw=Math.atan2(-dx,-dz);m.moving=dist>0.95;m.cd-=dt;
        if(dist<1.2&&Math.abs(P.y-m.y)<1.7&&m.cd<=0){m.cd=1.1;hurtPlayer(3,m.x,m.z);}
      }else{m.t-=dt;if(m.t<=0){m.moving=Math.random()<0.5;m.yaw=Math.random()*6.283;m.t=rnd(1.5,4);}}
    }else{
      m.t-=dt;if(m.flee>0)m.flee-=dt;
      if(m.flee<=0&&m.t<=0){if(Math.random()<0.45){m.moving=false;m.t=rnd(1.5,5);}else{m.moving=true;m.yaw=Math.random()*6.283;m.t=rnd(1,3.5);}}
      if(m.moving&&T.hop&&m.ground&&Math.random()<dt*2.2)m.vy=T.hop;
    }
    stepMob(m,dt);m.ph+=dt*m.speedNow*5;
    m.snd-=dt;
    if(m.snd<=0){m.snd=m.type==="zombie"?rnd(4,9):rnd(7,18);if(dist<26){const sp=spat(m.x,m.z);SFX[T.snd](sp[0],sp[1]);}}
  }
}
function hurtMob(m,dmg,fx,fz,byP){
  const T=TYPES[m.type];dmg=EX2.preHurt(m,dmg,byP);m.hp-=dmg;m.hurt=0.4;EX2.blood(m,dmg,fx,fz);
  const d=Math.hypot(m.x-fx,m.z-fz)||1;m.vx+=(m.x-fx)/d*6;m.vz+=(m.z-fz)/d*6;m.vy=5;
  if(byP&&(m.type==="spider"||m.type==="golem"))m.angry=15;if(byP&&m.type==="villager")for(const g of mobs)if(g.type==="golem"&&Math.hypot(g.x-m.x,g.z-m.z)<24)g.angry=15;
  if(PASSIVE[m.type]){m.flee=4;m.moving=true;m.yaw=Math.atan2(-(m.x-P.x),-(m.z-P.z));}
  const sp=spat(m.x,m.z);SFX.hitMob();SFX[T.hs](sp[0],Math.max(sp[1],0.5));
  if(m.hp<=0)killMob(m,byP);
}
function killMob(m,byP){EX2.kill(m,byP);
  const i=mobs.indexOf(m);if(i>=0)mobs.splice(i,1);
  if(S.mode!=="survival"||!byP)return;
  const t=m.type;
  if(t==="cow"){give(101,1+(Math.random()<0.5?1:0));give(102,Math.floor(rnd(0,2.4)));}
  else if(t==="sheep"){give(15,1+(Math.random()<0.5?1:0));give(101,1+(Math.random()<0.5?1:0));}
  else if(t==="chicken"||t==="rabbit")give(101,1);
  else if(t==="frog")give(134,1);
  else if(t==="zombie"&&Math.random()<0.3)give(102,1);
  else if(t==="golem")give(111,2+(Math.random()*2|0));
  else if(t==="pig")give(101,1+(Math.random()*2|0));else if(t==="horse")give(102,2);
}
function pickMob(reach,pad,dir){
  const o=eyePos(),d=dir||lookDir();let best=null,bt=reach;
  for(const m of mobs){
    if(m.carried||m.loaded)continue;
    const T=TYPES[m.type],lo=[m.x-T.r-pad,m.y-pad,m.z-T.r-pad],hi=[m.x+T.r+pad,m.y+T.h+pad,m.z+T.r+pad];
    let tmin=0,tmax=bt,ok=true;
    for(let k=0;k<3;k++){
      if(Math.abs(d[k])<1e-6){if(o[k]<lo[k]||o[k]>hi[k]){ok=false;break;}}
      else{let t1=(lo[k]-o[k])/d[k],t2=(hi[k]-o[k])/d[k];if(t1>t2){const q=t1;t1=t2;t2=q;}tmin=Math.max(tmin,t1);tmax=Math.min(tmax,t2);if(tmin>tmax){ok=false;break;}}
    }
    if(ok&&tmin<bt){bt=tmin;best=m;}
  }
  if(best){const w=reach>8?raycast(o,d,reach):target;if(w){const bd=Math.hypot(w.x+0.5-o[0],w.y+0.5-o[1],w.z+0.5-o[2])-0.5;if(bt>bd+0.4)return null;}}
  return best?{m:best,t:bt}:null;
}

/* ---------- Inventori ---------- */
const count=id=>S.inv[id]|0;
const curHot=()=>S.mode==="creative"?S.hotC:S.hotS;
const held=()=>HOTBAR[sel]|0;
function give(id,n,quiet){
  if(n<=0)return;if(!S.inv[id]&&S.order.indexOf(id)<0)S.order.push(id);
  S.inv[id]=(S.inv[id]|0)+n;if(typeof EX2!=="undefined")EX2.onGive(id,n);
  if(S.mode==="survival"&&S.hotS.indexOf(id)<0){const e=S.hotS.indexOf(0);if(e>=0)S.hotS[e]=id;}
  SFX.pick();if(!quiet)toast("+"+n+" "+NAMES[id]);refreshHotbar();updateHUD(true);
}
function take(id,n){S.inv[id]=Math.max(0,count(id)-n);if(!S.inv[id]){const i=S.hotS.indexOf(id);if(i>=0)S.hotS[i]=0;}}
function armorId(){const w=EX2.worn();if(w&&ARMOR[w])return w;let b=0,bp=0;for(const id in ARMOR)if(count(id)>0&&ARMOR[id]>bp){bp=ARMOR[id];b=+id;}return b;}
const armorPts=()=>(S.mode==="survival"||EX2.worn())?(ARMOR[armorId()]||0):0;
const heldDmg=()=>S.mode==="creative"?99:(TOOL[held()]?TOOL[held()].d:1);
function blockOf(it){
  if(PLAIN.has(it))return it;
  if(it===121||it===122){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),f=Math.abs(fx)>Math.abs(fz)?(fx>0?0:1):(fz>0?2:3);return(it===121?30:34)+f;}
  if(it===123)return 38;if(it===124)return 39;if(it===125)return 40;if(it===131)return 41;return 0;
}
function canPlace(it){
  if(blockOf(it)<=0)return false;
  if(S.mode==="survival"&&count(it)<=0)return false;
  if(it===131)return!!(target&&get(target.x,target.y,target.z)===17&&target.py===target.y+1);
  return true;
}
function describe(id){const _d=EX2.describe(id);if(_d)return _d;
  if(TOOL[id]){const t=TOOL[id];return NAMES[id]+" · "+(t.k==="sword"?"serangan "+t.d:t.k==="hoe"?"mengolah tanah":"kecepatan ×"+MULT[t.t]+" · serangan "+t.d);}
  if(ARMOR[id])return NAMES[id]+" · pelindung "+ARMOR[id]+" (dipakai otomatis)";
  if(FOOD[id])return NAMES[id]+" · makan: +"+FOOD[id]+" lapar (pegang lalu tekan Pasang)";
  if(id===129)return"Pistol · serangan 7 · jarak jauh · pakai Peluru · tombol Serang";
  if(id===130)return"Peluru · amunisi pistol";
  if(id===131)return"Bibit · tanam di tanah bajak (olah dengan cangkul)";
  if(id===125)return"Tempat tidur · tidur malam hari, atur titik lahir";
  if(id===14)return"Tungku · masak & lebur bahan";
  if(id===11)return"Meja kerja · buka semua resep";
  return NAMES[id]||"";
}
function refreshHotbar(){
  const h=curHot();if(S.mode==="survival")for(let i=0;i<9;i++)if(h[i]&&count(h[i])<=0)h[i]=0;
  HOTBAR.length=0;for(let i=0;i<9;i++)HOTBAR.push(h[i]|0);
  const hb=$$("hotbar");hb.innerHTML="";
  for(let i=0;i<9;i++){
    const id=HOTBAR[i],s=el("div",{class:"slot"+(i===sel?" sel":"")},hb);
    if(id){s.appendChild(iconCanvas(id));if(S.mode==="survival"&&count(id)>1)el("span",{class:"cnt",text:count(id)},s);else if(S.mode==="creative"&&EX2.crCount(id))el("span",{class:"cnt",text:EX2.crCount(id)},s);}
    const pick=e=>{e.preventDefault();e.stopPropagation();if(i===sel&&S.mode==="survival"&&FOOD[HOTBAR[i]]){eatItem(HOTBAR[i]);return;}select(i);};
    s.addEventListener("touchstart",pick,{passive:false});s.addEventListener("mousedown",pick);
  }
  EX2.hotExtra(hb);heldLabel(false);updateHUD(true);
  if(!$$("invp").classList.contains("hide"))renderInvHot();
}
function heldLabel(show){const h=held(),l=$$("held");l.textContent=h?NAMES[h]:"";if(show&&h){l.classList.add("show");clearTimeout(S.heldT);S.heldT=setTimeout(()=>l.classList.remove("show"),1500);}}
function onSelect(){heldLabel(true);updateHUD(true);if(!$$("invp").classList.contains("hide"))renderInvHot();}
function assignHot(id){
  const h=curHot(),old=h.indexOf(id);if(old>=0&&old!==sel)h[old]=0;h[sel]=id;
  refreshHotbar();const d=$$("detail");if(d)d.textContent=describe(id);
}

/* ---------- Ikon ---------- */
function px(g,c,x,y,w,h){g.fillStyle=c;g.fillRect(x,y,w||1,h||1);}
function toolIcon(g,k,t){
  for(let i=0;i<9;i++)px(g,"#7a5230",3+i,13-i,1,1);
  const c=TIERC[t],pts=k==="pick"?[[7,3],[8,2],[9,2],[10,2],[11,2],[12,3],[13,4],[13,5],[6,4]]:k==="axe"?[[9,2],[10,2],[11,3],[12,3],[12,4],[9,3],[10,3],[11,4],[10,4]]:[[8,3],[9,3],[10,3],[11,3],[11,4]];
  for(const p of pts)px(g,c,p[0],p[1],1,1);
}
const ARM_PAT=["...XXXX..XXXX...","..XXXXX..XXXXX..","..XXXXXXXXXXXX..","..XXXXXXXXXXXX..","...XXXXXXXXXX...","...XXXXXXXXXX...","...XXXXXXXXXX...","...XXXXXXXXXX...","...XXXXXXXXXX...","...XXXXXXXXXX...","...XXXXXXXXXX...","....XXXXXXXX...."];
function tileTo(g,t){g.drawImage(atlas,(t%4)*16,(t>>2)*16,16,16,0,0,16,16);}
function drawItem(g,id){if(EX2.icon(g,id))return;
  if(TOOL[id]&&TOOL[id].k!=="sword"){toolIcon(g,TOOL[id].k,TOOL[id].t);return;}
  if(id===101||id===107){const c=id===101?["#7a3b2e","#c8553d","#e0806a"]:["#4a2a1a","#8a5230","#a8683c"];px(g,c[0],3,4,9,8);px(g,c[1],4,3,8,8);px(g,c[2],5,4,3,3);px(g,"#f2e6d0",10,10,4,3);px(g,"#f2e6d0",12,12,3,3);}
  else if(id===102){px(g,"#6b4423",3,3,10,11);px(g,"#9a6a3a",4,4,8,9);px(g,"#6b4423",2,5,2,4);px(g,"#6b4423",12,5,2,4);px(g,"#b58450",6,6,4,1);px(g,"#b58450",6,9,4,1);}
  else if(id===103||id===104||id===112){
    const bl=id===103?"#d8b46a":id===104?"#b9bcc2":"#e8eaee",hi=id===103?"#f0d89a":"#fff";
    for(let i=5;i<=13;i++){px(g,bl,i,15-i,2,1);px(g,hi,i,14-i,1,1);}
    for(let k=0;k<5;k++)px(g,"#5a3a1a",3+k,8+k,1,1);for(let k=0;k<4;k++)px(g,"#7a5230",4-k,11+k,1,1);px(g,"#5a3a1a",0,15);
  }else if(ARMOR[id]){
    const c1=id===105?"#9a6a3a":id===106?"#8d9097":"#cfd4dc",c2=id===105?"#6b4423":id===106?"#5d6068":"#8a909a",A=ARM_PAT;
    for(let y=0;y<A.length;y++)for(let x=0;x<16;x++){if(A[y][x]!=="X")continue;
      const e=x===0||x===15||A[y][x-1]==="."||A[y][x+1]==="."||y===0||A[y-1][x]==="."||y===A.length-1;px(g,e?c2:c1,x,y+2,1,1);}
  }
  else if(id===108){for(let k=0;k<11;k++){px(g,"#7a5230",3+k,12-k,1,1);px(g,"#a07848",4+k,12-k,1,1);}}
  else if(id===109){px(g,"#1c1c20",4,6,8,7);px(g,"#2c2c32",5,5,6,2);px(g,"#3c3c44",6,7,2,2);px(g,"#1c1c20",8,4,4,3);}
  else if(id===110){px(g,"#b98a60",4,6,8,7);px(g,"#d6a878",5,5,6,2);px(g,"#8a6240",7,9,3,2);px(g,"#b98a60",9,4,3,3);}
  else if(id===111){for(let r=0;r<5;r++)px(g,r<2?"#f0f0f2":"#c4c6cc",3+(4-r),6+r,9,1);px(g,"#8e9096",3,11,9,1);}
  else if(id===129){px(g,"#1a1a1e",2,5,11,3);px(g,"#3a3a42",3,5,9,1);px(g,"#1a1a1e",4,8,4,6);px(g,"#2a2a30",9,8,2,2);px(g,"#555560",13,5,1,2);}
  else if(id===130){for(let k=0;k<3;k++){const x=3+k*4;px(g,"#c9a24a",x,7,3,7);px(g,"#8a8a90",x,4,3,3);px(g,"#e6c46a",x,7,1,6);}}
  else if(id===131){for(const p of[[4,5],[9,4],[6,9],[11,8],[5,12],[10,12]]){px(g,"#5a4a2a",p[0],p[1],2,2);px(g,"#8aa84a",p[0],p[1],1,1);}}
  else if(id===132){for(const x of[4,7,10]){for(let y=3;y<14;y++)px(g,"#c8a43c",x,y,1,1);px(g,"#e6c850",x-1,3,3,3);}}
  else if(id===133){px(g,"#8a5a2a",2,7,12,6);px(g,"#c8903e",3,6,10,6);px(g,"#e0b060",4,6,6,2);px(g,"#8a5a2a",5,9,1,2);px(g,"#8a5a2a",9,9,1,2);}
  else if(id===134||id===135){const c=id===134?["#d98a7a","#b45d4f"]:["#a8683c","#7a4526"];px(g,c[0],8,3,6,6);px(g,c[1],9,5,4,3);for(let k=0;k<6;k++)px(g,"#f2e6d0",7-k,9+k,2,1);}
  else if(id===121||id===122){tileTo(g,id===121?9:3);g.clearRect(0,0,8,8);}
  else if(id===123||id===124){tileTo(g,id===123?9:3);g.clearRect(0,0,16,8);}
  else if(id===125){tileTo(g,22);g.clearRect(0,0,16,5);px(g,"#8a6a40",0,14,2,2);px(g,"#8a6a40",14,14,2,2);}
}
function iconCanvas(id){
  const c=document.createElement("canvas");c.width=c.height=16;const g=c.getContext("2d");g.imageSmoothingEnabled=false;
  if(PLAIN.has(id)){const t=TILES[id][1];g.drawImage(atlas,(t%4)*16,(t>>2)*16,16,16,0,0,16,16);}else drawItem(g,id);
  return c;
}
function drawChar(cv){if(EX2.drawChar(cv))return;
  const g=cv.getContext("2d");g.clearRect(0,0,84,116);
  const a=armorId(),ac=a&&S.mode==="survival"?(ARMOR[a]>=14?"#c9ced6":ARMOR[a]>=10?"#8d9097":"#9a6a3a"):null;
  const skin="#e0ad85",hair="#3d2412",shirt=ac||"#3a82d8",pants=ac?"#6f747b":"#3f3f8c";
  g.fillStyle="rgba(0,0,0,.28)";g.fillRect(16,108,52,5);
  g.fillStyle=pants;g.fillRect(26,70,14,36);g.fillRect(42,70,14,36);
  g.fillStyle=shirt;g.fillRect(24,34,34,38);
  g.fillStyle=skin;g.fillRect(10,34,13,36);g.fillRect(59,34,13,36);
  if(ac){g.fillStyle=ac;g.fillRect(10,34,13,18);g.fillRect(59,34,13,18);}
  g.fillStyle=skin;g.fillRect(27,6,28,28);g.fillStyle=ac||hair;g.fillRect(27,6,28,9);
  g.fillStyle="#222a55";g.fillRect(33,20,5,5);g.fillRect(44,20,5,5);g.fillStyle="#b7774d";g.fillRect(36,28,10,2);
  const h=held();if(h){g.imageSmoothingEnabled=false;g.drawImage(iconCanvas(h),54,46,30,30);}
}

/* ---------- HUD ---------- */
const HEART=[".XX...XX.","XXXX.XXXX","XXXXXXXXX","XXXXXXXXX",".XXXXXXX.","..XXXXX..","...XXX...","....X...."];
const FOODP=[".....XXX.","....XXXXX","....XXXXX","...XXXXX.","..XXXX...",".BXX.....","BB.......",".B......."];
const ARMI=["XX.XXX.XX","XXXXXXXXX","XXXXXXXXX",".XXXXXXX.",".XXXXXXX.",".XXXXXXX.","..XXXXX.."];
function drawBar(cv,val,pat,full,empty,halfRight){
  const g=cv.getContext("2d"),K=2;g.clearRect(0,0,200,20);
  for(let i=0;i<10;i++){
    const v=val-i*2,st=v>=2?2:v>=1?1:0,ox=i*20+1;
    g.fillStyle="#120a0a";
    for(let y=0;y<pat.length;y++)for(let x=0;x<9;x++)if(pat[y][x]!==".")g.fillRect(ox+x*K-1,y*K,K+2,K+2);
    for(let y=0;y<pat.length;y++)for(let x=0;x<9;x++){
      const ch=pat[y][x];if(ch===".")continue;
      const on=st===2||(st===1&&(halfRight?x>=4:x<5));
      g.fillStyle=ch==="B"?(on?"#f0e6d2":"#5a5448"):(on?full:empty);g.fillRect(ox+x*K,y*K+1,K,K);
    }
  }
}
let hudKey="",toastT=0;
function updateHUD(force){
  const surv=S.mode==="survival",arm=armorPts(),h=held();
  const key=[S.mode,S.hp,S.food,arm,h,S.flying,S.third,count(130),bestFood(),EX2.hudKey()].join("|");
  if(!force&&key===hudKey)return;hudKey=key;
  $$("bars").classList.toggle("hide",!surv);
  if(surv){drawBar($$("cvHp"),S.hp,HEART,"#e0262f","#3a1215",false);drawBar($$("cvFood"),S.food,FOODP,"#c9742f","#3a2a15",true);
    $$("cvArm").style.display=arm>0?"block":"none";if(arm>0)drawBar($$("cvArm"),arm,ARMI,"#b8c4d4","#2c3440",false);}
  {const e=$$("tbEat");if(e)e.classList.toggle("hide",!(surv&&bestFood()));}
  $$("tbFly").classList.toggle("hide",surv);
  $$("tbCam").classList.toggle("on",S.third);
  $$("bDown").classList.toggle("show",S.flying);
  $$("info").textContent=(surv?"⛏ Survival":"✨ Kreatif")+(S.flying?" · ✈ Terbang":"")+(h?" · "+NAMES[h]:"")+EX2.gunInfo(h,surv)+(arm?" · 🛡 "+arm:"")+EX2.infoExtra();
}
function updateClock(){
  const hour=(6+DAY.tod*24)%24,hh=Math.floor(hour),mm=Math.floor((hour-hh)*60);
  $$("clock").textContent=(DAY.night?"🌙 ":"☀️ ")+String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0")+" · Hari "+DAY.day;
}
function toast(msg){const t=$$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),1700);}
function flash(){const h=$$("hurt");h.style.transition="none";h.style.opacity=0.6;requestAnimationFrame(()=>requestAnimationFrame(()=>{h.style.transition="opacity .5s";h.style.opacity=0;}));}
function muzzle(){const m=$$("mflash");m.style.transition="none";m.style.opacity=1;requestAnimationFrame(()=>requestAnimationFrame(()=>{m.style.transition="opacity .12s";m.style.opacity=0;}));}

/* ---------- Aksi pemain ---------- */
function hurtPlayer(dmg,sx,sz){
  if(S.mode!=="survival"||S.dead||(S.hurtT>0&&sx!==undefined))return;
  const d=Math.max(1,Math.round(dmg*(1-0.03*armorPts())));
  S.hp=Math.max(0,S.hp-d);S.hurtT=0.7;flash();SFX.hurt();
  if(sx!==undefined){const dx=P.x-sx,dz=P.z-sz,L=Math.hypot(dx,dz)||1;P.vx+=dx/L*6;P.vz+=dz/L*6;P.vy=Math.max(P.vy,4.5);}
  updateHUD(true);if(S.hp<=0)die();
}
function die(){S.dead=true;started=false;S.mining=false;mineUp();SFX.die();$$("death").classList.remove("hide");if(document.exitPointerLock)document.exitPointerLock();}
function respawn(){
  S.hp=20;S.food=20;S.dead=false;S.flying=false;
  if(S.bed&&get(S.bed[0],S.bed[1],S.bed[2])===40){P.x=S.bed[0]+0.5;P.y=S.bed[1]+1;P.z=S.bed[2]+0.5;P.vx=P.vy=P.vz=0;}else spawn();
  mobs=mobs.filter(m=>m.type!=="zombie");$$("death").classList.add("hide");started=true;S.fallTop=P.y;updateHUD(true);if(!isTouch)lock();
}
function bestFood(){let b=0,bv=0;for(const id in FOOD)if(count(id)>0&&FOOD[id]>bv){bv=FOOD[id];b=+id;}return b;}
function eatItem(id){
  if(S.mode!=="survival"||S.eatCd>0)return;if(S.food>=20){toast("Sudah kenyang");return;}
  S.eatCd=0.7;take(id,1);S.food=Math.min(20,S.food+FOOD[id]);SFX.eat();refreshHotbar();updateHUD(true);
}
function eat(){if(S.dead||S.paused||!started)return;const id=bestFood();if(!id){toast("Tidak ada makanan");return;}eatItem(id);}
function shoot(){
  if(S.atkCd>0||!started||S.paused)return;
  if(S.mode==="survival"&&count(130)<=0){S.atkCd=0.4;SFX.dry();toast("Peluru habis");return;}
  S.atkCd=0.34;S.swing=0.25;if(S.mode==="survival"){take(130,1);updateHUD(true);if(count(130)<=0)refreshHotbar();}
  SFX.shot();muzzle();P.pitch=Math.min(1.5,P.pitch+0.045);
  const h=pickMob(60,0.05);if(h)hurtMob(h.m,7,P.x,P.z,true);
}
function attack(){
  if(!started||S.paused||S.atkCd>0)return;
  if(EX2.attack())return;
  S.atkCd=0.42;S.swing=0.25;
  const hit=pickMob(3.9,isTouch?0.3:0.1);
  if(!hit){if(target&&!S.dead){const b=get(target.x,target.y,target.z);if((b===11||b===14||b===40)&&useBlock()){S.atkCd=0.6;return;}}SFX.swing();return;}
  hurtMob(hit.m,heldDmg(),P.x,P.z,true);
}
function toggleFly(){if(S.mode!=="creative"||!started)return;S.flying=!S.flying;P.vy=0;toast(S.flying?"Terbang aktif":"Terbang mati");updateHUD(true);}
function toggleCam(){S.third=!S.third;toast(S.third?"Kamera: orang ketiga":"Kamera: orang pertama");updateHUD(true);}
function sleep(t){
  S.bed=[t.x,t.y,t.z];
  if(DAY.dayf>0.45){toast("Titik lahir diatur. Tidur hanya bisa saat malam");return;}
  S.sleeping=true;S.paused=true;const o=$$("sleepov");o.classList.add("show");
  setTimeout(()=>{DAY.tod=0.03;DAY.day++;updateDay();mobs=mobs.filter(m=>m.type!=="zombie");S.hp=Math.min(20,S.hp+6);},1400);
  setTimeout(()=>{o.classList.remove("show");S.paused=false;S.sleeping=false;toast("☀️ Selamat pagi! Titik lahir diatur");updateHUD(true);},3000);
}
function useBlock(){
  if(S.dead)return false;
  if(EX2.use())return true;
  const vm=pickMob(3.6,0.15);if(vm&&vm.m.type==="villager"){trade(vm.m);return true;}
  if(!target)return false;
  const id=get(target.x,target.y,target.z),h=held(),surv=S.mode==="survival";
  if(surv&&id===11){openInv("craft");return true;}
  if(surv&&id===14){openFurn(idx(target.x,target.y,target.z));return true;}
  if(id===40){sleep(target);return true;}
  if(TOOL[h]&&TOOL[h].k==="hoe"&&(id===1||id===2)&&get(target.x,target.y+1,target.z)===AIR){setBlock(target.x,target.y,target.z,17);SFX.till();return true;}
  if(surv&&FOOD[h]){eatItem(h);return true;}
  return false;
}

/* ---------- Menambang & drop ---------- */
function blockClass(id){
  if(id===3||id===9||id===12||id===13||id===14||(id>=34&&id<=37)||id===39)return"pick";
  if(id===6||id===8||id===11||(id>=30&&id<=33)||id===38||id===40)return"axe";
  if(id===7||id===15||(id>=41&&id<=44))return"hoe";
  return"hand";
}
function mineTime(id){
  const base=HARD[id]||1,cl=blockClass(id),t=TOOL[held()];
  if(t&&t.k===cl)return base/MULT[t.t];
  return cl==="pick"?base/0.3:base;
}
function drops(old){
  const t=TOOL[held()],pt=t&&t.k==="pick"?t.t:0;
  switch(old){
    case 1:return[[2,1]].concat(Math.random()<0.08?[[131,1]]:[]);
    case 2:case 17:return[[2,1]];
    case 3:return pt>=1?[[3,1]]:[];
    case 9:return pt>=1?[[9,1]]:[];
    case 12:return pt>=1?[[109,1]]:[];
    case 13:return pt>=2?[[110,1]]:[];
    case 14:return pt>=1?[[14,1]]:[];
    case 7:return Math.random()<0.5?[[7,1]]:(Math.random()<0.1?[[131,1]]:[]);
    case 30:case 31:case 32:case 33:return[[121,1]];
    case 34:case 35:case 36:case 37:return pt>=1?[[122,1]]:[];
    case 38:return[[123,1]];case 39:return pt>=1?[[124,1]]:[];case 40:return[[125,1]];
    case 41:case 42:case 43:return[[131,1]];
    case 44:return[[132,1]].concat(rnd(0,3)|0?[[131,rnd(1,3)|0]]:[]);
    default:return[[old,1]];
  }
}
function mineDown(){S.mining=true;}
function mineUp(){S.mining=false;S.mineT=0;S.mineKey="";const m=$$("mine");if(m)m.style.display="none";}
function leftDown(){
  if(!started)return;
  if(EX2.weapon()||EX2.driving()){attack();return;}
  if(pickMob(3.9,0.05))attack();else mineDown();
}
const furn=new Map(),crops=new Map();
function getF(key){if(!furn.has(key))furn.set(key,{inp:null,fuel:null,out:null,burn:0,burnMax:0,prog:0});return furn.get(key);}
function onBlock(old,nw,x,y,z){
  const key=idx(x,y,z),so=old!==AIR&&old!==WATER,sn=nw!==AIR&&nw!==WATER,oc=old>=41&&old<=44,nc=nw>=41&&nw<=44;
  if(so&&!sn){
    SFX.break(old);
    if(old===14&&furn.has(key)){const f=furn.get(key);for(const s of[f.inp,f.fuel,f.out])if(s)give(s.id,s.n,true);furn.delete(key);}
    if(oc)crops.delete(key);
    if(S.mode==="survival")for(const d of drops(old))give(d[0],d[1],true);
  }else if(sn){
    if(nc)crops.set(key,(nw-41)*35);else if(oc)crops.delete(key);
    if(!(oc&&nc)&&!(so&&sn&&old===17===false&&nw===17))SFX.place();
  }
}
function tickF(f,dt){
  const o=f.inp&&SMELT[f.inp.id],can=o&&(!f.out||(f.out.id===o&&f.out.n<64));
  if(f.burn>0)f.burn-=dt;
  if(can){
    if(f.burn<=0&&f.fuel&&FUEL[f.fuel.id]){f.burnMax=f.burn=FUEL[f.fuel.id];f.fuel.n--;if(f.fuel.n<=0)f.fuel=null;}
    if(f.burn>0){f.prog+=dt;if(f.prog>=8){f.prog=0;f.inp.n--;if(f.inp.n<=0)f.inp=null;if(f.out)f.out.n++;else f.out={id:o,n:1};}}
    else f.prog=Math.max(0,f.prog-dt*2);
  }else f.prog=0;
}

/* ---------- Panel Tas & Racik ---------- */
function chipRow(parent,onPick){
  const r=el("div",{class:"chipsRow"},parent);
  for(const c of CATS){const b=el("button",{text:c,class:c===S.filter?"on":""},r);b.addEventListener("click",()=>{S.filter=c;SFX.click();renderInv();});}
}
function nearTable(){const x0=Math.floor(P.x),y0=Math.floor(P.y),z0=Math.floor(P.z);
  for(let y=y0-2;y<=y0+3;y++)for(let z=z0-4;z<=z0+4;z++)for(let x=x0-4;x<=x0+4;x++)if(get(x,y,z)===11)return true;return false;}
function canCraft(r,near){if(r.table&&!near)return false;for(const id in r.cost)if(count(id)<r.cost[id])return false;return true;}
function costText(r){return Object.keys(r.cost).map(id=>r.cost[id]+" "+NAMES[id]).join(" + ");}
function craft(r){
  if(!canCraft(r,nearTable()))return;
  for(const id in r.cost)take(id,r.cost[id]);
  give(r.out,r.n,true);SFX.craft();toast("Dibuat: "+NAMES[r.out]+(r.n>1?" ×"+r.n:""));renderInv();
}
function renderCraft(body){
  const near=nearTable();
  el("p",{class:"note",text:near?"✔ Meja kerja di dekatmu — semua resep terbuka":"Dekati meja kerja untuk membuka semua resep"},body);
  chipRow(body);
  for(const r of RECIPES){
    if(S.filter!=="Semua"&&r.cat!==S.filter)continue;
    const row=el("div",{class:"rrow"},body);row.appendChild(iconCanvas(r.out));
    const info=el("div",{class:"rinfo"},row);el("b",{text:NAMES[r.out]+(r.n>1?" ×"+r.n:"")+(count(r.out)?"  (punya "+count(r.out)+")":"")},info);
    el("small",{text:costText(r)+(r.table?" · perlu meja":"")},info);
    const b=el("button",{text:"Buat"},row);if(!canCraft(r,near))b.disabled=true;b.addEventListener("click",()=>craft(r));
  }
}
function renderBag(body){
  const surv=S.mode==="survival";
  const cr=el("div",{class:"charRow"},body),cv=el("canvas",{width:84,height:116},cr);drawChar(cv);
  const st=el("div",{class:"stats"},cr);
  if(surv){el("div",{text:"❤ Nyawa: "+S.hp+"/20"},st);el("div",{text:"🍖 Lapar: "+S.food+"/20"},st);
    const a=armorId();el("div",{text:"🛡 Armor: "+(a?NAMES[a]+" ("+ARMOR[a]+")":"belum ada")},st);}
  else el("div",{text:"✨ Kreatif: semua barang tersedia"},st);
  el("div",{text:"✋ Tangan: "+(held()?NAMES[held()]:"kosong")},st);
  let ids;
  if(surv)ids=S.order.filter(id=>count(id)>0);else{chipRow(body);ids=CAT_IDS[S.filter];}
  const g=el("div",{class:"grid"},body),total=Math.max(27,Math.ceil(ids.length/9)*9);
  for(let i=0;i<total;i++){
    const c=el("div",{class:"cell"},g);
    if(i<ids.length){const id=ids[i];c.appendChild(iconCanvas(id));if(surv&&count(id)>1)el("span",{class:"cnt",text:count(id)},c);
      c.addEventListener("click",()=>{SFX.click();assignHot(id);});}
  }
  el("div",{id:"detail",text:surv?"Ketuk barang untuk menaruhnya di slot hotbar yang dipilih (slot "+(sel+1)+")":"Pilih slot hotbar di bawah, lalu ketuk barang untuk mengisinya"},body);
  if(!surv){const b=el("button",{class:"alt",text:"Kosongkan slot terpilih",style:"padding:8px;font-size:13px"},body);b.addEventListener("click",()=>{curHot()[sel]=0;refreshHotbar();});}
}
function renderInvHot(){
  const r=$$("invHot");r.innerHTML="";
  for(let i=0;i<9;i++){
    const id=HOTBAR[i],c=el("div",{class:"cell"+(i===sel?" sel":"")},r);
    if(id){c.appendChild(iconCanvas(id));if(S.mode==="survival"&&count(id)>1)el("span",{class:"cnt",text:count(id)},c);}
    c.addEventListener("click",()=>{select(i);const d=$$("detail");if(d)d.textContent=HOTBAR[i]?describe(HOTBAR[i]):"Slot kosong";});
  }
}
function renderInv(){
  const body=$$("invBody");body.innerHTML="";
  for(const b of document.querySelectorAll("#invp .tabs button[data-t]"))b.classList.toggle("on",b.dataset.t===S.tab);
  $$("invp").querySelector('[data-t="craft"]').style.display=S.mode==="survival"?"":"none";
  if(S.tab==="craft"&&S.mode==="survival")renderCraft(body);else renderBag(body);
  renderInvHot();
}
function openInv(tab){
  if(S.dead||!started||S.paused)return;
  S.tab=tab==="craft"&&S.mode==="survival"?"craft":"inv";S.paused=true;S.mining=false;mineUp();S.atkHeld=false;input.fx=input.fz=0;
  if(document.exitPointerLock)document.exitPointerLock();
  renderInv();$$("invp").classList.remove("hide");SFX.click();
}
function closeInv(){$$("invp").classList.add("hide");S.paused=false;}

/* ---------- Panel Tungku ---------- */
let FR={};
function openFurn(key){
  if(S.mode!=="survival"||S.paused||!started)return;
  S.furnOpen=key;S.paused=true;S.mining=false;mineUp();S.atkHeld=false;input.fx=input.fz=0;
  if(document.exitPointerLock)document.exitPointerLock();
  renderFurn();$$("furn").classList.remove("hide");SFX.click();
}
function closeFurn(){S.furnOpen=null;$$("furn").classList.add("hide");S.paused=false;}
const fSig=f=>[f.inp&&f.inp.id+":"+f.inp.n,f.fuel&&f.fuel.id+":"+f.fuel.n,f.out&&f.out.id+":"+f.out.n,f.burn>0].join("|")+"|"+Object.keys(S.inv).map(k=>k+"="+S.inv[k]).join(",");
function renderFurn(){
  const f=getF(S.furnOpen),box=$$("furnBody");box.innerHTML="";S.furnSig=fSig(f);
  const mkSlot=(parent,label,slot,fn)=>{const w=el("div",{class:"fcol"},parent);el("small",{text:label},w);const c=el("div",{class:"cell big"},w);
    if(slot){c.appendChild(iconCanvas(slot.id));el("span",{class:"cnt",text:slot.n},c);}c.addEventListener("click",fn);return c;};
  const r1=el("div",{class:"fslots"},box);
  mkSlot(r1,"Bahan",f.inp,()=>{if(f.inp){give(f.inp.id,f.inp.n,true);f.inp=null;renderFurn();}});
  const mid=el("div",{class:"fmid"},r1);FR.bar=el("i",{},el("div",{class:"pbar"},mid));
  mkSlot(r1,"Hasil",f.out,()=>{if(f.out){give(f.out.id,f.out.n,true);f.out=null;SFX.pick();renderFurn();}});
  const r2=el("div",{class:"fslots"},box);
  FR.flame=el("div",{class:"flame",text:"🔥"},r2);
  mkSlot(r2,"Bahan bakar",f.fuel,()=>{if(f.fuel){give(f.fuel.id,f.fuel.n,true);f.fuel=null;renderFurn();}});
  el("p",{class:"note",text:"Ketuk barang di tas untuk dimasukkan. Bijih besi → Besi, Pasir → Kaca, Daging → matang. Bahan bakar: batu bara, kayu, papan."},box);
  const g=el("div",{class:"grid"},box),ids=S.order.filter(id=>count(id)>0),total=Math.max(18,Math.ceil(ids.length/9)*9);
  for(let i=0;i<total;i++){const c=el("div",{class:"cell"},g);
    if(i<ids.length){const id=ids[i];c.appendChild(iconCanvas(id));if(count(id)>1)el("span",{class:"cnt",text:count(id)},c);c.addEventListener("click",()=>moveToFurn(id));}}
  updateFurnBars();
}
function updateFurnBars(){const f=S.furnOpen!==null?getF(S.furnOpen):null;if(!f||!FR.bar)return;FR.bar.style.width=Math.min(100,f.prog/8*100)+"%";FR.flame.classList.toggle("on",f.burn>0);}
function moveToFurn(id){
  const f=getF(S.furnOpen),n=count(id);if(n<=0)return;
  if(SMELT[id]){if(f.inp&&f.inp.id!==id){toast("Slot bahan sudah terisi");return;}f.inp={id,n:(f.inp?f.inp.n:0)+n};take(id,n);}
  else if(FUEL[id]){if(f.fuel&&f.fuel.id!==id){toast("Slot bahan bakar sudah terisi");return;}f.fuel={id,n:(f.fuel?f.fuel.n:0)+n};take(id,n);}
  else{toast(NAMES[id]+" tidak bisa dimasak");return;}
  SFX.click();refreshHotbar();renderFurn();
}

/* ---------- Waktu & dunia ---------- */
function updateDay(){
  const hour=(6+DAY.tod*24)%24,e=Math.sin(2*Math.PI*(hour-6)/24);
  DAY.dayf=clamp((e+0.12)/0.42,0,1);DAY.br=0.3+0.7*DAY.dayf;DAY.fog=0.6+0.4*DAY.dayf;DAY.night=DAY.dayf<0.3;
  const dusk=Math.max(0,1-Math.abs(e)/0.2),dc=[0.53,0.75,0.95],nc=[0.02,0.03,0.09],oc=[0.95,0.5,0.3];
  for(let i=0;i<3;i++){const b=nc[i]+(dc[i]-nc[i])*DAY.dayf;DAY.sky[i]=b+(oc[i]-b)*dusk*0.55;}
}
let camX=0,camZ=0;
function near(c){return Math.abs(c.cx-camX)<112&&Math.abs(c.cz-camZ)<112;}
function rebuild(){
  camX=P.x;camZ=P.z;
  for(let n=0;n<3;n++){let best=-1,bd=1e9;
    for(let i=0;i<chunks.length;i++){const c=chunks[i];if(!c.dirty)continue;const d=Math.max(Math.abs(c.cx-camX),Math.abs(c.cz-camZ));if(d<bd&&d<112){bd=d;best=i;}}
    if(best<0)break;buildChunk(best);}
}
function initialBuild(){
  const pcx=Math.floor(P.x/CS),pcz=Math.floor(P.z/CS);camX=P.x;camZ=P.z;
  for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){const cx=pcx+dx,cz=pcz+dz;if(cx<0||cz<0||cx>=NCX||cz>=NCZ)continue;buildChunk(cz*NCX+cx);}
}

/* ---------- Simpan pemain ---------- */
const PK="dunia-kotak-v3-p";
function savePlayer(){if(EX2.noSave())return;try{localStorage.setItem(PK,JSON.stringify({seed,mode:S.mode,hp:S.hp,food:S.food,inv:S.inv,order:S.order,hotS:S.hotS,hotC:S.hotC,bed:S.bed,
  furn:[...furn.entries()],tod:DAY.tod,day:DAY.day,pos:[P.x,P.y,P.z],yaw:P.yaw,pitch:P.pitch,snd:S.sound,x2:EX2.save()}));}catch(e){}}
function loadPlayer(){
  try{const o=JSON.parse(localStorage.getItem(PK)||"null");if(!o)return;
    S.sound=o.snd!==false;EX2.load(o.x2,o.seed===seed);if(o.seed!==seed)return;
    S.mode=o.mode==="creative"?"creative":"survival";S.hp=clamp(o.hp|0,1,20);S.food=clamp(o.food|0,0,20);S.inv=o.inv||{};S.order=o.order||[];
    if(o.hotS)S.hotS=o.hotS;if(o.hotC)S.hotC=o.hotC;S.bed=o.bed||null;for(const e of(o.furn||[]))furn.set(e[0],e[1]);
    DAY.tod=+o.tod||0.04;DAY.day=o.day|0||1;
    if(o.pos&&!hits(o.pos[0],o.pos[1],o.pos[2])){P.x=o.pos[0];P.y=o.pos[1];P.z=o.pos[2];P.yaw=o.yaw||0;P.pitch=o.pitch||0;}
  }catch(e){}
}
function setMode(m){
  S.mode=m;if(m==="survival")S.flying=false;
  refreshHotbar();
  for(const b of document.querySelectorAll("#modeRow button"))b.classList.toggle("on",b.dataset.m===m);
  $$("modeDesc").textContent=m==="survival"?"Cari makan, tambang bijih, masak di tungku, bikin alat, armor & pistol. Waspada zombie malam hari!":"Semua barang tak terbatas, bisa terbang, tanpa damage.";
  savePlayer();
}

/* ---------- Update per frame ---------- */
function pre(){S.pvy=P.vy;S.pgr=P.ground;}
function update(dt){
  if(S.dead)return;
  if(started||S.paused){
    for(const f of furn.values())tickF(f,dt);
    if(S.furnOpen!==null){updateFurnBars();S.furnT-=dt;if(S.furnT<=0){S.furnT=0.2;if(fSig(getF(S.furnOpen))!==S.furnSig)renderFurn();}}
  }
  if(!started||S.paused)return;
  const surv=S.mode==="survival";
  S.atkCd-=dt;S.hurtT-=dt;S.eatCd-=dt;if(S.swing>0)S.swing-=dt;
  DAY.tod+=dt/480;if(DAY.tod>=1){DAY.tod-=1;DAY.day++;}
  updateDay();
  if(DAY.night!==S.wasNight){S.wasNight=DAY.night;toast(DAY.night?"🌙 Malam tiba… zombie muncul!":"☀️ Pagi telah tiba");}
  const spd=Math.hypot(P.vx,P.vz);S.walkPh+=dt*spd*2.2;
  // jatuh: damage menurut jarak (aman sampai 3 blok)
  const inW=get(Math.floor(P.x),Math.floor(P.y+0.4),Math.floor(P.z))===WATER;
  if(P.ground||S.flying||inW){
    if(S.wasAir&&P.ground&&!S.flying&&!inW){const dist=S.fallTop-P.y;if(dist>3.2){SFX.land(-S.pvy);if(surv)hurtPlayer(Math.ceil(dist-3));}else if(S.pvy<-5)SFX.land(-S.pvy);}
    S.fallTop=P.y;S.wasAir=false;
  }else{S.wasAir=true;if(P.y>S.fallTop)S.fallTop=P.y;}
  if(P.ground&&!S.flying){S.stepAcc+=spd*dt;if(S.stepAcc>2.2){S.stepAcc=0;if(spd>0.8)SFX.step(get(Math.floor(P.x),Math.floor(P.y-0.1),Math.floor(P.z)));}}
  // menambang
  const mb=$$("mine");let id=AIR;
  if(S.mining&&target&&target.y>0)id=get(target.x,target.y,target.z);
  if(id!==AIR&&id!==WATER){
    const key=target.x+","+target.y+","+target.z;if(key!==S.mineKey){S.mineKey=key;S.mineT=0;}
    const need=surv?mineTime(id):0.18;S.mineT+=dt;S.mineSnd-=dt;
    if(surv&&S.mineSnd<=0){S.mineSnd=0.26;SFX.hit(id);}
    if(surv){mb.style.display="block";mb.firstChild.style.width=Math.min(100,S.mineT/need*100)+"%";}
    if(S.mineT>=need){S.mineT=0;S.mineKey="";mb.style.display="none";S.swing=0.2;doBreak();}
  }else{S.mineT=0;S.mineKey="";mb.style.display="none";}
  if(S.atkHeld)attack();
  // lapar & nyawa
  if(surv){
    S.foodT+=dt*(spd>3?1.4:1);if(S.foodT>=30){S.foodT=0;if(S.food>0)S.food--;}
    if(S.food>=18&&S.hp<20){S.regenT+=dt;if(S.regenT>=3){S.regenT=0;S.hp++;S.foodT+=4;}}else S.regenT=0;
    if(S.food<=0){S.starveT+=dt;if(S.starveT>=4){S.starveT=0;if(S.hp>2){S.hp--;flash();SFX.hurt();}}}else S.starveT=0;
  }
  // tanaman tumbuh
  S.cropT-=dt;
  if(S.cropT<=0){S.cropT=1;
    for(const[k,age]of crops){const a=age+1,cur=blocks[k];
      if(!(cur>=41&&cur<=44)){crops.delete(k);continue;}
      crops.set(k,a);const st=Math.min(3,Math.floor(a/35));
      if(cur-41!==st){const x=k%W,z=((k/W)|0)%D,y=(k/(W*D))|0;setBlock(x,y,z,41+st);crops.set(k,a);}}
  }
  // mob
  updateMobs(dt);
  S.vilT=(S.vilT||0)-dt;if(S.vilT<=0){S.vilT=6;if(VIL&&!EX2.chaos()&&Math.hypot(P.x-VIL.x,P.z-VIL.z)<90){let v=0,g=0;for(const m of mobs){if(m.type==="villager")v++;else if(m.type==="golem")g++;}
    for(;v<4;v++){const h=VIL.homes[v%4],m=makeMob("villager",h[0]+0.5,VIL.y+0.02,h[1]+0.5);m.hi=v;mobs.push(m);}
    if(g<1)mobs.push(makeMob("golem",VIL.x+3,VIL.y+0.02,VIL.z+4));}}
  S.spawnT-=dt;if(S.spawnT<=0){S.spawnT=1.5;let pc=0;for(const m of mobs)if(!HOSTILEX[m.type])pc++;if(pc<44)spawnHerd(40,95);}
  S.zSpawnT-=dt;if(S.zSpawnT<=0){S.zSpawnT=2.5;if(DAY.night&&surv&&countType("spider")<1){for(let k=0;k<6;k++){const a=Math.random()*6.283,d=rnd(18,40);if(spawnAt("spider",P.x+Math.cos(a)*d,P.z+Math.sin(a)*d))break;}}
  if(DAY.night&&surv&&countType("zombie")<EX2.zcap()){for(let k=0;k<10;k++){const fa=Math.atan2(-Math.cos(P.yaw),-Math.sin(P.yaw)),a=Math.random()<0.7?fa+(Math.random()-0.5)*1.6:Math.random()*6.283,d=rnd(28,44);if(spawnAt("zombie",P.x+Math.cos(a)*d,P.z+Math.sin(a)*d))break;}}}
  EX2.update(dt);
  updateHUD(false);
  S.uiT-=dt;if(S.uiT<=0){S.uiT=0.5;updateClock();}
  S.saveT-=dt;if(S.saveT<=0){S.saveT=4;savePlayer();}
}

/* ---------- Mulai ---------- */
function populate(){mobs=[];for(let k=0;k<600&&mobs.length<34;k++)spawnHerd(8,75);spawnVillage();EX2.populate();}
function newWorld(){
  S.inv={};S.order=[];S.hotS=[0,0,0,0,0,0,0,0,0];S.bed=null;furn.clear();crops.clear();S.hp=20;S.food=20;S.dead=false;S.flying=false;DAY.tod=0.04;DAY.day=1;
  EX2.newWorld();regVillage();populate();initialBuild();refreshHotbar();updateHUD(true);savePlayer();
}
const CSS=`
html,body{overscroll-behavior:none}
.slot{width:min(8.4vw,40px);height:min(8.4vw,40px);position:relative}
.slot .cnt{position:absolute;right:2px;bottom:0;font-size:11px;font-weight:700;color:#fff;text-shadow:0 1px 2px #000,0 0 3px #000;pointer-events:none}
#joy{left:20px;bottom:98px;width:124px;height:124px}#knob{left:37px;top:37px}
.btn{width:62px;height:62px;line-height:1.05;text-align:center;flex-direction:column;gap:1px;background:rgba(15,25,40,.5);border-color:rgba(255,255,255,.4)}
.btn b{font-size:21px;font-weight:400}.btn small{font-size:10px;font-weight:700}
#bJump{right:14px;bottom:100px;width:68px;height:68px}
#bAtk{right:90px;bottom:100px;background:rgba(150,30,30,.5)}
#bBreak{right:14px;bottom:178px}#bPlace{right:90px;bottom:178px}
#bDown{right:166px;bottom:100px;width:52px;height:52px;display:none!important}
.touch #bDown.show{display:flex!important}
#clock{position:fixed;top:12px;left:50%;transform:translateX(-50%);padding:5px 12px;border-radius:14px;background:rgba(0,0,0,.45);color:#fff;font:600 13px system-ui,sans-serif;pointer-events:none;white-space:nowrap}
#info{position:fixed;top:44px;left:50%;transform:translateX(-50%);padding:3px 10px;border-radius:10px;background:rgba(0,0,0,.32);color:#e8eef5;font:500 11px system-ui,sans-serif;pointer-events:none;white-space:nowrap;max-width:70vw;overflow:hidden;text-overflow:ellipsis}
#toast{position:fixed;top:74px;left:50%;transform:translateX(-50%);padding:6px 12px;border-radius:12px;background:rgba(20,30,45,.88);color:#fff;font:600 13px system-ui,sans-serif;opacity:0;transition:opacity .25s;pointer-events:none;white-space:nowrap;z-index:3;max-width:92vw;overflow:hidden;text-overflow:ellipsis}
#toast.show{opacity:1}
#held{position:fixed;left:50%;bottom:98px;transform:translateX(-50%);padding:2px 10px;border-radius:8px;background:rgba(0,0,0,.4);color:#fff;font:600 12px system-ui,sans-serif;opacity:0;transition:opacity .3s;pointer-events:none;white-space:nowrap}
#held.show{opacity:1}
#hurt{position:fixed;inset:0;pointer-events:none;opacity:0;background:radial-gradient(ellipse at center,rgba(200,0,0,0) 35%,rgba(200,0,0,.75) 100%)}
#mflash{position:fixed;left:50%;top:58%;width:150px;height:150px;margin-left:-75px;pointer-events:none;opacity:0;background:radial-gradient(circle,rgba(255,240,170,.95) 0%,rgba(255,170,60,.55) 35%,rgba(255,120,0,0) 70%)}
#sleepov{position:fixed;inset:0;background:#02030a;color:#9db3d6;display:flex;align-items:center;justify-content:center;font:600 22px system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity 1.2s;z-index:6}
#sleepov.show{opacity:1;pointer-events:auto}
#mine{position:fixed;left:50%;top:calc(50% + 20px);width:56px;height:6px;margin-left:-28px;background:rgba(0,0,0,.5);border-radius:3px;overflow:hidden;display:none;pointer-events:none}
#mine i{display:block;height:100%;width:0;background:#fff}
#bars{position:fixed;left:50%;transform:translateX(-50%);bottom:56px;width:min(94vw,352px);height:38px;pointer-events:none}
#bars canvas{position:absolute;width:48%;height:auto}
#cvArm{left:0;top:0}#cvHp{left:0;bottom:0}#cvFood{right:0;bottom:0}
#tbs{position:fixed;right:10px;top:10px;display:flex;flex-direction:column;gap:6px;z-index:2}
#tbs .sec{display:none}#tbs.open .sec{display:flex}#tbs.open .sec.hide{display:none!important}
.tb{width:40px;height:40px;border-radius:12px;border:2px solid rgba(255,255,255,.25);background:rgba(15,25,40,.55);color:#fff;font-size:21px;display:flex;align-items:center;justify-content:center;padding:0}
.tb.on{background:rgba(95,168,58,.7)}
#modeRow{display:flex;gap:8px}#modeRow button{margin-top:8px;padding:11px 4px;font-size:14px}#modeRow button.on{background:#5fa83a}
#modeDesc{min-height:52px;font-size:13px}
.card.wide{max-width:430px;max-height:94vh;display:flex;flex-direction:column;text-align:left;padding:12px}
.tabs{display:flex;gap:6px;margin-bottom:8px}
.tabs button{flex:1;margin:0;padding:10px 4px;font-size:14px;background:#2f4157;border-radius:10px}
.tabs button.on{background:#5fa83a}.tabs #invClose,.tabs #furnClose{flex:0 0 46px;background:#7a2f2f}
#invBody,#furnBody{overflow-y:auto;touch-action:pan-y;-webkit-overflow-scrolling:touch;max-height:58vh;padding-right:2px}
.grid{display:grid;grid-template-columns:repeat(9,1fr);gap:3px}
.cell{aspect-ratio:1;background:#2a3a4d;border:2px solid #3a4e66;border-radius:6px;position:relative;padding:2px;box-sizing:border-box}
.cell.sel{border-color:#fff;background:#3b5270}
.cell canvas{width:100%;height:100%;image-rendering:pixelated;display:block;pointer-events:none}
.cell .cnt{position:absolute;right:2px;bottom:0;font-size:10px;font-weight:700;color:#fff;text-shadow:0 1px 2px #000;pointer-events:none}
.cell.big{width:62px;height:62px;aspect-ratio:auto;flex:none}
#invHot{display:grid;grid-template-columns:repeat(9,1fr);gap:3px;margin-top:8px;padding-top:8px;border-top:1px solid #34465b}
#detail{min-height:36px;margin:8px 0 4px;font-size:13px;color:#cfe0f0;line-height:1.35}
.charRow{display:flex;gap:12px;margin-bottom:10px;align-items:center}
.charRow canvas{width:84px;height:116px;background:linear-gradient(#32506e,#1d2d40);border-radius:10px;flex:none}
.stats{flex:1;font-size:13px;line-height:1.75}
.chipsRow{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}
.chipsRow button{margin:0;padding:7px 11px;font-size:12px;width:auto;background:#2f4157;border-radius:14px}
.chipsRow button.on{background:#5fa83a}
.note{font-size:12px!important;margin:4px 0 8px!important}
.rrow{display:flex;align-items:center;gap:10px;padding:7px 0;border-top:1px solid #34465b}
.rrow canvas{width:32px;height:32px;image-rendering:pixelated;flex:none}
.rinfo{flex:1;display:flex;flex-direction:column;font-size:14px}.rinfo small{color:#9fb0c2;font-size:11px}
.rrow button{width:auto;margin:0;padding:9px 16px;font-size:14px}.rrow button:disabled{opacity:.35}
.fslots{display:flex;align-items:center;justify-content:center;gap:16px;margin:8px 0}
.fcol{display:flex;flex-direction:column;align-items:center;gap:3px}.fcol small{font-size:11px;color:#9fb0c2}
.fmid{width:80px}.pbar{height:10px;background:#111a26;border-radius:5px;overflow:hidden}.pbar i{display:block;height:100%;width:0;background:#e9a23a}
.flame{font-size:30px;filter:grayscale(1) brightness(.5)}.flame.on{filter:none}
@media (max-height:520px){
 #joy{bottom:60px;left:16px;width:106px;height:106px}#knob{left:28px;top:28px}
 #bJump{bottom:58px;right:14px;width:60px;height:60px}#bAtk{bottom:58px;right:84px;width:56px;height:56px}
 #bBreak{bottom:124px;right:14px;width:56px;height:56px}#bPlace{bottom:124px;right:84px;width:56px;height:56px}#bDown{bottom:58px;right:150px}
 #bars{bottom:50px}#held{bottom:92px}.btn b{font-size:18px}
 #invBody,#furnBody{max-height:44vh}.charRow canvas{width:60px;height:82px}
}
`;
function tap(e,fn){
  e.addEventListener("touchstart",ev=>{ev.preventDefault();ev.stopPropagation();fn();},{passive:false});
  e.addEventListener("mousedown",ev=>{ev.preventDefault();ev.stopPropagation();fn();});
}
function buildHUD(){
  const st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
  const b=document.body;
  el("div",{id:"clock"},b);el("div",{id:"info"},b);el("div",{id:"toast"},b);el("div",{id:"held"},b);el("div",{id:"hurt"},b);el("div",{id:"mflash"},b);
  el("div",{id:"sleepov",text:"Zzz… tidur"},b);el("i",{},el("div",{id:"mine"},b));
  const bars=el("div",{id:"bars"},b);for(const id of["cvArm","cvHp","cvFood"])el("canvas",{id,width:200,height:20},bars);
  const tbs=el("div",{id:"tbs"},b);
  el("button",{id:"tbInv",class:"tb",text:"🎒"},tbs);
  el("button",{id:"tbCam",class:"tb sec",text:"👤"},tbs);el("button",{id:"tbFly",class:"tb sec",text:"✈"},tbs);
  el("div",{id:"bAtk",class:"btn"},b).innerHTML="<b>⚔</b><small>Serang</small>";el("div",{id:"bDown",class:"btn"},b).innerHTML="<b>⬇</b><small>Turun</small>";
  $$("bBreak").innerHTML="<b>⛏</b><small>Hancur</small>";$$("bPlace").innerHTML="<b>🧱</b><small>Pasang</small>";$$("bJump").innerHTML="<b>⬆</b><small>Lompat</small>";
  // panel tas & racik
  const ip=el("div",{id:"invp",class:"panel hide"},b),ic=el("div",{class:"card wide"},ip),tb=el("div",{class:"tabs"},ic);
  el("button",{"data-t":"inv",text:"🎒 Tas"},tb);el("button",{"data-t":"craft",text:"🔨 Racik"},tb);el("button",{id:"invClose",text:"✕"},tb);
  el("div",{id:"invBody"},ic);el("div",{id:"invHot"},ic);
  ip.addEventListener("touchmove",e=>e.stopPropagation(),{passive:true});
  // panel tungku
  const fp=el("div",{id:"furn",class:"panel hide"},b),fc=el("div",{class:"card wide"},fp),ft=el("div",{class:"tabs"},fc);
  el("button",{class:"on",text:"🔥 Tungku",style:"cursor:default"},ft);el("button",{id:"furnClose",text:"✕"},ft);el("div",{id:"furnBody"},fc);
  fp.addEventListener("touchmove",e=>e.stopPropagation(),{passive:true});
  // panel mati
  const dp=el("div",{id:"death",class:"panel hide"},b),dc=el("div",{class:"card"},dp);
  el("h1",{text:"Kamu mati"},dc);el("p",{text:"Tenang, barang di tasmu tetap aman."},dc);el("button",{id:"respawn",text:"Hidup lagi"},dc);
  // menu awal
  const err=$$("err"),row=el("div",{id:"modeRow"});err.parentNode.insertBefore(row,err);
  for(const m of[["survival","⛏ Survival"],["creative","✨ Kreatif"]]){const x=el("button",{class:"alt","data-m":m[0],text:m[1]},row);x.addEventListener("click",()=>{setMode(m[0]);SFX.click();});}
  err.parentNode.insertBefore(el("p",{id:"modeDesc"}),err);
  const sb=el("button",{id:"sndBtn",class:"alt",text:""});err.parentNode.insertBefore(sb,$$("play"));
  const sbl=()=>{sb.textContent=S.sound?"🔊 Suara: hidup":"🔇 Suara: mati";};sbl();
  sb.addEventListener("click",()=>{S.sound=!S.sound;if(master)master.gain.value=S.sound?0.6:0;sbl();savePlayer();});
  $$("help").insertAdjacentHTML("beforeend",isTouch?"<li>🎒 tas & racik · 👤 ganti kamera · 🍖 makan</li><li>Pegang pistol di hotbar lalu tekan <b>Serang</b></li>":"<li>Klik kiri: serang/tembak/hancurkan · E: tas · C: racik · R: makan · T: kamera · V: terbang</li>");
}
function bindInput(){
  tap($$("tbInv"),()=>openInv("inv"));tap($$("tbFly"),toggleFly);tap($$("tbCam"),toggleCam);
  $$("invClose").addEventListener("click",()=>{SFX.click();closeInv();});
  $$("furnClose").addEventListener("click",()=>{SFX.click();closeFurn();});
  for(const b of document.querySelectorAll("#invp .tabs button[data-t]"))b.addEventListener("click",()=>{S.tab=b.dataset.t;SFX.click();renderInv();});
  $$("respawn").addEventListener("click",respawn);
  const atk=$$("bAtk");
  atk.addEventListener("touchstart",e=>{e.preventDefault();e.stopPropagation();atk.classList.add("on");S.atkHeld=true;},{passive:false});
  const ae=e=>{e.preventDefault();atk.classList.remove("on");S.atkHeld=false;};atk.addEventListener("touchend",ae);atk.addEventListener("touchcancel",ae);
  const dn=$$("bDown");
  dn.addEventListener("touchstart",e=>{e.preventDefault();e.stopPropagation();dn.classList.add("on");input.down=true;},{passive:false});
  const de=e=>{e.preventDefault();dn.classList.remove("on");input.down=false;};dn.addEventListener("touchend",de);dn.addEventListener("touchcancel",de);
  let lastJ=0;$$("bJump").addEventListener("touchstart",()=>{const t=performance.now();if(S.mode==="creative"&&t-lastJ<320)toggleFly();lastJ=t;},{passive:true});
  let lastSp=0;
  addEventListener("keydown",e=>{
    if(e.repeat)return;
    if(e.code==="KeyE"||e.code==="KeyC"){if(!$$("invp").classList.contains("hide"))closeInv();else if(!$$("furn").classList.contains("hide"))closeFurn();else openInv(e.code==="KeyC"?"craft":"inv");return;}
    if(!started)return;
    if(e.code==="Space"){const t=performance.now();if(S.mode==="creative"&&t-lastSp<300)toggleFly();lastSp=t;}
    else if(e.code==="KeyR")eat();else if(e.code==="KeyV")toggleFly();else if(e.code==="KeyF")attack();else if(e.code==="KeyT")toggleCam();
  });
  addEventListener("mouseup",e=>{if(e.button===0)mineUp();});
  $$("play").addEventListener("click",()=>{audioInit();SFX.click();try{const d=document.documentElement;if(d.requestFullscreen)d.requestFullscreen().catch(()=>{});}catch(e){}});
  for(const ev of["touchstart","mousedown","keydown"])addEventListener(ev,()=>{if(ac&&ac.state!=="running")ac.resume();},{capture:true,passive:true});
  addEventListener("pagehide",savePlayer);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)savePlayer();});
}
function init(){
  buildHUD();loadPlayer();initMobGL();bindInput();EX2.init();
  for(const k in edits){const b=edits[k];if(b>=41&&b<=44)crops.set(+k,(b-41)*35);}
  regVillage();updateDay();populate();initialBuild();setMode(S.mode);updateClock();updateHUD(true);
}
return{
  get flying(){return S.flying;},S,mobs:()=>mobs,
  api:{ARMOR,S,TYPES,NAMES,TOOL,FOOD,SMELT,FUEL,HARD,PLAIN,PD,RECIPES,CAT_IDS,CATS,PASSIVE,HOSTILEX,SFX,B,emitBox,makeMob,spawnAt,groundY,mhit,mobs:()=>mobs,setMobs:a=>{mobs=a;},
    give,take,count,hurtPlayer,hurtMob,killMob,pickMob,spat,tone,noise,toast,flash,updateHUD,refreshHotbar,renderInv,held,eyePos,iconCanvas,eatItem,armorPts,countType,nearTable,bestFood,
    ac:()=>ac,master:()=>master,noiseBuf:()=>noiseBuf,VIL:()=>VIL,
    pauseOn:()=>{S.paused=true;S.mining=false;mineUp();S.atkHeld=false;input.fx=input.fz=0;if(document.exitPointerLock)document.exitPointerLock();},pauseOff:()=>{S.paused=false;},savePlayer},
  init,pre,update,rebuild,near,drawMobs,tiles,ores,village:villageGen,partial,pHit,slide,cam,eye:eyePos,
  onBlock,canPlace,blockOf,useBlock,onSelect,
  placed:id=>{if(S.mode==="survival"){take(id,1);refreshHotbar();}},
  mineDown,mineUp,leftDown,newWorld,
  dbg:{spawn:(type,dist)=>{const a=P.yaw,x=P.x-Math.sin(a)*dist,z=P.z-Math.cos(a)*dist,gy=groundY(Math.floor(x),Math.floor(z));const m=makeMob(type,x,Math.max(gy,1)+0.02,z);mobs.push(m);return m;},
    give,hurtPlayer,attack,openInv,closeInv,openFurn,closeFurn,craft,RECIPES,eat,toggleFly,toggleCam,getF,NAMES,count,sleep,shoot,setBlock:(x,y,z,id)=>setBlock(x,y,z,id),furn,crops}
};
})();
