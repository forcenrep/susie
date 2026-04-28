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
    title: 'ЕГЭ без паники (письменная часть)',
    image: 'public/с1.jpg',
    description:
      'Практический мини-курс для уверенной письменной части: структура, аргументация, критерии и типичные ошибки.',
    tags: ['Письменная часть', 'Шаблоны', 'Разбор ошибок'],
    examples: [
      'Пошаговый алгоритм письма и эссе без «пустых» фраз.',
      'Разбор критериев ФИПИ на понятных примерах.',
      'Переписывание слабых ответов в сильные по шаблону.',
      'Персональные комментарии к вашим текстам и точкам роста.',
    ],
    result:
      'Вы пишете структурно и уверенно, понимаете, за что дают баллы, и перестаёте теряться в письменной части на экзамене.',
    priceKey: 'course_ege',
  },
  speaking: {
    title: 'Устная часть без страха',
    image: 'public/с2.jpg',
    description:
      'Курс для уверенной устной речи: структура ответа, темп, подача и спокойная реакция на сложные вопросы.',
    tags: ['Устная часть', 'Темп речи', 'Уверенная подача'],
    examples: [
      'Готовые конструкции для уверенного старта ответа.',
      'Тренировка тайминга и логики без длинных пауз.',
      'Практика в формате экзамена с персональной обратной связью.',
      'Отработка сложных тем, где обычно теряются баллы.',
    ],
    result:
      'Вы говорите собранно и спокойно, держите структуру ответа и звучите уверенно даже в стрессовых заданиях.',
    priceKey: 'course_speaking',
  },
};

const PRICE_STORAGE_KEY = 'susie_price_settings_v1';
const PRICE_CHANNEL_NAME = 'susie_price_channel_v1';
const DEFAULT_PRICE_MAP = Object.freeze({
  format_individual: 'от 500 руб / занятие',
  format_pair: 'от 500 руб / занятие',
  format_group: 'от 500 руб / занятие',
  course_ege: '1000 ₽',
  course_speaking: '1000 ₽',
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
      '<div class="video-modal-placeholder">Здесь будет видеоотзыв. Вы сможете добавить ссылку на видео в карточку.</div>';
  }

  syncModalState();
}

function openVideoModal(trigger) {
  if (!videoModal || !videoModalTitle || !videoModalDescription || !videoModalPlayer) return;

  const title = trigger.dataset.videoTitle || 'Видеоотзыв';
  const description = trigger.dataset.videoDescription || 'Описание видео будет добавлено позже.';
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
      '<div class="video-modal-placeholder">Здесь будет видеоотзыв. Вы сможете добавить ссылку на видео в карточку.</div>';
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
    selectedCourseNote.textContent = `Выбран мини-курс: ${courseName}`;
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
  'ОГЭ': [
    {
      category: 'Английский язык',
      question: 'Какую форму глагола выбирают в настоящем времени для «он/она»?',
      options: [
        { text: 'Форму с окончанием -s', score: 3 },
        { text: 'Начальную форму без изменений', score: 1 },
        { text: 'Форму прошедшего времени', score: 2 },
      ],
    },
    {
      category: 'Английский язык',
      question: 'Какое время обычно используют для действия, которое уже завершилось к текущему моменту?',
      options: [
        { text: 'Настоящее завершённое время', score: 3 },
        { text: 'Простое прошедшее без контекста', score: 1 },
        { text: 'Прошедшее длительное время', score: 2 },
      ],
    },
    {
      category: 'Английский язык',
      question: 'Что обычно сложнее всего в ОГЭ прямо сейчас?',
      options: [
        { text: 'Письменная и устная части', score: 1 },
        { text: 'Понимание структуры заданий', score: 2 },
        { text: 'Уже понимаю структуру, нужен рост скорости', score: 3 },
      ],
    },
    {
      category: 'Психология',
      question: 'Как вы чувствуете себя перед проверочными работами?',
      options: [
        { text: 'Сильно переживаю и часто теряюсь', score: 1 },
        { text: 'Есть волнение, но могу собраться', score: 2 },
        { text: 'Чувствую себя спокойно и уверенно', score: 3 },
      ],
    },
    {
      category: 'Психология',
      question: 'Как реагируете на ошибки в заданиях?',
      options: [
        { text: 'Расстраиваюсь и теряю мотивацию', score: 1 },
        { text: 'Исправляю, но иногда боюсь повторить', score: 2 },
        { text: 'Воспринимаю как ориентир для роста', score: 3 },
      ],
    },
  ],
  'ЕГЭ': [
    {
      category: 'Английский язык',
      question: 'Какую форму глагола выбирают в условии второго типа после If?',
      options: [
        { text: 'Форму прошедшего времени (had)', score: 3 },
        { text: 'Форму настоящего времени (have)', score: 2 },
        { text: 'Форму будущего времени (will have)', score: 1 },
      ],
    },
    {
      category: 'Английский язык',
      question: 'Что важнее всего для сильной письменной части ЕГЭ?',
      options: [
        { text: 'Чёткая структура и аргументация', score: 3 },
        { text: 'Только сложные слова', score: 1 },
        { text: 'Длинный текст без плана', score: 2 },
      ],
    },
    {
      category: 'Английский язык',
      question: 'Как сейчас идёт работа с форматом заданий ЕГЭ?',
      options: [
        { text: 'Есть пробелы по нескольким блокам', score: 1 },
        { text: 'База есть, нужна стабильность', score: 2 },
        { text: 'Уверенно решаю большинство заданий', score: 3 },
      ],
    },
    {
      category: 'Психология',
      question: 'Насколько сильно стресс мешает вам на пробниках?',
      options: [
        { text: 'Сильно мешает и снижает результат', score: 1 },
        { text: 'Иногда мешает, но контролируемо', score: 2 },
        { text: 'Почти не влияет', score: 3 },
      ],
    },
    {
      category: 'Психология',
      question: 'Как оцениваете свою уверенность в день экзамена?',
      options: [
        { text: 'Пока не хватает уверенности', score: 1 },
        { text: 'Есть уверенность, но не во всех блоках', score: 2 },
        { text: 'Чувствую себя достаточно уверенно', score: 3 },
      ],
    },
  ],
  'Международный экзамен': [
    {
      category: 'Английский язык',
      question: 'Что важнее всего в устной части Международного экзамена?',
      options: [
        { text: 'Логика ответа и понятная структура речи', score: 3 },
        { text: 'Говорить как можно быстрее', score: 1 },
        { text: 'Использовать только сложные слова', score: 2 },
      ],
    },
    {
      category: 'Английский язык',
      question: 'Какой подход лучше для письменной части?',
      options: [
        { text: 'План + аргументы + проверка по критериям', score: 3 },
        { text: 'Писать без структуры, по вдохновению', score: 1 },
        { text: 'Сосредоточиться только на объёме', score: 2 },
      ],
    },
    {
      category: 'Английский язык',
      question: 'Как вы сейчас оцениваете работу с таймингом?',
      options: [
        { text: 'Пока не укладываюсь во время', score: 1 },
        { text: 'Иногда не успеваю отдельные части', score: 2 },
        { text: 'Обычно укладываюсь в лимит времени', score: 3 },
      ],
    },
    {
      category: 'Психология',
      question: 'Что чувствуете перед устным ответом?',
      options: [
        { text: 'Сильное волнение и страх ошибок', score: 1 },
        { text: 'Умеренное волнение, нужна практика', score: 2 },
        { text: 'Спокойствие и рабочий настрой', score: 3 },
      ],
    },
    {
      category: 'Психология',
      question: 'Как быстро восстанавливаетесь после неудачного задания?',
      options: [
        { text: 'Тяжело переключиться, падает концентрация', score: 1 },
        { text: 'Нужно время, но возвращаюсь в работу', score: 2 },
        { text: 'Быстро анализирую и иду дальше', score: 3 },
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
    title: 'Сильная база и хороший темп',
    text: 'У вас уже есть уверенная база. При точечной работе над слабыми зонами можно выйти на высокий результат.',
    tips: [
      'Укрепить самые сложные типы заданий и довести их до автоматизма.',
      'Поддерживать регулярную практику в формате пробников.',
      'Сохранить текущий темп и добавить финальную шлифовку стратегии.',
    ],
  },
  medium: {
    title: 'Хороший потенциал для роста',
    text: 'База уже есть, но часть навыков требует усиления. С чётким планом можно заметно поднять результат.',
    tips: [
      'Системно закрыть пробелы по структуре экзамена.',
      'Добавить тренировку письменной и устной частей по алгоритму.',
      'Регулярно отслеживать прогресс и корректировать подготовку.',
    ],
  },
  base: {
    title: 'Есть опора, нужна системность',
    text: 'Сейчас важно выстроить понятную стратегию и укрепить уверенность. Это даст стабильный прогресс уже в ближайшее время.',
    tips: [
      'Собрать базовый план подготовки по шагам.',
      'Прокачать ключевые навыки: лексика, структура и устойчивость на экзамене.',
      'Снизить стресс через короткие регулярные тренировки.',
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
  progressText.textContent = `Вопрос ${current} из ${total}`;
  progressValue.style.width = `${(current / total) * 100}%`;
}

function renderQuestion() {
  const question = testState.questions[testState.index];
  if (!question) return;

  questionTitle.textContent = question.question;
  questionTopic.textContent = `Блок: ${question.category}`;
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
  nextButton.textContent = testState.index === testState.questions.length - 1 ? 'Завершить тест' : 'Далее';
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
  if (exam === 'ОГЭ') {
    return 'Для ОГЭ особенно важно закрепить формат заданий и уверенность в устной части.';
  }
  if (exam === 'ЕГЭ') {
    return 'Для ЕГЭ ключевой акцент — стратегия по заданиям и стабильная письменная часть.';
  }
  return 'Для Международного экзамена важно держать баланс между структурой ответа и уверенной подачей.';
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
  setFormBusy(form, true);
  setFormStatus(form, 'pending', 'Отправляем заявку...');

  try {
    const payload = payloadBuilder(form);
    const response = await fetch(LEAD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      const fallbackMessage = 'Не удалось отправить заявку. Попробуйте еще раз чуть позже.';
      setFormStatus(form, 'error', data.message || fallbackMessage);
      return;
    }

    setFormStatus(form, 'success', data.message || 'Заявка отправлена. Скоро свяжемся с вами.');
    form.reset();
  } catch (error) {
    console.error('[lead-form] submit failed', { error });
    setFormStatus(form, 'error', 'Сервис временно недоступен. Попробуйте еще раз чуть позже.');
  } finally {
    setFormBusy(form, false);
  }
}

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
