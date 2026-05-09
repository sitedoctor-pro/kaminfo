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
  selectedPad: 'MSI Dragon',
  clavier: 'Clavier Gaming Standard',
  souris: 'Logitech G302',
  audioReady: false,
  audioCtx: null,
  followShown: false,
  typingPlayed: new WeakSet(),
};

const PHONE_REGEX = /^0[5-7][0-9]{8}$/;


const productData = {
  'pad-modal': {
    title: 'Tapis Gaming 30×70',
    desc: 'تابي كبير 30×70 كيغطّي المساحة ديال clavier والسوريس كاملة، وكيخليك تختار من عدد كبير ديال الستايلات اللي زادت دابا فالموقع.',
    images: [
      'assets/img/pads/pad-msi-dragon.png','assets/img/pads/pad-msi-red.png','assets/img/pads/pad-rog-black.png','assets/img/pads/pad-style-1.jpeg','assets/img/pads/pad-style-2.jpeg','assets/img/pads/pad-style-3.jpeg','assets/img/pads/pad-style-4.jpeg','assets/img/pads/pad-union-jack.png','assets/img/pads/pad-rog-crimson.png','assets/img/pads/pad-rog-spectrum.png','assets/img/pads/pad-rog-city.png','assets/img/pads/pad-msi-splash.png','assets/img/pads/pad-logitech-blue.png','assets/img/pads/pad-razer-acid-green.jpeg'
    ],
    video: 'assets/media/pad-video.mp4',
    bullets: ['Dimension 30×70 cm', 'Surface واسعة ومريحة للحركة', 'تصاميم كثيرة متوفرة دابا من بينها ستايل Razer Acid Green', 'مناسب للـ clavier + souris فوق نفس التابي'],
    details: [
      ['المقاس', '30×70 cm'],
      ['الاستعمال', 'Gaming / bureau / setup'],
      ['الاختيارات', '14 styles disponibles'],
      ['داخل العرض', 'كتختار تصميم واحد حسب الذوق ديالك من بين 14 ستايل']
    ]
  },
  'mouse-modal': {
    title: 'Logitech G302',
    desc: 'سوريس Logitech G302 بالشكل gaming المعروف ديالها، خفيفة فالاستخدام ومناسبة للـ setup اللي كيبغي look احترافي مع مسكة مريحة.',
    images: ['assets/img/mouse/mouse-front-glow.png','assets/img/mouse/mouse-blue-glow.png','assets/img/mouse/mouse-side-glow.png','assets/img/mouse/mouse-close-glow.png'],
    video: 'assets/media/mouse-video.mp4',
    bullets: ['Design gamer واضح', 'مسكة مريحة فاللعب والاستعمال اليومي', 'Software support', 'كتجي داخلة فالباك جاهزة'],
    details: [
      ['الموديل', 'Logitech G302'],
      ['اللون', 'Noir avec éclairage bleu'],
      ['الاستعمال', 'Gaming + usage quotidien'],
      ['الميزة', 'تحكم مريح وشكل احترافي']
    ]
  },
  'keyboard-modal': {
    title: 'Clavier Gaming',
    desc: 'تعتبر لوحة مفاتيح ميتيون K9520 خيارا احترافيا للاعبين، حيث تأتي بتصميم مريح يتضمن مسندا مغناطيسيا للمعصم قابل للفصل لتوفير راحة قصوى. تتميز بإضاءة RGB خلفية قابلة للتخصيص بالكامل لتناسب جو الألعاب الخاص بك.',
    images: ['assets/img/keyboard/keyboard-top.jpg','assets/img/keyboard/keyboard-box.png','assets/img/keyboard/keyboard-lifestyle.jpg'],
    video: 'assets/media/keyboard-video.mp4',
bullets: [
    'Look gamer عصري وجذاب',
    'إضاءة RGB خلفية قابلة للتخصيص',
    'تنظيم مزيان فوق المكتب بفضل التصميم المدمج',
    'داخل الباك الجاهز بثمن العرض المميز',
    'مسند معصم مغناطيسي مريح وقابل للفصل',
    '26 مفتاح Anti-ghosting لمنع تعارض الأوامر',
    'بكرة (Wheel) مخصصة للتحكم السريع في مستوى الصوت',
    '12 مفتاح اختصار للميديا والوظائف الذكية',
    'كابل USB مضفر (Braided) شديد التحمل',
    'غطاء علوي معدني يمنح صلابة واستقرار أكبر'
  ],
      details: [
      ['النوع', 'Clavier Gaming Standard'],
      ['الإضاءة', 'RGB style'],
      ['التنسيق', 'كيوافق tapis و souris ديال العرض'],
      ['داخل العرض', 'جاهز ضمن pack gaming']
    ]
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

  qsa('button, a, summary, .pad-option, .choice-card, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => playTone(520, 0.03, 'sine', 0.009));
    const clickFx = () => { playTone(760, 0.07, 'sawtooth', 0.026); setTimeout(() => playTone(980, 0.04, 'triangle', 0.016), 22); };
    el.addEventListener('click', clickFx);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') clickFx();
    });
  });
}

function preloadExperience() {
  const assets = [
    'assets/img/logo.jpg',
    'assets/img/mouse/mouse-front-glow.png',
    'assets/img/keyboard/keyboard-top.jpg',
    'assets/img/pads/pad-msi-dragon.png',
    'assets/img/pads/pad-msi-red.png',
    'assets/img/pads/pad-rog-black.png',
    'assets/img/pads/pad-style-1.jpeg',
    'assets/img/pads/pad-style-2.jpeg',
    'assets/img/pads/pad-style-3.jpeg',
    'assets/img/pads/pad-style-4.jpeg',
    'assets/img/pads/pad-union-jack.png',
    'assets/img/pads/pad-rog-crimson.png',
    'assets/img/pads/pad-rog-spectrum.png',
    'assets/img/pads/pad-rog-city.png',
    'assets/img/pads/pad-msi-splash.png',
    'assets/img/pads/pad-logitech-blue.png',
    'assets/media/hero-bg.mp4',
    'assets/media/rocket.gif'
  ];
  const progress = qs('#loaderProgress');
  const stateText = qs('#loaderState');
  let loaded = 0;
  const mark = () => {
    loaded += 1;
    const percent = Math.min(100, Math.round((loaded / assets.length) * 100));
    if (progress) progress.style.width = `${percent}%`;
    if (stateText) stateText.textContent = `${percent}%`;
    if (loaded >= assets.length) {
      const heroVideo = qs('.hero-video');
      if (heroVideo) heroVideo.play().catch(() => {});
      setTimeout(() => qs('#preloader')?.classList.add('hidden'), 350);
    }
  };
  assets.forEach(src => {
    if (src.endsWith('.mp4')) {
      const v = document.createElement('video');
      v.preload = 'auto';
      v.src = src;
      v.onloadeddata = mark;
      v.onerror = mark;
    } else {
      const img = new Image();
      img.onload = mark;
      img.onerror = mark;
      img.src = src;
    }
  });
}


function initHeroVisibility() {
  const hero = qs('#home');
  const media = qs('.hero-media');
  const video = qs('.hero-video');
  if (!hero || !media || !video) return;
  const io = new IntersectionObserver((entries) => {
    const entry = entries[0];
    const visible = !!entry && entry.isIntersecting && entry.intersectionRatio > 0.12;
    media.classList.toggle('is-hidden', !visible);
    if (visible) video.play().catch(() => {});
    else {
      video.pause();
      try { video.currentTime = 0; } catch (e) {}
    }
  }, { threshold: [0, 0.12, 0.25, 0.5] });
  io.observe(hero);
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
  setPrice(BASE_PRICE + 15);
  const priceEl = qs('#newPrice');
  if (priceEl) priceEl.textContent = `${BASE_PRICE + 15} DH`;
  qs('#expiredModal')?.classList.add('active');
  playAudioEl(qs('#gameOverVoice'), { currentTime: 0, volume: 1 });
  setTimeout(() => playAudioEl(qs('#gameOverSfx'), { currentTime: 0, volume: 1 }), 400);
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
  qs('#continueUpdatedOffer')?.addEventListener('click', () => {
    qs('#expiredModal')?.classList.remove('active');
    openWizard('intro');
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

function loadWizardVideo() {
  const video = qs('#kazooVideo');
  if (!video || video.dataset.loaded === '1') return;
  const src = video.dataset.src;
  if (!src) return;
  video.innerHTML = `<source src="${src}" type="video/mp4" />`;
  video.dataset.loaded = '1';
  video.load();
}

function unloadWizardVideo() {
  const video = qs('#kazooVideo');
  if (!video) return;
  video.pause();
  video.removeAttribute('src');
  video.innerHTML = '';
  video.load();
  video.dataset.loaded = '0';
}

function openWizard(targetStep = 'intro') {
  const shell = qs('#orderWizard');
  shell?.classList.add('active');
  shell?.setAttribute('aria-hidden', 'false');
  goToStep(targetStep);
  if (targetStep === 'intro') {
    loadWizardVideo();
    const video = qs('#kazooVideo');
    video?.play().catch(() => {});
    playAudioEl(qs('#kazooAudio'), { currentTime: 0, volume: 1, loop: false });
  }
}

function closeWizard() {
  qs('#orderWizard')?.classList.remove('active');
  qs('#orderWizard')?.setAttribute('aria-hidden', 'true');
  const a = qs('#kazooAudio');
  if (a) { a.pause(); a.currentTime = 0; }
  unloadWizardVideo();
}

function goToStep(step) {
  qsa('.sheet-step').forEach(el => el.classList.toggle('active', el.dataset.step === step));
  if (step !== 'intro') {
    const a = qs('#kazooAudio');
    if (a) { a.pause(); a.currentTime = 0; }
    unloadWizardVideo();
  } else {
    loadWizardVideo();
    qs('#kazooVideo')?.play().catch(() => {});
  }
}

function validateField(input) {
  if (!input) return true;
  const value = input.value.trim();
  let valid = true;
  if (input.hasAttribute('required') && !value) valid = false;
  if (valid && input.id === 'customerPhone' && !PHONE_REGEX.test(value)) valid = false;
  if (valid && input.id === 'customerQty') {
    const qty = Number(value);
    valid = Number.isFinite(qty) && qty >= 1 && qty <= 10;
  }
  input.classList.toggle('invalid', !valid);
  return valid;
}

function validateStep(step) {
  const fields = {
    intro: [qs('#customerName')],
    contact: [qs('#customerPhone'), qs('#customerAddress'), qs('#customerCity'), qs('#customerQty')],
    pad: [qs('#customerNotes')]
  }[step] || [];
  const firstInvalid = fields.find(field => !validateField(field));
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

function refreshWizardButtons() {
  const introOk = validateField(qs('#customerName'));
  const contactOk = [qs('#customerPhone'), qs('#customerAddress'), qs('#customerCity'), qs('#customerQty')].every(validateField);
  const padOk = validateField(qs('#customerNotes'));
  const introBtn = qs('.btn-next[data-next="contact"]');
  const contactBtn = qs('.btn-next[data-next="pad"]');
  const submitBtn = qs('#submitOrder');
  if (introBtn) introBtn.disabled = !introOk;
  if (contactBtn) contactBtn.disabled = !contactOk;
  if (submitBtn) submitBtn.disabled = !padOk;
}

function initWizard() {
  qsa('.js-open-order').forEach(btn => btn.addEventListener('click', () => openWizard('intro')));
  qsa('#customerName, #customerPhone, #customerAddress, #customerCity, #customerQty, #customerNotes').forEach(input => {
    ['input','change','blur'].forEach(evt => input.addEventListener(evt, () => { validateField(input); refreshWizardButtons(); }));
  });
  qs('#closeWizard')?.addEventListener('click', closeWizard);
  qsa('.btn-next').forEach(btn => btn.addEventListener('click', () => {
    const currentStep = btn.closest('.sheet-step')?.dataset.step;
    if (currentStep && !validateStep(currentStep)) {
      refreshWizardButtons();
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
  refreshWizardButtons();
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
  if (!validateStep('intro') || !validateStep('contact') || !validateStep('pad')) {
    refreshWizardButtons();
    alert('من فضلك عمّر جميع الخانات المطلوبة قبل تأكيد الطلب.');
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
  rocket.innerHTML = '<img src="assets/media/rocket.gif" alt="rocket">';
  document.body.appendChild(rocket);
  playAudioEl(qs('#rocketLaunchAudio'), { currentTime: 0, volume: 0.95 });
  playTone(220, 0.14, 'sawtooth', 0.03);
  setTimeout(() => playTone(300, 0.16, 'sawtooth', 0.035), 180);
  setTimeout(() => playTone(420, 0.18, 'triangle', 0.04), 420);
  rocket.animate([
    { left: '50%', bottom: '-28vh', transform: 'translateX(-50%) rotate(-82deg) scale(.82)' },
    { left: '50%', bottom: '6vh', transform: 'translateX(-50%) rotate(-84deg) scale(.86)', offset: 0.34 },
    { left: '50%', bottom: '44vh', transform: 'translateX(-50%) rotate(-86deg) scale(.96)', offset: 0.72 },
    { left: '50%', bottom: '118vh', transform: 'translateX(-50%) rotate(-88deg) scale(1.05)' }
  ], { duration: 2500, easing: 'cubic-bezier(.2,.75,.18,1)', fill: 'forwards' });
  setTimeout(() => { window.location.href = 'thank-you.html'; }, 2380);
}

function initVideoModal() {
  qsa('.lazy-video-trigger').forEach(card => card.addEventListener('click', () => openVideoModal(card.dataset.video, card.dataset.title)));
  qs('#closeVideoModal')?.addEventListener('click', closeVideoModal);
}

function openVideoModal(src, title = '') {
  const shell = qs('#videoModal');
  const video = qs('#videoModalPlayer');
  const titleEl = qs('#videoModalTitle');
  if (!shell || !video || !src) return;
  titleEl.textContent = title;
  video.innerHTML = `<source src="${src}" type="video/mp4">`;
  video.muted = true;
  video.controls = true;
  video.setAttribute('playsinline', '');
  video.load();
  shell.classList.add('active');
  shell.setAttribute('aria-hidden', 'false');
  video.play().catch(() => {});
}

function closeVideoModal() {
  const shell = qs('#videoModal');
  const video = qs('#videoModalPlayer');
  if (video) {
    video.pause();
    video.removeAttribute('src');
    video.innerHTML = '';
    video.load();
  }
  shell?.classList.remove('active');
  shell?.setAttribute('aria-hidden', 'true');
}

function closeProductModal() {
  const modal = qs('#productModal');
  modal?.classList.remove('active');
  const vid = qs('.modal-product-video');
  if (vid) { vid.pause(); vid.removeAttribute('src'); vid.innerHTML = ''; vid.load(); }
}

function initProductModal() {
  qsa('.product-card').forEach(card => card.addEventListener('click', () => openProductModal(card.dataset.modal)));
  qs('#closeProductModal')?.addEventListener('click', closeProductModal);
}

function openProductModal(id) {
  const data = productData[id];
  const root = qs('#productModalContent');
  if (!data || !root) return;
  root.innerHTML = `
    <div class="product-modal-grid">
      <div class="product-gallery">
        ${data.video ? `<video class="modal-product-video" autoplay muted loop playsinline preload="metadata" controlslist="nodownload noplaybackrate"><source src="${data.video}" type="video/mp4"></video>` : ''}
        ${data.images.map((src, index) => `<img class="gallery-zoom" data-full="${src}" src="${src}" alt="${data.title} ${index + 1}">`).join('')}
      </div>
      <div class="product-copy">
        <span class="eyebrow">KAM INFO PRODUCT VIEW</span>
        <h3>${data.title}</h3>
        <p>${data.desc}</p>
        <ul>${data.bullets.map(x => `<li>${x}</li>`).join('')}</ul>
        <div class="product-specs">${(data.details || []).map(([label, value]) => `<div class="product-spec-item"><span>${label}</span><strong>${value}</strong></div>`).join('')}</div>
        <button class="btn btn-primary js-modal-order">اطلب الآن</button>
      </div>
    </div>`;
  qs('#productModal')?.classList.add('active');
  qsa('.gallery-zoom', root).forEach(img => {
    img.addEventListener('click', () => openImageLightbox(img.dataset.full || img.src, img.alt || data.title));
  });
  qs('.js-modal-order', root)?.addEventListener('click', () => {
    closeProductModal();
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => openWizard('intro'), 500);
  });
}

function openImageLightbox(src, alt = '') {
  const shell = qs('#imageLightbox');
  const img = qs('#lightboxImage');
  if (!shell || !img || !src) return;
  img.src = src;
  img.alt = alt;
  shell.classList.add('active');
}


function initQuicklookLightbox() {
  qsa('.quicklook-grid .gallery-card img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openImageLightbox(img.currentSrc || img.src, img.alt || 'pad image'));
  });
}

function initQuicklookToggle() {
  const btn = qs('#showMorePads');
  const extras = qsa('.quicklook-extra');
  if (!btn || !extras.length) return;

  btn.addEventListener('click', () => {
    const expanded = btn.dataset.expanded === 'true';
    extras.forEach(card => card.classList.toggle('is-visible', !expanded));
    btn.dataset.expanded = expanded ? 'false' : 'true';
    btn.textContent = expanded ? 'عرض المزيد من الستايلات' : 'عرض أقل';
  });
}

function initImageLightbox() {
  qs('#closeImageLightbox')?.addEventListener('click', () => qs('#imageLightbox')?.classList.remove('active'));
}

function bindCloseBackdrops() {
  qsa('.modal-shell').forEach(shell => {
    shell.addEventListener('click', e => {
      if (e.target.classList.contains('modal-backdrop')) {
        if (shell.id === 'videoModal') closeVideoModal();
        else if (shell.id === 'orderWizard') closeWizard();
        else if (shell.id === 'productModal') closeProductModal();
        else shell.classList.remove('active');
      }
    });
  });
  qsa('.modal-dismiss').forEach(btn => btn.addEventListener('click', () => {
    const shell = btn.closest('.modal-shell');
    if (!shell) return;
    if (shell.id === 'videoModal') closeVideoModal();
    else if (shell.id === 'orderWizard') closeWizard();
    else if (shell.id === 'productModal') closeProductModal();
    else shell.classList.remove('active');
  }));
}

function initMobileMenu() {
  qs('#menuToggle')?.addEventListener('click', () => qs('#mainNav')?.classList.toggle('open'));
  qsa('#mainNav a, #mobileSectionNav a').forEach(a => a.addEventListener('click', () => qs('#mainNav')?.classList.remove('open')));
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
  initHeroVisibility();
  initTilt();
  initCountdown();
  initExtendOffer();
  toggleOrderFocus();
  showFollowUp();
  initWizard();
  initVideoModal();
  initProductModal();
  initMobileMenu();
  initImageLightbox();
  initQuicklookLightbox();
  initQuicklookToggle();
  bindCloseBackdrops();
  initOrderSuccessModal();
  qs('#submitOrder')?.addEventListener('click', submitOrder);
});

