const revealItems = document.querySelectorAll('.reveal');

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
    rootMargin: '0px 0px -24px 0px',
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

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    const clickedInside = mainNav.contains(event.target) || menuToggle.contains(event.target);
    if (!clickedInside) {
      closeMenu();
    }
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
    tab.addEventListener('click', () => {
      activateCase(tab.dataset.caseTab);
    });
  });
}
