(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const body = document.body;
  const isAR = document.documentElement.lang.toLowerCase().startsWith('ar');
  const assetPath = (path) => `${isAR ? '../' : ''}assets/${String(path).replace(/^\/+/, '')}`;
  const i18n = (fr, ar) => isAR ? ar : fr;
  const hasArabic = (value = '') => /[\u0600-\u06FF]/.test(String(value));

  const year = $('#currentYear');
  if (year) year.textContent = new Date().getFullYear();
  const mobileMenu = $('#mobileMenu');
  const burger = $('#burger');

  const setMobileMenu = (open) => {
    if (!burger || !mobileMenu) return;
    body.classList.toggle('menu-open', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? i18n('Fermer le menu', 'إغلاق القائمة') : i18n('Ouvrir le menu', 'فتح القائمة'));
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
    headerLinks.forEach(a => { const active = a.getAttribute('href') === `#${current}`; a.classList.toggle('is-active', active); if (active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  window.addEventListener('scroll', () => {
    if (typeof runStatsAnimation === 'function') runStatsAnimation();
  }, { passive: true });
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
  let lastModalTrigger = null;
  const rememberTrigger = () => { lastModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null; };
  const focusDialog = (root) => window.setTimeout(() => root?.querySelector('button,[href],input,textarea,[tabindex]:not([tabindex=\"-1\"])')?.focus(), 40);
  const restoreTrigger = () => window.setTimeout(() => lastModalTrigger?.focus?.(), 20);

  const productData = {
    keyboard: {
      label: '01 · Clavier Gaming RGB',
      title: 'Clavier Gaming RGB',
      intro: 'Un clavier pensé pour offrir une frappe réactive, un look RGB marqué et une présence forte sur le bureau. Il complète parfaitement le pack KAM INFO.',
      images: [
        assetPath('img/keyboard/keyboard-top.webp'),
        assetPath('img/keyboard/keyboard-lifestyle.webp'),
        assetPath('img/keyboard/keyboard-box.webp')
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
        assetPath('img/mouse/mouse-blue-glow.webp'),
        assetPath('img/mouse/mouse-side-glow.webp'),
        assetPath('img/mouse/mouse-front-glow.webp'),
        assetPath('img/mouse/mouse-close-glow.webp')
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
        assetPath('img/pads/pad-style-1.webp'),
        assetPath('img/pads/pad-style-2.webp'),
        assetPath('img/pads/pad-style-3.webp'),
        assetPath('img/pads/pad-style-4.webp')
      ],
      specs: [
        { icon: 'size', title: 'Dimension 30×70 cm', text: 'Espace confortable pour souris et clavier.' },
        { icon: 'glide', title: 'Glisse fluide', text: 'Mouvement plus souple pour les longues sessions.' },
        { icon: 'base', title: 'Base stable', text: 'Meilleure tenue sur le bureau.' },
        { icon: 'target', title: 'Design au choix', text: 'Choisissez le visuel qui correspond à votre style.' }
      ]
    }
  };

  if (isAR) {
    Object.assign(productData, {
      keyboard: {
        ...productData.keyboard,
        label: '01 · كلافية Gaming RGB',
        title: 'كلافية Gaming RGB',
        intro: 'كلافية بإضاءة RGB واستجابة سريعة، مناسبة للغيمينغ والاستعمال اليومي وكتكمل الـSetup ديالك بشكل واضح.',
        specs: [
          { icon: 'keyboard', title: 'إضاءة RGB', text: 'إضاءة RGB كتزيد لمسة غيمينغ واضحة للـSetup.' },
          { icon: 'response', title: 'أزرار سريعة الاستجابة', text: 'كتابة سلسة واستجابة سريعة فالاستعمال اليومي.' },
          { icon: 'shield', title: 'Anti-ghosting', text: 'تحكم أدق ملي كتضغط على عدة أزرار بسرعة.' },
          { icon: 'target', title: 'حجم كامل', text: 'حجم كامل ومناسب للغيمينغ والاستعمال اليومي.' }
        ]
      },
      mouse: {
        ...productData.mouse,
        label: '02 · Logitech G302',
        title: 'Logitech G302',
        intro: 'ماوس خفيفة ودقيقة كتكمّل الكلافية ديال الباك وكتساعد على تحكم أسرع فالحركة.',
        specs: [
          { icon: 'target', title: 'مستشعر دقيق', text: 'تتبع سريع وموثوق للحركات.' },
          { icon: 'feather', title: 'تصميم خفيف', text: 'قبضة مريحة وحركة أسلس.' },
          { icon: 'mouse', title: 'تحكم سهل', text: 'أزرار سهلة الوصول واستعمال مريح.' },
          { icon: 'shield', title: 'جودة Logitech', text: 'ماوس Logitech معروفة بسهولة الاستعمال والتحكم المريح.' }
        ]
      },
      pad: {
        ...productData.pad,
        label: '03 · تابيس Gaming 30×70 سم',
        title: 'تابيس Gaming 30×70 سم',
        intro: 'تابيس كبير كيخلي حركة الماوس مستقرة وكيعطي للمكتب شكل منظم. كاينين عدة تصاميم باش تختار الشكل اللي مناسب للـSetup ديالك.',
        specs: [
          { icon: 'size', title: 'قياس 30×70 سم', text: 'مساحة مريحة للماوس والكلافية.' },
          { icon: 'glide', title: 'حركة سلسة', text: 'سطح مناسب للحركات الطويلة والدقيقة.' },
          { icon: 'base', title: 'قاعدة ثابتة', text: 'ثبات أحسن فوق المكتب.' },
          { icon: 'target', title: 'تصميم على اختيارك', text: 'اختار التصميم اللي مناسب للـSetup ديالك.' }
        ]
      }
    });
  }

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
      <button type="button" class="${index === 0 ? 'active' : ''}" data-src="${src}" aria-label="${i18n('Voir image', 'شوف الصورة')} ${index + 1}">
        <img src="${src}" alt="${product.title} ${i18n('miniature', 'صورة مصغرة')} ${index + 1}" loading="lazy" decoding="async">
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
    rememberTrigger();
    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
    lockBody();
    focusDialog(productModal);
  };
  const closeProductModal = () => {
    productModal?.classList.remove('open');
    productModal?.setAttribute('aria-hidden', 'true');
    unlockBody();
    restoreTrigger();
  };
  $$('[data-open-product]').forEach(btn => btn.addEventListener('click', () => openProductModal(btn.dataset.openProduct)));
  $$('[data-close-product]').forEach(btn => btn.addEventListener('click', closeProductModal));

  const reviewModal = $('#reviewModal');
  const openReviewModalBtn = $('#openReviewModal');
  const openReviewModal = () => {
    if (!reviewModal) return;
    rememberTrigger();
    reviewModal.classList.add('open');
    reviewModal.setAttribute('aria-hidden', 'false');
    lockBody();
    focusDialog(reviewModal);
  };
  const closeReviewModal = () => {
    reviewModal?.classList.remove('open');
    reviewModal?.setAttribute('aria-hidden', 'true');
    unlockBody();
    restoreTrigger();
  };
  openReviewModalBtn?.addEventListener('click', openReviewModal);
  $$('[data-close-review]').forEach(btn => btn.addEventListener('click', closeReviewModal));

  let rating = 0;
  const starButtons = $$('#starPicker button');
  const paintStars = (value) => starButtons.forEach(btn => { const active = Number(btn.dataset.rating) <= value; btn.classList.toggle('active', active); btn.setAttribute('aria-checked', Number(btn.dataset.rating) === value ? 'true' : 'false'); });
  starButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => paintStars(Number(btn.dataset.rating)));
    btn.addEventListener('click', () => { rating = Number(btn.dataset.rating); paintStars(rating); });
  });
  $('#starPicker')?.addEventListener('mouseleave', () => paintStars(rating));

  const reviewsTrack = $('#reviewsTrack');
  const carouselDots = $('#carouselDots');
  const reviewsState = { items: [] };
  const allReviewsModal = $('#allReviewsModal');
  const allReviewsList = $('#allReviewsList');
  const reviewsMoreWrap = $('#reviewsMoreWrap');
  const starsLabel = (note) => `${note.toFixed(1)}`;
  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const renderReviewCard = (review) => {
    const name = (review.customer_name || i18n('Client', 'زبون')).trim();
    const city = (review.city || i18n('Maroc', 'المغرب')).trim();
    const safeName = escapeHTML(name);
    const safeCity = escapeHTML(city);
    const initials = name.split(/\s+/).slice(0, 2).map(s => s[0]?.toUpperCase() || '').join('');
    const content = ((review.review_text ?? review.review) || '').trim();
    const safeContent = escapeHTML(content);
    const reviewLang = hasArabic(name + city + content) ? 'ar' : 'fr';
    const reviewDir = reviewLang === 'ar' ? 'rtl' : 'ltr';
    const note = Number(review.rating || 5);
    return `
      <article class="review-card">
        <div class="review-top">
          <div class="review-stars" aria-label="${note} ${i18n('sur 5', 'من 5')}">${'★'.repeat(note)}${'☆'.repeat(5 - note)}</div>
          <span class="review-rating">${starsLabel(note)}/5</span>
        </div>
        <p class="review-quote" lang="${reviewLang}" dir="${reviewDir}">${safeContent}</p>
        <div class="reviewer">
          <div class="avatar">${initials || 'K'}</div>
          <div>
            <strong lang="${reviewLang}" dir="${reviewDir}">${safeName}</strong>
            <small lang="${reviewLang}" dir="${reviewDir}">${safeCity}</small>
          </div>
          <span class="verified" aria-label="${i18n('Avis vérifié', 'رأي تمت مراجعته')}"><svg viewBox="0 0 24 24"><path d="m5 13 4 4L19 7"/></svg></span>
        </div>
      </article>`;
  };

  const statsAnimationState = {
    values: { average: 0, count: 0, recommend: 0 },
    hasAnimated: false,
    ready: false
  };

  const animateStatNumber = (el, target, decimals = 0, duration = 1250, delay = 0) => {
    if (!el) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      el.textContent = Number(target).toFixed(decimals);
      return;
    }

    window.setTimeout(() => {
      const startTime = performance.now();
      const startValue = 0;
      const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

      const frame = now => {
        const progress = Math.min(1, (now - startTime) / duration);
        const value = startValue + (target - startValue) * easeOutCubic(progress);
        el.textContent = value.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          el.textContent = Number(target).toFixed(decimals);
        }
      };

      requestAnimationFrame(frame);
    }, delay);
  };

  const runStatsAnimation = () => {
    if (!statsAnimationState.ready || statsAnimationState.hasAnimated) return;

    const panel = $('#statsPanel');
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const visible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    if (!visible) return;

    statsAnimationState.hasAnimated = true;

    animateStatNumber(
      $('[data-stat="average"]'),
      statsAnimationState.values.average,
      1,
      1200,
      40
    );
    animateStatNumber(
      $('[data-stat="count"]'),
      statsAnimationState.values.count,
      0,
      1350,
      150
    );
    animateStatNumber(
      $('[data-stat="recommend"]'),
      statsAnimationState.values.recommend,
      0,
      1450,
      260
    );
  };

  const setStats = (items) => {
    const count = items.length;
    const avg = count ? items.reduce((s, i) => s + Number(i.rating || 0), 0) / count : 0;
    const recommend = count ? Math.round(items.filter(i => Number(i.rating || 0) >= 4).length / count * 100) : 0;

    statsAnimationState.values = {
      average: avg,
      count,
      recommend
    };
    statsAnimationState.ready = true;

    $('[data-stat="average"]').textContent = '0.0';
    $('[data-stat="count"]').textContent = '0';
    $('[data-stat="recommend"]').textContent = '0';

    runStatsAnimation();
  };

  const syncMobileDots = () => {
    if (!reviewsTrack || !carouselDots || !reviewsState.items.length || window.innerWidth > 760) {
      if (carouselDots) carouselDots.innerHTML = '';
      return;
    }
    carouselDots.innerHTML = Array.from(reviewsTrack.children).map((_, i) => `<span class="${i===0?'active':''}"></span>`).join('');
    const dots = $$('#carouselDots span');
    const cardWidth = reviewsTrack.firstElementChild?.getBoundingClientRect().width || 1;
    const updateDots = () => {
      const idx = Math.round(reviewsTrack.scrollLeft / (cardWidth + 14));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    };
    reviewsTrack.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
  };

  const renderAllReviewsList = () => {
    if (!allReviewsList) return;
    const items = reviewsState.items;
    allReviewsList.innerHTML = items.length
      ? items.map(renderReviewCard).join('')
      : `<div class="reviews-empty">${i18n('Aucun avis publié pour le moment.', 'ما كاين حتى رأي منشور حالياً.')}</div>`;

    $('#allReviewsModalCount') && ($('#allReviewsModalCount').textContent = String(items.length));
  };

  const renderReviews = (items) => {
    reviewsState.items = items;
    if (!reviewsTrack) return;

    if (!items.length) {
      reviewsTrack.innerHTML = `<div class="reviews-empty">${i18n('Aucun avis publié pour le moment. Soyez le premier à partager votre expérience.', 'ما كاين حتى رأي منشور حالياً. تقدر تكون أول واحد يشارك تجربته.')}</div>`;
      if (reviewsMoreWrap) reviewsMoreWrap.hidden = true;
      setStats([]);
      syncMobileDots();
      renderAllReviewsList();
      return;
    }

    // Keep the storefront compact: only the 4 newest reviews are rendered here.
    // Every approved review remains available in the scrollable modal.
    const featured = items.slice(0, 4);
    reviewsTrack.innerHTML = featured.map(renderReviewCard).join('');

    if (reviewsMoreWrap) reviewsMoreWrap.hidden = items.length <= 4;
    const countBadge = $('#allReviewsCount');
    if (countBadge) countBadge.textContent = String(items.length);

    setStats(items);
    syncMobileDots();
    renderAllReviewsList();
  };


  const openAllReviews = () => {
    if (!allReviewsModal) return;
    rememberTrigger();
    renderAllReviewsList();
    allReviewsModal.classList.add('open');
    allReviewsModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('all-reviews-open');
    window.setTimeout(() => allReviewsList?.focus(), 100);
  };

  const closeAllReviews = () => {
    if (!allReviewsModal) return;
    allReviewsModal.classList.remove('open');
    allReviewsModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('all-reviews-open');
    restoreTrigger();
  };

  $('#openAllReviews')?.addEventListener('click', openAllReviews);
  $$('[data-close-all-reviews]').forEach(btn => btn.addEventListener('click', closeAllReviews));

  $('#addReviewFromAll')?.addEventListener('click', () => {
    closeAllReviews();
    window.setTimeout(openReviewModal, 120);
  });

  const supa = window.kamSupabase || window.supabaseClient || window.caminfoSupabase || null;
  const fetchReviews = async () => {
    if (!supa) { renderReviews([]); return; }
    try {
      const { data, error } = await supa
        .from('reviews')
        .select('customer_name, city, rating, review_text, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      renderReviews(data || []);
    } catch (err) {
      console.warn('reviews fetch failed', err);
      renderReviews([]);
    }
  };
  const reviewsSection = $('#reviews');
  if (reviewsSection && 'IntersectionObserver' in window) {
    const reviewsLoader = new IntersectionObserver((entries, obs) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      obs.disconnect();
      fetchReviews();
    }, { rootMargin: '600px 0px' });
    reviewsLoader.observe(reviewsSection);
  } else {
    fetchReviews();
  }

  const reviewForm = $('#reviewForm');
  const formStatus = $('#formStatus');
  reviewForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#reviewName').value.trim();
    const city = $('#reviewCity').value.trim();
    const review = $('#reviewText').value.trim();
    if (!rating || !name || !review) {
      formStatus.textContent = i18n('Merci de compléter la note, le nom et votre avis.', 'كمّل التقييم والاسم والرأي ديالك.');
      return;
    }
    formStatus.textContent = i18n('Envoi en cours...', 'جاري الإرسال...');
    if (!supa) {
      formStatus.textContent = i18n('Service d’avis temporairement indisponible. Réessayez dans quelques instants.', 'خدمة الآراء غير متوفرة مؤقتاً. حاول مرة أخرى بعد قليل.');
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
      formStatus.textContent = i18n('Merci. Votre avis sera publié après validation.', 'شكراً. الرأي ديالك غادي يتنشر من بعد المراجعة.');
      reviewForm.reset(); rating = 0; paintStars(0);
      setTimeout(closeReviewModal, 1100);
    } catch (err) {
      console.warn('Review submission failed:', err);
      formStatus.textContent = i18n('Une erreur est survenue. Réessayez dans quelques instants.', 'وقع مشكل. حاول مرة أخرى بعد قليل.');
    }
  });

  const orderModal = $('#orderModal');
  const openOrder = () => {
    rememberTrigger();
    orderModal?.classList.add('open');
    orderModal?.setAttribute('aria-hidden', 'false');
    lockBody();
    focusDialog(orderModal);
  };
  const closeOrder = () => {
    orderModal?.classList.remove('open');
    orderModal?.setAttribute('aria-hidden', 'true');
    unlockBody();
    restoreTrigger();
  };
  $$('.js-open-order').forEach(btn => btn.addEventListener('click', openOrder));
  $$('[data-close-order]').forEach(btn => btn.addEventListener('click', closeOrder));

  const padDesigns = [
    { slug:'msi-dragon', name:'MSI Dragon', image:assetPath('img/pads/pad-msi-dragon.webp') },
    { slug:'msi-red', name:'MSI Red', image:assetPath('img/pads/pad-msi-red.webp') },
    { slug:'rog-black', name:'ROG Black', image:assetPath('img/pads/pad-rog-black.webp') },
    { slug:'style-1', name:'Style 1', image:assetPath('img/pads/pad-style-1.webp') },
    { slug:'style-2', name:'Style 2', image:assetPath('img/pads/pad-style-2.webp') },
    { slug:'style-3', name:'Style 3', image:assetPath('img/pads/pad-style-3.webp') },
    { slug:'style-4', name:'Style 4', image:assetPath('img/pads/pad-style-4.webp') },
    { slug:'union-jack', name:'Union Jack', image:assetPath('img/pads/pad-union-jack.webp') },
    { slug:'rog-crimson', name:'ROG Crimson', image:assetPath('img/pads/pad-rog-crimson.webp') },
    { slug:'rog-spectrum', name:'ROG Spectrum', image:assetPath('img/pads/pad-rog-spectrum.webp') },
    { slug:'rog-city', name:'ROG City', image:assetPath('img/pads/pad-rog-city.webp') },
    { slug:'msi-splash', name:'MSI Splash', image:assetPath('img/pads/pad-msi-splash.webp') },
    { slug:'logitech-blue', name:'Logitech Blue', image:assetPath('img/pads/pad-logitech-blue.webp') },
    { slug:'razer-green', name:'Razer Green', image:assetPath('img/pads/pad-razer-acid-green.webp') }
  ];
  const padGrid = $('#padGrid');
  const summaryPad = $('#summaryPad');
  const orderState = { step: 0, pad: padDesigns[0] };
  const renderPads = () => {
    if (!padGrid) return;
    padGrid.innerHTML = padDesigns.map((pad, i) => `
      <button class="pad-option ${i===0?'active':''}" type="button" data-pad="${pad.slug}" aria-label="${pad.name}">
        <img src="${pad.image}" alt="${i18n('Tapis gaming 30×70 cm', 'تابيس Gaming 30×70 سم')} — ${pad.name}" loading="lazy" decoding="async">
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
      source: isAR ? 'landing_page_ar' : 'landing_page',
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
    submitStatus.textContent = i18n('Envoi de la commande...', 'جاري إرسال الطلب...');
    submitOrderBtn.classList.add('loading');
    const payload = buildPayload();

    const redirectSuccess = () => { window.location.href = 'merci.html'; };

    try {
      if (!supa) throw new Error(i18n('Service de commande indisponible', 'خدمة الطلب غير متوفرة'));

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
      submitStatus.textContent = i18n('Commande confirmée. Redirection...', 'تم تأكيد الطلب. جاري التحويل...');
      setTimeout(redirectSuccess, 600);
    } catch (err) {
      console.warn('Order submission failed:', err);
      submitStatus.textContent = i18n('Impossible d’envoyer la commande pour le moment. Réessayez dans quelques instants.', 'ما قدرناش نرسلو الطلب دابا. حاول مرة أخرى بعد قليل.');
      submitOrderBtn.classList.remove('loading');
    }
  });



  // V10 — WhatsApp widget using the real KAM INFO contact number
  const WHATSAPP_NUMBER = '212645505322';
  const waPanel = $('#waWidget');
  const waToggleBtn = $('#waToggleBtn');
  const waCloseBtn = $('#waClose');
  const waInput = $('#waInput');

  const buildWhatsAppUrl = (message) => {
    const text = (message || '').trim() || i18n('Salut KAM INFO, je souhaite des informations sur le Gaming Pack.', 'سلام KAM INFO، بغيت معلومات على باك الغيمينغ.');
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const openWhatsAppPanel = () => {
    if (!waPanel || !waToggleBtn) return;
    waPanel.classList.add('active');
    waPanel.setAttribute('aria-hidden', 'false');
    waToggleBtn.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => waInput?.focus(), 180);
  };

  const closeWhatsAppPanel = () => {
    if (!waPanel || !waToggleBtn) return;
    waPanel.classList.remove('active');
    waPanel.setAttribute('aria-hidden', 'true');
    waToggleBtn.setAttribute('aria-expanded', 'false');
  };

  const sendWhatsAppMessage = (message) => {
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  waToggleBtn?.addEventListener('click', event => {
    event.stopPropagation();
    waPanel?.classList.contains('active') ? closeWhatsAppPanel() : openWhatsAppPanel();
  });

  waCloseBtn?.addEventListener('click', closeWhatsAppPanel);

  waPanel?.addEventListener('click', event => event.stopPropagation());

  $$('.wa-q-btn').forEach(button => {
    button.addEventListener('click', () => sendWhatsAppMessage(button.dataset.wa));
  });

  $('#waSend')?.addEventListener('click', () => sendWhatsAppMessage(waInput?.value));

  waInput?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendWhatsAppMessage(event.currentTarget.value);
    }
  });

  document.addEventListener('click', event => {
    if (!waPanel?.classList.contains('active')) return;
    if (event.target.closest('#waWidget') || event.target.closest('#waToggleBtn')) return;
    closeWhatsAppPanel();
  });

  const languageLinks = $$('[data-lang-link]');
  const nearestSectionId = () => {
    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    $$('main section[id]').forEach(section => {
      const distance = Math.abs(section.getBoundingClientRect().top - 110);
      if (distance < bestDistance) { best = section.id; bestDistance = distance; }
    });
    return location.hash ? location.hash.slice(1) : best;
  };
  languageLinks.forEach(link => link.addEventListener('click', event => {
    const section = nearestSectionId();
    if (!section) return;
    const target = new URL(link.href, location.origin);
    target.hash = section;
    event.preventDefault();
    location.href = target.pathname + target.hash;
  }));

  const closeOnEscape = (e) => {
    if (e.key !== 'Escape') return;
    if (body.classList.contains('menu-open')) setMobileMenu(false);
    if (productModal?.classList.contains('open')) closeProductModal();
    if (reviewModal?.classList.contains('open')) closeReviewModal();
    if (allReviewsModal?.classList.contains('open')) closeAllReviews();
    if (orderModal?.classList.contains('open')) closeOrder();
    if (waPanel?.classList.contains('active')) closeWhatsAppPanel();
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
