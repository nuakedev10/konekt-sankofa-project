// ═══════════════════════════════════════════
// KONEKT BY SANKOFA — App Logic
// ═══════════════════════════════════════════

// ── State ──────────────────────────────────
const state = {
  currentScreen: 'screen-splash',
  currentStep: 1,
  lang: 'en',
  vehicle: 'moto',
  payment: 'mtn',
  destination: 'Kimironko Market',
  distance: '4.2 km',
  fare: { base: 500, perKm: 150, total: 1130 },
  countdownInterval: null,
};

const translations = {
  en: {
    greeting: 'Mwaramutse, Keza 👋',
    greetingSub: 'Where are you headed today?',
    searchPlaceholder: 'Where do you want to go?',
    btnStart: 'Get Started',
    btnLogin: 'I Have an Account',
  },
  rw: {
    greeting: 'Mwaramutse, Keza 👋',
    greetingSub: 'Ujya he none uyu munsi?',
    searchPlaceholder: 'Ujya he?',
    btnStart: 'Tangira',
    btnLogin: 'Mfite konti',
  },
};

// ── Clock ───────────────────────────────────
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2,'0');
  const m = now.getMinutes().toString().padStart(2,'0');
  const el = document.getElementById('status-time');
  if (el) el.textContent = `${h}:${m}`;
}
setInterval(updateClock, 10000);
updateClock();

// ── Navigation ──────────────────────────────
function goto(screenId) {
  if (state.currentScreen === screenId) return;
  const prev = document.getElementById(state.currentScreen);
  const next = document.getElementById(screenId);
  if (!next) return;
  if (prev) prev.classList.remove('active');
  next.classList.add('active');
  state.currentScreen = screenId;

  // Side effects per screen
  if (screenId === 'screen-booking') {
    gotoStep(state.currentStep || 1);
  }
  if (screenId === 'screen-tracking') {
    startCountdown();
  }
}

// ── Booking Steps ───────────────────────────
function gotoStep(step) {
  goto('screen-booking');
  state.currentStep = step;

  // Update step indicators
  [1,2,3].forEach(i => {
    const dot = document.getElementById(`sd${i}`);
    const line = document.getElementById(`sl${i}`);
    if (!dot) return;
    dot.className = 'step-dot';
    if (i < step)      { dot.classList.add('done'); dot.textContent = '✓'; }
    else if (i === step){ dot.classList.add('active'); dot.textContent = i; }
    else               { dot.textContent = i; }
    if (line && i < step) line.classList.add('done');
    else if (line)        line.classList.remove('done');
  });

  const titles = { 1: 'Choose Route', 2: 'Your Fixed Fare', 3: 'Driver Matched' };
  const el = document.getElementById('booking-title');
  if (el) el.textContent = titles[step];

  const body = document.getElementById('booking-body');
  if (!body) return;

  if (step === 1) body.innerHTML = renderStep1();
  if (step === 2) body.innerHTML = renderStep2();
  if (step === 3) body.innerHTML = renderStep3();

  body.classList.add('fade-in');
  setTimeout(() => body.classList.remove('fade-in'), 400);
}

// ── Step 1: Route ───────────────────────────
function renderStep1() {
  const isBus = state.vehicle === 'bus';
  return `
    <div class="loc-card">
      <div class="loc-row">
        <div class="loc-dot pickup"></div>
        <div class="loc-text">
          <div class="loc-label">Pickup Location</div>
          <div class="loc-value" id="pickup-val">Kigali Innovation City, Gasabo ✓</div>
        </div>
        <span class="loc-action">Change</span>
      </div>
      <div class="loc-row" onclick="openPanel('panel-destination')">
        <div class="loc-dot drop"></div>
        <div class="loc-text">
          <div class="loc-label">Drop-off</div>
          <div class="loc-value" id="dropoff-val">${state.destination}</div>
        </div>
        <span class="loc-action">✏️</span>
      </div>
    </div>

    <button class="gps-btn" onclick="detectGPS()">
      📍 &nbsp;Use My Location (GPS Auto-Detect)
    </button>

    <div class="map-preview">
      <div class="map-grid-bg"></div>
      <div class="map-pin-preview">📍</div>
    </div>

    <p class="section-label" style="margin-bottom:10px">Choose Vehicle Type</p>
    <div class="vehicle-picker">
      <div class="vehicle-card ${!isBus ? 'selected' : ''}" id="v-moto" onclick="selectVehicle('moto')">
        <div class="v-emoji">🏍️</div>
        <div class="v-name">Moto</div>
        <div class="v-sub">1–2 passengers</div>
        <div class="v-price">From 500 RWF</div>
      </div>
      <div class="vehicle-card ${isBus ? 'selected' : ''}" id="v-bus" onclick="selectVehicle('bus')">
        <div class="v-emoji">🚌</div>
        <div class="v-name">Bus</div>
        <div class="v-sub">Shared ride</div>
        <div class="v-price">From 350 RWF</div>
      </div>
    </div>

    <button class="btn-primary btn-full" onclick="gotoStep(2)">
      → &nbsp;View Fare Breakdown
    </button>
  `;
}

// ── Step 2: Fare ────────────────────────────
function renderStep2() {
  computeFare();
  const f = state.fare;
  const isBus = state.vehicle === 'bus';
  const modifier = isBus ? '×0.7 (shared)' : '×1.0 (solo)';
  const platform = Math.round(f.total * 0.12);

  document.getElementById('payment-total').textContent = `${f.total.toLocaleString()} RWF`;
  document.getElementById('receipt-total').textContent = `${f.total.toLocaleString()} RWF`;
  document.getElementById('receipt-vehicle').textContent = isBus ? 'Bus (shared)' : 'Moto';
  document.getElementById('success-dest').textContent = state.destination;

  return `
    <div class="fare-card">
      <h3>💰 Your Fare Breakdown</h3>
      <div class="fare-row"><span class="fl">Base fare (dispatch)</span><span class="fv">500 RWF</span></div>
      <div class="fare-row"><span class="fl">Distance · ${state.distance} × 150 RWF</span><span class="fv">${(parseFloat(state.distance) * 150).toFixed(0)} RWF</span></div>
      <div class="fare-row"><span class="fl">Vehicle modifier (${state.vehicle})</span><span class="fv">${modifier}</span></div>
      <div class="fare-row"><span class="fl">Platform fee (12%)</span><span class="fv">${platform} RWF</span></div>
      <div class="fare-row total"><span class="fl">You Pay</span><span class="fv">${f.total.toLocaleString()} RWF</span></div>
    </div>

    <div class="eta-bar">
      <div class="eta-item"><span class="eta-big">3</span><span class="eta-sm">min to driver</span></div>
      <div class="eta-item"><span class="eta-big">12</span><span class="eta-sm">min journey</span></div>
      <div class="eta-item"><span class="eta-big">${state.distance}</span><span class="eta-sm">km total</span></div>
    </div>

    <div class="fixed-note">✅ This fare is fixed. It will not change once you book.</div>

    <button class="btn-primary btn-full" onclick="gotoStep(3)" style="margin-bottom:10px">
      🔒 &nbsp;Confirm Fare &amp; Match Driver
    </button>
    <button class="btn-outline btn-full" onclick="gotoStep(1)">← Change Route</button>
  `;
}

// ── Step 3: Driver ───────────────────────────
function renderStep3() {
  return `
    <div style="text-align:center;padding:10px 0 16px">
      <div style="font-size:14px;color:var(--muted)">Driver matched ✅</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">Gasabo Riders' Cooperative · Reg. 2021</div>
    </div>

    <div class="driver-card fade-in">
      <div class="driver-top">
        <div class="driver-av-wrap">JP</div>
        <div>
          <div class="driver-name">Jean-Pierre Habimana</div>
          <div class="driver-coop">Gasabo Riders' Cooperative</div>
          <div class="stars-row">
            <span class="star-s">★</span><span class="star-s">★</span><span class="star-s">★</span>
            <span class="star-s">★</span><span class="star-s">★</span>
            <span class="stars-count">4.9 (312 trips)</span>
          </div>
        </div>
      </div>
      <div class="driver-details">
        <div class="detail-pill"><div class="dp-lbl">Plate Number</div><div class="dp-val">RAC 487 B</div></div>
        <div class="detail-pill"><div class="dp-lbl">Moto Colour</div><div class="dp-val">Green / Black</div></div>
        <div class="detail-pill"><div class="dp-lbl">Vehicle</div><div class="dp-val">Honda CG 125</div></div>
        <div class="detail-pill"><div class="dp-lbl">Helmet</div><div class="dp-val">✅ Provided</div></div>
      </div>
      <div class="verified-tag">✅ Identity Verified by Konekt</div>
      <button class="share-trip-btn" onclick="showToast('Trip link shared on WhatsApp!')">
        📤 Share Trip for Safety
      </button>
    </div>

    <button class="btn-primary btn-full" onclick="goto('screen-payment')">
      📱 &nbsp;Proceed to Payment
    </button>
  `;
}

// ── Fare Calculation ─────────────────────────
function computeFare() {
  const km = parseFloat(state.distance);
  const distCost = Math.round(km * 150);
  const subtotal = 500 + distCost;
  const modifier = state.vehicle === 'bus' ? 0.7 : 1.0;
  state.fare.total = Math.round(subtotal * modifier);
}

// ── Vehicle Selection ────────────────────────
function selectVehicle(type) {
  state.vehicle = type;
  document.getElementById('v-moto')?.classList.toggle('selected', type === 'moto');
  document.getElementById('v-bus')?.classList.toggle('selected', type === 'bus');
}

// ── GPS ──────────────────────────────────────
function detectGPS() {
  showToast('📍 Location detected: Innovation City, Gasabo');
  const el = document.getElementById('pickup-val');
  if (el) el.textContent = 'Kigali Innovation City, Gasabo ✓';
}

// ── Quick Book ───────────────────────────────
function quickBook(dest, dist) {
  state.destination = dest;
  state.distance = dist;
  state.currentStep = 1;
  goto('screen-booking');
  gotoStep(1);
}

// ── Destination Panel ────────────────────────
function openPanel(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closePanel(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

function handleOverlay(e, panelId) {
  if (e.target === e.currentTarget) closePanel(panelId);
}

function filterDest(val) {
  const items = document.querySelectorAll('#suggestion-list .suggestion');
  items.forEach(item => {
    const name = item.querySelector('.sn')?.textContent?.toLowerCase() || '';
    item.style.display = name.includes(val.toLowerCase()) || val === '' ? '' : 'none';
  });
}

function chooseDest(dest, dist) {
  state.destination = dest;
  state.distance = dist;
  const input = document.getElementById('dest-input');
  if (input) input.value = dest;
}

function confirmDest() {
  closePanel('panel-destination');
  state.currentStep = 1;
  goto('screen-booking');
  gotoStep(1);
}

// ── Payment ───────────────────────────────────
function selectPayment(type) {
  state.payment = type;
  ['mtn','airtel','cash'].forEach(t => {
    document.getElementById(`pm-${t}`)?.classList.toggle('selected', t === type);
    const radio = document.getElementById(`radio-${t}`);
    if (radio) radio.className = 'pm-radio' + (t === type ? ' sel' : '');
  });
}

function confirmPayment() {
  const label = state.payment === 'mtn' ? 'MTN MoMo' : state.payment === 'airtel' ? 'Airtel Money' : 'Cash';
  showToast(`Payment via ${label} confirmed`);
  setTimeout(() => goto('screen-tracking'), 1000);
  startCountdown();
}

// ── Countdown ────────────────────────────────
function startCountdown() {
  if (state.countdownInterval) clearInterval(state.countdownInterval);
  let count = 3;
  state.countdownInterval = setInterval(() => {
    count--;
    const el = document.getElementById('eta-num');
    const status = document.getElementById('track-status');
    if (el) el.textContent = count;
    if (count <= 0) {
      clearInterval(state.countdownInterval);
      if (status) status.textContent = 'Jean-Pierre has arrived!';
      if (el) el.textContent = '0';
    }
  }, 1500);
}

// ── Rating ────────────────────────────────────
function rateStar(n) {
  document.querySelectorAll('#star-rating .star').forEach((s, i) => {
    s.classList.toggle('active', i < n);
  });
  if (n >= 4) showToast('Thanks for the rating! 🙏');
  else showToast('We\'ll improve. Thanks for the feedback.');
}

// ── Language ──────────────────────────────────
function setLang(lang, btn) {
  state.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const t = translations[lang];
  const g = document.getElementById('greeting');
  const gs = document.getElementById('greeting-sub');
  const sp = document.getElementById('search-placeholder');
  const bs = document.getElementById('btn-start');
  const bl = document.getElementById('btn-login');
  const ld = document.getElementById('lang-display');

  if (g) g.textContent = t.greeting;
  if (gs) gs.textContent = t.greetingSub;
  if (sp) sp.textContent = t.searchPlaceholder;
  if (bs) bs.textContent = t.btnStart;
  if (bl) bl.textContent = t.btnLogin;
  if (ld) ld.textContent = lang === 'en' ? 'English' : 'Kinyarwanda';

  showToast(lang === 'rw' ? 'Ururimi: Kinyarwanda ✓' : 'Language: English ✓');
}

function cycleLanguage() {
  const next = state.lang === 'en' ? 'rw' : 'en';
  const btn = document.querySelector(`.lang-btn[onclick*="'${next}'"]`);
  setLang(next, btn);
}

// ── Toast ─────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  // Initialize booking body for when user navigates there
  state.currentStep = 1;
});
