// Proxies the Google Apps Script request server-side.
// This avoids iOS Safari's ITP, which blocks dynamic cross-origin script loads
// from google.com domains. The browser calls /.netlify/functions/data (same origin)
// and this function fetches from Apps Script with full redirect-following.

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwwpPerNgKreQEC6TZpu4NjaPm6MMF90gJEAqJXmxqSKBPbcmAJTDmVdl9ChxeLaFln/exec';

exports.handler = async (event) => {
  const key = (event.queryStringParameters || {}).key;
  if (!key) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing key' }) };
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
