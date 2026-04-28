const revealItems = document.querySelectorAll('.reveal');

const staggerGroups = document.querySelectorAll('.stagger-parent');
staggerGroups.forEach((group) => {
  const items = group.querySelectorAll('.reveal');
  items.forEach((item, index) => {
    const delay = Math.min(index * 90, 450);
    item.style.transitionDelay = `${delay}ms`;
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: '0px 0px -36px 0px',
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    const clickedInside = mainNav.contains(event.target) || menuToggle.contains(event.target);
    if (!clickedInside) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

const caseTabs = document.querySelectorAll('[data-case-tab]');
const casePanels = document.querySelectorAll('[data-case-panel]');

if (caseTabs.length && casePanels.length) {
  const activateCase = (caseId) => {
    caseTabs.forEach((tab) => {
      const isActive = tab.dataset.caseTab === caseId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-pressed', String(isActive));
    });

    casePanels.forEach((panel) => {
      const isActive = panel.dataset.casePanel === caseId;
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);
    });
  };

  caseTabs.forEach((tab) => {
    tab.addEventListener('click', () => activateCase(tab.dataset.caseTab));
  });
}

const photoReviewsBlock = document.querySelector('[data-photo-reviews]');

if (photoReviewsBlock) {
  const photoTrack = photoReviewsBlock.querySelector('.photo-reviews-track');
  const photoSlides = Array.from(photoReviewsBlock.querySelectorAll('.photo-review-slide'));
  const prevPhotoButton = photoReviewsBlock.querySelector('[data-photo-prev]');
  const nextPhotoButton = photoReviewsBlock.querySelector('[data-photo-next]');
  const photoDots = Array.from(photoReviewsBlock.querySelectorAll('[data-photo-dot]'));
  let activePhotoIndex = 0;

  const renderPhotoSlide = (index) => {
    if (!photoTrack || !photoSlides.length) return;
    activePhotoIndex = (index + photoSlides.length) % photoSlides.length;
    photoTrack.style.transform = `translateX(-${activePhotoIndex * 100}%)`;

    photoSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activePhotoIndex);
    });

    photoDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activePhotoIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  };

  if (photoSlides.length > 1) {
    prevPhotoButton?.addEventListener('click', () => renderPhotoSlide(activePhotoIndex - 1));
    nextPhotoButton?.addEventListener('click', () => renderPhotoSlide(activePhotoIndex + 1));

    photoDots.forEach((dot) => {
      dot.addEventListener('click', () => renderPhotoSlide(Number(dot.dataset.photoDot)));
    });
  } else {
    prevPhotoButton?.setAttribute('disabled', 'true');
    nextPhotoButton?.setAttribute('disabled', 'true');
  }

  renderPhotoSlide(0);
}

const videoReviewsBlock = document.querySelector('[data-video-reviews]');

if (videoReviewsBlock) {
  const videoTrack = videoReviewsBlock.querySelector('.video-reviews-track');
  const videoSlides = Array.from(videoReviewsBlock.querySelectorAll('.video-review-slide'));
  const prevVideoButton = videoReviewsBlock.querySelector('[data-video-prev]');
  const nextVideoButton = videoReviewsBlock.querySelector('[data-video-next]');
  const videoDots = Array.from(videoReviewsBlock.querySelectorAll('[data-video-dot]'));
  let activeVideoIndex = 0;

  const renderVideoSlide = (index) => {
    if (!videoTrack || !videoSlides.length) return;
    activeVideoIndex = (index + videoSlides.length) % videoSlides.length;
    videoTrack.style.transform = `translateX(-${activeVideoIndex * 100}%)`;

    videoSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeVideoIndex;
      slide.classList.toggle('is-active', isActive);
      const video = slide.querySelector('video');
      if (video && !isActive) video.pause();
    });

    videoDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeVideoIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  };

  if (videoSlides.length > 1) {
    prevVideoButton?.addEventListener('click', () => renderVideoSlide(activeVideoIndex - 1));
    nextVideoButton?.addEventListener('click', () => renderVideoSlide(activeVideoIndex + 1));

    videoDots.forEach((dot) => {
      dot.addEventListener('click', () => renderVideoSlide(Number(dot.dataset.videoDot)));
    });
  } else {
    prevVideoButton?.setAttribute('disabled', 'true');
    nextVideoButton?.setAttribute('disabled', 'true');
  }

  renderVideoSlide(0);
}

const videoModal = document.getElementById('video-modal');
const videoModalTitle = document.getElementById('video-modal-title');
const videoModalDescription = document.getElementById('video-modal-description');
const videoModalPlayer = document.getElementById('video-modal-player');
const videoTriggers = document.querySelectorAll('.video-card-trigger');

const courseModal = document.getElementById('course-modal');
const courseModalTitle = document.getElementById('course-modal-title');
const courseModalDescription = document.getElementById('course-modal-description');
const courseModalExamples = document.getElementById('course-modal-examples');
const courseModalImage = document.getElementById('course-modal-image');
const courseModalMedia = document.getElementById('course-modal-media');
const courseModalTags = document.getElementById('course-modal-tags');
const courseModalResult = document.getElementById('course-modal-result');
const courseModalSignup = document.getElementById('course-modal-signup');
const courseModalPrice = document.getElementById('course-modal-price');
const courseMoreButtons = document.querySelectorAll('.course-more');
const courseSignupButtons = document.querySelectorAll('.course-signup');
const selectedCourseInput = document.getElementById('selected-course-input');
const selectedCourseNote = document.getElementById('selected-course-note');
const finalCtaSection = document.getElementById('final-cta');
const testLeadForm = document.querySelector('.lead-form--test');
const finalLeadForm = document.getElementById('final-lead-form');

const courseDetails = {
  'ege-writing': {
    title: 'Р•Р“Р­ Р±РµР· РїР°РЅРёРєРё (РїРёСЃСЊРјРµРЅРЅР°СЏ С‡Р°СЃС‚СЊ)',
    image: 'public/СЃ1.jpg',
    description:
      'РџСЂР°РєС‚РёС‡РµСЃРєРёР№ РјРёРЅРё-РєСѓСЂСЃ РґР»СЏ СѓРІРµСЂРµРЅРЅРѕР№ РїРёСЃСЊРјРµРЅРЅРѕР№ С‡Р°СЃС‚Рё: СЃС‚СЂСѓРєС‚СѓСЂР°, Р°СЂРіСѓРјРµРЅС‚Р°С†РёСЏ, РєСЂРёС‚РµСЂРёРё Рё С‚РёРїРёС‡РЅС‹Рµ РѕС€РёР±РєРё.',
    tags: ['РџРёСЃСЊРјРµРЅРЅР°СЏ С‡Р°СЃС‚СЊ', 'РЁР°Р±Р»РѕРЅС‹', 'Р Р°Р·Р±РѕСЂ РѕС€РёР±РѕРє'],
    examples: [
      'РџРѕС€Р°РіРѕРІС‹Р№ Р°Р»РіРѕСЂРёС‚Рј РїРёСЃСЊРјР° Рё СЌСЃСЃРµ Р±РµР· В«РїСѓСЃС‚С‹С…В» С„СЂР°Р·.',
      'Р Р°Р·Р±РѕСЂ РєСЂРёС‚РµСЂРёРµРІ Р¤РРџР РЅР° РїРѕРЅСЏС‚РЅС‹С… РїСЂРёРјРµСЂР°С….',
      'РџРµСЂРµРїРёСЃС‹РІР°РЅРёРµ СЃР»Р°Р±С‹С… РѕС‚РІРµС‚РѕРІ РІ СЃРёР»СЊРЅС‹Рµ РїРѕ С€Р°Р±Р»РѕРЅСѓ.',
      'РџРµСЂСЃРѕРЅР°Р»СЊРЅС‹Рµ РєРѕРјРјРµРЅС‚Р°СЂРёРё Рє РІР°С€РёРј С‚РµРєСЃС‚Р°Рј Рё С‚РѕС‡РєР°Рј СЂРѕСЃС‚Р°.',
    ],
    result:
      'Р’С‹ РїРёС€РµС‚Рµ СЃС‚СЂСѓРєС‚СѓСЂРЅРѕ Рё СѓРІРµСЂРµРЅРЅРѕ, РїРѕРЅРёРјР°РµС‚Рµ, Р·Р° С‡С‚Рѕ РґР°СЋС‚ Р±Р°Р»Р»С‹, Рё РїРµСЂРµСЃС‚Р°С‘С‚Рµ С‚РµСЂСЏС‚СЊСЃСЏ РІ РїРёСЃСЊРјРµРЅРЅРѕР№ С‡Р°СЃС‚Рё РЅР° СЌРєР·Р°РјРµРЅРµ.',
    priceKey: 'course_ege',
  },
  speaking: {
    title: 'РЈСЃС‚РЅР°СЏ С‡Р°СЃС‚СЊ Р±РµР· СЃС‚СЂР°С…Р°',
    image: 'public/СЃ2.jpg',
    description:
      'РљСѓСЂСЃ РґР»СЏ СѓРІРµСЂРµРЅРЅРѕР№ СѓСЃС‚РЅРѕР№ СЂРµС‡Рё: СЃС‚СЂСѓРєС‚СѓСЂР° РѕС‚РІРµС‚Р°, С‚РµРјРї, РїРѕРґР°С‡Р° Рё СЃРїРѕРєРѕР№РЅР°СЏ СЂРµР°РєС†РёСЏ РЅР° СЃР»РѕР¶РЅС‹Рµ РІРѕРїСЂРѕСЃС‹.',
    tags: ['РЈСЃС‚РЅР°СЏ С‡Р°СЃС‚СЊ', 'РўРµРјРї СЂРµС‡Рё', 'РЈРІРµСЂРµРЅРЅР°СЏ РїРѕРґР°С‡Р°'],
    examples: [
      'Р“РѕС‚РѕРІС‹Рµ РєРѕРЅСЃС‚СЂСѓРєС†РёРё РґР»СЏ СѓРІРµСЂРµРЅРЅРѕРіРѕ СЃС‚Р°СЂС‚Р° РѕС‚РІРµС‚Р°.',
      'РўСЂРµРЅРёСЂРѕРІРєР° С‚Р°Р№РјРёРЅРіР° Рё Р»РѕРіРёРєРё Р±РµР· РґР»РёРЅРЅС‹С… РїР°СѓР·.',
      'РџСЂР°РєС‚РёРєР° РІ С„РѕСЂРјР°С‚Рµ СЌРєР·Р°РјРµРЅР° СЃ РїРµСЂСЃРѕРЅР°Р»СЊРЅРѕР№ РѕР±СЂР°С‚РЅРѕР№ СЃРІСЏР·СЊСЋ.',
      'РћС‚СЂР°Р±РѕС‚РєР° СЃР»РѕР¶РЅС‹С… С‚РµРј, РіРґРµ РѕР±С‹С‡РЅРѕ С‚РµСЂСЏСЋС‚СЃСЏ Р±Р°Р»Р»С‹.',
    ],
    result:
      'Р’С‹ РіРѕРІРѕСЂРёС‚Рµ СЃРѕР±СЂР°РЅРЅРѕ Рё СЃРїРѕРєРѕР№РЅРѕ, РґРµСЂР¶РёС‚Рµ СЃС‚СЂСѓРєС‚СѓСЂСѓ РѕС‚РІРµС‚Р° Рё Р·РІСѓС‡РёС‚Рµ СѓРІРµСЂРµРЅРЅРѕ РґР°Р¶Рµ РІ СЃС‚СЂРµСЃСЃРѕРІС‹С… Р·Р°РґР°РЅРёСЏС….',
    priceKey: 'course_speaking',
  },
};

const PRICE_STORAGE_KEY = 'susie_price_settings_v1';
const PRICE_CHANNEL_NAME = 'susie_price_channel_v1';
const DEFAULT_PRICE_MAP = Object.freeze({
  format_individual: 'РѕС‚ 500 СЂСѓР± / Р·Р°РЅСЏС‚РёРµ',
  format_pair: 'РѕС‚ 500 СЂСѓР± / Р·Р°РЅСЏС‚РёРµ',
  format_group: 'РѕС‚ 500 СЂСѓР± / Р·Р°РЅСЏС‚РёРµ',
  course_ege: '1000 в‚Ѕ',
  course_speaking: '1000 в‚Ѕ',
});
const priceElements = Array.from(document.querySelectorAll('[data-price-key]'));
const priceChannel =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(PRICE_CHANNEL_NAME) : null;

let activeCourseName = '';
let activeCourseId = '';
let currentPriceMap = { ...DEFAULT_PRICE_MAP };

function normalizePriceMap(source) {
  const normalized = { ...DEFAULT_PRICE_MAP };
  if (!source || typeof source !== 'object') return normalized;

  Object.keys(DEFAULT_PRICE_MAP).forEach((key) => {
    const rawValue = source[key];
    if (typeof rawValue !== 'string') return;

    const cleanValue = rawValue.trim();
    if (cleanValue) {
      normalized[key] = cleanValue;
    }
  });

  return normalized;
}

function loadSavedPrices() {
  try {
    const raw = window.localStorage.getItem(PRICE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PRICE_MAP };
    const parsed = JSON.parse(raw);
    return normalizePriceMap(parsed);
  } catch {
    return { ...DEFAULT_PRICE_MAP };
  }
}

function getCoursePriceById(courseId) {
  const details = courseDetails[courseId];
  if (!details || !details.priceKey) return DEFAULT_PRICE_MAP.course_ege;
  return currentPriceMap[details.priceKey] || DEFAULT_PRICE_MAP[details.priceKey] || DEFAULT_PRICE_MAP.course_ege;
}

function applyPriceMap(priceMap) {
  priceElements.forEach((element) => {
    const key = element.dataset.priceKey;
    if (!key) return;
    if (priceMap[key]) {
      element.textContent = priceMap[key];
    }
  });

  if (courseModalPrice && activeCourseId) {
    courseModalPrice.textContent = getCoursePriceById(activeCourseId);
  }
}

function syncPriceMap(incomingMap) {
  currentPriceMap = normalizePriceMap(incomingMap);
  applyPriceMap(currentPriceMap);
}

syncPriceMap(loadSavedPrices());

window.addEventListener('storage', (event) => {
  if (event.key !== PRICE_STORAGE_KEY) return;
  if (!event.newValue) {
    syncPriceMap(DEFAULT_PRICE_MAP);
    return;
  }

  try {
    const parsed = JSON.parse(event.newValue);
    syncPriceMap(parsed);
  } catch {
    syncPriceMap(DEFAULT_PRICE_MAP);
  }
});

if (priceChannel) {
  priceChannel.addEventListener('message', (event) => {
    const payload = event.data;
    if (!payload || payload.type !== 'prices:update') return;
    syncPriceMap(payload.prices);
  });
}

function syncModalState() {
  const hasOpenModal =
    (videoModal && !videoModal.hidden) || (courseModal && !courseModal.hidden);
  document.body.classList.toggle('modal-open', Boolean(hasOpenModal));
}

function closeVideoModal() {
  if (!videoModal) return;
  videoModal.hidden = true;

  if (videoModalPlayer) {
    videoModalPlayer.innerHTML =
      '<div class="video-modal-placeholder">Р—РґРµСЃСЊ Р±СѓРґРµС‚ РІРёРґРµРѕРѕС‚Р·С‹РІ. Р’С‹ СЃРјРѕР¶РµС‚Рµ РґРѕР±Р°РІРёС‚СЊ СЃСЃС‹Р»РєСѓ РЅР° РІРёРґРµРѕ РІ РєР°СЂС‚РѕС‡РєСѓ.</div>';
  }

  syncModalState();
}

function openVideoModal(trigger) {
  if (!videoModal || !videoModalTitle || !videoModalDescription || !videoModalPlayer) return;

  const title = trigger.dataset.videoTitle || 'Р’РёРґРµРѕРѕС‚Р·С‹РІ';
  const description = trigger.dataset.videoDescription || 'РћРїРёСЃР°РЅРёРµ РІРёРґРµРѕ Р±СѓРґРµС‚ РґРѕР±Р°РІР»РµРЅРѕ РїРѕР·Р¶Рµ.';
  const embedUrl = trigger.dataset.videoEmbed;

  videoModalTitle.textContent = title;
  videoModalDescription.textContent = description;

  if (embedUrl) {
    videoModalPlayer.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.title = title;
    videoModalPlayer.appendChild(iframe);
  } else {
    videoModalPlayer.innerHTML =
      '<div class="video-modal-placeholder">Р—РґРµСЃСЊ Р±СѓРґРµС‚ РІРёРґРµРѕРѕС‚Р·С‹РІ. Р’С‹ СЃРјРѕР¶РµС‚Рµ РґРѕР±Р°РІРёС‚СЊ СЃСЃС‹Р»РєСѓ РЅР° РІРёРґРµРѕ РІ РєР°СЂС‚РѕС‡РєСѓ.</div>';
  }

  videoModal.hidden = false;
  syncModalState();
}

function closeCourseModal() {
  if (!courseModal) return;
  courseModal.hidden = true;
  activeCourseName = '';
  activeCourseId = '';
  syncModalState();
}

function openCourseModal(courseId) {
  if (!courseModal || !courseModalTitle || !courseModalDescription || !courseModalExamples) return;

  const details = courseDetails[courseId];
  if (!details) return;

  courseModalTitle.textContent = details.title;
  courseModalDescription.textContent = details.description;

  if (courseModalImage && courseModalMedia) {
    if (details.image) {
      courseModalImage.src = details.image;
      courseModalImage.alt = details.title;
      courseModalMedia.hidden = false;
    } else {
      courseModalImage.removeAttribute('src');
      courseModalImage.alt = '';
      courseModalMedia.hidden = true;
    }
  }

  if (courseModalTags) {
    courseModalTags.innerHTML = '';
    (details.tags || []).forEach((tag) => {
      const tagElement = document.createElement('span');
      tagElement.textContent = tag;
      courseModalTags.appendChild(tagElement);
    });
  }

  courseModalExamples.innerHTML = '';
  details.examples.forEach((example) => {
    const li = document.createElement('li');
    li.textContent = example;
    courseModalExamples.appendChild(li);
  });

  if (courseModalResult) {
    courseModalResult.textContent = details.result || '';
  }

  activeCourseId = courseId;
  activeCourseName = details.title;
  if (courseModalPrice) {
    courseModalPrice.textContent = getCoursePriceById(courseId);
  }
  courseModal.hidden = false;
  syncModalState();
}

function applyCourseSelection(courseName) {
  if (!courseName) return;

  if (selectedCourseInput) {
    selectedCourseInput.value = courseName;
  }

  if (selectedCourseNote) {
    selectedCourseNote.hidden = false;
    selectedCourseNote.textContent = `Р’С‹Р±СЂР°РЅ РјРёРЅРё-РєСѓСЂСЃ: ${courseName}`;
  }
}

function scrollToLeadForm() {
  if (!finalCtaSection) return;
  finalCtaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

videoTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => openVideoModal(trigger));
});

document.querySelectorAll('[data-video-close]').forEach((button) => {
  button.addEventListener('click', closeVideoModal);
});

courseMoreButtons.forEach((button) => {
  button.addEventListener('click', () => openCourseModal(button.dataset.courseId));
});

document.querySelectorAll('[data-course-close]').forEach((button) => {
  button.addEventListener('click', closeCourseModal);
});

if (courseModalSignup) {
  courseModalSignup.addEventListener('click', () => {
    if (!activeCourseName) return;
    applyCourseSelection(activeCourseName);
    closeCourseModal();
    scrollToLeadForm();
  });
}

courseSignupButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const courseName = button.dataset.course || '';
    applyCourseSelection(courseName);
    scrollToLeadForm();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeVideoModal();
  closeCourseModal();
});

const testData = {
  'РћР“Р­': [
    {
      category: 'РђРЅРіР»РёР№СЃРєРёР№ СЏР·С‹Рє',
      question: 'РљР°РєСѓСЋ С„РѕСЂРјСѓ РіР»Р°РіРѕР»Р° РІС‹Р±РёСЂР°СЋС‚ РІ РЅР°СЃС‚РѕСЏС‰РµРј РІСЂРµРјРµРЅРё РґР»СЏ В«РѕРЅ/РѕРЅР°В»?',
      options: [
        { text: 'Р¤РѕСЂРјСѓ СЃ РѕРєРѕРЅС‡Р°РЅРёРµРј -s', score: 3 },
        { text: 'РќР°С‡Р°Р»СЊРЅСѓСЋ С„РѕСЂРјСѓ Р±РµР· РёР·РјРµРЅРµРЅРёР№', score: 1 },
        { text: 'Р¤РѕСЂРјСѓ РїСЂРѕС€РµРґС€РµРіРѕ РІСЂРµРјРµРЅРё', score: 2 },
      ],
    },
    {
      category: 'РђРЅРіР»РёР№СЃРєРёР№ СЏР·С‹Рє',
      question: 'РљР°РєРѕРµ РІСЂРµРјСЏ РѕР±С‹С‡РЅРѕ РёСЃРїРѕР»СЊР·СѓСЋС‚ РґР»СЏ РґРµР№СЃС‚РІРёСЏ, РєРѕС‚РѕСЂРѕРµ СѓР¶Рµ Р·Р°РІРµСЂС€РёР»РѕСЃСЊ Рє С‚РµРєСѓС‰РµРјСѓ РјРѕРјРµРЅС‚Сѓ?',
      options: [
        { text: 'РќР°СЃС‚РѕСЏС‰РµРµ Р·Р°РІРµСЂС€С‘РЅРЅРѕРµ РІСЂРµРјСЏ', score: 3 },
        { text: 'РџСЂРѕСЃС‚РѕРµ РїСЂРѕС€РµРґС€РµРµ Р±РµР· РєРѕРЅС‚РµРєСЃС‚Р°', score: 1 },
        { text: 'РџСЂРѕС€РµРґС€РµРµ РґР»РёС‚РµР»СЊРЅРѕРµ РІСЂРµРјСЏ', score: 2 },
      ],
    },
    {
      category: 'РђРЅРіР»РёР№СЃРєРёР№ СЏР·С‹Рє',
      question: 'Р§С‚Рѕ РѕР±С‹С‡РЅРѕ СЃР»РѕР¶РЅРµРµ РІСЃРµРіРѕ РІ РћР“Р­ РїСЂСЏРјРѕ СЃРµР№С‡Р°СЃ?',
      options: [
        { text: 'РџРёСЃСЊРјРµРЅРЅР°СЏ Рё СѓСЃС‚РЅР°СЏ С‡Р°СЃС‚Рё', score: 1 },
        { text: 'РџРѕРЅРёРјР°РЅРёРµ СЃС‚СЂСѓРєС‚СѓСЂС‹ Р·Р°РґР°РЅРёР№', score: 2 },
        { text: 'РЈР¶Рµ РїРѕРЅРёРјР°СЋ СЃС‚СЂСѓРєС‚СѓСЂСѓ, РЅСѓР¶РµРЅ СЂРѕСЃС‚ СЃРєРѕСЂРѕСЃС‚Рё', score: 3 },
      ],
    },
    {
      category: 'РџСЃРёС…РѕР»РѕРіРёСЏ',
      question: 'РљР°Рє РІС‹ С‡СѓРІСЃС‚РІСѓРµС‚Рµ СЃРµР±СЏ РїРµСЂРµРґ РїСЂРѕРІРµСЂРѕС‡РЅС‹РјРё СЂР°Р±РѕС‚Р°РјРё?',
      options: [
        { text: 'РЎРёР»СЊРЅРѕ РїРµСЂРµР¶РёРІР°СЋ Рё С‡Р°СЃС‚Рѕ С‚РµСЂСЏСЋСЃСЊ', score: 1 },
        { text: 'Р•СЃС‚СЊ РІРѕР»РЅРµРЅРёРµ, РЅРѕ РјРѕРіСѓ СЃРѕР±СЂР°С‚СЊСЃСЏ', score: 2 },
        { text: 'Р§СѓРІСЃС‚РІСѓСЋ СЃРµР±СЏ СЃРїРѕРєРѕР№РЅРѕ Рё СѓРІРµСЂРµРЅРЅРѕ', score: 3 },
      ],
    },
    {
      category: 'РџСЃРёС…РѕР»РѕРіРёСЏ',
      question: 'РљР°Рє СЂРµР°РіРёСЂСѓРµС‚Рµ РЅР° РѕС€РёР±РєРё РІ Р·Р°РґР°РЅРёСЏС…?',
      options: [
        { text: 'Р Р°СЃСЃС‚СЂР°РёРІР°СЋСЃСЊ Рё С‚РµСЂСЏСЋ РјРѕС‚РёРІР°С†РёСЋ', score: 1 },
        { text: 'РСЃРїСЂР°РІР»СЏСЋ, РЅРѕ РёРЅРѕРіРґР° Р±РѕСЋСЃСЊ РїРѕРІС‚РѕСЂРёС‚СЊ', score: 2 },
        { text: 'Р’РѕСЃРїСЂРёРЅРёРјР°СЋ РєР°Рє РѕСЂРёРµРЅС‚РёСЂ РґР»СЏ СЂРѕСЃС‚Р°', score: 3 },
      ],
    },
  ],
  'Р•Р“Р­': [
    {
      category: 'РђРЅРіР»РёР№СЃРєРёР№ СЏР·С‹Рє',
      question: 'РљР°РєСѓСЋ С„РѕСЂРјСѓ РіР»Р°РіРѕР»Р° РІС‹Р±РёСЂР°СЋС‚ РІ СѓСЃР»РѕРІРёРё РІС‚РѕСЂРѕРіРѕ С‚РёРїР° РїРѕСЃР»Рµ If?',
      options: [
        { text: 'Р¤РѕСЂРјСѓ РїСЂРѕС€РµРґС€РµРіРѕ РІСЂРµРјРµРЅРё (had)', score: 3 },
        { text: 'Р¤РѕСЂРјСѓ РЅР°СЃС‚РѕСЏС‰РµРіРѕ РІСЂРµРјРµРЅРё (have)', score: 2 },
        { text: 'Р¤РѕСЂРјСѓ Р±СѓРґСѓС‰РµРіРѕ РІСЂРµРјРµРЅРё (will have)', score: 1 },
      ],
    },
    {
      category: 'РђРЅРіР»РёР№СЃРєРёР№ СЏР·С‹Рє',
      question: 'Р§С‚Рѕ РІР°Р¶РЅРµРµ РІСЃРµРіРѕ РґР»СЏ СЃРёР»СЊРЅРѕР№ РїРёСЃСЊРјРµРЅРЅРѕР№ С‡Р°СЃС‚Рё Р•Р“Р­?',
      options: [
        { text: 'Р§С‘С‚РєР°СЏ СЃС‚СЂСѓРєС‚СѓСЂР° Рё Р°СЂРіСѓРјРµРЅС‚Р°С†РёСЏ', score: 3 },
        { text: 'РўРѕР»СЊРєРѕ СЃР»РѕР¶РЅС‹Рµ СЃР»РѕРІР°', score: 1 },
        { text: 'Р”Р»РёРЅРЅС‹Р№ С‚РµРєСЃС‚ Р±РµР· РїР»Р°РЅР°', score: 2 },
      ],
    },
    {
      category: 'РђРЅРіР»РёР№СЃРєРёР№ СЏР·С‹Рє',
      question: 'РљР°Рє СЃРµР№С‡Р°СЃ РёРґС‘С‚ СЂР°Р±РѕС‚Р° СЃ С„РѕСЂРјР°С‚РѕРј Р·Р°РґР°РЅРёР№ Р•Р“Р­?',
      options: [
        { text: 'Р•СЃС‚СЊ РїСЂРѕР±РµР»С‹ РїРѕ РЅРµСЃРєРѕР»СЊРєРёРј Р±Р»РѕРєР°Рј', score: 1 },
        { text: 'Р‘Р°Р·Р° РµСЃС‚СЊ, РЅСѓР¶РЅР° СЃС‚Р°Р±РёР»СЊРЅРѕСЃС‚СЊ', score: 2 },
        { text: 'РЈРІРµСЂРµРЅРЅРѕ СЂРµС€Р°СЋ Р±РѕР»СЊС€РёРЅСЃС‚РІРѕ Р·Р°РґР°РЅРёР№', score: 3 },
      ],
    },
    {
      category: 'РџСЃРёС…РѕР»РѕРіРёСЏ',
      question: 'РќР°СЃРєРѕР»СЊРєРѕ СЃРёР»СЊРЅРѕ СЃС‚СЂРµСЃСЃ РјРµС€Р°РµС‚ РІР°Рј РЅР° РїСЂРѕР±РЅРёРєР°С…?',
      options: [
        { text: 'РЎРёР»СЊРЅРѕ РјРµС€Р°РµС‚ Рё СЃРЅРёР¶Р°РµС‚ СЂРµР·СѓР»СЊС‚Р°С‚', score: 1 },
        { text: 'РРЅРѕРіРґР° РјРµС€Р°РµС‚, РЅРѕ РєРѕРЅС‚СЂРѕР»РёСЂСѓРµРјРѕ', score: 2 },
        { text: 'РџРѕС‡С‚Рё РЅРµ РІР»РёСЏРµС‚', score: 3 },
      ],
    },
    {
      category: 'РџСЃРёС…РѕР»РѕРіРёСЏ',
      question: 'РљР°Рє РѕС†РµРЅРёРІР°РµС‚Рµ СЃРІРѕСЋ СѓРІРµСЂРµРЅРЅРѕСЃС‚СЊ РІ РґРµРЅСЊ СЌРєР·Р°РјРµРЅР°?',
      options: [
        { text: 'РџРѕРєР° РЅРµ С…РІР°С‚Р°РµС‚ СѓРІРµСЂРµРЅРЅРѕСЃС‚Рё', score: 1 },
        { text: 'Р•СЃС‚СЊ СѓРІРµСЂРµРЅРЅРѕСЃС‚СЊ, РЅРѕ РЅРµ РІРѕ РІСЃРµС… Р±Р»РѕРєР°С…', score: 2 },
        { text: 'Р§СѓРІСЃС‚РІСѓСЋ СЃРµР±СЏ РґРѕСЃС‚Р°С‚РѕС‡РЅРѕ СѓРІРµСЂРµРЅРЅРѕ', score: 3 },
      ],
    },
  ],
  'РњРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Р№ СЌРєР·Р°РјРµРЅ': [
    {
      category: 'РђРЅРіР»РёР№СЃРєРёР№ СЏР·С‹Рє',
      question: 'Р§С‚Рѕ РІР°Р¶РЅРµРµ РІСЃРµРіРѕ РІ СѓСЃС‚РЅРѕР№ С‡Р°СЃС‚Рё РњРµР¶РґСѓРЅР°СЂРѕРґРЅРѕРіРѕ СЌРєР·Р°РјРµРЅР°?',
      options: [
        { text: 'Р›РѕРіРёРєР° РѕС‚РІРµС‚Р° Рё РїРѕРЅСЏС‚РЅР°СЏ СЃС‚СЂСѓРєС‚СѓСЂР° СЂРµС‡Рё', score: 3 },
        { text: 'Р“РѕРІРѕСЂРёС‚СЊ РєР°Рє РјРѕР¶РЅРѕ Р±С‹СЃС‚СЂРµРµ', score: 1 },
        { text: 'РСЃРїРѕР»СЊР·РѕРІР°С‚СЊ С‚РѕР»СЊРєРѕ СЃР»РѕР¶РЅС‹Рµ СЃР»РѕРІР°', score: 2 },
      ],
    },
    {
      category: 'РђРЅРіР»РёР№СЃРєРёР№ СЏР·С‹Рє',
      question: 'РљР°РєРѕР№ РїРѕРґС…РѕРґ Р»СѓС‡С€Рµ РґР»СЏ РїРёСЃСЊРјРµРЅРЅРѕР№ С‡Р°СЃС‚Рё?',
      options: [
        { text: 'РџР»Р°РЅ + Р°СЂРіСѓРјРµРЅС‚С‹ + РїСЂРѕРІРµСЂРєР° РїРѕ РєСЂРёС‚РµСЂРёСЏРј', score: 3 },
        { text: 'РџРёСЃР°С‚СЊ Р±РµР· СЃС‚СЂСѓРєС‚СѓСЂС‹, РїРѕ РІРґРѕС…РЅРѕРІРµРЅРёСЋ', score: 1 },
        { text: 'РЎРѕСЃСЂРµРґРѕС‚РѕС‡РёС‚СЊСЃСЏ С‚РѕР»СЊРєРѕ РЅР° РѕР±СЉС‘РјРµ', score: 2 },
      ],
    },
    {
      category: 'РђРЅРіР»РёР№СЃРєРёР№ СЏР·С‹Рє',
      question: 'РљР°Рє РІС‹ СЃРµР№С‡Р°СЃ РѕС†РµРЅРёРІР°РµС‚Рµ СЂР°Р±РѕС‚Сѓ СЃ С‚Р°Р№РјРёРЅРіРѕРј?',
      options: [
        { text: 'РџРѕРєР° РЅРµ СѓРєР»Р°РґС‹РІР°СЋСЃСЊ РІРѕ РІСЂРµРјСЏ', score: 1 },
        { text: 'РРЅРѕРіРґР° РЅРµ СѓСЃРїРµРІР°СЋ РѕС‚РґРµР»СЊРЅС‹Рµ С‡Р°СЃС‚Рё', score: 2 },
        { text: 'РћР±С‹С‡РЅРѕ СѓРєР»Р°РґС‹РІР°СЋСЃСЊ РІ Р»РёРјРёС‚ РІСЂРµРјРµРЅРё', score: 3 },
      ],
    },
    {
      category: 'РџСЃРёС…РѕР»РѕРіРёСЏ',
      question: 'Р§С‚Рѕ С‡СѓРІСЃС‚РІСѓРµС‚Рµ РїРµСЂРµРґ СѓСЃС‚РЅС‹Рј РѕС‚РІРµС‚РѕРј?',
      options: [
        { text: 'РЎРёР»СЊРЅРѕРµ РІРѕР»РЅРµРЅРёРµ Рё СЃС‚СЂР°С… РѕС€РёР±РѕРє', score: 1 },
        { text: 'РЈРјРµСЂРµРЅРЅРѕРµ РІРѕР»РЅРµРЅРёРµ, РЅСѓР¶РЅР° РїСЂР°РєС‚РёРєР°', score: 2 },
        { text: 'РЎРїРѕРєРѕР№СЃС‚РІРёРµ Рё СЂР°Р±РѕС‡РёР№ РЅР°СЃС‚СЂРѕР№', score: 3 },
      ],
    },
    {
      category: 'РџСЃРёС…РѕР»РѕРіРёСЏ',
      question: 'РљР°Рє Р±С‹СЃС‚СЂРѕ РІРѕСЃСЃС‚Р°РЅР°РІР»РёРІР°РµС‚РµСЃСЊ РїРѕСЃР»Рµ РЅРµСѓРґР°С‡РЅРѕРіРѕ Р·Р°РґР°РЅРёСЏ?',
      options: [
        { text: 'РўСЏР¶РµР»Рѕ РїРµСЂРµРєР»СЋС‡РёС‚СЊСЃСЏ, РїР°РґР°РµС‚ РєРѕРЅС†РµРЅС‚СЂР°С†РёСЏ', score: 1 },
        { text: 'РќСѓР¶РЅРѕ РІСЂРµРјСЏ, РЅРѕ РІРѕР·РІСЂР°С‰Р°СЋСЃСЊ РІ СЂР°Р±РѕС‚Сѓ', score: 2 },
        { text: 'Р‘С‹СЃС‚СЂРѕ Р°РЅР°Р»РёР·РёСЂСѓСЋ Рё РёРґСѓ РґР°Р»СЊС€Рµ', score: 3 },
      ],
    },
  ],
};

const testIntro = document.getElementById('test-intro');
const testFlow = document.getElementById('test-flow');
const testResultWrap = document.getElementById('test-result-wrap');
const examCards = document.querySelectorAll('.exam-card');
const testStart = document.getElementById('test-start');
const testStartWarning = document.getElementById('test-start-warning');
const questionTitle = document.getElementById('test-question-title');
const questionTopic = document.getElementById('test-question-topic');
const progressText = document.getElementById('test-progress');
const progressValue = document.getElementById('test-progress-value');
const optionsWrap = document.getElementById('test-options');
const prevButton = document.getElementById('test-prev');
const nextButton = document.getElementById('test-next');
const resultTitle = document.getElementById('test-result-title');
const resultText = document.getElementById('test-result');
const resultList = document.getElementById('test-recommendations');
const testFormExamGrid = document.getElementById('test-form-exam-grid');

const testState = {
  exam: '',
  questions: [],
  answers: [],
  index: 0,
};

const resultPresets = {
  high: {
    title: 'РЎРёР»СЊРЅР°СЏ Р±Р°Р·Р° Рё С…РѕСЂРѕС€РёР№ С‚РµРјРї',
    text: 'РЈ РІР°СЃ СѓР¶Рµ РµСЃС‚СЊ СѓРІРµСЂРµРЅРЅР°СЏ Р±Р°Р·Р°. РџСЂРё С‚РѕС‡РµС‡РЅРѕР№ СЂР°Р±РѕС‚Рµ РЅР°Рґ СЃР»Р°Р±С‹РјРё Р·РѕРЅР°РјРё РјРѕР¶РЅРѕ РІС‹Р№С‚Рё РЅР° РІС‹СЃРѕРєРёР№ СЂРµР·СѓР»СЊС‚Р°С‚.',
    tips: [
      'РЈРєСЂРµРїРёС‚СЊ СЃР°РјС‹Рµ СЃР»РѕР¶РЅС‹Рµ С‚РёРїС‹ Р·Р°РґР°РЅРёР№ Рё РґРѕРІРµСЃС‚Рё РёС… РґРѕ Р°РІС‚РѕРјР°С‚РёР·РјР°.',
      'РџРѕРґРґРµСЂР¶РёРІР°С‚СЊ СЂРµРіСѓР»СЏСЂРЅСѓСЋ РїСЂР°РєС‚РёРєСѓ РІ С„РѕСЂРјР°С‚Рµ РїСЂРѕР±РЅРёРєРѕРІ.',
      'РЎРѕС…СЂР°РЅРёС‚СЊ С‚РµРєСѓС‰РёР№ С‚РµРјРї Рё РґРѕР±Р°РІРёС‚СЊ С„РёРЅР°Р»СЊРЅСѓСЋ С€Р»РёС„РѕРІРєСѓ СЃС‚СЂР°С‚РµРіРёРё.',
    ],
  },
  medium: {
    title: 'РҐРѕСЂРѕС€РёР№ РїРѕС‚РµРЅС†РёР°Р» РґР»СЏ СЂРѕСЃС‚Р°',
    text: 'Р‘Р°Р·Р° СѓР¶Рµ РµСЃС‚СЊ, РЅРѕ С‡Р°СЃС‚СЊ РЅР°РІС‹РєРѕРІ С‚СЂРµР±СѓРµС‚ СѓСЃРёР»РµРЅРёСЏ. РЎ С‡С‘С‚РєРёРј РїР»Р°РЅРѕРј РјРѕР¶РЅРѕ Р·Р°РјРµС‚РЅРѕ РїРѕРґРЅСЏС‚СЊ СЂРµР·СѓР»СЊС‚Р°С‚.',
    tips: [
      'РЎРёСЃС‚РµРјРЅРѕ Р·Р°РєСЂС‹С‚СЊ РїСЂРѕР±РµР»С‹ РїРѕ СЃС‚СЂСѓРєС‚СѓСЂРµ СЌРєР·Р°РјРµРЅР°.',
      'Р”РѕР±Р°РІРёС‚СЊ С‚СЂРµРЅРёСЂРѕРІРєСѓ РїРёСЃСЊРјРµРЅРЅРѕР№ Рё СѓСЃС‚РЅРѕР№ С‡Р°СЃС‚РµР№ РїРѕ Р°Р»РіРѕСЂРёС‚РјСѓ.',
      'Р РµРіСѓР»СЏСЂРЅРѕ РѕС‚СЃР»РµР¶РёРІР°С‚СЊ РїСЂРѕРіСЂРµСЃСЃ Рё РєРѕСЂСЂРµРєС‚РёСЂРѕРІР°С‚СЊ РїРѕРґРіРѕС‚РѕРІРєСѓ.',
    ],
  },
  base: {
    title: 'Р•СЃС‚СЊ РѕРїРѕСЂР°, РЅСѓР¶РЅР° СЃРёСЃС‚РµРјРЅРѕСЃС‚СЊ',
    text: 'РЎРµР№С‡Р°СЃ РІР°Р¶РЅРѕ РІС‹СЃС‚СЂРѕРёС‚СЊ РїРѕРЅСЏС‚РЅСѓСЋ СЃС‚СЂР°С‚РµРіРёСЋ Рё СѓРєСЂРµРїРёС‚СЊ СѓРІРµСЂРµРЅРЅРѕСЃС‚СЊ. Р­С‚Рѕ РґР°СЃС‚ СЃС‚Р°Р±РёР»СЊРЅС‹Р№ РїСЂРѕРіСЂРµСЃСЃ СѓР¶Рµ РІ Р±Р»РёР¶Р°Р№С€РµРµ РІСЂРµРјСЏ.',
    tips: [
      'РЎРѕР±СЂР°С‚СЊ Р±Р°Р·РѕРІС‹Р№ РїР»Р°РЅ РїРѕРґРіРѕС‚РѕРІРєРё РїРѕ С€Р°РіР°Рј.',
      'РџСЂРѕРєР°С‡Р°С‚СЊ РєР»СЋС‡РµРІС‹Рµ РЅР°РІС‹РєРё: Р»РµРєСЃРёРєР°, СЃС‚СЂСѓРєС‚СѓСЂР° Рё СѓСЃС‚РѕР№С‡РёРІРѕСЃС‚СЊ РЅР° СЌРєР·Р°РјРµРЅРµ.',
      'РЎРЅРёР·РёС‚СЊ СЃС‚СЂРµСЃСЃ С‡РµСЂРµР· РєРѕСЂРѕС‚РєРёРµ СЂРµРіСѓР»СЏСЂРЅС‹Рµ С‚СЂРµРЅРёСЂРѕРІРєРё.',
    ],
  },
};

function setTestState(view) {
  const panels = {
    intro: testIntro,
    flow: testFlow,
    result: testResultWrap,
  };

  Object.entries(panels).forEach(([name, panel]) => {
    if (!panel) return;
    const isActive = name === view;
    panel.hidden = !isActive;
    panel.classList.toggle('is-active', isActive);
  });
}

function updateProgress() {
  const total = testState.questions.length;
  const current = testState.index + 1;
  progressText.textContent = `Р’РѕРїСЂРѕСЃ ${current} РёР· ${total}`;
  progressValue.style.width = `${(current / total) * 100}%`;
}

function renderQuestion() {
  const question = testState.questions[testState.index];
  if (!question) return;

  questionTitle.textContent = question.question;
  questionTopic.textContent = `Р‘Р»РѕРє: ${question.category}`;
  updateProgress();

  optionsWrap.innerHTML = '';

  question.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-btn';
    button.textContent = option.text;

    button.addEventListener('click', () => {
      testState.answers[testState.index] = option.score;
      optionsWrap.querySelectorAll('.option-btn').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      nextButton.disabled = false;
    });

    optionsWrap.appendChild(button);
  });

  const savedAnswer = testState.answers[testState.index];
  if (savedAnswer != null) {
    const optionButtons = optionsWrap.querySelectorAll('.option-btn');
    const optionIndex = question.options.findIndex((item) => item.score === savedAnswer);
    if (optionButtons[optionIndex]) {
      optionButtons[optionIndex].classList.add('is-active');
    }
    nextButton.disabled = false;
  } else {
    nextButton.disabled = true;
  }

  prevButton.disabled = testState.index === 0;
  nextButton.textContent = testState.index === testState.questions.length - 1 ? 'Р—Р°РІРµСЂС€РёС‚СЊ С‚РµСЃС‚' : 'Р”Р°Р»РµРµ';
}

function getResultByScore() {
  const maxScore = testState.questions.length * 3;
  const totalScore = testState.answers.reduce((sum, value) => sum + value, 0);
  const ratio = totalScore / maxScore;

  if (ratio >= 0.75) return resultPresets.high;
  if (ratio >= 0.5) return resultPresets.medium;
  return resultPresets.base;
}

function examSpecificTip(exam) {
  if (exam === 'РћР“Р­') {
    return 'Р”Р»СЏ РћР“Р­ РѕСЃРѕР±РµРЅРЅРѕ РІР°Р¶РЅРѕ Р·Р°РєСЂРµРїРёС‚СЊ С„РѕСЂРјР°С‚ Р·Р°РґР°РЅРёР№ Рё СѓРІРµСЂРµРЅРЅРѕСЃС‚СЊ РІ СѓСЃС‚РЅРѕР№ С‡Р°СЃС‚Рё.';
  }
  if (exam === 'Р•Р“Р­') {
    return 'Р”Р»СЏ Р•Р“Р­ РєР»СЋС‡РµРІРѕР№ Р°РєС†РµРЅС‚ вЂ” СЃС‚СЂР°С‚РµРіРёСЏ РїРѕ Р·Р°РґР°РЅРёСЏРј Рё СЃС‚Р°Р±РёР»СЊРЅР°СЏ РїРёСЃСЊРјРµРЅРЅР°СЏ С‡Р°СЃС‚СЊ.';
  }
  return 'Р”Р»СЏ РњРµР¶РґСѓРЅР°СЂРѕРґРЅРѕРіРѕ СЌРєР·Р°РјРµРЅР° РІР°Р¶РЅРѕ РґРµСЂР¶Р°С‚СЊ Р±Р°Р»Р°РЅСЃ РјРµР¶РґСѓ СЃС‚СЂСѓРєС‚СѓСЂРѕР№ РѕС‚РІРµС‚Р° Рё СѓРІРµСЂРµРЅРЅРѕР№ РїРѕРґР°С‡РµР№.';
}

function showResult() {
  const result = getResultByScore();
  resultTitle.textContent = result.title;
  resultText.textContent = `${result.text} ${examSpecificTip(testState.exam)}`;

  resultList.innerHTML = '';
  result.tips.forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    resultList.appendChild(li);
  });

  if (testFormExamGrid) {
    const examInputs = testFormExamGrid.querySelectorAll('input[name="exam"]');
    examInputs.forEach((input) => {
      input.checked = input.value === testState.exam;
    });
  }

  setTestState('result');
}

examCards.forEach((card) => {
  card.addEventListener('click', () => {
    examCards.forEach((item) => item.classList.remove('is-active'));
    card.classList.add('is-active');
    testState.exam = card.dataset.exam;
    if (testStartWarning) {
      testStartWarning.hidden = true;
    }
  });
});

if (testStart) {
  testStart.addEventListener('click', () => {
    const selectedQuestions = testData[testState.exam] || [];
    if (!selectedQuestions.length) {
      if (testStartWarning) {
        testStartWarning.hidden = false;
      }
      return;
    }

    if (testStartWarning) {
      testStartWarning.hidden = true;
    }

    testState.questions = selectedQuestions;
    testState.answers = Array(selectedQuestions.length).fill(null);
    testState.index = 0;

    setTestState('flow');
    renderQuestion();
  });
}

if (prevButton) {
  prevButton.addEventListener('click', () => {
    if (testState.index <= 0) return;
    testState.index -= 1;
    renderQuestion();
  });
}

if (nextButton) {
  nextButton.addEventListener('click', () => {
    if (testState.answers[testState.index] == null) return;

    if (testState.index < testState.questions.length - 1) {
      testState.index += 1;
      renderQuestion();
      return;
    }

    showResult();
  });
}

setTestState('intro');
const leadForms = document.querySelectorAll('.lead-form');

function initConsentLockedSubmit(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const consentChecks = form.querySelectorAll('.consent-set input[type="checkbox"]');
  if (!submitButton || !consentChecks.length) return;

  const syncSubmitState = () => {
    const allChecked = Array.from(consentChecks).every((checkbox) => checkbox.checked);
    submitButton.disabled = !allChecked;
  };

  consentChecks.forEach((checkbox) => {
    checkbox.addEventListener('change', syncSubmitState);
  });

  syncSubmitState();
}

leadForms.forEach((form) => initConsentLockedSubmit(form));

const COOKIE_CONSENT_KEY = 'susie_cookie_consent_v1';
const cookieBanner = document.getElementById('cookie-banner');
const cookieAcceptButton = document.getElementById('cookie-accept');

function hasCookieConsent() {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
}

function hideCookieBanner() {
  if (!cookieBanner) return;
  cookieBanner.hidden = true;
}

if (cookieBanner) {
  cookieBanner.hidden = hasCookieConsent();
}

if (cookieAcceptButton) {
  cookieAcceptButton.addEventListener('click', () => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {
      // localStorage may be unavailable in restrictive browser modes.
    }
    hideCookieBanner();
  });
}

const LEAD_API_ENDPOINT = '/api/submit-lead';

function getOrCreateFormStatus(form) {
  let status = form.querySelector('.form-submit-status');
  if (status) return status;

  status = document.createElement('p');
  status.className = 'form-submit-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.hidden = true;
  form.appendChild(status);
  return status;
}

function setFormStatus(form, type, message) {
  const status = getOrCreateFormStatus(form);
  status.classList.remove('is-success', 'is-error', 'is-pending');
  status.classList.add(`is-${type}`);
  status.textContent = message;
  status.hidden = false;
}

function clearFormStatus(form) {
  const status = form.querySelector('.form-submit-status');
  if (!status) return;
  status.hidden = true;
  status.textContent = '';
  status.classList.remove('is-success', 'is-error', 'is-pending');
}

function setFormBusy(form, isBusy) {
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = isBusy;
    submitButton.setAttribute('aria-busy', String(isBusy));
  }
}

function formatPhoneValue(rawValue) {
  let digits = String(rawValue || '').replace(/\D/g, '');

  if (digits.startsWith('8') || digits.startsWith('7')) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  let formatted = '+7';
  if (!digits.length) return formatted;

  formatted += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) formatted += ')';
  if (digits.length > 3) formatted += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) formatted += ` ${digits.slice(6, 8)}`;
  if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;

  return formatted;
}

function isPhoneComplete(phone) {
  return /^\+7 \(\d{3}\) \d{3} \d{2}-\d{2}$/.test(String(phone || '').trim());
}

function initPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.value = formatPhoneValue(input.value);
    });

    input.addEventListener('focus', () => {
      if (!input.value.trim()) input.value = '+7';
    });

    input.addEventListener('blur', () => {
      if (input.value.trim() === '+7') input.value = '';
    });
  });
}

function getTestFormPayload(form) {
  const formData = new FormData(form);
  return {
    // This marks that submission came from the post-test form with discount.
    formType: 'test',
    name: (formData.get('name') || '').toString().trim(),
    phone: (formData.get('phone') || '').toString().trim(),
    exam: (formData.get('exam') || '').toString().trim(),
  };
}

function getFinalFormPayload(form) {
  const formData = new FormData(form);
  return {
    // This marks that submission came from the main final CTA form.
    formType: 'final',
    name: (formData.get('final_name') || '').toString().trim(),
    phone: (formData.get('final_phone') || '').toString().trim(),
    exam: (formData.get('final_exam') || '').toString().trim(),
    course: (formData.get('course') || '').toString().trim(),
  };
}

async function submitLeadForm(form, payloadBuilder) {
  clearFormStatus(form);

  try {
    const payload = payloadBuilder(form);
    if (!isPhoneComplete(payload.phone)) {
      setFormStatus(form, 'error', 'Введите номер в формате +7 (999) 999 99-99.');
      return;
    }

    setFormBusy(form, true);
    setFormStatus(form, 'pending', 'Отправляем заявку...');

    const response = await fetch(LEAD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type') || '';
    const isJsonResponse = contentType.includes('application/json');
    const data = isJsonResponse ? await response.json().catch(() => ({})) : {};
    const backendMessage = data.message || data.error || '';

    if (!response.ok || !data.ok) {
      const fallbackMessage = 'Не удалось отправить заявку. Попробуйте еще раз чуть позже.';
      if (!isJsonResponse) {
        console.error('[lead-form] non-json api response', {
          status: response.status,
          contentType,
          endpoint: LEAD_API_ENDPOINT,
        });
      }

      setFormStatus(form, 'error', backendMessage || fallbackMessage);
      return;
    }

    setFormStatus(form, 'success', backendMessage || 'Заявка отправлена. Скоро свяжемся с вами.');
    form.reset();
  } catch (error) {
    console.error('[lead-form] submit failed', { error });
    setFormStatus(form, 'error', 'Сервис временно недоступен. Попробуйте еще раз чуть позже.');
  } finally {
    setFormBusy(form, false);
  }
}

initPhoneMask();

if (testLeadForm) {
  testLeadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitLeadForm(testLeadForm, getTestFormPayload);
  });
}

if (finalLeadForm) {
  finalLeadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitLeadForm(finalLeadForm, getFinalFormPayload);
  });
}

