// Cloudflare Pages Function — proxy seguro hacia la API de Anthropic.
// La API key vive SOLO aquí, como variable de entorno secreta de Cloudflare
// (ANTHROPIC_API_KEY), nunca en el código del navegador.

export async function onRequestPost(context) {
  const { request, env } = context;

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
