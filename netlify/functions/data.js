// Proxies the Google Apps Script request server-side.
// Key is stored as a Netlify environment variable (APPS_SCRIPT_KEY) —
// never exposed to the browser or network requests.

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwwpPerNgKreQEC6TZpu4NjaPm6MMF90gJEAqJXmxqSKBPbcmAJTDmVdl9ChxeLaFln/exec';

exports.handler = async () => {
  const key = process.env.APPS_SCRIPT_KEY;
  if (!key) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server misconfigured — APPS_SCRIPT_KEY not set' }),
    };
  }

  try {
    const upstream = await fetch(
      `${APPS_SCRIPT_URL}?key=${encodeURIComponent(key)}`,
      { redirect: 'follow' }
    );
    const body = await upstream.text();

    return {
      statusCode: upstream.ok ? 200 : upstream.status,
      headers: { 'Content-Type': 'application/json' },
      body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
