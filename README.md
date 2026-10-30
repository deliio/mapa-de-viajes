# Mapa de viajes · Travel map

App web (PWA) en modo oscuro para guardar los viajes que has hecho y ver qué porcentaje del mundo conoces. Español / English.

**Abrir:** https://deliio.github.io/mapa-de-viajes/

- Toca un país del mapa (o búscalo) para marcarlo como visitado, fijarlo como casa o añadir un viaje.
- Cada viaje guarda país, año, mes opcional, ciudades y una nota.
- Estadísticas: % del mundo (sobre los 195 países de la ONU), % de superficie, países, ciudades, continentes (x/6) y viajes.
- **Fotos**: en la ficha de cada país puedes añadir fotos, separadas por ciudad. En el mapa aparecen como chinchetas redondas con la foto (y el número de fotos).
- Las ciudades de tus viajes se colocan solas en el mapa (se buscan sus coordenadas en Open-Meteo, gratis y sin cuenta; solo se envía el nombre de la ciudad).
- Gráfico de viajes por año y progreso por continente.
- Zoom con pellizco, rueda o los botones + / − / ⟲.
- Los datos se guardan solo en tu dispositivo (localStorage, y las fotos en IndexedDB reducidas a 1600 px). Menú ⋯ → copia de seguridad (con o sin fotos) para exportar/importar un JSON.
- Instalable: en iPhone, Safari → Share → Add to Home Screen.

Datos del mapa: Natural Earth 1:50m (vía `world-atlas`) y `world-countries`, ya proyectados en `countries.js`.
Tecnología: HTML, CSS y JavaScript nativo, sin dependencias.
