/* ===== datos ===== */
const sections=[
  {name:"Outfit",text:"Inspiración diaria para tus outfits favoritos. ¡Descubre nuevas combinaciones!",url:"outfit.html"},
  {name:"Fitness",text:"Consejos y motivación para mantenerte activo y saludable.",url:"fitness.html"},
  {name:"Vámonos",text:"Ideas para escapadas, eventos, celebraciones y más.",url:"vamonos.html"},
  {name:"Ocio",text:"Recomendaciones de películas, juegos y entretenimiento.",url:"ocio.html"},
  {name:"Ánima",text:"Mensajes motivacionales, horóscopos y bienestar emocional.",url:"anima.html"},
  {name:"Alimentación",text:"Consejos para una alimentación saludable, rica y fácil.",url:"alimentacion.html"}
 ];
 
 /* rotaciones fijas */
 const faceT={
   Outfit       :'rotateX(0deg) rotateY(0deg)',
   Fitness      :'rotateX(0deg) rotateY(180deg)',
   Vámonos      :'rotateX(0deg) rotateY(-90deg)',
   Ocio         :'rotateX(0deg) rotateY(90deg)',
   Ánima        :'rotateX(-90deg) rotateY(0deg)',
   Alimentación :'rotateX(90deg) rotateY(0deg)'
 };
 
 /* DOM */
 const cube=document.getElementById('cube');
 const title=document.getElementById('sectionTitle');
 const textEl=document.getElementById('sectionText');
 const faces=[...cube.querySelectorAll('.cube-face')];
 
 /* estado */
 let rotX=0,rotY=0,isDragging=false;
 let pauseTimer=null,longTimer=null;
 let lastSection=sections[0];
 
 /* helpers */
 function updateUI(sec){lastSection=sec;title.textContent=sec.name;textEl.textContent=sec.text;}
 function clearActive(){faces.forEach(f=>f.classList.remove('active'));}
 
 /* detecta la cara más frontal según rotX/rotY */
 function getFrontFace(){
   const nx=((rotX%360)+360)%360, ny=((rotY%360)+360)%360;
   const tol=45;
   for(const [name,tr] of Object.entries(faceT)){
     const m=tr.match(/rotateX\((-?\d+)deg\).*rotateY\((-?\d+)deg\)/);if(!m)continue;
     const rx=(+m[1]+360)%360, ry=(+m[2]+360)%360;
     if(Math.abs(rx-nx)<tol && Math.abs(ry-ny)<tol) return name;
   }
   return null;
 }
 
 /* pausa 6 s y muestra cara */
 function showFace(sec){
   cube.classList.add('paused');cube.style.animation='none';
   cube.style.transform=faceT[sec.name];
   clearActive();faces.find(f=>f.dataset.name===sec.name)?.classList.add('active');
   const m=faceT[sec.name].match(/rotateX\((-?\d+)deg\).*rotateY\((-?\d+)deg\)/);rotX=+m[1];rotY=+m[2];
   clearTimeout(pauseTimer);
   pauseTimer=setTimeout(()=>{
     cube.classList.remove('paused');cube.style.transform='';cube.style.animation='spin 15s linear infinite';clearActive();pauseTimer=null;
   },6000);
 }
 
 /* clic iconos */
 document.querySelectorAll('.scroll-buttons button').forEach((btn,i)=>btn.addEventListener('click',()=>{
   const sec=sections[i];updateUI(sec);showFace(sec);
 }));
 
 /* long‑press */
 function startLong(){
   if(longTimer||isDragging)return;
 
   clearActive();                     /* marca cara realmente visible */
   const face=getFrontFace();
   if(face) faces.find(f=>f.dataset.name===face)?.classList.add('active');
 
   cube.classList.add('loading');
   longTimer=setTimeout(()=>{
     cube.classList.remove('loading');
     cube.classList.add('done');
     setTimeout(()=>{window.location.href=lastSection.url;},300);
   },2000);
 }
 function cancelLong(){clearTimeout(longTimer);longTimer=null;cube.classList.remove('loading','done');}
 
 /* drag */
 let sX,sY;
 cube.addEventListener('pointerdown',e=>{
   cube.setPointerCapture(e.pointerId);
   sX=e.clientX;sY=e.clientY;isDragging=false;
   cube.classList.add('paused');cube.style.animation='none';
   startLong();
 });
 cube.addEventListener('pointermove',e=>{
   const dx=e.clientX-sX,dy=e.clientY-sY;
   if(Math.hypot(dx,dy)>5){
     isDragging=true;cancelLong();
     rotY+=dx*0.5;rotX-=dy*0.5;
     cube.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg)`;
     sX=e.clientX;sY=e.clientY;
   }
 });
 cube.addEventListener('pointerup',()=>{
   if(longTimer) cancelLong();
   cube.classList.remove('paused');
   cube.style.animation='spin 15s linear infinite';
 });
 
 /* bloqueo nativo */
 cube.addEventListener('contextmenu',e=>e.preventDefault());
 document.addEventListener('selectstart',e=>e.preventDefault());
 
 /* inicial */
 updateUI(sections[0]);faces[0].classList.add('active');
 