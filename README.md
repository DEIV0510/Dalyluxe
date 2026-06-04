# DalyLuxe Lashes — Landing Page

Landing page premium para **DalyLuxe Lashes**, estudio profesional de extensiones de pestañas ubicado en **Soacha · Ciudad Verde** (Colombia).

> Realzamos la belleza de tu mirada con extensiones de pestañas de alta calidad.
> Diseños personalizados, atención profesional y resultados elegantes.

📷 Instagram: [@dalyluxelashes\_\_](https://instagram.com/dalyluxelashes__)

---

## ✨ Características

- **Pantalla de carga** cinematográfica (ojo animado en SVG, glow rosado, partículas y barra de progreso).
- **Hero** con slideshow automático de resultados reales y parallax sutil.
- **Catálogo de servicios** con filtros interactivos por categoría.
- **Calculadora de precios** en vivo (aplicación nueva / retoque + adicionales) que arma el pedido y abre WhatsApp.
- **Galería** con lightbox (zoom, navegación con flechas y teclado).
- **Proceso, beneficios, testimonios y ubicación** (Google Maps embebido).
- Integración total con **WhatsApp** en todos los botones.
- 100 % **responsive · mobile-first**, sin scroll horizontal.
- SEO completo: Open Graph, Twitter Cards y datos estructurados `BeautySalon`.

## 🛠️ Tecnología

**HTML + CSS + JavaScript puro.** Sin frameworks, sin build, sin dependencias.

## 🚀 Uso

Abre **`index.html`** directamente en cualquier navegador.

De forma opcional, para una vista previa con servidor local:

```bash
node server.js
# http://localhost:5200
```

## 📁 Estructura

```
index.html            # Estructura y contenido
styles.css            # Estilos (dark luxury, glassmorphism, responsive)
script.js             # Interactividad (preloader, slideshow, filtros, calculadora, lightbox)
assets/img/           # Fotos reales optimizadas (WebP + JPG) + logo
scripts/prep-images.mjs  # Pipeline de optimización de imágenes (requiere sharp)
server.js             # Servidor estático opcional para desarrollo
```

## ⚙️ Configuración

El número de WhatsApp es editable en `script.js`:

```js
const whatsappNumber = "573022929597";
```

---

© DalyLuxe Lashes · Soacha Ciudad Verde
