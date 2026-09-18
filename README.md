# AURA Perfumería

Tienda en línea de lujo para venta de colonias y perfumes (Zona Caballero / Zona Dama), con
compra directa por WhatsApp y panel de administración propio. Desplegado 100% en Firebase.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack) + **TypeScript** + **Tailwind CSS v4**
- **Base de datos**: Cloud Firestore, vía Firebase Admin SDK (solo desde el servidor).
- **Autenticación admin**: Firebase Authentication (correo/contraseña) + cookie de sesión
  httpOnly creada con el Admin SDK (`createSessionCookie`). Solo los UID listados en
  `ADMIN_UIDS` pueden entrar a `/admin`.
- **Hosting**: Firebase App Hosting (soporta SSR de Next.js de forma nativa).
- **Animaciones**: Framer Motion. **Búsqueda**: Fuse.js + diccionario de sinónimos en español
  (sin API externa de IA).
- **Compra**: deep link de WhatsApp (`wa.me`) con el mensaje y precio del producto prellenado.

Proyecto de Firebase: **aura-e7a0e**.

## Requisitos

- Node.js 20.9 o superior.
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`, o se
  usa vía `npx` como en los scripts de este proyecto).
- Java (solo para correr los emuladores de Firestore/Auth en desarrollo local).

## Desarrollo local (con emuladores)

Los emuladores dejan probar todo el sitio y el panel admin **sin tocar los datos reales**.

```bash
npm install
cp .env.example .env.local
# Descomenta/ajusta las 3 líneas de emulador en .env.local si no están
```

En una terminal:

```bash
npm run emulators
```

En otra terminal, importa el catálogo (702 productos) y crea usuarios de prueba con los
mismos UID que los administradores reales (no afecta producción):

```bash
npm run db:seed
```

Esto imprime credenciales de prueba tipo `admin1@aura.test / AuraAdmin123!` — úsalas para
entrar a `/admin/login` en local.

Luego:

```bash
npm run dev
```

Abre http://localhost:3000. Panel admin en http://localhost:3000/admin/login.

## Variables de entorno

Ver `.env.example`. Las más importantes:

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Config pública del proyecto de Firebase (no es secreta). Se obtiene en Firebase Console → Configuración del proyecto → Tus apps → Web. |
| `ADMIN_UIDS` | UIDs de Firebase Authentication autorizados a usar `/admin`, separados por coma. |
| `WHATSAPP_NUMBER` | Número de WhatsApp para recibir pedidos (código de país + número, sin `+`). |
| `SITE_URL` | URL pública del sitio, usada en SEO, sitemap y JSON-LD. |

**No hace falta ninguna clave de cuenta de servicio.** En Firebase App Hosting, el Admin SDK
se autentica solo (Application Default Credentials). En local, los emuladores tampoco piden
credenciales reales.

## Panel de administración

Desde `/admin` puedes gestionar:

- **Productos** (`/admin/productos`): buscar, filtrar, crear, editar y eliminar; marcar
  oferta / disponible / nuevo ingreso / destacado con un clic; asignar foto real (URL) a cada
  producto (mientras no se suba una, se muestra una ilustración de lujo generada
  automáticamente).
- **Carrusel de inicio** (`/admin/carrusel`): slides con imagen, texto, enlace y tema visual
  (Caballero / Dama / general).
- **Ajustes** (`/admin/ajustes`): número de WhatsApp, textos de cada zona, SEO, redes sociales
  y cambio de contraseña del admin (usa Firebase Auth directamente, sin pedir la actual).

Los cambios se reflejan de inmediato en el sitio público (sin necesidad de recompilar).

## Despliegue en Firebase (producción)

1. Autentícate y enlaza el proyecto (una sola vez):

   ```bash
   npx firebase login
   npx firebase use aura-e7a0e
   ```

2. Reglas de Firestore y de Storage (deniegan todo acceso directo desde el cliente; el sitio
   solo lee/escribe vía el servidor con el Admin SDK — las fotos de productos/carrusel subidas
   desde `/admin` sí quedan con lectura pública, ya que se muestran en la tienda):

   ```bash
   npx firebase deploy --only firestore:rules,storage
   ```

   Si el bucket de Storage por defecto de tu proyecto todavía no existe, actívalo primero en
   Firebase Console → Storage → "Comenzar" (una sola vez).

3. **App Hosting**: crea el backend una sola vez desde Firebase Console → App Hosting → "Get
   started", conectando este repositorio de GitHub y la rama de producción. A partir de ahí,
   cada push a esa rama despliega automáticamente (build + SSR administrado por Firebase).

   Los valores de entorno productivos ya están en `apphosting.yaml` (config pública de
   Firebase + los dos UID admin + WhatsApp). Para mover `ADMIN_UIDS` a Secret Manager en vez
   de texto plano:

   ```bash
   npx firebase apphosting:secrets:set ADMIN_UIDS
   ```

   y luego referenciarlo en `apphosting.yaml` con `secret: ADMIN_UIDS` en vez de `value:`.

4. **Cargar el catálogo en producción** (una sola vez, o cuando quieras reimportar desde el
   Excel original): corre el seed con credenciales de una cuenta con acceso de escritura a
   Firestore del proyecto, por ejemplo desde Cloud Shell o tu máquina con
   `gcloud auth application-default login`:

   ```bash
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=aura-e7a0e node scripts/seed.mjs
   ```

   El script no reimporta si ya existen productos, así que es seguro correrlo más de una vez.

## Estructura del proyecto

```
src/app/(site)/       Páginas públicas (inicio, /caballero, /dama, /ofertas, /producto/[slug]…)
src/app/admin/        Panel de administración (protegido por sesión de Firebase Auth)
src/app/api/search/   Endpoint de búsqueda inteligente
src/components/       Componentes de UI compartidos
src/lib/firebase-admin.ts / firebase-client.ts   Inicialización de Firebase (servidor/cliente)
src/lib/repo/         Acceso a datos en Firestore (productos, carrusel, ajustes)
src/lib/auth.ts, session.ts, proxy.ts   Autenticación y protección de /admin
scripts/seed.mjs      Importa el catálogo y crea datos/ususarios de prueba en el emulador
data/products-seed.json  Catálogo normalizado (702 productos) generado a partir del Excel original
firebase.json, firestore.rules, apphosting.yaml   Configuración de Firebase
```
