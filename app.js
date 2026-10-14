const data={
bebe:{title:"Mochila para bebé",desc:"Artículos básicos adaptados a su edad y necesidades.",tip:"Guarda la fórmula infantil habitual que el bebé ya consume. Consulta a su pediatra para necesidades específicas.",items:["Fórmula infantil habitual","Biberón o utensilios habituales limpios","Agua segura, según indicación para su preparación","Pañales suficientes","Higiene: toallitas húmedas, crema protectora habitual y bolsas para pañales usados","Ropa limpia y adecuada al clima","Manta ligera","Medicamentos personales indicados"]},
nino:{title:"Mochila para niño",desc:"Considera edad, alergias, necesidades especiales y duración de la evacuación.",tip:"Incluye alimentos que ya consume y que sean apropiados para su edad; revisa alergias y restricciones alimentarias.",items:["Agua potable","Alimentos no perecibles apropiados para su edad","Ropa de cambio y abrigo","Higiene: cepillo y pasta dental, jabón, papel higiénico y toallitas","Documento o tarjeta con contactos de emergencia","Linterna pequeña","Objeto de consuelo o entretenimiento","Medicamentos personales indicados"]},
adolescente:{title:"Mochila para adolescente",desc:"Elementos para mantenerse hidratado, identificado y preparado.",tip:"Asegúrate de que conozca el plan familiar, los contactos y el punto de encuentro.",items:["Agua potable","Alimentos no perecibles","Ropa de cambio y abrigo","Linterna y pilas","Batería portátil y cable","Documento o copia de identificación","Higiene: cepillo y pasta dental, jabón, desodorante, papel higiénico y productos menstruales si los necesita","Medicamentos personales indicados"]},
adulto:{title:"Mochila para adulto",desc:"Suministros básicos y artículos personales importantes.",tip:"Revisa la mochila periódicamente y adapta el contenido al clima, los riesgos locales y las necesidades del hogar.",items:["Agua potable","Alimentos no perecibles","Botiquín básico de primeros auxilios","Linterna y pilas","Radio portátil, si tienes una","Copia de documentos importantes en bolsa impermeable","Higiene: cepillo y pasta dental, jabón, desodorante, papel higiénico y artículos personales","Medicamentos personales indicados"]},
mayor:{title:"Mochila para adulto mayor",desc:"Prioriza accesibilidad, tratamientos habituales y ayudas personales.",tip:"Guarda una lista actualizada de medicamentos y necesidades. Comprueba que los artículos sean fáciles de alcanzar.",items:["Agua potable y alimentos adecuados","Lista de tratamientos y medicamentos personales indicados","Lentes, audífonos u otras ayudas personales","Ayuda para caminar, si la utiliza","Ropa cómoda y abrigo","Documentos y contactos de emergencia","Higiene: artículos dentales, jabón, toallitas y pañales para adultos si los necesita","Linterna fácil de manejar"]},
mascota:{title:"Mochila para mascota",desc:"Adapta el contenido a la especie, tamaño, salud y duración de la evacuación.",tip:"Guarda el alimento habitual, una foto reciente y una identificación. Los medicamentos deben ser indicados por su veterinario.",items:["Alimento habitual de la mascota","Agua y recipiente plegable","Correa, arnés o transportadora","Higiene: bolsas para desechos, paños y material absorbente apropiado para la especie","Placa de identificación y datos del responsable","Foto reciente y registro de vacunas, si está disponible","Manta o elemento familiar","Medicamentos personales indicados por su veterinario"]}
};
const medData={
bebe:["Bebé","Incluye únicamente los medicamentos que su pediatra haya indicado para ese bebé y conserva las instrucciones profesionales junto al producto."],
nino:["Niño","Consulta al pediatra o farmacéutico sobre qué medicamentos son apropiados para su edad y peso. No calcules dosis por tu cuenta."],
adolescente:["Adolescente","Guarda los tratamientos personales prescritos y sigue sus indicaciones. No compartas medicamentos con otras personas."],
adulto:["Adulto","Prepara los tratamientos habituales prescritos y una lista actualizada. Revisa vencimientos y condiciones de conservación."],
mayor:["Adulto mayor","Mantén una lista de tratamientos, horarios y alergias; consulta a un profesional para prevenir errores e interacciones."],
mascota:["Mascota","Incluye solo tratamientos indicados por un veterinario. No administres medicamentos humanos por tu cuenta."]};
const KEY="mochilaSOS_v2";let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||"{}")}catch{}
let cat="bebe",med="bebe",coordsNow=null;const $=id=>document.getElementById(id);
function persist(){try{localStorage.setItem(KEY,JSON.stringify(saved))}catch{}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(s){const t=$("toast");t.textContent=s;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2600)}
function renderList(){const d=data[cat],checked=saved.checks?.[cat]||[];$("listTitle").textContent=d.title;$("listDesc").textContent=d.desc;$("tipText").textContent=d.tip;$("items").innerHTML=d.items.map((s,i)=>`<label class="item ${checked.includes(i)?"checked":""}"><input type="checkbox" data-i="${i}" ${checked.includes(i)?"checked":""}><span>${esc(s)}</span></label>`).join("");document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("active",b.dataset.cat===cat));$("count").textContent=`${checked.length} / ${d.items.length}`;$("progressBar").style.width=`${checked.length/d.items.length*100}%`}
$("tabs").addEventListener("click",e=>{let b=e.target.closest("[data-cat]");if(b){cat=b.dataset.cat;renderList()}});
$("items").addEventListener("change",e=>{if(!e.target.matches("input"))return;saved.checks=saved.checks||{};saved.checks[cat]=saved.checks[cat]||[];let i=+e.target.dataset.i;saved.checks[cat]=e.target.checked?[...new Set([...saved.checks[cat],i])]:saved.checks[cat].filter(n=>n!==i);persist();renderList()});
$("clear").addEventListener("click",()=>{saved.checks=saved.checks||{};saved.checks[cat]=[];persist();renderList();toast("Lista desmarcada.")});
$("save").addEventListener("click",()=>{persist();$("savedMsg").textContent="Progreso guardado en este dispositivo.";toast("Progreso guardado.")});
function renderMed(){const d=medData[med];$("medTitle").textContent=d[0];$("medText").textContent=d[1];document.querySelectorAll("#medTabs button").forEach(b=>b.classList.toggle("active",b.dataset.med===med));}
$("medTabs").addEventListener("click",e=>{let b=e.target.closest("[data-med]");if(b){med=b.dataset.med;renderMed()}});
$("goMeds").addEventListener("click",()=>{med=cat;renderMed();$("medicamentos").scrollIntoView({behavior:"smooth"})});
$("menuToggle").addEventListener("click",()=> $("nav").classList.toggle("open"));document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>$("nav").classList.remove("open")));
function renderPlaces(){let ps=saved.places||[];$("places").innerHTML=ps.length?ps.map((p,i)=>`<div class="place"><i class="mark" style="background:${p.type==="safe"?"#249b58":"#f0182b"}"></i><div><strong>${esc(p.name)}</strong><small>${p.type==="safe"?"Punto seguro / encuentro":"Zona de riesgo por verificar"}${p.note?" · "+esc(p.note):""}</small></div><button data-del="${i}" aria-label="Eliminar lugar">×</button></div>`).join(""):'<p class="muted">Todavía no hay lugares guardados.</p>'}
$("placeForm").addEventListener("submit",e=>{e.preventDefault();saved.places=saved.places||[];saved.places.push({name:$("placeName").value.trim(),type:$("placeType").value,note:$("placeNote").value.trim()});persist();renderPlaces();e.target.reset();toast("Lugar guardado en este dispositivo.")});
$("places").addEventListener("click",e=>{let b=e.target.closest("[data-del]");if(!b)return;saved.places.splice(+b.dataset.del,1);persist();renderPlaces()});
function getPos(success){if(!navigator.geolocation){toast("Este navegador no admite geolocalización.");return}navigator.geolocation.getCurrentPosition(success,err=>toast(err.code===1?"Permiso de ubicación denegado.":"No se pudo obtener la ubicación. Inténtalo otra vez."),{enableHighAccuracy:true,timeout:15000,maximumAge:60000})}
function setCoords(pos){coordsNow={lat:pos.coords.latitude,lon:pos.coords.longitude};$("coordinates").textContent=`${coordsNow.lat.toFixed(6)}, ${coordsNow.lon.toFixed(6)}`;$("accuracy").textContent=`Precisión estimada: ±${Math.round(pos.coords.accuracy)} metros`;$("locStatus").textContent="Ubicación obtenida. Revisa con quién la compartes."; $("copyLocation").disabled=false;$("shareLocation").disabled=false}
$("getLocation").addEventListener("click",()=>{$("locStatus").textContent="Solicitando permiso de ubicación…";getPos(setCoords)});
$("copyLocation").addEventListener("click",async()=>{if(!coordsNow)return;let s=`${coordsNow.lat}, ${coordsNow.lon}`;try{await navigator.clipboard.writeText(s);toast("Coordenadas copiadas.")}catch{toast(s)}});
$("shareLocation").addEventListener("click",async()=>{if(!coordsNow)return;let url=`https://maps.google.com/?q=${coordsNow.lat},${coordsNow.lon}`;if(navigator.share){try{await navigator.share({title:"Mi ubicación - Mochila S.O.S.",url})}catch{}}else{try{await navigator.clipboard.writeText(url);toast("Enlace de ubicación copiado.")}catch{toast(url)}}});
$("centerMap").addEventListener("click",()=>getPos(pos=>{let lat=pos.coords.latitude,lon=pos.coords.longitude;$("mapFrame").src=`https://www.openstreetmap.org/export/embed.html?bbox=${lon-.012}%2C${lat-.008}%2C${lon+.012}%2C${lat+.008}&layer=mapnik&marker=${lat}%2C${lon}`;toast("Mapa centrado en tu ubicación.")}));
renderList();renderMed();renderPlaces();

// Navegación de pantallas independientes: no se muestra toda la aplicación en una sola página.
function showView(name){
  const target=document.querySelector(`.view[data-view="${name}"]`);
  if(!target)return;
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v===target));
  document.querySelectorAll('[data-view-link]').forEach(b=>{
    const active=b.dataset.viewLink===name;
    b.classList.toggle('active',active);
    if(b.matches('button')) b.setAttribute('aria-current',active?'page':'false');
  });
  document.body.classList.toggle('view-home',name==='inicio');
  history.replaceState(null,'','#'+name);
  window.scrollTo({top:0,behavior:'instant'});
  const nav=$('nav'); if(nav) nav.classList.remove('open');
}
document.querySelectorAll('[data-view-link]').forEach(el=>el.addEventListener('click',e=>{
  e.preventDefault(); showView(el.dataset.viewLink);
}));
function initialView(){
  const key=(location.hash||'#inicio').slice(1);
  const view=['inicio','mochila','mapa','ubicacion','alertas'].includes(key)?key:'inicio';
  showView(view);
}
initialView();
