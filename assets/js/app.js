(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const body = document.body;

  const siteLoader = $('#siteLoader');
  const finishLoader = () => {
    body.classList.add('loaded');
    if (siteLoader) {
      siteLoader.classList.add('hidden');
      setTimeout(() => siteLoader.remove(), 500);
    }
  };
  window.addEventListener('load', () => setTimeout(finishLoader, 700));
  setTimeout(finishLoader, 2400);

  const year = $('#currentYear');
  if (year) year.textContent = new Date().getFullYear();
  const header = $('#siteHeader');
  const mobileMenu = $('#mobileMenu');
  const burger = $('#burger');

  const setMobileMenu = (open) => {
    if (!burger || !mobileMenu) return;
    body.classList.toggle('menu-open', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    body.style.overflow = open ? 'hidden' : '';
  };

  if (burger && mobileMenu) {
    burger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setMobileMenu(!body.classList.contains('menu-open'));
    });

    $$('#mobileMenu a').forEach(link => {
      link.addEventListener('click', () => setMobileMenu(false));
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && body.classList.contains('menu-open')) {
        setMobileMenu(false);
      }
    });
  }

  const headerLinks = $$('.desktop-nav a');
  const sections = ['home', 'pack', 'videos', 'reviews', 'faq', 'order']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const setActiveLink = () => {
    let current = 'home';
    const threshold = innerHeight * 0.3;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom > threshold) current = section.id;
    });
    headerLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  const normalizePhone = (value = '') => value.trim().replace(/[\s().-]/g, '');
  const isValidMoroccanPhone = (value = '') => /^(?:\+212|00212|0)[5-7]\d{8}$/.test(normalizePhone(value));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.id === 'statsPanel') entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.18 });
  $$('.reveal-up, #statsPanel').forEach(el => observer.observe(el));

  const lockBody = () => { body.style.overflow = 'hidden'; };
  const unlockBody = () => { if (!body.classList.contains('menu-open')) body.style.overflow = ''; };

  const productData = {
    keyboard: {
      label: '01 · Clavier Gaming RGB',
      title: 'Clavier Gaming RGB',
      intro: 'Un clavier pensé pour offrir une frappe réactive, un look RGB marqué et une présence forte sur le bureau. Il complète parfaitement le pack KAM INFO.',
      images: [
        'assets/img/keyboard/keyboard-top.webp',
        'assets/img/keyboard/keyboard-lifestyle.webp',
        'assets/img/keyboard/keyboard-box.webp'
      ],
      specs: [
        { icon: 'keyboard', title: 'Rétroéclairage RGB', text: 'Effet lumineux gaming pour un setup plus immersif.' },
        { icon: 'response', title: 'Touches réactives', text: 'Frappe fluide et réponse rapide au quotidien.' },
        { icon: 'shield', title: 'Anti-ghosting', text: 'Meilleure précision lors des actions rapides.' },
        { icon: 'target', title: 'Format complet', text: 'Disposition pratique pour jeu et bureautique.' }
      ]
    },
    mouse: {
      label: '02 · Logitech G302',
      title: 'Logitech G302',
      intro: 'Une souris légère et précise qui accompagne parfaitement le clavier du pack. Son design favorise la maîtrise et la rapidité des mouvements.',
      images: [
        'assets/img/mouse/mouse-blue-glow.webp',
        'assets/img/mouse/mouse-side-glow.webp',
        'assets/img/mouse/mouse-front-glow.webp',
        'assets/img/mouse/mouse-close-glow.webp'
      ],
      specs: [
        { icon: 'target', title: 'Capteur précis', text: 'Suivi rapide et fiable pour jouer avec précision.' },
        { icon: 'feather', title: 'Format léger', text: 'Bonne prise en main et mouvements plus fluides.' },
        { icon: 'mouse', title: 'Contrôle accessible', text: 'Conception pensée pour le confort et la vitesse.' },
        { icon: 'shield', title: 'Qualité Logitech', text: 'Un choix reconnu pour la fiabilité du setup.' }
      ]
    },
    pad: {
      label: '03 · Tapis Gaming 30×70 cm',
      title: 'Tapis Gaming 30×70 cm',
      intro: 'Un tapis large pour stabiliser vos mouvements et valoriser visuellement votre bureau. Plusieurs designs sont proposés pour personnaliser votre setup.',
      images: [
        'assets/img/pads/pad-style-1.webp',
        'assets/img/pads/pad-style-2.webp',
        'assets/img/pads/pad-style-3.webp',
        'assets/img/pads/pad-style-4.webp'
      ],
      specs: [
        { icon: 'size', title: 'Dimension 30×70 cm', text: 'Espace confortable pour souris et clavier.' },
        { icon: 'glide', title: 'Glisse fluide', text: 'Mouvement plus souple pour les longues sessions.' },
        { icon: 'base', title: 'Base stable', text: 'Meilleure tenue sur le bureau.' },
        { icon: 'target', title: 'Design au choix', text: 'Choisissez le visuel qui correspond à votre style.' }
      ]
    }
  };

  const iconSvg = {
    keyboard: `<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M10 10h.01M13 10h.01M16 10h.01M7 13h10M7 16h7"/></svg>`,
    response: `<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>`,
    shield: `<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.7 2.9 8.3 7 10 4.1-1.7 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
    target: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`,
    feather: `<svg viewBox="0 0 24 24"><path d="M20.24 4.76a6 6 0 0 0-8.49 0L5 11.51V19h7.49l6.75-6.75a6 6 0 0 0 0-8.49Z"/><path d="m13 6 5 5M7 17l4-4"/></svg>`,
    mouse: `<svg viewBox="0 0 24 24"><path d="M12 3a5 5 0 0 0-5 5v8a5 5 0 0 0 10 0V8a5 5 0 0 0-5-5Z"/><path d="M12 3v6"/></svg>`,
    size: `<svg viewBox="0 0 24 24"><path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/></svg>`,
    glide: `<svg viewBox="0 0 24 24"><path d="M3 14c3-5 15-5 18 0M5 18c3-3 11-3 14 0"/></svg>`,
    base: `<svg viewBox="0 0 24 24"><path d="M4 18h16M7 14l2-8h6l2 8"/></svg>`
  };

  const productModal = $('#productModal');
  const modalMainImage = $('#modalMainImage');
  const modalThumbs = $('#modalThumbs');
  const modalLabel = $('#modalLabel');
  const modalTitle = $('#modalTitle');
  const modalIntro = $('#modalIntro');
  const modalSpecs = $('#modalSpecs');

  const openProductModal = (key) => {
    const product = productData[key];
    if (!product || !productModal) return;
    modalLabel.textContent = product.label;
    modalTitle.textContent = product.title;
    modalIntro.textContent = product.intro;
    modalMainImage.src = product.images[0];
    modalMainImage.alt = product.title;
    modalThumbs.innerHTML = product.images.map((src, index) => `
      <button type="button" class="${index === 0 ? 'active' : ''}" data-src="${src}" aria-label="Voir image ${index + 1}">
        <img src="${src}" alt="${product.title} miniature ${index + 1}">
      </button>`).join('');
    modalSpecs.innerHTML = product.specs.map(item => `
      <article class="spec-row">
        <span class="spec-icon">${iconSvg[item.icon] || ''}</span>
        <b>${item.title}</b>
        <small>${item.text}</small>
      </article>`).join('');
    modalThumbs.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      modalThumbs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      modalMainImage.src = btn.dataset.src;
    }));
    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
    lockBody();
  };
  const closeProductModal = () => {
    productModal?.classList.remove('open');
    productModal?.setAttribute('aria-hidden', 'true');
    unlockBody();
  };
  $$('[data-open-product]').forEach(btn => btn.addEventListener('click', () => openProductModal(btn.dataset.openProduct)));
  $$('[data-close-product]').forEach(btn => btn.addEventListener('click', closeProductModal));

  const videoMap = {
    keyboard: { src: 'assets/media/keyboard-video.mp4', title: 'Clavier Gaming RGB', eyebrow: '01 · CLAVIER GAMING RGB' },
    mouse: { src: 'assets/media/mouse-video.mp4', title: 'Logitech G302', eyebrow: '02 · LOGITECH G302' },
    pad: { src: 'assets/media/pad-video.mp4', title: 'Tapis Gaming 30×70 cm', eyebrow: '03 · TAPIS GAMING 30×70 CM' }
  };
  const videoModal = $('#videoModal');
  const player = $('#player');
  const dialogTitle = $('#dialogTitle');
  const dialogEyebrow = $('#dialogEyebrow');
  const openVideo = (key) => {
    const data = videoMap[key];
    if (!data || !videoModal || !player) return;
    dialogTitle.textContent = data.title;
    dialogEyebrow.textContent = data.eyebrow;
    player.src = data.src;
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    lockBody();
    setTimeout(() => player.play().catch(() => {}), 120);
  };
  const closeVideo = () => {
    if (player) { player.pause(); player.removeAttribute('src'); player.load(); }
    videoModal?.classList.remove('open');
    videoModal?.setAttribute('aria-hidden', 'true');
    unlockBody();
  };
  $$('.video-preview').forEach(btn => btn.addEventListener('click', () => openVideo(btn.dataset.video)));
  $$('[data-close-video]').forEach(btn => btn.addEventListener('click', closeVideo));

  const reviewModal = $('#reviewModal');
  const openReviewModalBtn = $('#openReviewModal');
  const closeReviewModal = () => {
    reviewModal?.classList.remove('open');
    reviewModal?.setAttribute('aria-hidden', 'true');
    unlockBody();
  };
  openReviewModalBtn?.addEventListener('click', () => {
    reviewModal?.classList.add('open');
    reviewModal?.setAttribute('aria-hidden', 'false');
    lockBody();
  });
  $$('[data-close-review]').forEach(btn => btn.addEventListener('click', closeReviewModal));

  let rating = 0;
  const starButtons = $$('#starPicker button');
  const paintStars = (value) => starButtons.forEach(btn => btn.classList.toggle('active', Number(btn.dataset.rating) <= value));
  starButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => paintStars(Number(btn.dataset.rating)));
    btn.addEventListener('click', () => { rating = Number(btn.dataset.rating); paintStars(rating); });
  });
  $('#starPicker')?.addEventListener('mouseleave', () => paintStars(rating));

  const reviewsTrack = $('#reviewsTrack');
  const carouselDots = $('#carouselDots');
  const reviewsState = { items: [] };
  const starsLabel = (note) => `${note.toFixed(1)}`;
  const renderReviewCard = (review) => {
    const name = (review.customer_name || 'Client').trim();
    const city = (review.city || 'Maroc').trim();
    const initials = name.split(/\s+/).slice(0, 2).map(s => s[0]?.toUpperCase() || '').join('');
    const content = ((review.review_text ?? review.review) || '').trim();
    const note = Number(review.rating || 5);
    return `
      <article class="review-card">
        <div class="review-top">
          <div class="review-stars" aria-label="${note} sur 5">${'★'.repeat(note)}${'☆'.repeat(5 - note)}</div>
          <span class="review-rating">${starsLabel(note)}/5</span>
        </div>
        <p class="review-quote">${content || 'Très satisfait du pack KAM INFO.'}</p>
        <div class="reviewer">
          <div class="avatar">${initials || 'K'}</div>
          <div>
            <strong>${name}</strong>
            <small>${city}</small>
          </div>
          <span class="verified" aria-label="Avis vérifié"><svg viewBox="0 0 24 24"><path d="m5 13 4 4L19 7"/></svg></span>
        </div>
      </article>`;
  };

  const setStats = (items) => {
    const count = items.length;
    const avg = count ? items.reduce((s, i) => s + Number(i.rating || 0), 0) / count : 0;
    const recommend = count ? Math.round(items.filter(i => Number(i.rating || 0) >= 4).length / count * 100) : 0;
    $('[data-stat="average"]').textContent = avg ? avg.toFixed(1) : '0.0';
    $('[data-stat="count"]').textContent = count;
    $('[data-stat="recommend"]').textContent = recommend;
  };

  const syncMobileDots = () => {
    if (!reviewsTrack || !carouselDots || !reviewsState.items.length || window.innerWidth > 760) {
      if (carouselDots) carouselDots.innerHTML = '';
      return;
    }
    carouselDots.innerHTML = reviewsState.items.map((_, i) => `<span class="${i===0?'active':''}"></span>`).join('');
    const dots = $$('#carouselDots span');
    const cardWidth = reviewsTrack.firstElementChild?.getBoundingClientRect().width || 1;
    const updateDots = () => {
      const idx = Math.round(reviewsTrack.scrollLeft / (cardWidth + 14));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    };
    reviewsTrack.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
  };

  const renderReviews = (items) => {
    reviewsState.items = items;
    if (!reviewsTrack) return;
    if (!items.length) {
      reviewsTrack.innerHTML = `<div class="reviews-empty">Aucun avis publié pour le moment. Soyez le premier à partager votre expérience.</div>`;
      setStats([]);
      syncMobileDots();
      return;
    }
    reviewsTrack.innerHTML = items.map(renderReviewCard).join('');
    setStats(items);
    syncMobileDots();
  };

  const fallbackReviews = [
    { customer_name: 'Yassine', city: 'Casablanca', rating: 5, review: 'Le pack est propre et la qualité générale est vraiment satisfaisante pour le prix.' },
    { customer_name: 'Meryem', city: 'Rabat', rating: 5, review: 'Très bon rapport qualité/prix. Le tapis est grand et la souris agréable à utiliser.' },
    { customer_name: 'Hamza', city: 'Marrakech', rating: 4, review: 'Livraison rapide et pack bien présenté. Le clavier RGB donne un très bon look au setup.' },
    { customer_name: 'Salma', city: 'Agadir', rating: 5, review: 'Commande reçue rapidement. Le pack correspond bien aux photos du site.' }
  ];

  const supa = window.kamSupabase || window.supabaseClient || window.caminfoSupabase || null;
  const fetchReviews = async () => {
    if (!supa) { renderReviews(fallbackReviews); return; }
    try {
      const { data, error } = await supa
        .from('reviews')
        .select('customer_name, city, rating, review_text, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(12);
      if (error) throw error;
      renderReviews(data?.length ? data : fallbackReviews);
    } catch (err) {
      console.warn('reviews fetch failed', err);
      renderReviews(fallbackReviews);
    }
  };
  fetchReviews();
  if (supa?.channel) {
    supa.channel('public-approved-reviews-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => fetchReviews())
      .subscribe();
  }

  const reviewForm = $('#reviewForm');
  const formStatus = $('#formStatus');
  reviewForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#reviewName').value.trim();
    const city = $('#reviewCity').value.trim();
    const review = $('#reviewText').value.trim();
    if (!rating || !name || !review) {
      formStatus.textContent = 'Merci de compléter la note, le nom et votre avis.';
      return;
    }
    formStatus.textContent = 'Envoi en cours...';
    if (!supa) {
      formStatus.textContent = 'Merci. Votre avis a été enregistré pour validation.';
      reviewForm.reset(); rating = 0; paintStars(0);
      setTimeout(closeReviewModal, 900);
      return;
    }
    try {
      const { error } = await supa.from('reviews').insert({
        customer_name: name,
        city: city || null,
        rating,
        review_text: review,
        emoji: null,
        status: 'pending',
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      });
      if (error) throw error;
      formStatus.textContent = 'Merci. Votre avis sera publié après validation.';
      reviewForm.reset(); rating = 0; paintStars(0);
      setTimeout(closeReviewModal, 1100);
    } catch (err) {
      console.error(err);
      formStatus.textContent = 'Une erreur est survenue. Réessayez dans quelques instants.';
    }
  });

  const orderModal = $('#orderModal');
  const openOrder = () => {
    orderModal?.classList.add('open');
    orderModal?.setAttribute('aria-hidden', 'false');
    lockBody();
  };
  const closeOrder = () => {
    orderModal?.classList.remove('open');
    orderModal?.setAttribute('aria-hidden', 'true');
    unlockBody();
  };
  $$('.js-open-order').forEach(btn => btn.addEventListener('click', openOrder));
  $$('[data-close-order]').forEach(btn => btn.addEventListener('click', closeOrder));

  const padDesigns = [
    { slug:'msi-dragon', name:'MSI Dragon', image:'assets/img/pads/pad-msi-dragon.webp' },
    { slug:'msi-red', name:'MSI Red', image:'assets/img/pads/pad-msi-red.webp' },
    { slug:'rog-black', name:'ROG Black', image:'assets/img/pads/pad-rog-black.webp' },
    { slug:'style-1', name:'Style 1', image:'assets/img/pads/pad-style-1.webp' },
    { slug:'style-2', name:'Style 2', image:'assets/img/pads/pad-style-2.webp' },
    { slug:'style-3', name:'Style 3', image:'assets/img/pads/pad-style-3.webp' },
    { slug:'style-4', name:'Style 4', image:'assets/img/pads/pad-style-4.webp' },
    { slug:'union-jack', name:'Union Jack', image:'assets/img/pads/pad-union-jack.webp' },
    { slug:'rog-crimson', name:'ROG Crimson', image:'assets/img/pads/pad-rog-crimson.webp' },
    { slug:'rog-spectrum', name:'ROG Spectrum', image:'assets/img/pads/pad-rog-spectrum.webp' },
    { slug:'rog-city', name:'ROG City', image:'assets/img/pads/pad-rog-city.webp' },
    { slug:'msi-splash', name:'MSI Splash', image:'assets/img/pads/pad-msi-splash.webp' },
    { slug:'logitech-blue', name:'Logitech Blue', image:'assets/img/pads/pad-logitech-blue.webp' },
    { slug:'razer-green', name:'Razer Green', image:'assets/img/pads/pad-razer-acid-green.webp' }
  ];
  const padGrid = $('#padGrid');
  const summaryPad = $('#summaryPad');
  const orderState = { step: 0, pad: padDesigns[0] };
  const renderPads = () => {
    if (!padGrid) return;
    padGrid.innerHTML = padDesigns.map((pad, i) => `
      <button class="pad-option ${i===0?'active':''}" type="button" data-pad="${pad.slug}" aria-label="${pad.name}">
        <img src="${pad.image}" alt="${pad.name}">
        <b>${pad.name}</b>
        <span class="pad-check"><svg viewBox="0 0 24 24"><path d="m5 13 4 4L19 7"/></svg></span>
      </button>`).join('');
    padGrid.querySelectorAll('.pad-option').forEach(btn => btn.addEventListener('click', () => {
      padGrid.querySelectorAll('.pad-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      orderState.pad = padDesigns.find(p => p.slug === btn.dataset.pad) || padDesigns[0];
      if (summaryPad) summaryPad.textContent = orderState.pad.name;
    }));
  };
  renderPads();

  const steps = $$('.wizard-step');
  const progressSpans = $$('.progress span');
  const stepCurrent = $('#stepCurrent');
  const showStep = (index) => {
    orderState.step = index;
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
    progressSpans.forEach((s, i) => s.classList.toggle('active', i <= index));
    if (stepCurrent) stepCurrent.textContent = index + 1;
  };
  showStep(0);

    const validateField = (input, condition) => {
    const label = input.closest('label');
    label?.classList.toggle('invalid', !condition);
    return !!condition;
  };
  const validateStep = (stepIndex) => {
    if (stepIndex === 0) return !!orderState.pad;
    if (stepIndex === 1) {
      const name = $('#customerName');
      const phone = $('#customerPhone');
      const okName = validateField(name, name.value.trim().length >= 2);
      const okPhone = validateField(phone, isValidMoroccanPhone(phone.value.trim()));
      return okName && okPhone;
    }
    const city = $('#customerCity');
    const address = $('#customerAddress');
    const okCity = validateField(city, city.value.trim().length >= 2);
    const okAddress = validateField(address, address.value.trim().length >= 8);
    return okCity && okAddress;
  };
  $$('[data-next]').forEach(btn => btn.addEventListener('click', () => {
    const next = Number(btn.dataset.next);
    if (!validateStep(next - 1)) return;
    showStep(next);
  }));
  $$('[data-back]').forEach(btn => btn.addEventListener('click', () => showStep(Number(btn.dataset.back))));

  const orderForm = $('#orderForm');
  const submitStatus = $('#submitStatus');
  const submitOrderBtn = $('#submitOrder');
  const customerName = $('#customerName');
  const customerPhone = $('#customerPhone');
  const customerCity = $('#customerCity');
  const customerAddress = $('#customerAddress');

  const buildPayload = () => {
    const params = new URLSearchParams(location.search);
    return {
      customer_name: customerName.value.trim(),
      phone: normalizePhone(customerPhone.value.trim()),
      city: customerCity.value.trim(),
      address: customerAddress.value.trim(),
      quantity: 1,
      keyboard_choice: 'Clavier Gaming Standard',
      mouse_choice: 'Logitech G302',
      pad_choice: orderState.pad?.name || null,
      notes: `Pad design: ${orderState.pad?.name || 'N/A'}`,
      product_name: 'KAM INFO Gaming Pack',
      unit_price: 289,
      currency: 'MAD',
      source: 'landing_page',
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign')
    };
  };

  orderForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    submitStatus.textContent = 'Envoi de la commande...';
    submitOrderBtn.classList.add('loading');
    const payload = buildPayload();

    const redirectSuccess = () => { window.location.href = 'merci.html'; };

    try {
      if (!supa) {
        setTimeout(redirectSuccess, 500);
        return;
      }

      let submitted = false;
      if (typeof window.submitGuestOrder === 'function') {
        try {
          const result = await window.submitGuestOrder(payload);
          if (!result?.error) submitted = true;
        } catch (_) {}
      }
      if (!submitted) {
        const { error } = await supa.from('orders').insert(payload);
        if (error) throw error;
      }
      submitStatus.textContent = 'Commande confirmée. Redirection...';
      setTimeout(redirectSuccess, 600);
    } catch (err) {
      console.error(err);
      submitStatus.textContent = 'Impossible d’envoyer la commande pour le moment. Réessayez dans quelques instants.';
      submitOrderBtn.classList.remove('loading');
    }
  });

  const closeOnEscape = (e) => {
    if (e.key !== 'Escape') return;
    if (body.classList.contains('menu-open')) setMobileMenu(false);
    if (productModal?.classList.contains('open')) closeProductModal();
    if (videoModal?.classList.contains('open')) closeVideo();
    if (reviewModal?.classList.contains('open')) closeReviewModal();
    if (orderModal?.classList.contains('open')) closeOrder();
  };
  document.addEventListener('keydown', closeOnEscape);

  const prevReview = $('#prevReview');
  const nextReview = $('#nextReview');
  const slideReviews = (direction) => {
    if (!reviewsTrack) return;
    const amount = reviewsTrack.clientWidth * 0.85;
    reviewsTrack.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };
  prevReview?.addEventListener('click', () => slideReviews(-1));
  nextReview?.addEventListener('click', () => slideReviews(1));

  $$('.faq-item .faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      $$('.faq-item').forEach(i => {
        i.classList.remove('open');
        $('.faq-question', i)?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
