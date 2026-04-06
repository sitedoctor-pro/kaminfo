const qs = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

const STORAGE = {
  price: 'kam_info_price',
  offerEnd: 'kam_info_offer_end',
  offerExtended: 'kam_info_offer_extended',
  offerExpiredSeen: 'kam_info_offer_expired_seen',
  orderDone: 'kam_info_order_done',
  orderDoneData: 'kam_info_order_done_data'
};

const BASE_PRICE = 289;
const BASE_DURATION_MS = 4 * 60 * 1000;

const state = {
  price: Number(localStorage.getItem(STORAGE.price) || BASE_PRICE),
  selectedPad: 'ROG Style',
  clavier: 'Clavier Gaming Standard',
  souris: 'Logitech G302',
  audioReady: false,
  audioCtx: null,
  followShown: false,
  typingPlayed: new WeakSet(),
};

const productData = {
  'pad-modal': {
    title: 'Tapis Gaming 30×90',
    desc: 'Tapis long et large pour setup gamer, avec 4 styles disponibles dans ce pack. الهدف منه يعطي المكتب شكل قوي ومريح للحركة.',
    images: ['assets/img/pad-msi-desk.jpeg','assets/img/pad-rog.jpg','assets/img/pad-msi.webp','assets/img/pad-black.webp'],
    video: 'assets/media/pad-video.mp4',
    bullets: ['Dimension 30×90', '4 styles au choix', 'Look setup premium', 'Surface كبيرة ومرتبة']
  },
  'mouse-modal': {
    title: 'Logitech G302',
    desc: 'سوريس gaming معروفة وسط الناس ديال الجيمينغ، design compact، وتحكم بالإعدادات من خلال logiciel Logitech compatible.',
    images: ['assets/img/mouse-front.jpg','assets/img/mouse-box.webp','assets/img/mouse-inhand.jpg','assets/img/mouse-detail.jpg'],
    video: 'assets/media/mouse-video.mp4',
    bullets: ['Tracking rapide', 'Design gamer compact', 'Software support', 'Parfaite pour FPS / MOBA vibe']
  },
  'keyboard-modal': {
    title: 'Clavier Gaming',
    desc: 'كلافي gaming داخل العرض باش يكمل setup ديالك فالشكل والاستعمال. موديل واحد داخل هذا الباك لتسريع الطلب.',
    images: ['assets/img/keyboard-top.jpg','assets/img/keyboard-hero.jpeg','assets/img/keyboard-detail.jpeg','assets/img/keyboard-hero2.png'],
    video: 'assets/media/keyboard-video.mp4',
    bullets: ['Look gamer', 'Format confortable', 'Visuel fort sur bureau', 'Ready pour setup neon']
  }
};

function initCursorGlow() {
  const glow = qs('.cursor-glow');
  if (!glow) return;
  window.addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

async function ensureAudio() {
  if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (state.audioCtx.state === 'suspended') await state.audioCtx.resume();
  state.audioReady = true;
}

function playTone(freq = 440, duration = 0.06, type = 'triangle', gainValue = 0.02) {
  if (!state.audioReady || !state.audioCtx) return;
  const osc = state.audioCtx.createOscillator();
  const gain = state.audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, state.audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(gainValue, state.audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(state.audioCtx.destination);
  osc.start();
  osc.stop(state.audioCtx.currentTime + duration);
}

function playAudioEl(el, opts = {}) {
  if (!el) return;
  if (typeof opts.currentTime === 'number') el.currentTime = opts.currentTime;
  if (typeof opts.loop === 'boolean') el.loop = opts.loop;
  if (typeof opts.volume === 'number') el.volume = opts.volume;
  el.play().catch(() => {});
}

function bindInteractionAudio() {
  const unlock = async () => {
    await ensureAudio();
    playTone(680, 0.08, 'triangle', 0.03);
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('touchmove', unlock);
    window.removeEventListener('click', unlock);
  };
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('touchstart', unlock, { once: true, passive: true });
  window.addEventListener('touchmove', unlock, { once: true, passive: true });
  window.addEventListener('click', unlock, { once: true });

  qsa('button, a').forEach(el => {
    el.addEventListener('mouseenter', () => playTone(520, 0.03, 'sine', 0.009));
    el.addEventListener('click', () => playTone(760, 0.06, 'sawtooth', 0.02));
  });
}

function preloadExperience() {
  const assets = [
    'assets/img/logo.jpg','assets/img/mouse-front.jpg','assets/img/keyboard-top.jpg','assets/img/pad-rog.jpg',
    'assets/img/pad-msi.webp','assets/img/pad-union.webp','assets/img/pad-black.webp','assets/img/mouse-hero.png',
    'assets/img/keyboard-hero2.png','assets/img/keyboard-hero.jpeg','assets/media/hero-bg.mp4',
    'assets/media/kazoo.mp4','assets/media/rocket.avif','assets/media/kazoo-audio.mp3',
    'assets/media/keyboard-video.mp4','assets/media/mouse-video.mp4','assets/media/pad-video.mp4'
  ];
  const progress = qs('#loaderProgress');
  const stateText = qs('#loaderState');
  let loaded = 0;
  const mark = () => {
    loaded += 1;
    const percent = Math.min(100, Math.round((loaded / assets.length) * 100));
    if (progress) progress.style.width = `${percent}%`;
    if (stateText) stateText.textContent = `${percent}%`;
    if (state.audioReady) playTone(220 + percent * 4, 0.03, 'triangle', 0.012);
    if (loaded >= assets.length) {
      const heroVideo = qs('.hero-video');
      if (heroVideo) heroVideo.play().catch(() => {});
      setTimeout(() => qs('#preloader')?.classList.add('hidden'), 450);
    }
  };

  assets.forEach(src => {
    if (src.endsWith('.mp4')) {
      const v = document.createElement('video');
      v.preload = 'auto';
      v.src = src;
      v.onloadeddata = mark;
      v.onerror = mark;
    } else if (src.endsWith('.mp3')) {
      const a = new Audio();
      a.preload = 'auto';
      a.src = src;
      a.oncanplaythrough = mark;
      a.onerror = mark;
    } else {
      const img = new Image();
      img.onload = mark;
      img.onerror = mark;
      img.src = src;
    }
  });
}

function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('type-target') && !state.typingPlayed.has(entry.target)) {
        typeText(entry.target);
        state.typingPlayed.add(entry.target);
      }
    });
  }, { threshold: 0.15 });
  qsa('.reveal, .type-target').forEach(el => observer.observe(el));
}

function typeText(el) {
  const raw = el.dataset.raw || el.innerHTML;
  el.dataset.raw = raw;
  const temp = document.createElement('div');
  temp.innerHTML = raw;
  const text = temp.textContent || temp.innerText || '';
  let i = 0;
  el.innerHTML = '';
  const interval = setInterval(() => {
    el.textContent = text.slice(0, i + 1);
    if (state.audioReady) playTone(300 + (i % 8) * 40, 0.02, 'square', 0.006);
    i += 1;
    if (i >= text.length) {
      clearInterval(interval);
      el.innerHTML = raw;
    }
  }, 24);
}

function initTilt() {
  qsa('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${y * -10}deg) rotateY(${x * 12}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

let countdownTimer = null;

function getOrCreateOfferEnd() {
  let endAt = Number(localStorage.getItem(STORAGE.offerEnd));
  const extended = localStorage.getItem(STORAGE.offerExtended) === '1';
  if (!endAt) {
    endAt = Date.now() + BASE_DURATION_MS;
    localStorage.setItem(STORAGE.offerEnd, String(endAt));
    localStorage.setItem(STORAGE.offerExtended, '0');
    localStorage.removeItem(STORAGE.offerExpiredSeen);
  }
  if (!extended && endAt <= Date.now() && !localStorage.getItem(STORAGE.offerExpiredSeen)) {
    return endAt;
  }
  if (!extended && endAt <= Date.now() && localStorage.getItem(STORAGE.offerExpiredSeen)) {
    return endAt;
  }
  return endAt;
}

function initCountdown() {
  const countdownEl = qs('#countdown');
  const endAt = getOrCreateOfferEnd();
  const tick = () => {
    const left = Math.max(0, endAt - Date.now());
    const totalSeconds = Math.floor(left / 1000);
    const hr = Math.floor(totalSeconds / 3600);
    const min = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const sec = String(totalSeconds % 60).padStart(2, '0');
    countdownEl.textContent = hr > 0 ? `${String(hr).padStart(2, '0')}:${min}:${sec}` : `${min}:${sec}`;
    countdownEl.classList.toggle('warning-pulse', totalSeconds <= 40 && totalSeconds > 0);
    if (totalSeconds === 40) showFortySecondWarning();
    if (left <= 0) {
      clearInterval(countdownTimer);
      countdownEl.textContent = '00:00';
      showExpiredModal();
    }
  };
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(tick, 1000);
  tick();
}

function showFortySecondWarning() {
  if (qs('#fortyWarn')) return;
  const warn = document.createElement('div');
  warn.id = 'fortyWarn';
  warn.className = 'expired-banner';
  warn.textContent = '⚠️ باقي 40 ثانية فقط على العرض';
  qs('.top-strip-inner')?.appendChild(warn);
  playTone(880, 0.12, 'square', 0.03);
}

function showExpiredModal() {
  if (qs('#expiredModal')?.classList.contains('active')) return;
  localStorage.setItem(STORAGE.offerExpiredSeen, '1');
  qs('#expiredModal')?.classList.add('active');
  playAudioEl(qs('#gameOverVoice'), { currentTime: 0, volume: 1 });
  setTimeout(() => playAudioEl(qs('#gameOverSfx'), { currentTime: 0, volume: 1 }), 500);
}

function formatMoney(value) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function setPrice(newPrice) {
  state.price = newPrice;
  qsa('#heroPrice, #footerPrice, #stickyPrice').forEach(el => { if (el) el.textContent = `${formatMoney(newPrice)} DH`; });
  localStorage.setItem(STORAGE.price, String(newPrice));
}

function resetOfferAndOrderForNewRequest() {
  localStorage.removeItem(STORAGE.orderDone);
  localStorage.removeItem(STORAGE.orderDoneData);
  localStorage.setItem(STORAGE.offerEnd, String(Date.now() + BASE_DURATION_MS));
  localStorage.setItem(STORAGE.offerExtended, '0');
  localStorage.removeItem(STORAGE.offerExpiredSeen);
  setPrice(BASE_PRICE);
}

function initExtendOffer() {
  const range = qs('#extendRange');
  const hoursLabel = qs('#extendHoursLabel');
  const extendPrice = qs('#extendPrice');
  const newPrice = qs('#newPrice');
  if (!range) return;
  const update = () => {
    const hours = Number(range.value);
    const extra = hours * 5;
    hoursLabel.textContent = `${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    extendPrice.textContent = `${formatMoney(extra)} DH`;
    newPrice.textContent = `${formatMoney(BASE_PRICE + extra)} DH`;
  };
  range.addEventListener('input', update);
  update();
  qs('#extendOffer')?.addEventListener('click', () => {
    const hours = Number(range.value);
    const extra = hours * 5;
    const newEnd = Date.now() + hours * 60 * 60 * 1000;
    localStorage.setItem(STORAGE.offerEnd, String(newEnd));
    localStorage.setItem(STORAGE.offerExtended, '1');
    localStorage.removeItem(STORAGE.offerExpiredSeen);
    setPrice(BASE_PRICE + extra);
    qs('#expiredModal')?.classList.remove('active');
    const warn = qs('#fortyWarn');
    if (warn) warn.remove();
    initCountdown();
    playTone(520, 0.12, 'triangle', 0.03);
  });
}

function toggleOrderFocus() {
  const section = qs('.observe-order');
  if (!section) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => document.body.classList.toggle('order-focus', entry.isIntersecting));
  }, { threshold: 0.45 });
  observer.observe(section);
}

function showFollowUp() {
  setTimeout(() => {
    if (state.followShown) return;
    qs('#followUp')?.classList.add('active');
    qs('#followUp')?.setAttribute('aria-hidden', 'false');
    state.followShown = true;
    playTone(620, 0.12, 'square', 0.03);
  }, 10000);
  qs('#closeFollowUp')?.addEventListener('click', () => qs('#followUp')?.classList.remove('active'));
}

function openWizard(targetStep = 'intro') {
  const shell = qs('#orderWizard');
  shell?.classList.add('active');
  shell?.setAttribute('aria-hidden', 'false');
  goToStep(targetStep);
  const video = qs('#kazooVideo');
  video?.play().catch(() => {});
  playAudioEl(qs('#kazooAudio'), { currentTime: 0, volume: 1, loop: false });
}

function closeWizard() {
  qs('#orderWizard')?.classList.remove('active');
  qs('#orderWizard')?.setAttribute('aria-hidden', 'true');
  const a = qs('#kazooAudio');
  if (a) { a.pause(); a.currentTime = 0; }
}

function goToStep(step) {
  qsa('.sheet-step').forEach(el => el.classList.toggle('active', el.dataset.step === step));
}

function initWizard() {
  qsa('.js-open-order').forEach(btn => btn.addEventListener('click', () => openWizard('intro')));
  qs('#closeWizard')?.addEventListener('click', closeWizard);
  qsa('.btn-next').forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.next === 'contact' && !qs('#customerName').value.trim()) {
      qs('#customerName').focus();
      return;
    }
    playTone(780, 0.07, 'sawtooth', 0.02);
    goToStep(btn.dataset.next);
  }));
  qsa('.btn-back').forEach(btn => btn.addEventListener('click', () => goToStep(btn.dataset.back)));
  qsa('.pad-option').forEach(opt => opt.addEventListener('click', () => {
    qsa('.pad-option').forEach(x => x.classList.remove('active'));
    opt.classList.add('active');
    state.selectedPad = opt.dataset.pad;
    playTone(630, 0.05, 'triangle', 0.02);
  }));
}

async function submitOrder() {
  const data = {
    nom: qs('#customerName').value.trim(),
    telephone: qs('#customerPhone').value.trim(),
    adresse: qs('#customerAddress').value.trim(),
    ville: qs('#customerCity').value.trim(),
    quantite: qs('#customerQty').value.trim() || '1',
    type_tapis: state.selectedPad,
    clavier_prefere: state.clavier,
    souris: state.souris,
    notes: qs('#customerNotes').value.trim(),
    prix: `${formatMoney(state.price)} DH`
  };
  if (!data.nom || !data.telephone || !data.adresse) {
    alert('دخل الاسم، الهاتف والعنوان من فضلك.');
    return;
  }

  const form = qs('#hiddenForm');
  Object.entries(data).forEach(([k, v]) => {
    const field = form.querySelector(`[name="${k}"]`);
    if (field) field.value = v;
  });

  const formData = new FormData(form);
  try {
    await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
  } catch (e) {}

  sessionStorage.setItem('kamInfoOrder', JSON.stringify(data));
  localStorage.setItem(STORAGE.orderDone, '1');
  localStorage.setItem(STORAGE.orderDoneData, JSON.stringify(data));
  launchRocketTransition();
}

function launchRocketTransition() {
  const rocket = document.createElement('div');
  rocket.className = 'rocket-flight';
  rocket.innerHTML = '<img src="assets/media/rocket-launch.gif" alt="rocket">';
  document.body.appendChild(rocket);
  playAudioEl(qs('#rocketLaunchAudio'), { currentTime: 0, volume: 0.95 });
  playTone(220, 0.14, 'sawtooth', 0.03);
  setTimeout(() => playTone(300, 0.16, 'sawtooth', 0.035), 180);
  setTimeout(() => playTone(420, 0.18, 'triangle', 0.04), 420);
  rocket.animate([
    { left: '-38vw', bottom: '20vh', transform: 'translate3d(0,0,0) rotate(0deg) scale(.88)' },
    { left: '-10vw', bottom: '20vh', transform: 'translate3d(0,0,0) rotate(1deg) scale(.9)', offset: 0.38 },
    { left: '35vw', bottom: '21vh', transform: 'translate3d(0,0,0) rotate(-1deg) scale(.98)', offset: 0.72 },
    { left: '118vw', bottom: '24vh', transform: 'translate3d(0,0,0) rotate(-3deg) scale(1.06)' }
  ], { duration: 2500, easing: 'cubic-bezier(.22,.1,.12,1)', fill: 'forwards' });
  setTimeout(() => { window.location.href = 'thank-you.html'; }, 2380);
}

function initProductModal() {
  qsa('.product-card').forEach(card => card.addEventListener('click', () => openProductModal(card.dataset.modal)));
  qs('#closeProductModal')?.addEventListener('click', () => qs('#productModal')?.classList.remove('active'));
}

function openProductModal(id) {
  const data = productData[id];
  const root = qs('#productModalContent');
  if (!data || !root) return;
  root.innerHTML = `
    <div class="product-modal-grid">
      <div class="product-gallery">
        ${data.video ? `<video class="modal-product-video" autoplay muted loop playsinline preload="metadata"><source src="${data.video}" type="video/mp4"></video>` : ''}
        ${data.images.map(src => `<img src="${src}" alt="${data.title}">`).join('')}
      </div>
      <div class="product-copy">
        <span class="eyebrow">KAM INFO PRODUCT VIEW</span>
        <h3>${data.title}</h3>
        <p>${data.desc}</p>
        <ul>${data.bullets.map(x => `<li>${x}</li>`).join('')}</ul>
        <button class="btn btn-primary js-modal-order">اطلب الآن</button>
      </div>
    </div>`;
  qs('#productModal')?.classList.add('active');
  qs('.js-modal-order', root)?.addEventListener('click', () => {
    qs('#productModal')?.classList.remove('active');
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => openWizard('intro'), 500);
  });
}

function bindCloseBackdrops() {
  qsa('.modal-shell').forEach(shell => {
    shell.addEventListener('click', e => {
      if (e.target.classList.contains('modal-backdrop')) shell.classList.remove('active');
    });
  });
  qsa('.modal-dismiss').forEach(btn => btn.addEventListener('click', () => {
    const shell = btn.closest('.modal-shell');
    shell?.classList.remove('active');
  }));
}

function initOrderSuccessModal() {
  if (localStorage.getItem(STORAGE.orderDone) !== '1') return;
  const modal = qs('#orderSuccessModal');
  if (!modal) return;
  modal.classList.add('active');
  qs('#restartOrderFlow')?.addEventListener('click', () => {
    modal.classList.remove('active');
    resetOfferAndOrderForNewRequest();
    initCountdown();
    openWizard('intro');
  });
  qs('#keepOrderState')?.addEventListener('click', () => modal.classList.remove('active'));
}

window.addEventListener('load', () => {
  setPrice(state.price);
  initCursorGlow();
  bindInteractionAudio();
  preloadExperience();
  initReveal();
  initTilt();
  initCountdown();
  initExtendOffer();
  toggleOrderFocus();
  showFollowUp();
  initWizard();
  initProductModal();
  bindCloseBackdrops();
  initOrderSuccessModal();
  qs('#submitOrder')?.addEventListener('click', submitOrder);
});
