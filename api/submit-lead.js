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
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      console.error('[lead-api] telegram env is not configured', {
        requestId,
        hasBotToken: Boolean(telegramBotToken),
        hasChatId: Boolean(telegramChatId),
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

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    const telegramData = await telegramResponse.json().catch(() => null);

    if (!telegramResponse.ok || !telegramData?.ok) {
      console.error('[lead-api] telegram send failed', {
        requestId,
        status: telegramResponse.status,
        statusText: telegramResponse.statusText,
        telegramErrorCode: telegramData?.error_code,
        telegramDescription: telegramData?.description,
        formType: normalizedLead.formType,
      });

      return res.status(502).json({
        ok: false,
        code: 'TELEGRAM_SEND_FAILED',
        message: 'Не удалось отправить заявку. Попробуйте еще раз чуть позже.',
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
  if (!lead.exam) return 'Укажите, какой экзамен сдаете.';

  return '';
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
  const formLabel = isTestForm ? 'Форма после теста' : 'Финальная форма';
  const hasDiscount = isTestForm ? 'Да, скидка 20%' : 'Нет';
  const courseLine = lead.course ? `\n<b>Курс:</b> ${escapeHtml(lead.course)}` : '';

  return [
    '<b>Новая заявка с сайта</b>',
    '',
    `<b>Форма:</b> ${escapeHtml(formLabel)}`,
    `<b>Скидка:</b> ${escapeHtml(hasDiscount)}`,
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Экзамен:</b> ${escapeHtml(lead.exam)}${courseLine}`,
  ].join('\n');
}
