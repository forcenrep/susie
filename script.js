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

const videoModal = document.getElementById('video-modal');
const videoModalTitle = document.getElementById('video-modal-title');
const videoModalDescription = document.getElementById('video-modal-description');
const videoModalPlayer = document.getElementById('video-modal-player');
const videoTriggers = document.querySelectorAll('.video-card-trigger');

const courseModal = document.getElementById('course-modal');
const courseModalTitle = document.getElementById('course-modal-title');
const courseModalDescription = document.getElementById('course-modal-description');
const courseModalExamples = document.getElementById('course-modal-examples');
const courseModalSignup = document.getElementById('course-modal-signup');
const courseMoreButtons = document.querySelectorAll('.course-more');
const courseSignupButtons = document.querySelectorAll('.course-signup');
const selectedCourseInput = document.getElementById('selected-course-input');
const selectedCourseNote = document.getElementById('selected-course-note');
const finalCtaSection = document.getElementById('final-cta');

const courseDetails = {
  'ege-writing': {
    title: 'ЕГЭ без паники (письменная часть)',
    description:
      'Практический мини-курс для уверенной письменной части: структура, логика аргументации, критерии и частые ошибки.',
    examples: [
      'Проверка письма и комментарии по критериям.',
      'Пошаговый алгоритм для эссе и типовых формулировок.',
      'Разбор удачных и слабых примеров с доработкой.',
    ],
  },
  speaking: {
    title: 'Устная часть без страха',
    description:
      'Курс для развития уверенной речи: тренируем ответы по структуре, темп, уверенную подачу и реакцию на сложные вопросы.',
    examples: [
      'Проверка устных ответов и персональная обратная связь.',
      'Готовые конструкции и речевые связки для разных тем.',
      'Практика в формате экзамена с корректировкой стратегии.',
    ],
  },
};

let activeCourseName = '';

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
  syncModalState();
}

function openCourseModal(courseId) {
  if (!courseModal || !courseModalTitle || !courseModalDescription || !courseModalExamples) return;

  const details = courseDetails[courseId];
  if (!details) return;

  courseModalTitle.textContent = details.title;
  courseModalDescription.textContent = details.description;

  courseModalExamples.innerHTML = '';
  details.examples.forEach((example) => {
    const li = document.createElement('li');
    li.textContent = example;
    courseModalExamples.appendChild(li);
  });

  activeCourseName = details.title;
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
    testStart.disabled = !testState.exam;
  });
});

if (testStart) {
  testStart.addEventListener('click', () => {
    const selectedQuestions = testData[testState.exam] || [];
    if (!selectedQuestions.length) return;

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
