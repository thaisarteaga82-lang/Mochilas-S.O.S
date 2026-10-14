(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const STORAGE = { checks: 'mosos-checks-v2', type: 'mosos-person-v2', notes: 'mosos-notes-v2', places: 'mosos-places-v2', contacts: 'mosos-contacts-v2' };
  const defaultItems = [
    {id:'water',name:'Agua potable',detail:'Agua para beber; revisa y renueva con frecuencia',groups:['adulto','nino','bebe','adultomayor','mascota']},
    {id:'food',name:'Alimentos no perecederos',detail:'Opciones fáciles de transportar y adecuadas para la familia',groups:['adulto','nino','bebe','adultomayor','mascota']},
    {id:'light',name:'Linterna y pilas',detail:'Comprueba que funcionen',groups:['adulto','nino','bebe','adultomayor','mascota']},
    {id:'radio',name:'Radio portátil',detail:'Para escuchar información oficial si fallan las comunicaciones',groups:['adulto','nino','bebe','adultomayor']},
    {id:'firstaid',name:'Botiquín básico',detail:'Material de primeros auxilios e instrucciones de uso',groups:['adulto','nino','bebe','adultomayor','mascota']},
    {id:'documents',name:'Documentos importantes',detail:'Copias protegidas de documentos y contactos',groups:['adulto','nino','bebe','adultomayor']},
    {id:'charger',name:'Cargador y batería portátil',detail:'Mantén los dispositivos cargados',groups:['adulto','nino','adultomayor']},
    {id:'hygiene',name:'Higiene personal',detail:'Jabón, papel higiénico, toallitas y bolsas',groups:['adulto','nino','bebe','adultomayor']},
    {id:'clothes',name:'Ropa de cambio y abrigo',detail:'Prendas cómodas, según clima y necesidades',groups:['adulto','nino','bebe','adultomayor','mascota']},
    {id:'cash',name:'Dinero en efectivo y llaves',detail:'Guarda una cantidad pequeña y llaves de repuesto',groups:['adulto','adultomayor']},
    {id:'mask',name:'Mascarillas y protección',detail:'Según las recomendaciones sanitarias locales',groups:['adulto','nino','adultomayor']},
    {id:'baby',name:'Pañales, leche y artículos del bebé',detail:'Incluye solo los productos adecuados para tu bebé',groups:['bebe']},
    {id:'comfort',name:'Artículo de consuelo y datos del cuidador',detail:'Identificación y necesidades específicas del niño o niña',groups:['nino','bebe']},
    {id:'mobility',name:'Ayudas personales',detail:'Lentes, audífonos, baterías o ayudas para movilidad',groups:['adultomayor']},
    {id:'petfood',name:'Comida, agua y recipiente para mascota',detail:'Suministro apropiado para tu animal',groups:['mascota']},
    {id:'petlead',name:'Correa, transportadora e identificación',detail:'Añade bolsas y datos del veterinario',groups:['mascota']},
    {id:'petrecords',name:'Registro y medicación veterinaria',detail:'Envases e indicaciones del veterinario',groups:['mascota']}
  ];
  const labels = { adulto:'Adulto', nino:'Niño o niña', bebe:'Bebé', adultomayor:'Adulto mayor', mascota:'Mascota' };
  const safeRead = (key, fallback) => { try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } };
  const safeWrite = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  let currentView = 'inicio'; let lastCoords = null; let toastTimer;
  function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600); }
  function navigate(view) {
    if (!labels && !['inicio','mochila','mapa','ubicacion','alertas'].includes(view)) return;
    currentView = view;
    $$('.view').forEach(el => { const active = el.dataset.view === view; el.hidden = !active; el.classList.toggle('active', active); });
    $$('.nav-item').forEach(el => { const active = el.dataset.go === view; el.classList.toggle('active', active); if (active) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current'); });
    $('#mainContent').scrollTop = 0; window.scrollTo({top:0,behavior:'auto'}); $('#mainContent').focus({preventScroll:true});
  }
  document.addEventListener('click', e => { const target = e.target.closest('[data-go]'); if (target) navigate(target.dataset.go); });

  const personSelect = $('#personType'); personSelect.value = safeRead(STORAGE.type, 'adulto');
  function renderChecklist() {
    const type = personSelect.value; safeWrite(STORAGE.type, type);
    const checks = safeRead(STORAGE.checks, {}); const items = defaultItems.filter(item => item.groups.includes(type));
    $('#checklist').innerHTML = items.map(item => `<label class="check-row ${checks[type + ':' + item.id] ? 'checked' : ''}"><input type="checkbox" data-check="${item.id}" ${checks[type + ':' + item.id] ? 'checked' : ''}><span><strong>${item.name}</strong><small>${item.detail}</small></span></label>`).join('');
    updateProgress();
  }
  function updateProgress() {
    const type = personSelect.value; const checks = safeRead(STORAGE.checks, {}); const items = defaultItems.filter(item => item.groups.includes(type)); const done = items.filter(item => checks[type + ':' + item.id]).length; const percent = items.length ? Math.round(done / items.length * 100) : 0;
    $('#progressText').textContent = `${done} de ${items.length} artículos listos`; $('#progressPercent').textContent = `${percent}%`; $('#progressBar').style.width = percent + '%';
    $$('.check-row').forEach(row => row.classList.toggle('checked', $('input', row).checked));
  }
  personSelect.addEventListener('change', renderChecklist);
  $('#checklist').addEventListener('change', e => { if (!e.target.matches('[data-check]')) return; const checks = safeRead(STORAGE.checks, {}); checks[personSelect.value + ':' + e.target.dataset.check] = e.target.checked; safeWrite(STORAGE.checks, checks); updateProgress(); });
  $('#resetChecklist').addEventListener('click', () => { const checks = safeRead(STORAGE.checks, {}); defaultItems.filter(item => item.groups.includes(personSelect.value)).forEach(item => delete checks[personSelect.value + ':' + item.id]); safeWrite(STORAGE.checks, checks); renderChecklist(); toast('Lista desmarcada.'); });
  $('#specialNotes').value = safeRead(STORAGE.notes, '');
  $('#saveNotes').addEventListener('click', () => { const ok = safeWrite(STORAGE.notes, $('#specialNotes').value); $('#notesStatus').textContent = ok ? 'Notas guardadas en este dispositivo.' : 'No se pudieron guardar las notas en este navegador.'; });

  function renderPlaces() { const places = safeRead(STORAGE.places, []); $('#savedPlaces').innerHTML = places.length ? places.map((p,i) => `<div class="saved-item"><div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.type)} · referencia personal no verificada</small></div><button class="delete-button" data-delete-place="${i}" aria-label="Eliminar ${escapeHtml(p.name)}">Eliminar</button></div>`).join('') : '<p class="small-status">Todavía no has añadido referencias.</p>'; }
  function renderContacts() { const contacts = safeRead(STORAGE.contacts, []); $('#contactsList').innerHTML = contacts.length ? contacts.map((c,i) => `<div class="contact-item"><div><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.phone)}</small></div><button class="delete-button" data-delete-contact="${i}" aria-label="Eliminar contacto ${escapeHtml(c.name)}">Eliminar</button></div>`).join('') : '<p class="small-status">Todavía no has guardado contactos.</p>'; }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  $('#placeForm').addEventListener('submit', e => { e.preventDefault(); const places = safeRead(STORAGE.places, []); places.push({name:$('#placeName').value.trim(),type:$('#placeType').value}); safeWrite(STORAGE.places, places); e.target.reset(); renderPlaces(); toast('Referencia guardada en este dispositivo.'); });
  $('#savedPlaces').addEventListener('click', e => { const btn = e.target.closest('[data-delete-place]'); if (!btn) return; const places = safeRead(STORAGE.places, []); places.splice(Number(btn.dataset.deletePlace),1); safeWrite(STORAGE.places, places); renderPlaces(); });
  $('#contactForm').addEventListener('submit', e => { e.preventDefault(); const contacts = safeRead(STORAGE.contacts, []); contacts.push({name:$('#contactName').value.trim(),phone:$('#contactPhone').value.trim()}); safeWrite(STORAGE.contacts, contacts); e.target.reset(); renderContacts(); toast('Contacto guardado en este dispositivo.'); });
  $('#contactsList').addEventListener('click', e => { const btn = e.target.closest('[data-delete-contact]'); if (!btn) return; const contacts = safeRead(STORAGE.contacts, []); contacts.splice(Number(btn.dataset.deleteContact),1); safeWrite(STORAGE.contacts, contacts); renderContacts(); });

  function formatCoords(pos) { const {latitude, longitude, accuracy} = pos.coords; lastCoords = {latitude,longitude,accuracy}; $('#coordinates').hidden = false; $('#coordinates').textContent = `${latitude.toFixed(6)}, ${longitude.toFixed(6)} · precisión aproximada ${Math.round(accuracy)} m`; $('#locationStatus').textContent = 'Ubicación obtenida. Revisa las coordenadas antes de compartirlas.'; $('#shareLocation').disabled = false; $('#copyLocation').disabled = false; }
  $('#getLocation').addEventListener('click', () => { if (!('geolocation' in navigator)) { $('#locationStatus').textContent = 'Este navegador no ofrece geolocalización.'; return; } $('#locationStatus').textContent = 'Solicitando permiso de ubicación…'; navigator.geolocation.getCurrentPosition(formatCoords, err => { const msgs = {1:'No se concedió permiso. Puedes habilitarlo en los ajustes del navegador.',2:'No se pudo determinar la ubicación. Comprueba la conexión y el GPS.',3:'La solicitud tardó demasiado. Inténtalo de nuevo.'}; $('#locationStatus').textContent = msgs[err.code] || 'No se pudo obtener la ubicación.'; }, {enableHighAccuracy:true,timeout:15000,maximumAge:30000}); });
  $('#shareLocation').addEventListener('click', async () => { if (!lastCoords) return; const url = `https://www.google.com/maps?q=${lastCoords.latitude},${lastCoords.longitude}`; const text = `Mi ubicación: ${lastCoords.latitude.toFixed(6)}, ${lastCoords.longitude.toFixed(6)}\n${url}`; if (navigator.share) { try { await navigator.share({title:'Mi ubicación - Mochila S.O.S.',text,url}); } catch (e) { if (e.name !== 'AbortError') toast('No se pudo abrir la opción para compartir.'); } } else { try { await navigator.clipboard.writeText(text); toast('Enlace de ubicación copiado.'); } catch { window.prompt('Copia este enlace de ubicación:', text); } } });
  $('#copyLocation').addEventListener('click', async () => { if (!lastCoords) return; const text = `${lastCoords.latitude.toFixed(6)}, ${lastCoords.longitude.toFixed(6)}`; try { await navigator.clipboard.writeText(text); toast('Coordenadas copiadas.'); } catch { window.prompt('Copia las coordenadas:', text); } });
  renderChecklist(); renderPlaces(); renderContacts(); navigate('inicio');
})();
