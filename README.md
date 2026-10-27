# Luci · Riviera Pool Party

Invitación de cumpleaños React + TypeScript, estática y mobile-first. **Viernes 13 de noviembre de 2026, 5:00 PM, Jardín D-GALICIA**, zona `America/Mexico_City`. No está publicada. Dirección exacta, WhatsApp, fotos, edad, hora final y música no se han proporcionado y no se inventan.

## Ejecutar

Node 22.18+ o 24, npm:

```sh
npm ci
npm run dev
```

Abrir la URL que muestra Vite. Desde un teléfono en la misma red, usar la IP LAN del equipo y ese puerto. No exponer el servidor de desarrollo a Internet.

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm run preview
node scripts/check-contrast.mjs
```

En este sandbox macOS se necesita `OPENSSL_CONF=/dev/null` antes de los comandos Node/npm. `.npmrc` elige `/bin/sh`; no afecta al hosting estático. El entorno también puede impedir vaciar `dist`; el reporte explica la compilación aislada real usada, sin reparar permisos ni borrar trabajo.

## Configuración única

Editar **`src/config/invitation.ts`**:

- `name`, `eventType`, `welcome`, `message`, `age` opcional. La identidad actual es cumpleaños con alberca, sin edad asumida.
- `date: '2026-11-13'`, `startTime: '17:00'`, `timeZone: 'America/Mexico_City'`. El instante real es **2026-11-13T23:00:00Z**. El contador recomputa contra reloj real cada segundo y cuando cambia la visibilidad de la pestaña, sin valores negativos ni spam de lector de pantalla por segundo.
- `endTime` es opcional y del mismo día; omitir si no se conoce o la fiesta cruza medianoche. No se inventa una duración para el ICS. Fechas inválidas, zonas inválidas y horas DST ambiguas/inexistentes se rechazan.
- `venue`: nombre confirmado. `address`, `coordinates` o `mapsLink`: completar con datos exactos antes de habilitar “CÓMO LLEGAR”. No se busca una dirección a partir del nombre del jardín. Google sólo recibe conexiones después de abrir navegación o cargar el iframe bajo demanda.
- `whatsapp`: dígitos con código de país, sin `+`, espacios ni guiones. Vacío deshabilita “CONFIRMAR ASISTENCIA” con explicación. `maxCompanions` son acompañantes ADICIONALES: cero no permite acompañantes. `confirmationMessage` cierra el mensaje.
- `photos` y `heroImage`: imágenes locales `public/images/` con `src`, `alt`, `width`, `height`, `caption` opcional. Sin fotografías se muestra una ilustración geométrica original de alberca, nunca personas ficticias ni placeholders de demo. Lightbox nativo con teclado, Escape, swipe, carga/error y retorno al control inicial.
- `music` opcional: `{ src: 'music/pista-propia.mp3', loop: true }`. Debe ser propia o licenciada. No suena al cargar: sólo al pulsar el reproductor. Sin archivo no se muestra el control. Error/carga/reintento permanecen visibles también en móvil.
- `dressCode` opcional permite detalle adicional; no se ha asumido un código formal. El recordatorio de traje de baño sí es parte confirmada del evento.
- `theme`: paleta Riviera centralizada; `effects.animations` y `effects.particles`. La preferencia del sistema de movimiento reducido siempre prevalece. Las burbujas son estáticas; no hay bucle ambiental infinito.
- `seo`: título, descripción e imagen social. Vite genera los metadatos en HTML para compartir, no sólo mediante React.

No se almacenan nombres/respuestas ni hay backend. WhatsApp abre un mensaje revisable: **abrirlo no significa enviarlo**. El calendario permite el lugar confirmado sin inventar una calle; exporta UTC, CRLF, caracteres escapados y líneas plegadas correctamente por octetos UTF-8. El build verifica recursos locales configurados.

## Diseño y animaciones

Outfit ExtraBold + DM Sans locales, paleta ivory/water/sage/deep teal/champagne/dusty coral. La hero, fecha, lugar y recordatorio tienen composiciones distintas. Sólo el contador usa un bloque oscuro. GSAP + `@gsap/react` + ScrollTrigger + SplitText crean una secuencia inicial de unos 2s, máscaras de caracteres, revelados puntuales y cambios numéricos de 220ms. La navegación nunca se bloquea y se puede omitir la animación. Contextos/media/splits se limpian bajo StrictMode.

Los pares de texto normal superan 4.5:1; sage/teal es 4.88 y coral se reserva para gráficos porque con teal sólo alcanza 3.38. Ver `docs/validation/v2/contrast.json`. La prueba de tokens no sustituye revisar contraste sobre imágenes y los estados renderizados.

Skills realmente aplicadas: **Emil Design Engineering**, **Animate** y recetas, **Mobile Native**, **Impeccable** (contexto, craft-floor y polish). No se afirma haber completado una aprobación visual independiente de Impeccable. Documentación oficial de GSAP consultada: [React](https://gsap.com/resources/React/), [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

## Archivos

- `src/App.tsx`, `src/styles.css`: experiencia y sistema visual.
- `src/hooks/useInvitationMotion.ts`: GSAP, timelines y cleanup.
- `src/hooks/useCountdown.ts`, `src/components/Countdown.tsx`: reloj real y números animados.
- `src/sections/EventDetails.tsx`: fecha, ICS y ubicación.
- `src/sections/RSVPSection.tsx`: WhatsApp y validaciones.
- `src/components/Gallery.tsx`, `AudioPlayer.tsx`, `PoolArt.tsx`: componentes y arte propio.
- `src/utils/event.ts`: IANA/Temporal, calendario, Maps, WhatsApp.
- `src/__tests__/`: regresiones funcionales, reloj, lifecycle y smoke real GSAP.
- `public/social.png`: PNG real 1200×630, arte propio y Outfit vectorizado; sin fotografía personal.
- `PRODUCT.md`, `DESIGN.md`: hechos y dirección vigente.

Outfit y DM Sans: licencias OFL en los paquetes Fontsource. Lucide: ISC. Temporal añade peso para evitar conversiones horarias aproximadas. GSAP fue añadido expresamente para V2; no era una dependencia existente. No se ha instalado ni utilizado Playwright.

## Publicación gratuita

No se han creado cuentas ni desplegado. Cloudflare Pages o Netlify admiten un proyecto estático:

1. Subir el código a un repositorio propio. Build `npm run build`, salida `dist`, Node 22.18+ o 24. Alternativa: cargar la carpeta compilada mediante el flujo manual del proveedor.
2. Al conocer la URL final HTTPS, configurar `PUBLIC_SITE_URL` con esa URL y reconstruir. Sin ella el HTML queda `noindex,nofollow` y no inventa URLs de imagen absoluta.
3. Verificar que `TU-URL/social.png` responde PNG, `og:image`/`twitter:image` son públicos absolutos y la vista previa de WhatsApp muestra Luci/Pool Party.
4. Completar WhatsApp y la ubicación real, probar en teléfono y volver a publicar. No hacen falta API keys, dominio comprado ni backend.

GitHub Pages bajo `/nombre-repo/`: definir `PUBLIC_BASE_PATH=/nombre-repo/` y `PUBLIC_SITE_URL=https://TU-USUARIO.github.io/nombre-repo`; publicar `dist` con GitHub Pages/Actions. En dominio raíz conservar `/`.

## Validación honesta

Ver **`docs/validation/v2/REPORT.md`** para ejecución actual y **`docs/validation/MANUAL.md`** para el checklist de 320, 375, 390, 430, 768, 1024 y 1440px y teléfonos reales. Los archivos anteriores de `docs/validation/` son evidencia histórica V1, no la identidad ni la aceptación actual.

jsdom no prueba layout, safe areas, tacto, reproducción real ni entrega de WhatsApp. Importar ICS en clientes reales y revisar audio en iOS/Android sigue pendiente cuando existan archivos y datos. No se afirma conformidad WCAG completa sólo por axe o valores de contraste.
