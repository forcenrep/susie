module.exports = async function handler(req, res) {
  const requestId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      ok: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Метод не поддерживается.',
    });
  }

  try {
    const body = await parseBody(req);

    // TELEGRAM_BOT_TOKEN is read only from server env variables.
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    // TELEGRAM_CHAT_ID is read only from server env variables.
    const telegramChatIdRaw = process.env.TELEGRAM_CHAT_ID;

    if (!isTelegramEnvConfigured(telegramBotToken, telegramChatIdRaw)) {
      console.error('[lead-api] telegram env is not configured', {
        requestId,
        hasBotToken: Boolean(telegramBotToken),
        hasChatId: Boolean(telegramChatIdRaw),
      });

      return res.status(500).json({
        ok: false,
        code: 'TELEGRAM_NOT_CONFIGURED',
        message: 'Заявка временно не может быть отправлена. Попробуйте позже.',
      });
    }

    // Two forms are separated by formType from frontend: `test` or `final`.
    const normalizedLead = normalizeLeadBody(body);
    const validationError = validateLead(normalizedLead);
    if (validationError) {
      return res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: validationError,
      });
    }

    // Message text for Telegram is formatted in one place.
    const text = buildTelegramMessage(normalizedLead);

    const chatIds = parseChatIds(telegramChatIdRaw);
    const sendResults = [];

    for (const chatId of chatIds) {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        }
      );

      const telegramData = await telegramResponse.json().catch(() => null);
      sendResults.push({
        chatId,
        ok: Boolean(telegramResponse.ok && telegramData?.ok),
        status: telegramResponse.status,
        statusText: telegramResponse.statusText,
        telegramErrorCode: telegramData?.error_code,
        telegramDescription: telegramData?.description,
      });
    }

    const hasSuccess = sendResults.some((item) => item.ok);
    if (!hasSuccess) {
      console.error('[lead-api] telegram send failed for all chats', {
        requestId,
        formType: normalizedLead.formType,
        results: sendResults.map((item) => ({
          ...item,
          chatId: maskChatId(item.chatId),
        })),
      });

      return res.status(502).json({
        ok: false,
        code: 'TELEGRAM_SEND_FAILED',
        message: 'Не удалось отправить заявку. Попробуйте еще раз чуть позже.',
      });
    }

    const failedResults = sendResults.filter((item) => !item.ok);
    if (failedResults.length) {
      console.warn('[lead-api] telegram partial delivery', {
        requestId,
        formType: normalizedLead.formType,
        failed: failedResults.map((item) => ({
          ...item,
          chatId: maskChatId(item.chatId),
        })),
      });
    }

    console.info('[lead-api] lead sent to telegram', {
      requestId,
      formType: normalizedLead.formType,
      exam: normalizedLead.exam,
    });

    return res.status(200).json({
      ok: true,
      code: 'LEAD_SENT',
      message: 'Заявка отправлена. Скоро свяжемся с вами.',
    });
  } catch (error) {
    console.error('[lead-api] unexpected error', {
      requestId,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      ok: false,
      code: 'INTERNAL_ERROR',
      message: 'Сервис временно недоступен. Попробуйте еще раз позже.',
    });
  }
};

async function parseBody(req) {
  const rawBody = req?.body;

  if (rawBody != null) {
    if (typeof rawBody === 'object' && !Buffer.isBuffer(rawBody)) return rawBody;
    if (Buffer.isBuffer(rawBody)) {
      const text = rawBody.toString('utf8');
      return parseJsonString(text);
    }
    if (typeof rawBody === 'string') {
      return parseJsonString(rawBody);
    }

    return {};
  }

  // Fallback for runtimes where body is only available as a stream.
  let streamRaw = '';
  for await (const chunk of req) {
    streamRaw += chunk;
  }

  if (!streamRaw.trim()) return {};
  return parseJsonString(streamRaw);
}

function parseJsonString(value) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error('Invalid JSON body');
  }
}

function isTelegramEnvConfigured(botToken, chatId) {
  const token = safeString(botToken);
  const chatIds = parseChatIds(chatId);

  if (!token || !chatIds.length) return false;

  // Guard against placeholders from .env.example.
  if (token.includes('your_') || token.includes('replace_with_')) return false;
  if (chatIds.some((chat) => chat.includes('your_') || chat.includes('replace_with_'))) return false;

  // Real Telegram bot token contains ":" between numeric id and secret part.
  if (!token.includes(':')) return false;

  return true;
}

function parseChatIds(value) {
  return safeString(value)
    .split(/[\s,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function maskChatId(chatId) {
  const value = safeString(chatId);
  if (value.length <= 4) return '****';
  return `***${value.slice(-4)}`;
}

function normalizeLeadBody(body) {
  return {
    formType: safeString(body.formType),
    name: safeString(body.name),
    phone: safeString(body.phone),
    exam: safeString(body.exam),
    course: safeString(body.course),
  };
}

function validateLead(lead) {
  if (lead.formType !== 'test' && lead.formType !== 'final') {
    return 'Не удалось определить форму отправки.';
  }

  if (!lead.name) return 'Укажите имя.';
  if (!lead.phone) return 'Укажите номер телефона.';
  if (!isValidPhoneFormat(lead.phone)) return 'Введите номер в формате +7 (999) 999 99-99.';
  if (!lead.exam) return 'Укажите, какой экзамен сдаете.';

  return '';
}

function isValidPhoneFormat(value) {
  return /^\+7 \(\d{3}\) \d{3} \d{2}-\d{2}$/.test(String(value || '').trim());
}

function safeString(value) {
  return String(value ?? '').trim();
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildTelegramMessage(lead) {
  const isTestForm = lead.formType === 'test';
  const formLabel = isTestForm ? 'После теста' : 'Финальная форма';
  const hasDiscount = isTestForm ? 'Да, 20%' : 'Нет';
  const courseLine = lead.course ? `\n🎯 <b>Курс:</b> ${escapeHtml(lead.course)}` : '';

  return [
    '🚀 <b>Новая заявка с сайта Susie</b>',
    '',
    '━━━━━━━━━━━━━━━',
    `🧾 <b>Форма:</b> ${escapeHtml(formLabel)}`,
    `🎁 <b>Скидка:</b> ${escapeHtml(hasDiscount)}`,
    `👤 <b>Имя:</b> ${escapeHtml(lead.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `📚 <b>Экзамен:</b> ${escapeHtml(lead.exam)}${courseLine}`,
    '━━━━━━━━━━━━━━━',
  ].join('\n');
}
