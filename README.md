# Mapa de viajes · Travel map

App web (PWA) en modo oscuro para guardar los viajes que has hecho y ver qué porcentaje del mundo conoces. Español / English.

**Abrir:** https://deliio.github.io/mapa-de-viajes/

- Toca un país del mapa (o búscalo) para marcarlo como visitado, fijarlo como casa o añadir un viaje.
- Cada viaje guarda país, año, mes opcional, ciudades y una nota.
- Estadísticas: % del mundo (sobre los 195 países de la ONU), % de superficie, países, ciudades, continentes (x/6) y viajes.
- Gráfico de viajes por año y progreso por continente.
- Zoom con pellizco, rueda o los botones + / − / ⟲.
- Los datos se guardan solo en tu dispositivo (localStorage). Menú ⋯ → copia de seguridad para exportar/importar un JSON.
- Instalable: en iPhone, Safari → Share → Add to Home Screen.

Datos del mapa: Natural Earth 1:50m (vía `world-atlas`) y `world-countries`, ya proyectados en `countries.js`.
Tecnología: HTML, CSS y JavaScript nativo, sin dependencias.
