# SABI · Proyectos por área y aprendizaje profundo — cómo subirlo

Repositorio: alexrojas0601-hue/sabicentecsuperacion (Cloudflare Pages lo publica solo al subir).
Apaga la traducción de Chrome antes de empezar.

1. En la raíz del repositorio: Add file → Upload files. Arrastra tutor.html, index.html,
   recursos.html, proyectos.html, AGENTES.md y README.md. Commit.
2. Entra a la carpeta data → Upload files → pedagogia-vigente.json y proyectos-areas.json. Commit.
3. Entra a functions → api → Upload files → chat.js (reemplaza el actual). Commit.
4. Entra a scripts → Upload files → investigador-areas.mjs. Commit.
5. La carpeta .github no se deja arrastrar en muchos equipos: en la raíz usa Add file → Create new
   file, escribe como nombre  .github/workflows/sabi-investigadores.yml  y pega el contenido del
   archivo. Commit.

Comprobar (5 minutos después):
- superacion.sabicentec.com/proyectos.html muestra 94 proyectos y los filtros.
- En el tutor, la pantalla de misiones tiene la tarjeta "Proyectos del área".
- En GitHub → Actions → "SABI · investigadores por área" → Run workflow con modo cobertura:
  debe terminar en verde y abrir un Pull Request con el informe de vacíos.

No hay que crear secretos nuevos: usa el mismo ANTHROPIC_API_KEY del curador.
