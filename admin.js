const ADMIN_PASSWORD = '123456';
const ADMIN_SESSION_KEY = 'susie_admin_auth_v1';

const PRICE_STORAGE_KEY = 'susie_price_settings_v1';
const PRICE_CHANNEL_NAME = 'susie_price_channel_v1';

const DEFAULT_PRICE_MAP = Object.freeze({
  format_individual: 'от 500 руб / занятие',
  format_pair: 'от 500 руб / занятие',
  format_group: 'от 500 руб / занятие',
  course_ege: '1000 ₽',
  course_speaking: '1000 ₽',
});

const loginSection = document.getElementById('admin-login');
const loginForm = document.getElementById('admin-login-form');
const passwordInput = document.getElementById('admin-password');
const loginError = document.getElementById('admin-login-error');
const adminPanel = document.getElementById('admin-panel');

const fields = Array.from(document.querySelectorAll('[data-price-field]'));
const saveButton = document.getElementById('save-prices');
const resetButton = document.getElementById('reset-defaults');
const statusNode = document.getElementById('admin-status');

const priceChannel =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(PRICE_CHANNEL_NAME) : null;

function setAuthorizedSession(value) {
  try {
    if (value) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

function getAuthorizedSession() {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function setVisible(element, visible, displayValue = 'block') {
  if (!element) return;
  element.hidden = !visible;
  element.style.display = visible ? displayValue : 'none';
}

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
    return normalizePriceMap(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_PRICE_MAP };
  }
}

function fillFields(priceMap) {
  fields.forEach((field) => {
    const key = field.dataset.priceField;
    if (!key) return;
    field.value = priceMap[key] || '';
  });
}

function collectFromFields() {
  const nextMap = { ...DEFAULT_PRICE_MAP };
  fields.forEach((field) => {
    const key = field.dataset.priceField;
    if (!key) return;
    const value = field.value.trim();
    nextMap[key] = value || DEFAULT_PRICE_MAP[key];
  });
  return nextMap;
}

function updateStatus(message) {
  if (!statusNode) return;
  const now = new Date();
  const time = now.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  statusNode.textContent = `${message} (${time})`;
}

function publishPrices(priceMap, statusMessage = 'Цены сохранены') {
  const normalized = normalizePriceMap(priceMap);

  try {
    window.localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    updateStatus('Не удалось сохранить цены в браузере');
    return;
  }

  if (priceChannel) {
    priceChannel.postMessage({
      type: 'prices:update',
      prices: normalized,
    });
  }

  updateStatus(statusMessage);
}

function unlockAdmin() {
  setVisible(loginSection, false);
  setVisible(adminPanel, true, 'grid');
  if (loginError) loginError.hidden = true;
  if (passwordInput) passwordInput.value = '';
}

function showLogin() {
  setVisible(loginSection, true, 'grid');
  setVisible(adminPanel, false);
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const entered = (passwordInput?.value || '').trim();
    if (entered === ADMIN_PASSWORD) {
      setAuthorizedSession(true);
      unlockAdmin();
      updateStatus('Панель разблокирована. Внесите изменения и нажмите «Сохранить».');
      return;
    }

    if (loginError) {
      loginError.hidden = false;
      loginError.textContent = 'Неверный пароль';
    }
  });
}

if (passwordInput) {
  passwordInput.addEventListener('input', () => {
    if (loginError) loginError.hidden = true;
  });
}

fields.forEach((field) => {
  field.addEventListener('input', () => {
    updateStatus('Есть несохранённые изменения. Нажмите «Сохранить».');
  });
});

if (saveButton) {
  saveButton.addEventListener('click', () => {
    publishPrices(collectFromFields(), 'Цены сохранены');
  });
}

if (resetButton) {
  resetButton.addEventListener('click', () => {
    fillFields(DEFAULT_PRICE_MAP);
    updateStatus('Поля сброшены. Нажмите «Сохранить», чтобы применить.');
  });
}

const initialPrices = loadSavedPrices();
fillFields(initialPrices);

const isAuthorized = getAuthorizedSession();
if (isAuthorized) {
  unlockAdmin();
  updateStatus('Панель готова. Внесите изменения и нажмите «Сохранить».');
} else {
  showLogin();
}
