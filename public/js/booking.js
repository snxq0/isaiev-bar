// booking.js — генерирует карточки, фильтрует, открывает модалку и отправляет брони на сервер
const API_URL = "https://wib-admin.vercel.app/tables";
let tableStates = [];

const tablesGrid = document.getElementById('tables-grid');
const filterZone = document.getElementById('filter-zone');
const filterCapacity = document.getElementById('filter-capacity');
const filterAvailability = document.getElementById('filter-availability');
const resetFiltersBtn = document.getElementById('reset-filters');

const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalTableId = document.getElementById('modal-table-id');
const modalMaxCap = document.getElementById('modal-max-cap');
const bookingForm = document.getElementById('booking-form');

let currentTable = null;

// таблицы
const TABLES = [
{ id: 'C1', zone:'casual', capacity: 2 }, { id: 'C2', zone:'casual', capacity: 4 },
{ id: 'C3', zone:'casual', capacity: 6 }, { id: 'C4', zone:'casual', capacity: 4 },
{ id: 'C5', zone:'casual', capacity: 3 }, { id: 'C6', zone:'casual', capacity: 8 },
{ id: 'C7', zone:'casual', capacity: 2 }, { id: 'C8', zone:'casual', capacity: 6 },
{ id: 'C9', zone:'casual', capacity: 5 }, { id: 'C10', zone:'casual', capacity: 4 },
{ id: 'C11', zone:'casual', capacity: 7 }, { id: 'C12', zone:'casual', capacity: 8 },
{ id: 'L1', zone:'chill', capacity: 6 }, { id: 'L2', zone:'chill', capacity: 8 },
{ id: 'L3', zone:'chill', capacity: 10 }, { id: 'L4', zone:'chill', capacity: 6 },
{ id: 'L5', zone:'chill', capacity: 9 }, { id: 'W1', zone:'wib', capacity: 10 },
{ id: 'W2', zone:'wib', capacity: 12 }, { id: 'W3', zone:'wib', capacity: 16 },
{ id: 'W4', zone:'wib', capacity: 8 }, { id: 'W5', zone:'wib', capacity: 20 }
];

async function loadTableStates() {
  try {
    const res = await fetch(API_URL);
    tableStates = await res.json();
  } catch (err) {
    console.error("Не удалось загрузить столы", err);
  }
}

function isTableBooked(tableId){
  return tableStates[tableId] !== "free";
}

function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function descForZone(zone){
if(zone==='casual') return 'Gemütliche Tische für Freunde und Treffen';
if(zone==='chill') return 'Weiche Sofas, Hookah und Lounge-Atmosphäre';
if(zone==='wib') return 'Private Roundtables für Unternehmen';
return '';
}

function renderTables(){
tablesGrid.innerHTML = '';
const zoneFilter = filterZone.value;
const capFilter = filterCapacity.value;
const availabilityFilter = filterAvailability.value;

TABLES.forEach(t => {
if(zoneFilter !== 'all' && t.zone !== zoneFilter) return;

if(capFilter !== 'all'){
const [min,max] = capFilter.split('-');
if(max) {
if(!(t.capacity >= parseInt(min) && t.capacity <= parseInt(max))) return;
} else {
if(!(t.capacity >= parseInt(min))) return;
}
}

if(availabilityFilter !== 'all'){
const booked = isTableBooked(t.id);
if(availabilityFilter === 'free' && booked) return;
if(availabilityFilter === 'busy' && !booked) return;
}

const card = document.createElement('article');
card.className = 'table-card';
card.setAttribute('data-id', t.id);

const header = document.createElement('div');
header.className = 'row';
header.innerHTML = `<div class="table-id">${t.id}</div>
                <div class="badge ${isTableBooked(t.id) ? 'status busy' : 'status free'}">${isTableBooked(t.id) ? 'Besetzt' : 'Frei'}</div>`;
card.appendChild(header);

const info = document.createElement('div');
info.className = 'table-info';
info.innerHTML = `<div class="small">Zone: <strong>${capitalize(t.zone)}</strong></div>
              <div class="small">Kapazität: <strong>${t.capacity}</strong></div>
              <div class="small" style="margin-top:8px">Beschreibung: ${descForZone(t.zone)}</div>`;
card.appendChild(info);

const actions = document.createElement('div');
actions.className = 'actions';
const btn = document.createElement('button');
btn.className = 'book-btn';
btn.textContent = isTableBooked(t.id) ? 'Besetzt' : 'Reservieren';
btn.disabled = isTableBooked(t.id);
btn.addEventListener('click', () => openModal(t));
actions.appendChild(btn);
card.appendChild(actions);

tablesGrid.appendChild(card);
});
}

/* ---------- modal logic ---------- */

function openModal(tableObj){
currentTable = tableObj;
modal.setAttribute('aria-hidden','false');
modal.style.display = 'flex';
modalTableId.textContent = tableObj.id;
modalMaxCap.textContent = tableObj.capacity;
document.getElementById('b-guests').max = tableObj.capacity;
document.getElementById('b-guests').value = Math.min(1, tableObj.capacity);
bookingForm.style.display = 'block'; // показываем форму
setTimeout(()=> document.getElementById('b-name').focus(), 100);
}

function closeModal(){
modal.setAttribute('aria-hidden','true');
modal.style.display = 'none';
bookingForm.reset();
currentTable = null;
}

/* show confirmation inside modal */
function showConfirmation(booking){
bookingForm.style.display = 'none';
modal.querySelector('.modal-panel').insertAdjacentHTML('beforeend', `
<div id="confirmation" style="padding:20px; text-align:center;">
<h2 style="color:#007bff;">Bestätigt!</h2>
<p>Danke, ${booking.name}!</p>
<p><strong>Tisch:</strong> ${booking.tableId}</p>
<p><strong>Datum und Uhrzeit:</strong> ${booking.datetime}</p>
<p><strong>Gäste:</strong> ${booking.guests}</p>
<button id="modal-close-confirm" class="btn" style="margin-top:15px;">Schließen</button>
</div>
`);

document.getElementById('modal-close-confirm').addEventListener('click', () => {
document.getElementById('confirmation').remove();
closeModal();
});
}

/* submit booking */
bookingForm.addEventListener('submit', async (e) => {
e.preventDefault();
if(!currentTable) return alert('Wählen Sie bitte den Tisch.');

const name = document.getElementById('b-name').value.trim();
const phone = document.getElementById('b-phone').value.trim();
const email = document.getElementById('b-email').value.trim();
const datetime = document.getElementById('b-datetime').value;
const guests = parseInt(document.getElementById('b-guests').value, 10);

if(!name || !phone || !datetime || !guests) return alert('Alle felder müssen ausgefüllt werden!');

const booking = { id: `${currentTable.id}_${Date.now()}`, tableId: currentTable.id, name, phone, email, datetime, guests, createdAt: new Date().toISOString() };

bookings.push(booking);
localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

// отправка на serverless API
try {
const res = await fetch("/api/sendBooking", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ tableId: currentTable.id, name, phone, email, datetime, guests })
});
const result = await res.json();
console.log(result);
} catch (err) {
console.error(err);
}

// показываем confirmation прямо в модалке
showConfirmation(booking);
renderTables();
});

/* close handlers */
modalClose.addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
window.addEventListener('keydown', (e)=> { if(e.key==='Escape') closeModal(); });
modal.addEventListener('click', (e)=> { if(e.target===modal) closeModal(); });

/* filters */
filterZone.addEventListener('change', renderTables);
filterCapacity.addEventListener('change', renderTables);
filterAvailability.addEventListener('change', renderTables);
resetFiltersBtn.addEventListener('click', ()=>{
filterZone.value = 'all';
filterCapacity.value = 'all';
filterAvailability.value = 'all';
renderTables();
});

(async () => {
  await loadTableStates();
  renderTables();
})();
