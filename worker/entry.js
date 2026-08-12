// Punto de entrada único del Worker — reemplaza el modelo antiguo de
// Cloudflare Pages Functions (functions/api/chat.js), que ya no aplica
// en el flujo actual de "Workers + Static Assets".
//
// Sirve el sitio estático (dist/, vía el binding ASSETS) para cualquier
// ruta normal, y maneja /api/chat aquí mismo como proxy seguro hacia la
// API de Anthropic. La API key vive SOLO como secreto de Cloudflare
// (ANTHROPIC_API_KEY) y nunca llega al navegador del estudiante.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return handleChat(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleChat(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Solicitud inválida.", 400);
  }

  const { system, messages } = body || {};
  if (!system || !Array.isArray(messages) || messages.length === 0) {
    return jsonError("Faltan campos requeridos.", 400);
  }
  if (messages.length > 60) {
    return jsonError("Conversación demasiado larga.", 400);
  }

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError("El servidor no tiene configurada la API key.", 500);
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages,
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    return jsonError(`Error del modelo (${upstream.status}): ${detail}`, 502);
  }

  const data = await upstream.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
