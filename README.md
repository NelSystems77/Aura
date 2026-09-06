# AURA Perfumería

Tienda en línea de lujo para venta de colonias y perfumes (Zona Caballero / Zona Dama), con
compra directa por WhatsApp y panel de administración propio.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack) + **TypeScript** + **Tailwind CSS v4**
- **Base de datos**: SQLite nativo de Node (`node:sqlite`), sin dependencias externas ni
  servicios en la nube. El archivo vive en `var/data/aura.db`.
- **Autenticación admin**: cookie de sesión firmada (HMAC), sin librerías externas.
- **Animaciones**: Framer Motion. **Búsqueda**: Fuse.js + diccionario de sinónimos en español
  (sin API externa de IA).
- **Compra**: deep link de WhatsApp (`wa.me`) con el mensaje y precio del producto prellenado.

## Requisitos

- Node.js **22.5 o superior** (usa `node:sqlite`, disponible desde esa versión).
- O bien Docker, si prefieres desplegar en contenedor (ver más abajo).

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y ajusta los valores
npm run db:seed              # crea el admin inicial y carga los 702 productos del catálogo
npm run dev
```

Abre http://localhost:3000. El panel de administración está en
http://localhost:3000/admin/login (credenciales definidas por `ADMIN_EMAIL` / `ADMIN_PASSWORD`
al correr el seed la primera vez).

## Variables de entorno

Ver `.env.example`. Las más importantes:

| Variable          | Descripción                                                             |
| ----------------- | ------------------------------------------------------------------------ |
| `SESSION_SECRET`  | Secreto para firmar la cookie del panel admin. Genera uno con `openssl rand -hex 32`. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credenciales del primer usuario admin (solo se usan en el primer `db:seed`). |
| `WHATSAPP_NUMBER` | Número de WhatsApp para recibir pedidos (código de país + número, sin `+`). |
| `DB_PATH`         | Ruta del archivo SQLite (por defecto `./var/data/aura.db`).             |
| `SITE_URL`        | URL pública del sitio, usada en SEO, sitemap y JSON-LD.                 |

## Panel de administración

Desde `/admin` puedes gestionar:

- **Productos** (`/admin/productos`): buscar, filtrar, crear, editar y eliminar; marcar
  oferta / disponible / nuevo ingreso / destacado con un clic; asignar foto real (URL) a cada
  producto (mientras no se suba una, se muestra una ilustración de lujo generada automáticamente).
- **Carrusel de inicio** (`/admin/carrusel`): slides con imagen, texto, enlace y tema visual
  (Caballero / Dama / general).
- **Ajustes** (`/admin/ajustes`): número de WhatsApp, textos de cada zona, SEO, redes sociales
  y cambio de contraseña del admin.

Los cambios se reflejan de inmediato en el sitio público (sin necesidad de recompilar).

## Despliegue en un VPS propio

### Opción A — Docker (recomendada)

```bash
git clone <tu-repo> aura && cd aura
cp .env.example .env   # ajusta SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, WHATSAPP_NUMBER, SITE_URL
docker compose up -d --build
```

El contenedor corre el seed automáticamente en cada arranque (es seguro: si ya existen
productos, no los vuelve a importar) y expone el sitio en el puerto `3000`. Los datos
(SQLite) se guardan en el volumen `aura-data`, así que sobreviven a rebuilds y actualizaciones.

Coloca un reverse proxy (Nginx o Caddy) delante para servir HTTPS:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Luego `certbot --nginx -d tu-dominio.com` para el certificado TLS.

### Opción B — Node + PM2 (sin Docker)

Requiere Node 22.5+ instalado en el VPS.

```bash
git clone <tu-repo> aura && cd aura
npm ci
cp .env.example .env
npm run build
npm run db:seed
npm install -g pm2
pm2 start "npm run start" --name aura
pm2 save
pm2 startup   # sigue las instrucciones para arranque automático
```

Igual que en la Opción A, coloca Nginx + certbot delante para HTTPS.

### Backups

El único estado persistente es el archivo SQLite. Respáldalo periódicamente:

```bash
cp var/data/aura.db backups/aura-$(date +%F).db
```

## Estructura del proyecto

```
src/app/(site)/       Páginas públicas (inicio, /caballero, /dama, /ofertas, /producto/[slug]…)
src/app/admin/        Panel de administración (protegido por sesión)
src/app/api/search/   Endpoint de búsqueda inteligente
src/components/       Componentes de UI compartidos
src/lib/               Acceso a datos (SQLite), autenticación, WhatsApp, búsqueda, formato
scripts/seed.mjs      Script de importación inicial de catálogo + creación de admin
data/products-seed.json  Catálogo normalizado (702 productos) generado a partir del Excel original
```
