const qs=(s,c=document)=>c.querySelector(s);const qsa=(s,c=document)=>[...c.querySelectorAll(s)];const sb=window.caminfoSupabase;const WHATSAPP_NUMBER='212645505322';const PRICE=289;const PHONE_REGEX=/^0[5-7][0-9]{8}$/;const STORAGE={visitor:'kaminfo_visitor_id',session:'kaminfo_session_id'};
const state={selectedPad:'MSI Dragon',rating:5,audioCtx:null,audioReady:false,typingPlayed:new WeakSet(),pads:[['MSI Dragon','assets/img/pads/pad-msi-dragon.png'],['MSI Red','assets/img/pads/pad-msi-red.png'],['ROG Black','assets/img/pads/pad-rog-black.png'],['MSI Spiral','assets/img/pads/pad-style-1.jpeg'],['Ryzen Red','assets/img/pads/pad-style-2.jpeg'],['ROG Neon','assets/img/pads/pad-style-3.jpeg'],['Panther Red','assets/img/pads/pad-style-4.jpeg'],['Union Jack','assets/img/pads/pad-union-jack.png'],['ROG Crimson Slash','assets/img/pads/pad-rog-crimson.png'],['ROG Neon Spectrum','assets/img/pads/pad-rog-spectrum.png'],['ROG Cyber City','assets/img/pads/pad-rog-city.png'],['MSI Dragon Splash','assets/img/pads/pad-msi-splash.png'],['Logitech Blue Circuit','assets/img/pads/pad-logitech-blue.png'],['Razer Acid Green','assets/img/pads/pad-razer-acid-green.jpeg']],productData:{'pad-modal':{title:'Tapis Gaming 30×70',desc:'تابي كبير 30×70 كيغطّي المساحة ديال clavier والسوريس كاملة، وكيخليك تختار من عدد كبير ديال الستايلات اللي زادت دابا فالموقع.',images:['assets/img/pads/pad-msi-dragon.png','assets/img/pads/pad-msi-red.png','assets/img/pads/pad-rog-black.png','assets/img/pads/pad-style-1.jpeg','assets/img/pads/pad-style-2.jpeg','assets/img/pads/pad-style-3.jpeg','assets/img/pads/pad-style-4.jpeg','assets/img/pads/pad-union-jack.png','assets/img/pads/pad-rog-crimson.png','assets/img/pads/pad-rog-spectrum.png','assets/img/pads/pad-rog-city.png','assets/img/pads/pad-msi-splash.png','assets/img/pads/pad-logitech-blue.png','assets/img/pads/pad-razer-acid-green.jpeg'],video:'assets/media/pad-video.mp4',poster:'assets/img/pads/pad-msi-dragon.png',bullets:['Dimension 30×70 cm','Surface واسعة ومريحة للحركة','تصاميم كثيرة متوفرة دابا من بينها ستايل Razer Acid Green','مناسب للـ clavier + souris فوق نفس التابي']},'mouse-modal':{title:'Logitech G302',desc:'سوريس Logitech G302 بالشكل gaming المعروف ديالها، خفيفة فالاستخدام ومناسبة للـ setup اللي كيبغي look احترافي مع مسكة مريحة.',images:['assets/img/mouse/mouse-front-glow.png','assets/img/mouse/mouse-blue-glow.png','assets/img/mouse/mouse-side-glow.png','assets/img/mouse/mouse-close-glow.png'],video:'assets/media/mouse-video.mp4',poster:'assets/img/mouse/mouse-front-glow.png',bullets:['Design gamer واضح','مسكة مريحة فاللعب والاستعمال اليومي','Software support','كتجي داخلة فالباك جاهزة']},'keyboard-modal':{title:'Clavier Gaming',desc:'تعتبر لوحة مفاتيح ميتيون K9520 خيارا احترافيا للاعبين، حيث تأتي بتصميم مريح يتضمن مسندا مغناطيسيا للمعصم قابل للفصل لتوفير راحة قصوى. تتميز بإضاءة RGB خلفية قابلة للتخصيص بالكامل لتناسب جو الألعاب الخاص بك.',images:['assets/img/keyboard/keyboard-top.jpg','assets/img/keyboard/keyboard-box.png','assets/img/keyboard/keyboard-lifestyle.jpg'],video:'assets/media/keyboard-video.mp4',poster:'assets/img/keyboard/keyboard-top.jpg',bullets:['Look gamer عصري وجذاب','إضاءة RGB خلفية قابلة للتخصيص','تنظيم مزيان فوق المكتب بفضل التصميم المدمج','مسند معصم مغناطيسي مريح وقابل للفصل','26 مفتاح Anti-ghosting لمنع تعارض الأوامر','12 مفتاح اختصار للميديا والوظائف الذكية']}}};
function uuid(){return crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(16).slice(2)}`}function visitorId(){let v=localStorage.getItem(STORAGE.visitor);if(!v){v=uuid();localStorage.setItem(STORAGE.visitor,v)}return v}function sessionId(){let v=sessionStorage.getItem(STORAGE.session);if(!v){v=uuid();sessionStorage.setItem(STORAGE.session,v)}return v}async function track(event_type='page_view',metadata={}){if(!sb)return;try{await sb.from('page_views').insert({visitor_id:visitorId(),session_id:sessionId(),page_path:location.pathname||'/',page_title:document.title,event_type,referrer:document.referrer||null,user_agent:navigator.userAgent,utm_source:new URLSearchParams(location.search).get('utm_source'),utm_medium:new URLSearchParams(location.search).get('utm_medium'),utm_campaign:new URLSearchParams(location.search).get('utm_campaign'),metadata})}catch(e){}}function toast(msg){const el=qs('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('show'),3600)}function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
async function ensureAudio(){if(!state.audioCtx)state.audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(state.audioCtx.state==='suspended')await state.audioCtx.resume();state.audioReady=true}function playTone(freq=440,duration=.04,type='triangle',gainValue=.016){if(!state.audioReady||!state.audioCtx)return;const osc=state.audioCtx.createOscillator(),gain=state.audioCtx.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,state.audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(gainValue,state.audioCtx.currentTime+.01);gain.gain.exponentialRampToValueAtTime(.0001,state.audioCtx.currentTime+duration);osc.connect(gain);gain.connect(state.audioCtx.destination);osc.start();osc.stop(state.audioCtx.currentTime+duration)}function initAudio(){const unlock=async()=>{await ensureAudio();playTone(680,.08,'triangle',.03)};['pointerdown','touchstart','click'].forEach(evt=>window.addEventListener(evt,unlock,{once:true,passive:true}));document.addEventListener('click',e=>{if(e.target.closest('button,a,summary,.product-card,.pad-option')){playTone(760,.06,'sawtooth',.022);setTimeout(()=>playTone(980,.035,'triangle',.014),24)}})}
function preloadExperience(){const assets=['assets/img/logo.jpg','assets/img/keyboard/keyboard-box.png','assets/img/mouse/mouse-front-glow.png','assets/img/pads/pad-msi-dragon.png'];const progress=qs('#loaderProgress'),text=qs('#loaderState');let loaded=0;const mark=()=>{loaded++;const pct=Math.min(100,Math.round(loaded/assets.length*100));if(progress)progress.style.width=`${pct}%`;if(text)text.textContent=`${pct}%`;if(loaded>=assets.length)setTimeout(()=>qs('#preloader')?.classList.add('hidden'),300)};assets.forEach(src=>{const img=new Image();img.onload=mark;img.onerror=mark;img.src=src})}
function initHeroVideo(){
  const video=qs('#heroVideo');
  if(!video||!video.dataset.src)return;

  if(video.dataset.loaded==='1')return;

  video.innerHTML=`<source src="${video.dataset.src}" type="video/mp4">`;
  video.dataset.loaded='1';
  video.load();
  video.play().catch(()=>{});
}
function initCursorGlow(){const glow=qs('.cursor-glow');if(!glow)return;window.addEventListener('pointermove',e=>{glow.style.left=`${e.clientX}px`;glow.style.top=`${e.clientY}px`},{passive:true})}function initReveal(){const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('visible');if(entry.target.classList.contains('type-target')&&!state.typingPlayed.has(entry.target)){typeText(entry.target);state.typingPlayed.add(entry.target)}})},{threshold:.15});qsa('.reveal,.type-target').forEach(el=>obs.observe(el))}function typeText(el){const raw=el.dataset.raw||el.innerHTML;el.dataset.raw=raw;const tmp=document.createElement('div');tmp.innerHTML=raw;const text=tmp.textContent||tmp.innerText||'';let i=0;el.innerHTML='';const interval=setInterval(()=>{el.textContent=text.slice(0,i+1);playTone(300+(i%8)*40,.018,'square',.005);i++;if(i>=text.length){clearInterval(interval);el.innerHTML=raw}},22)}function initTilt(){qsa('.tilt-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(matchMedia('(max-width:760px)').matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`translateY(-8px) rotateX(${y*-10}deg) rotateY(${x*12}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='')})}
function initMenu(){const btn=qs('#menuToggle'),nav=qs('#mainNav');btn?.addEventListener('click',()=>{btn.classList.toggle('active');nav.classList.toggle('active')});qsa('#mainNav a,.mobile-section-nav a').forEach(a=>a.addEventListener('click',()=>{btn?.classList.remove('active');nav?.classList.remove('active')}));document.addEventListener('click',e=>{if(!e.target.closest('.site-header')&&nav?.classList.contains('active')){btn.classList.remove('active');nav.classList.remove('active')}})}
function openShell(id){qs(id)?.classList.add('active');qs(id)?.setAttribute('aria-hidden','false');document.body.classList.add('modal-open')}function closeShell(id){qs(id)?.classList.remove('active');qs(id)?.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
function initPads(){const grid=qs('#padChoiceGrid');if(!grid)return;grid.innerHTML=state.pads.map(([name,img],i)=>`<button class="pad-option ${i===0?'active':''}" type="button" data-pad="${escapeHtml(name)}"><img src="${img}" alt="${escapeHtml(name)}" loading="lazy"><span>${escapeHtml(name)}</span></button>`).join('');grid.addEventListener('click',e=>{const opt=e.target.closest('.pad-option');if(!opt)return;qsa('.pad-option',grid).forEach(x=>x.classList.remove('active'));opt.classList.add('active');state.selectedPad=opt.dataset.pad;updateSummary()})}
function validate(input){if(!input)return true;const val=input.value.trim();let ok=true;if(input.required&&!val)ok=false;if(input.id==='customerPhone'&&val&&!PHONE_REGEX.test(val))ok=false;if(input.id==='customerQty'){const n=Number(val);ok=Number.isFinite(n)&&n>=1&&n<=10}input.classList.toggle('invalid',!ok);return ok}function validateStep(step){const map={0:['#customerName','#customerPhone','#customerAddress','#customerCity','#customerQty'],1:[],2:[]};const invalid=(map[step]||[]).map(sel=>qs(sel)).find(el=>!validate(el));if(invalid){invalid.focus();toast('من فضلك عمّر المعلومات المطلوبة بشكل صحيح.');return false}return true}function goStep(step){qsa('#orderForm .sheet-step').forEach(el=>el.classList.toggle('active',Number(el.dataset.step)===step));qsa('.wizard-progress span').forEach((el,i)=>el.classList.toggle('active',i<=step));updateSummary()}function currentStep(){return Number(qs('#orderForm .sheet-step.active')?.dataset.step||0)}function updateSummary(){const qty=Math.max(1,Number(qs('#customerQty')?.value||1));const el=qs('#orderSummary');if(!el)return;el.innerHTML=`<strong>ملخص الطلب:</strong><br>الاسم: ${escapeHtml(qs('#customerName')?.value||'-')}<br>الهاتف: ${escapeHtml(qs('#customerPhone')?.value||'-')}<br>المدينة: ${escapeHtml(qs('#customerCity')?.value||'-')}<br>العنوان: ${escapeHtml(qs('#customerAddress')?.value||'-')}<br>التابي: ${escapeHtml(state.selectedPad)}<br>الكمية: ${qty}<br>المجموع: <strong>${qty*PRICE} DH</strong>`}
function initWizard(){qsa('.js-open-order').forEach(btn=>btn.addEventListener('click',()=>{openShell('#orderWizard');goStep(0);track('order_open')}));qs('#closeWizard')?.addEventListener('click',()=>closeShell('#orderWizard'));qs('[data-close="order"]')?.addEventListener('click',()=>closeShell('#orderWizard'));qsa('#orderForm input,#orderForm textarea').forEach(el=>['input','change','blur'].forEach(evt=>el.addEventListener(evt,()=>{validate(el);updateSummary()})));qsa('.btn-next').forEach(btn=>btn.addEventListener('click',()=>{const step=currentStep();if(!validateStep(step))return;goStep(Number(btn.dataset.next))}));qsa('.btn-back').forEach(btn=>btn.addEventListener('click',()=>goStep(Number(btn.dataset.back))));qs('#orderForm')?.addEventListener('submit',submitOrder)}
async function submitOrder(e){e.preventDefault();if(!validateStep(0))return;const qty=Number(qs('#customerQty').value||1);const payload={customer_name:qs('#customerName').value.trim(),phone:qs('#customerPhone').value.trim(),city:qs('#customerCity').value.trim(),address:qs('#customerAddress').value.trim(),quantity:qty,keyboard_choice:'Clavier Gaming Standard',mouse_choice:'Logitech G302',pad_choice:state.selectedPad,notes:qs('#customerNotes').value.trim()||null,product_name:'Pack Gaming KAM INFO',unit_price:PRICE,currency:'MAD',source:'landing_page',user_agent:navigator.userAgent,referrer:document.referrer||null,utm_source:new URLSearchParams(location.search).get('utm_source'),utm_medium:new URLSearchParams(location.search).get('utm_medium'),utm_campaign:new URLSearchParams(location.search).get('utm_campaign')};const btn=qs('#submitOrder');btn.disabled=true;btn.textContent='جاري إرسال الطلب...';try{const{error}=await sb.from('orders').insert(payload);if(error)throw error;await track('click',{target:'submit_order',total:qty*PRICE});closeShell('#orderWizard');toast('تم إرسال الطلب بنجاح. غادي نتواصلو معاك قريباً ✅');qs('#orderForm').reset();qs('#customerQty').value=1;state.selectedPad='MSI Dragon';initPads();updateSummary()}catch(err){console.error(err);toast('وقع خطأ أثناء إرسال الطلب. حاول مرة أخرى.')}finally{btn.disabled=false;btn.textContent='تأكيد الطلب'}}
async function loadReviews(){
  const grid=qs('#reviewsGrid');
  if(!grid||!sb)return;

  try{
    const{data,error}=await sb
      .from('reviews')
      .select('customer_name,city,rating,emoji,review_text,created_at')
      .eq('status','approved')
      .order('created_at',{ascending:false})
      .limit(12);

    if(error)throw error;

    grid.innerHTML=(data||[]).map(r=>`
      <article class="review-card glass reveal visible">
        <div class="review-head">
          <strong>${escapeHtml(r.customer_name)}${r.city?' - '+escapeHtml(r.city):''}</strong>
          <span>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
        </div>
        <p>${r.emoji||'😊'} ${escapeHtml(r.review_text)}</p>
      </article>
    `).join('');
  }catch(e){
    console.error(e);
  }
}

function initReviewModal(){const emojis={1:'😞',2:'🙁',3:'🙂',4:'😄',5:'🤩'};const setRating=n=>{state.rating=n;qs('#reviewEmoji').textContent=emojis[n];qsa('#starPicker button').forEach(b=>b.classList.toggle('active',Number(b.dataset.rating)<=n))};setRating(5);qs('#openReviewModal')?.addEventListener('click',()=>{openShell('#reviewModal');track('review_open')});qs('#closeReviewModal')?.addEventListener('click',()=>closeShell('#reviewModal'));qs('[data-close="review"]')?.addEventListener('click',()=>closeShell('#reviewModal'));qs('#starPicker')?.addEventListener('click',e=>{const b=e.target.closest('button[data-rating]');if(b)setRating(Number(b.dataset.rating))});qs('#reviewForm')?.addEventListener('submit',async e=>{e.preventDefault();const name=qs('#reviewName'),text=qs('#reviewText');if(!validate(name)||!validate(text)){toast('من فضلك كتب الاسم والرأي.');return}try{const{error}=await sb.from('reviews').insert({customer_name:name.value.trim(),city:qs('#reviewCity').value.trim()||null,rating:state.rating,emoji:emojis[state.rating],review_text:text.value.trim(),status:'pending',user_agent:navigator.userAgent,referrer:document.referrer||null});if(error)throw error;closeShell('#reviewModal');qs('#reviewForm').reset();setRating(5);toast('شكراً لك! رأيك وصل للإدارة للموافقة ✅')}catch(err){console.error(err);toast('تعذر إرسال الرأي حالياً.')}})}
function initProductModal(){qsa('.product-card').forEach(card=>card.addEventListener('click',()=>openProductModal(card.dataset.modal)));qs('#closeProductModal')?.addEventListener('click',closeProductModal);qs('[data-close="product"]')?.addEventListener('click',closeProductModal)}
function openProductModal(id){const data=state.productData[id],root=qs('#productModalContent');if(!data||!root)return;root.innerHTML=`<div class="product-modal-grid"><div class="product-gallery"><video class="modal-product-video" controls playsinline preload="none" poster="${data.poster}" data-src="${data.video}"></video>${data.images.map(src=>`<img src="${src}" alt="${escapeHtml(data.title)}" loading="lazy">`).join('')}</div><div class="product-copy"><span class="eyebrow">SHOW MORE</span><h3>${escapeHtml(data.title)}</h3><p>${escapeHtml(data.desc)}</p><ul>${data.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul><button class="btn btn-primary js-open-order" type="button">اطلب الآن</button></div></div>`;openShell('#productModal');const video=qs('.modal-product-video',root);if(video&&video.dataset.src){video.innerHTML=`<source src="${video.dataset.src}" type="video/mp4">`;video.load();video.play().catch(()=>{})}qs('.product-copy .js-open-order',root)?.addEventListener('click',()=>{closeProductModal();openShell('#orderWizard');goStep(0)})}
function closeProductModal(){const vid=qs('.modal-product-video');if(vid){vid.pause();vid.removeAttribute('src');vid.innerHTML='';vid.load()}closeShell('#productModal');qs('#productModalContent').innerHTML=''}
function initLazyVideos(){qsa('.lazy-video-trigger').forEach(btn=>btn.addEventListener('click',()=>openVideoModal(btn.dataset.video,btn.dataset.title,btn.dataset.poster)));qs('#closeVideoModal')?.addEventListener('click',closeVideoModal);qs('[data-close="video"]')?.addEventListener('click',closeVideoModal)}
function openVideoModal(src,title='',poster=''){const video=qs('#videoModalPlayer'),loading=qs('#videoLoading');if(!video||!src)return;loading.style.display='block';video.poster=poster;video.innerHTML='';openShell('#videoModal');track('video_play',{title,src});setTimeout(()=>{if(!qs('#videoModal').classList.contains('active'))return;video.innerHTML=`<source src="${src}" type="video/mp4">`;video.load();video.oncanplay=()=>{loading.style.display='none';video.play().catch(()=>{})};qs('#videoModalTitle').textContent=title},120)}
function closeVideoModal(){const video=qs('#videoModalPlayer');if(video){video.pause();video.removeAttribute('src');video.innerHTML='';video.load();video.oncanplay=null}closeShell('#videoModal')}
function initYoutube(){qs('#youtubeThumb')?.addEventListener('click',e=>{const btn=e.currentTarget,id=btn.dataset.youtubeId;if(!id){toast('أضف YouTube video ID فـ data-youtube-id باش يتشغل الفيديو.');return}btn.outerHTML=`<iframe title="KAM INFO Video Drop" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;track('video_play',{provider:'youtube',id})})}
function initShowMore(){
  const btn=qs('#showMorePads');
  if(!btn)return;

  btn.dataset.expanded='0';
  btn.textContent='Voir plus';

  btn.addEventListener('click',()=>{
    const shouldShow=btn.dataset.expanded!=='1';

    qsa('.quicklook-extra').forEach(el=>{
      el.classList.toggle('is-visible',shouldShow);
    });

    btn.dataset.expanded=shouldShow?'1':'0';
    btn.textContent=shouldShow?'Voir moins':'Voir plus';
  });
}


function initImageLightbox(){
  const shell=qs('#imageLightbox');
  const img=qs('#lightboxImage');
  const caption=qs('#lightboxCaption');

  if(!shell||!img)return;

  qs('#quicklookGrid')?.addEventListener('click',e=>{
    const card=e.target.closest('.gallery-card');
    if(!card)return;

    const source=card.querySelector('img');
    if(!source)return;

    const text=card.querySelector('figcaption')?.textContent||source.alt||'';

    img.src=source.src;
    img.alt=source.alt||text;

    if(caption)caption.textContent=text;

    openShell('#imageLightbox');
  });

  qs('#closeImageLightbox')?.addEventListener('click',closeImageLightbox);
  qs('[data-close="lightbox"]')?.addEventListener('click',closeImageLightbox);
}

function closeImageLightbox(){
  const img=qs('#lightboxImage');

  closeShell('#imageLightbox');

  if(img)img.src='';
}

function initWhatsApp(){const panel=qs('#waWidget'),toggle=qs('#waToggleBtn');const close=()=>{panel.classList.remove('active');panel.setAttribute('aria-hidden','true')};const open=()=>{panel.classList.add('active');panel.setAttribute('aria-hidden','false')};toggle?.addEventListener('click',e=>{e.stopPropagation();panel.classList.contains('active')?close():open()});qs('#waClose')?.addEventListener('click',e=>{e.stopPropagation();close()});panel?.addEventListener('click',e=>e.stopPropagation());document.addEventListener('click',()=>{if(panel?.classList.contains('active'))close()});qsa('.wa-q-btn').forEach(b=>b.addEventListener('click',()=>{qs('#waInput').value=b.dataset.wa;sendWa()}));qs('#waSend')?.addEventListener('click',sendWa);qs('#waInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')sendWa()})}function sendWa(){const msg=qs('#waInput')?.value.trim()||'سلام KAM INFO بغيت معلومات على pack gaming';window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank','noopener')}
function initRealtime(){if(!sb)return;sb.channel('public-approved-reviews').on('postgres_changes',{event:'UPDATE',schema:'public',table:'reviews'},payload=>{if(payload.new?.status==='approved')loadReviews()}).subscribe()}function initServiceWorker(){if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{})}
function init(){preloadExperience();initAudio();initCursorGlow();initHeroVideo();initReveal();initTilt();initMenu();initPads();initWizard();initReviewModal();initProductModal();initLazyVideos();initYoutube();initShowMore();initImageLightbox();initWhatsApp();loadReviews();initRealtime();initServiceWorker();track('page_view');updateSummary()}document.addEventListener('DOMContentLoaded',init);
