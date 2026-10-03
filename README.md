# SABI CENTEC — Familia de Maestros

Aplicación del ecosistema SABICENTEC: el estudiante elige el área que
quiere aprender, mejorar, profundizar o superar, y conversa con el
maestro-tutor de esa materia (núcleo común + módulo pedagógico
especializado, alineado con el modelo institucional Proyecto FUTURO).

## Arquitectura

- **Frontend**: React + Vite (`src/App.jsx`), estático, se sirve desde
  Cloudflare Pages.
- **Backend**: una Cloudflare Pages Function (`functions/api/chat.js`)
  que recibe el mensaje del navegador y lo reenvía a la API de Anthropic
  usando la API key como **secreto del lado del servidor** — la key
  nunca llega al navegador del estudiante.

## 1. Subir a GitHub

```bash
cd sabicentec-familia-maestros
git init
git add .
git commit -m "SABI CENTEC — Familia de Maestros: primera versión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/sabicentec-familia-maestros.git
git push -u origin main
```

(Reemplaza `TU-USUARIO` por tu usuario u organización de GitHub. Si el
repo aún no existe, créalo antes en github.com — vacío, sin README, para
que el push no choque con archivos remotos.)

## 2. Desplegar en Cloudflare Pages

1. En el dashboard de Cloudflare → **Workers & Pages** → **Crear
   aplicación** → **Pages** → **Conectar a Git** → selecciona el repo
   `sabicentec-familia-maestros`.
2. Configuración de build:
   - **Comando de build:** `npm run build`
   - **Directorio de salida:** `dist`
3. Antes del primer deploy (o justo después), agrega la variable de
   entorno secreta:
   - Ve a **Settings → Environment variables** del proyecto Pages.
   - Agrega `ANTHROPIC_API_KEY` con tu API key, marcada como **Secret**
     (no como texto plano), tanto en Production como en Preview.
4. Guarda y despliega. Cloudflare Pages detecta automáticamente
   `functions/api/chat.js` y lo publica como función serverless en
   `/api/chat` — no necesitas configurar nada más para el backend.

## 3. Verificar

Abre la URL que te da Cloudflare (`*.pages.dev`, o tu dominio propio si
lo conectas), elige un área, y escribe un mensaje. Si ves un error de
"El servidor no tiene configurada la API key", revisa el paso 3.

## Desarrollo local

```bash
npm install
npm run dev
```

Para probar `/api/chat` en local necesitas Wrangler:

```bash
npm install -g wrangler
wrangler pages dev dist --binding ANTHROPIC_API_KEY=tu-key-aqui
```

## Estructura de contenido pedagógico

Todas las áreas (núcleo común + módulos especializados por materia) viven
en `src/App.jsx`, en las constantes `NUCLEO_COMUN` y `AREAS`. Para
agregar o ajustar una materia, edita ese archivo — no requiere tocar el
backend.
