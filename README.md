# StopNShop — Premium E-Commerce Plattform

Eine produktionsreife, vollständige MERN-Stack-E-Commerce-Lösung mit integrierter
Stripe-Zahlungsabwicklung, KI-gesteuertem Chatbot und robuster Sicherheitsarchitektur.

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Architektur & Tech Stack](#2-architektur--tech-stack)
3. [Sicherheitsmerkmale](#3-sicherheitsmerkmale)
4. [Installationsanleitung](#4-installationsanleitung)
5. [Umgebungsvariablen](#5-umgebungsvariablen)
6. [Verfügbare Skripte](#6-verfügbare-skripte)

---

## 1. Projektübersicht

StopNShop ist eine mehrschichtige E-Commerce-Plattform mit vollständig getrennten
Frontend- und Backend-Subsystemen. Die Plattform bietet:

- **Produktkatalog** mit kategorie- und detailbasierter Navigation
- **Warenkorb-Management** mit persistentem Zustand über Zustand (Client-Store)
- **Stripe Checkout** mit serverseitiger Webhook-Bestätigung als einzige Quelle
  der Wahrheit für Bestellerstellung
- **Rollenbasierte Zugriffskontrolle** – Endnutzer- und Admin-Bereich vollständig getrennt
- **KI-Chatbot** auf Basis der OpenAI-API
- **Interaktive Karte** (Google Maps / Leaflet) für Ladenstandorte
- **Produktionsreifes Logging** (Winston + Morgan) mit Datei-Rotation
- **E-Mail-Benachrichtigungen** über Mailtrap/Nodemailer bei Bestellabschluss

---

## 2. Architektur & Tech Stack

### 2.1 Gesamtarchitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
│                                                             │
│  Pages → Custom Hooks → Zustand Stores → Axios → REST API  │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP / JSON
┌───────────────────────────▼─────────────────────────────────┐
│                   Server (Node.js / Express)                 │
│                                                             │
│  Route → Middleware → Controller → Service → Mongoose ODM  │
└───────────────────────────┬─────────────────────────────────┘
                            │ Mongoose
┌───────────────────────────▼─────────────────────────────────┐
│                      MongoDB (Docker)                        │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Backend-Schichtarchitektur (Router → Controller → Service)

Das Backend folgt konsequent dem **Router-Controller-Service**-Muster, das eine
klare Trennung der Verantwortlichkeiten gewährleistet:

| Schicht | Datei(en) | Aufgabe |
|---------|-----------|---------|
| **Router** | `routes/*.js` | URL-Zuordnung, Middleware-Kette, HTTP-Verb |
| **Controller** | `controllers/*.js` | Request/Response-Verarbeitung, HTTP-Status |
| **Service** | `services/*.js` | Geschäftslogik, Datenbankzugriff, externe APIs |
| **Model** | `models/*.js` | Mongoose-Schemas und -Validierung |
| **Validator** | `validators/*.js` | Zod-Schemas zur Eingabevalidierung |
| **Middleware** | `middleware/*.js` | Auth, Logging, Rate-Limiting, Fehlerbehandlung |

**Beispiel – Produktabruf:**
```
GET /api/products/:category
  → productRoutes.js (Router)
  → authMiddleware.js (optional: JWT-Prüfung)
  → productController.js (Parameter lesen, Antwort formen)
  → productService.js (Datenbankabfrage, AppError bei 404)
  → Product.js (Mongoose-Modell)
```

**Stripe-Zahlungsfluss (Webhook-gesichert):**
```
POST /api/create-checkout-session
  → Erstellt CheckoutSession-Dokument (Status: "pending")
  → Stripe Checkout Session mit metadata.checkoutId
  → Redirect → Stripe Hosted Page

POST /webhooks/stripe  (Stripe → Server, raw body)
  → Signaturprüfung (STRIPE_WEBHOOK_SECRET)
  → checkout.session.completed
  → Order-Dokument wird erstellt (idempotent)
  → CheckoutSession Status → "completed"
  → Bestätigungs-E-Mail wird versendet
```

Bestellungen werden **ausschließlich** nach serverseitiger Webhook-Bestätigung
angelegt. Ein direkter `POST /api/orders`-Aufruf wird mit HTTP 410 abgewiesen.

### 2.3 Backend-Tech-Stack

| Technologie | Version | Verwendungszweck |
|-------------|---------|-----------------|
| Node.js | ≥ 18 | Laufzeitumgebung |
| Express | ^4.21 | HTTP-Framework |
| Mongoose | ^8.10 | MongoDB ODM |
| Zod | ^3.23 | Schema-Validierung |
| Stripe | ^17.7 | Zahlungsabwicklung |
| JWT | ^9.0 | Authentifizierung |
| bcrypt | ^5.1 | Passwort-Hashing |
| Winston | ^3.19 | Strukturiertes Logging |
| Morgan | ^1.10 | HTTP-Access-Logging |
| Helmet | ^8.1 | Sicherheits-Header |
| express-rate-limit | ^8.5 | API-Ratenbegrenzung |
| OpenAI | ^4.87 | Chatbot-Funktionalität |
| Nodemon | ^3.0 | Entwicklungs-Reload |

### 2.4 Frontend-Architektur (Custom Hooks & Zustand)

Das Frontend basiert auf React 19 mit **Vite** als Build-Tool und **TailwindCSS**
für das Styling. Die Zustandsverwaltung ist klar in drei Ebenen gegliedert:

```
Komponente (UI-Rendering)
    ↑
Custom Hook (Daten + Logik, wiederverwendbar)
    ↑
Zustand Store (globaler App-Zustand)
    ↑
Axios (HTTP-Kommunikation)
```

**Custom Hook – Beispiel `useProductData`:**  
Kapselt den gesamten Produktabruf, Größenauswahl und „In den Warenkorb"-Logik.
Die Präsentationskomponente bleibt vollständig frei von Geschäftslogik.

**Zustand Stores:**

| Store | Datei | Verantwortlichkeit |
|-------|-------|--------------------|
| `useAuthStore` | `store/authStore.js` | JWT-Token, Benutzerprofil, Login/Logout |
| `useCartStore` | `store/cartStore.js` | Warenkorb-Einträge, Mengen, `clearCart` |

**Seitenstruktur:**

```
src/pages/
  shopping-view/   → Produktübersicht, Detail, Checkout, Zahlung
  admin-view/      → Dashboard, Produkte, Bestellungen, Nutzer
  auth/            → Login, Registrierung, Passwort zurücksetzen
  not-found/       → 404-Seite
```

**UI-Stabilität:**  
Alle Seiten verwenden `ErrorBoundary`-Komponenten sowie Skeleton-Loader
(`ProductCardSkeleton`, `ProductDetailSkeleton`, admin `FullPageSkeleton`),
um Ladezustände graceful abzubilden.

### 2.5 Frontend-Tech-Stack

| Technologie | Version | Verwendungszweck |
|-------------|---------|-----------------|
| React | ^19 | UI-Framework |
| React Router DOM | ^7.1 | Client-seitiges Routing |
| Zustand | ^5.0 | Globale Zustandsverwaltung |
| Axios | ^1.7 | HTTP-Client |
| TailwindCSS | ^4.0 | Utility-First-CSS |
| Framer Motion | ^12 | Animationen |
| Stripe.js | ^5.10 | Zahlungs-Redirect |
| Chart.js | ^4.4 | Admin-Dashboard-Charts |
| Leaflet / React Leaflet | ^1.9 / ^5.0 | Interaktive Karte |
| react-hot-toast | ^2.5 | Benachrichtigungen |

### 2.6 Datenbankschema (MongoDB)

| Collection | Modell | Schlüsselfelder |
|------------|--------|----------------|
| `users` | `User.js` | `email`, `passwordHash`, `role` |
| `products` | `Product.js` | `name`, `category`, `price`, `stock` |
| `orders` | `Order.js` | `stripeSessionId`, `isPaid`, `paymentStatus` |
| `checkoutsessions` | `CheckoutSession.js` | `stripeSessionId`, `status`, `orderId` |
| `promocodes` | `promoCode.js` | `code`, `discountPercent`, `expiresAt` |

### 2.7 Docker-Konfiguration

Die Plattform wird über **Docker Compose** betrieben. MongoDB läuft isoliert im
Container mit persistentem Volume; Server und Client nutzen Hot-Reload über
gemountete Volumes.

```
docker-compose.yml
  ├── mongo      → mongo:6, Port 27017, Volume mongo-data
  ├── server     → Node.js-Image aus ./server/Dockerfile, Port 5000
  └── client     → node:20, Vite --host, Port 3000 → 5173
```

---

## 3. Sicherheitsmerkmale

### 3.1 Eingabe- und Datenvalidierung

Alle eingehenden API-Anfragen werden durch **Zod**-Schemas in `validators/*.js`
geprüft, bevor sie die Kontrollerebene erreichen. Das `validateRequest`-Middleware
normiert Fehlerantworten auf HTTP 400 mit strukturierter Fehlerliste.

```
POST /api/create-checkout-session
  → checkoutValidator.js  (customerName, email, shippingInfo, items – Pflichtfelder)
  → validateRequest.js    (Zod-Fehler → 400 Bad Request)
```

### 3.2 HTTP-Sicherheits-Header (Helmet)

`securityMiddleware.js` aktiviert **Helmet** auf der gesamten Express-Anwendung.
Helmet setzt automatisch folgende Header:

| Header | Schutz gegen |
|--------|-------------|
| `X-Content-Type-Options: nosniff` | MIME-Typ-Sniffing |
| `X-Frame-Options: SAMEORIGIN` | Clickjacking |
| `Strict-Transport-Security` | Downgrade-Angriffe (HTTPS erzwingen) |
| `X-DNS-Prefetch-Control: off` | Unerwünschte DNS-Vorabrufe |
| `Referrer-Policy: no-referrer` | Informationsleck im Referrer-Header |
| `Cross-Origin-Opener-Policy` | Cross-Origin-Isolation |
| `Content-Security-Policy` | XSS / Injection |

Bei nicht installiertem Paket greift ein manueller Fallback für die kritischsten
Header (Graceful Degradation).

### 3.3 API-Ratenbegrenzung (express-rate-limit)

```
Fenster:       15 Minuten
Max. Anfragen: 100 pro IP
Betrifft:      alle /api/*-Routen
```

Überschreitet ein Client das Limit, antwortet der Server mit HTTP **429 Too Many
Requests**. Schützt vor Brute-Force-Angriffen, Credential-Stuffing und
DoS-Versuchen. Auch hier ist ein In-Memory-Fallback implementiert.

### 3.4 Authentifizierung & Autorisierung

- **JWT-Authentifizierung** (`jsonwebtoken`) – Token werden als `HttpOnly`-Cookie
  übertragen; `cookie-parser` liest sie serverseitig aus.
- **Passwort-Hashing** mit `bcrypt` (Salt-Rounds konfigurierbar).
- **Rollenbasierter Zugriff** über `requireAdmin.js`-Middleware – Admin-Routen
  sind vom Endnutzer-Bereich vollständig isoliert.
- **Auth-spezifisches Rate-Limiting** über `authRateLimit.js` für Login-Endpunkte.

### 3.5 Stripe-Webhook-Sicherheit

Der Webhook-Endpunkt `POST /webhooks/stripe` empfängt den **rohen Request-Body**
(via `express.raw()`), bevor `express.json()` greift. Stripe-Signaturen werden
mit `STRIPE_WEBHOOK_SECRET` kryptografisch verifiziert, bevor Ereignisse
verarbeitet werden. Manipulation oder Replay-Angriffe werden damit abgewehrt.

### 3.6 Produktions-Logging

```
server/logs/
  ├── error.log       → nur Fehler (level: error)
  ├── combined.log    → alle Log-Einträge
  ├── exceptions.log  → unbehandelte Ausnahmen
  └── rejections.log  → unbehandelte Promise-Ablehnungen
```

HTTP-Zugriffslog (Morgan) wird in den Winston-Stream geleitet. Der Log-Level ist
über die Umgebungsvariable `LOG_LEVEL` steuerbar (`info` / `warn` / `error`).

---

## 4. Installationsanleitung

### 4.1 Voraussetzungen

| Werkzeug | Mindestversion |
|----------|---------------|
| Node.js | 18.x |
| npm | 9.x |
| Docker & Docker Compose | 24.x / 2.x |
| Git | beliebig |

### 4.2 Repository klonen

```bash
git clone https://github.com/<organisation>/DEDSV-StopNShop.git
cd DEDSV-StopNShop
```

### 4.3 Lokale Entwicklungsumgebung (ohne Docker)

#### Schritt 1 – Backend einrichten

```bash
cd server
cp .env.example .env          # Variablen befüllen (siehe Abschnitt 5)
npm install
npm run seed                   # optional: Demodaten laden
npm start                      # oder: npx nodemon server.js
```

#### Schritt 2 – Frontend einrichten

```bash
cd ../client
cp .env.example .env           # VITE_API_BASE_URL setzen
npm install
npm run dev
```

Der Client ist erreichbar unter: `http://localhost:5173`  
Die API läuft auf: `http://localhost:5000`

#### Schritt 3 – Stripe-Webhooks lokal empfangen

```bash
# Stripe CLI installieren: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to http://localhost:5000/webhooks/stripe
# Den ausgegebenen Signing Secret in server/.env als STRIPE_WEBHOOK_SECRET eintragen
```

### 4.4 Vollständiger Docker-Compose-Stack

```bash
# Im Projektstamm
cp server/.env.example server/.env    # Variablen befüllen
docker compose up --build
```

| Dienst | Adresse |
|--------|---------|
| Client (Vite) | http://localhost:3000 |
| Server (API) | http://localhost:5000 |
| MongoDB | mongodb://localhost:27017 |

```bash
# Stack stoppen und Volumes entfernen
docker compose down -v
```

### 4.5 Nur MongoDB in Docker (Server lokal)

```bash
docker compose up mongo
# In server/.env:
# MONGODB_URI=mongodb://127.0.0.1:27017/stopnshop
cd server && npm start
```

---

## 5. Umgebungsvariablen

Alle Variablen gehören in `server/.env`. Die Datei `server/.env.example` enthält
ein dokumentiertes Template.

| Variable | Pflicht | Beschreibung |
|----------|---------|-------------|
| `PORT` | nein | Server-Port (Standard: `5000`) |
| `MONGODB_URI` | **ja** | MongoDB-Verbindungszeichenfolge |
| `JWT_SECRET` | **ja** | Geheimer Schlüssel für JWT-Signierung |
| `STRIPE_SECRET_KEY` | **ja** | Stripe-Server-seitiger API-Schlüssel |
| `STRIPE_WEBHOOK_SECRET` | **ja** | Webhook-Signatursecret (Stripe CLI oder Dashboard) |
| `OPENAI_API_KEY` | nein | API-Schlüssel für Chatbot-Funktionalität |
| `CORS_ORIGINS` | nein | Kommagetrennte zusätzliche CORS-Origins |
| `LOG_LEVEL` | nein | Winston-Log-Level (`info` / `warn` / `error`) |
| `MAILTRAP_TOKEN` | nein | Mailtrap-API-Token für E-Mail-Versand |

---

## 6. Verfügbare Skripte

### Backend (`server/`)

| Skript | Beschreibung |
|--------|-------------|
| `npm start` | Produktionsstart mit `node server.js` |
| `npm run seed` | Demodaten in MongoDB laden |

### Frontend (`client/`)

| Skript | Beschreibung |
|--------|-------------|
| `npm run dev` | Vite-Entwicklungsserver starten |
| `npm run build` | Produktions-Build erstellen |
| `npm run preview` | Build lokal vorschauen |
| `npm run lint` | ESLint über alle Quelldateien ausführen |

---

## Lizenz

ISC — siehe `server/package.json`.

## Autoren

Dineo · Simon · Darly · Essam · Vladyslav
