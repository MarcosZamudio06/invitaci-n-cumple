# Validación manual pendiente — sin Playwright

Este checklist NO equivale a ejecución ni aprobación visual.

## Matriz

En DevTools de Chrome/Safari abrir el sitio en **320, 375, 390, 430, 768, 1024 y 1440px**. En cada ancho:

- Revisar hero LUCI, countdown inmediato, fecha 13, Jardín D-GALICIA, recordatorio de traje de baño, gráfico de alberca o galería con 1/2/7 imágenes, RSVP y cierre; no debe aparecer scroll horizontal.
- Comprobar `document.documentElement.scrollWidth <= window.innerWidth` en consola y recorrer verticalmente.
- Revisar contraste texto/fondo y texto sobre imágenes; zoom 200% y 400%, sin ocultar controles.
- Recorrer con Tab/Shift+Tab, Enter y Espacio. Foco visible, orden lógico, sin trampa salvo el modal nativo.
- Abrir galería, Tab circular dentro del diálogo, flechas, Escape, retorno al botón inicial; probar archivo roto y carga lenta.
- Activar movimiento reducido en el sistema y `effects.animations:false`; navegación inmediata, sin desplazamientos decorativos.
- Revisar consola en TODOS los recorridos; ninguna excepción o recurso fallido.

## Teléfonos reales

- iOS Safari y Android Chrome: barras de navegador, safe area, teclado abierto, inputs sin zoom, botones al menos 44px y texto legible.
- Deslizar galería horizontalmente; permitir scroll vertical. Doble toque y zoom siguen disponibles.
- Con música con licencia: nada suena al cargar ni al abrir invitación; pulsar activar, pausar, reintentar sin conexión. Probar volver desde otra aplicación y bucle.
- WhatsApp configurado V3: aceptar “¡Claro que voy!” y rechazar asistencia, nombre con acentos/emoji, total de personas visible sólo en afirmativo (sin límite de evento si no se configuró), y mensaje opcional. Revisar contenido antes de enviarlo. Comprobar recuperación si navegador bloquea la pestaña. El sitio nunca debe afirmar que envió/registró una respuesta. Abrir el enlace ya comparte el mensaje preparado con WhatsApp; sólo Enviar lo dirige al destinatario. Probar doble toque accidental, reintento y retorno desde WhatsApp.
- Mapa: no debe haber peticiones a Google antes de cargarlo; enlace sigue funcionando si el iframe falla.

## Fecha y publicación

- Verificar fecha confirmada 13 noviembre 2026, viernes, 5:00 PM America/Mexico_City (23:00Z). En una copia local de prueba, esperar cambios del contador, volver de pestaña inactiva y probar fecha pasada: “¡HOY ES EL GRAN DÍA!” sin números negativos.
- Importar ICS en Apple Calendar, Google Calendar y Outlook; confirmar zona, fecha, horario y acentos. Sin hora final no se exporta una duración inventada.
- Verificar URL social pública absoluta y PNG en respuesta HTTP, favicon, base de subdirectorio y todas las rutas configuradas.
- Abrir enlace compartido en WhatsApp y revisar preview Luci / Pool Party / 13 noviembre antes de distribuirlo.

## Herramientas permitidas

DevTools, Safari Web Inspector, Chrome remote debugging, Lighthouse manual, axe DevTools, teclado y dispositivos reales. NO Playwright ni herramientas basadas en él.
