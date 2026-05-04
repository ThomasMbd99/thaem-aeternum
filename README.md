# THAEM AETERNUM — Documentation complète

> Boutique e-commerce de parfums de luxe artisanaux.  
> Stack : React 18 + TypeScript + Vite + Supabase + Stripe + Vercel.

---

## Table des matières

1. [Vision du projet](#1-vision-du-projet)
2. [Stack technique](#2-stack-technique)
3. [Architecture du projet](#3-architecture-du-projet)
4. [Les collections & les parfums](#4-les-collections--les-parfums)
5. [Formats & tarifs](#5-formats--tarifs)
6. [Pages de l'application](#6-pages-de-lapplication)
7. [Composants](#7-composants)
8. [Contextes React](#8-contextes-react)
9. [Hooks personnalisés](#9-hooks-personnalisés)
10. [Données statiques](#10-données-statiques)
11. [Backend Supabase](#11-backend-supabase)
12. [Edge Functions](#12-edge-functions-serverless)
13. [Système de thèmes dynamiques](#13-système-de-thèmes-dynamiques)
14. [Tunnel d'achat complet](#14-tunnel-dachat-complet)
15. [Variables d'environnement](#15-variables-denvironnement)
16. [Installation & démarrage](#16-installation--démarrage)
17. [Scripts disponibles](#17-scripts-disponibles)
18. [Tests](#18-tests)
19. [Déploiement Vercel](#19-déploiement-vercel)

---

## 1. Vision du projet

**Thaem Aeternum** est une maison de parfumerie en ligne qui propose des fragrances de niche inspirées des grands classiques du marché. L'expérience utilisateur est au cœur du projet : splash screen animé, transitions fluides entre pages, thème visuel qui change selon la collection consultée, quiz olfactif pour guider l'acheteur, coffret découverte personnalisable, et tunnel de paiement complet avec livraison Mondial Relay.

Le nom **« Æ »** (ligature latine) est au cœur de l'identité visuelle — il apparaît dans le nom de chaque parfum et dans les noms de collection.

---

## 2. Stack technique

| Couche | Technologie | Rôle |
|---|---|---|
| Framework UI | **React 18** + **TypeScript** | Base de l'application |
| Bundler | **Vite** | Dev server ultra-rapide, build optimisé |
| Style | **Tailwind CSS v3** | Utilitaires CSS |
| Composants UI | **shadcn/ui** (Radix UI) | Composants accessibles et stylisables |
| Animations | **Framer Motion** | Transitions de pages, animations d'entrée |
| Routing | **React Router v6** | Navigation SPA avec `AnimatePresence` |
| Data fetching | **TanStack Query v5** | Cache serveur, synchronisation état |
| Backend/Auth/BDD | **Supabase** | Auth, PostgreSQL, Storage, Edge Functions |
| Paiement | **Stripe** | Checkout Session, webhooks |
| Emails | **Resend** | Emails transactionnels |
| Livraison | **Mondial Relay** | Sélection de points relais |
| Déploiement | **Vercel** | Hosting frontend + redirections SPA |
| Tests unitaires | **Vitest** + **Testing Library** | Tests de composants |
| Tests E2E | **Playwright** | Tests de bout en bout |
| Linter | **ESLint** (flat config) | Qualité de code |

---

## 3. Architecture du projet

```
thaem-aeternum/
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── components.json
├── vercel.json
├── playwright.config.ts
├── vitest.config.ts
├── .env.example
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── pages/
│   │   ├── Index.tsx              # Page d'accueil
│   │   ├── Collections.tsx        # Galerie des 5 collections
│   │   ├── CollectionPage.tsx     # Page d'une collection (avec thème)
│   │   ├── AllParfums.tsx         # Catalogue complet
│   │   ├── ProductPage.tsx        # Fiche produit
│   │   ├── DiscoveryBox.tsx       # Coffret découverte
│   │   ├── OffresPage.tsx         # Offres spéciales
│   │   ├── OurStory.tsx           # Histoire de la marque
│   │   ├── Contact.tsx            # Formulaire de contact
│   │   ├── Quiz.tsx               # Quiz olfactif
│   │   ├── CheckoutPage.tsx       # Tunnel de paiement
│   │   ├── CheckoutSuccess.tsx    # Confirmation commande
│   │   ├── LoginPage.tsx          # Auth
│   │   ├── AccountPage.tsx        # Espace client
│   │   ├── AdminPage.tsx          # Back-office
│   │   ├── InvoicePage.tsx        # Facture PDF
│   │   ├── MentionsLegales.tsx
│   │   ├── CGV.tsx
│   │   ├── Confidentialite.tsx
│   │   ├── PolitiqueRetour.tsx
│   │   └── NotFound.tsx
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── NavLink.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── SplashScreen.tsx
│   │   ├── AnimatedBackground.tsx
│   │   ├── DynamicBackground.tsx
│   │   ├── ThemeTransition.tsx
│   │   ├── CollectionSplash.tsx
│   │   ├── CollectionTransition.tsx
│   │   ├── OlfactoryPyramid.tsx
│   │   ├── ProductStory.tsx
│   │   ├── RelayPointPicker.tsx
│   │   ├── PageTransition.tsx
│   │   ├── CookieBanner.tsx
│   │   └── ui/
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/
│   │   ├── useParfums.ts
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── data/
│   │   ├── products.ts
│   │   ├── bottleImages.ts
│   │   ├── collectionStories.ts
│   │   └── stories.ts
│   │
│   ├── lib/
│   │   └── supabase.ts
│   │
│   └── test/
│
└── supabase/
    └── functions/
        ├── create-checkout-session/
        ├── stripe-webhook/
        ├── send-confirmation-email/
        ├── send-shipping-email/
        └── send-contact-email/
```

---

## 4. Les collections & les parfums

5 collections, 23 parfums. Tout est dans `src/data/products.ts`.

### SACRÆ — Gourmande & Sucrée
*accent `#C4956A` · fond `#F5F0E1` · texte `#3D2B1F`*

| ID | Nom | Tagline | Inspiration |
|---|---|---|---|
| `zaemyr` | ZÆMYR | Miel de pistache, fleur d'oranger, vanille royale | Baklava Royal – Navitus |
| `lamae` | LAMÆ | Caramel toffee, fève tonka absolue, santal crémeux | Kryptonite Absolue – Khalil T. |
| `almae` | ALMÆ | Lait lacté, tubéreuse indolente, vanille et cacao | Blanche Bête – Les Liquides Imaginaires |
| `velae` | VELÆ | Tonka veloutée, rose absolue, tabac des Balkans | Velvet Tonka – BDK |
| `varkaem` | VARKÆM | Vanille spiritueuse, rhum exotique, rose de Bulgarie | Spirituelle Double Vanille – Guerlain |

### VITÆ — Fruitée & Fraîche
*accent `#FF6B2B` · fond `#FFF5EE` · texte `#3A1500`*

| ID | Nom | Tagline | Inspiration |
|---|---|---|---|
| `espae` | ESPÆ | Baies rouges éclatantes, framboise vive, musc de patchouli | Rouge Trafalgar – Dior |
| `koyaen` | KOYÆN | Ananas tropical, noix de coco crémeuse, musc solaire | Pina Colada – Gulf Orchid |
| `ayaem` | AYÆM | Mangue juteuse, oud fruité, notes exotiques ensoleillées | Mango Aoud – Gritti |
| `naera` | NÆRA | Framboise épicée, rose flamboyante, poivre vibrant | Flamenco – Ramon Monegal |

### UMBRÆ — Boisée & Intense
*accent `#8B6914` · fond `#1A1210` · texte `#D4B896`*

| ID | Nom | Tagline | Inspiration |
|---|---|---|---|
| `aeonis` | ÆONIS | Fraise vénéneuse, cuir sombre, caramel et cannelle | Venom Incarnat – SHL 777 |
| `aelia` | ÆLIA | Santal poudré, ambrette soyeuse, élégance parisienne | Santal de Paris – Place de la Rêverie |
| `valaena` | VALÆNA | Cardamome épicée, iris poudré, santal et vétiver bourbon | Gris Charnel – BDK |
| `azrae` | AZRÆ | Rose de Damas, ambre nocturne, oud et poivre rose | Ambre Nuit – Dior |

### NEROLÆ — Florale & Orientale
*accent `#F0A0B8` · fond `#FFF5F8` · texte `#4A2030`*

| ID | Nom | Tagline | Inspiration |
|---|---|---|---|
| `alnae` | ALNÆ | Violette marine, sucre vanillé, fleurs blanches célestes | Celeste – Giardini Di Toscana |
| `osae` | OSÆ | Floral ambre sensuel, rose orientale, muscs soyeux | Nº5 Floral – Rosendo Mateu |
| `laeya` | LÆYA | Tubéreuse pêchée, jasmin enveloppant, vanille et vétiver | Hundred Silent Ways – Nishane |
| `saen` | SÆN | Rose des sables, oud précieux, safran doré et ambre gris | Les Sables Roses – Louis Vuitton |

### ÆRA — Propre & Minimaliste
*accent `#A8D4F0` · fond `#F5FAFF` · texte `#1A2A3A`*

| ID | Nom | Tagline | Inspiration |
|---|---|---|---|
| `lysae` | LYSÆ | Poire fraîche, jasmin délicat, oud du Vietnam et muscs | Passion Riviera – Place de la Rêverie |
| `vaem` | VÆM | Fleurs aériennes, jasmin d'Egypte, muscs blancs cristallins | 724 – Maison Francis Kurkdjian |
| `thaely` | THÆLY | Citron lumineux, néroli tunisien, thé noir et ambroxan | Imagination – Louis Vuitton |
| `taelya` | TÆLYA | Mandarine safranée, daim minéral, immortelle cuivrée | Ganymede – Marc-Antoine Barrois |

---

## 5. Formats & tarifs

| Format | Prix | Description |
|---|---|---|
| **10ml** | 9,99 € | Flacon voyage |
| **50ml** | 44,99 € | Flacon signature |
| **Recharge 50ml** | 34,99 € | Rechargez votre flacon (éco-responsable) |

**Bundle automatique** : -9,99 € par tranche de 2 flacons 50ml dans le panier.

```ts
const bundleDiscount = Math.floor(total50ml / 2) * 9.99;
```

---

## 6. Pages de l'application

| Route | Composant | Description |
|---|---|---|
| `/` | `Index` | Page d'accueil |
| `/collections` | `Collections` | Galerie des 5 collections |
| `/parfums` | `AllParfums` | Catalogue complet |
| `/collection/:id` | `CollectionPage` | Page d'une collection (thème actif) |
| `/produit/:id` | `ProductPage` | Fiche produit + pyramide olfactive |
| `/coffret` | `DiscoveryBox` | Coffret personnalisable |
| `/offres` | `OffresPage` | Offres spéciales & bundles |
| `/histoire` | `OurStory` | Histoire de la marque |
| `/contact` | `Contact` | Formulaire de contact |
| `/quiz` | `Quiz` | Quiz olfactif interactif |
| `/checkout` | `CheckoutPage` | Tunnel de paiement |
| `/checkout/success` | `CheckoutSuccess` | Confirmation commande |
| `/login` | `LoginPage` | Connexion / inscription / magic link |
| `/account` | `AccountPage` | Espace client |
| `/admin` | `AdminPage` | Back-office (protégé) |
| `/invoice/:id` | `InvoicePage` | Facture PDF |
| `/mentions-legales` | `MentionsLegales` | Mentions légales |
| `/cgv` | `CGV` | CGV |
| `/confidentialite` | `Confidentialite` | Politique de confidentialité |
| `/politique-retour` | `PolitiqueRetour` | Politique de retour |
| `*` | `NotFound` | 404 |

**Comportements globaux dans `App.tsx` :**
- `ThemeGuard` — remet le thème à null en quittant une page collection/produit
- `ScrollToTop` — remonte en haut à chaque changement de route
- `AnimatedRoutes` — transitions Framer Motion entre toutes les pages (450ms)

---

## 7. Composants

| Composant | Rôle |
|---|---|
| `Navbar` | Navigation principale, compteur panier, lien compte |
| `Footer` | Liens légaux et secondaires |
| `CartDrawer` | Drawer latéral panier (articles, remise, total, checkout) |
| `ProductCard` | Carte produit réutilisable |
| `SplashScreen` | Écran de démarrage animé |
| `AnimatedBackground` | Fond animé global (s'adapte au thème actif) |
| `DynamicBackground` | Variante légère du background |
| `ThemeTransition` | Overlay d'animation lors d'un changement de thème |
| `CollectionSplash` | Splash spécifique à une collection |
| `CollectionTransition` | Animation entre deux collections |
| `OlfactoryPyramid` | Pyramide olfactive (tête / cœur / fond) |
| `ProductStory` | Bloc narratif d'inspiration du parfum |
| `RelayPointPicker` | Sélection de point relais Mondial Relay |
| `PageTransition` | Wrapper de transition légère |
| `CookieBanner` | Bandeau RGPD (consentement en localStorage) |
| `NavLink` | Lien de navigation avec état actif |
| `ui/` | Composants shadcn/ui (Button, Dialog, Sheet…) |

---

## 8. Contextes React

### `AuthContext`

```ts
user: User | null
session: Session | null
profile: Profile | null  // { prenom, nom, telephone, adresse, ville, code_postal, pays }
loading: boolean
signOut()
refreshProfile()
```

Écoute `onAuthStateChange` Supabase en temps réel.

### `CartContext`

```ts
items: CartItem[]         // { productId, format, quantity, price, name, isDiscoveryBox?, selectedPerfumes? }
totalItems: number
totalPrice: number
bundleDiscount: number    // -9.99€ / 2 × 50ml
finalPrice: number
isOpen: boolean
addItem(item)
removeItem(id, format)
updateQuantity(id, format, qty)
clearCart()
setIsOpen(bool)
```

### `ThemeContext`

```ts
theme: 'sacrae' | 'vitae' | 'umbrae' | 'nerolae' | 'aera' | null
setTheme(collection | null)
```

Injecte les couleurs de la collection comme variables CSS sur `<html>`.

---

## 9. Hooks personnalisés

| Hook | Description |
|---|---|
| `useParfums` | Fetch des parfums (Supabase + TanStack Query) |
| `use-mobile` | `true` si largeur < 768px |
| `use-toast` | Notifications toast shadcn/ui |

---

## 10. Données statiques (`src/data/`)

| Fichier | Contenu |
|---|---|
| `products.ts` | Collections, parfums, formats, helpers (`getProduct`, `getCollection`…) |
| `bottleImages.ts` | Mapping `id parfum → image flacon` |
| `collectionStories.ts` | Textes narratifs longs par collection |
| `stories.ts` | Contenus visuels pour la page OurStory |

---

## 11. Backend Supabase

**Tables PostgreSQL :**

| Table | Description |
|---|---|
| `profiles` | Profil client (lié à `auth.users`) |
| `orders` | Commandes (montant, statut, adresse livraison) |
| `order_items` | Lignes de commande (produit, format, qté, prix) |

**Auth :** email + mot de passe, magic link.

**RLS :** chaque utilisateur ne voit que ses données. L'admin (`VITE_ADMIN_EMAIL`) voit tout.

---

## 12. Edge Functions (serverless)

| Fonction | Déclencheur | Rôle |
|---|---|---|
| `create-checkout-session` | Frontend (checkout) | Crée la Stripe Checkout Session |
| `stripe-webhook` | Stripe (post-paiement) | Enregistre la commande en BDD + déclenche les emails |
| `send-confirmation-email` | `stripe-webhook` | Email de confirmation au client (Resend) |
| `send-shipping-email` | Admin (AdminPage) | Email d'expédition avec numéro de suivi |
| `send-contact-email` | Formulaire Contact | Transfère le message vers l'email boutique |

---

## 13. Système de thèmes dynamiques

Chaque collection a ses couleurs dans `products.ts` (`accent`, `bg`, `text`).

**Flux d'activation :**

1. Navigation vers `/collection/umbrae` → `setTheme('umbrae')`
2. `ThemeContext` injecte les variables CSS sur `<html>`
3. `AnimatedBackground` adapte ses animations aux nouvelles couleurs
4. `ThemeTransition` joue l'animation de changement
5. Quitter la page → `ThemeGuard` appelle `setTheme(null)`

---

## 14. Tunnel d'achat complet

```
CartDrawer → /checkout
  ├── Étape 1 : Informations personnelles
  ├── Étape 2 : Adresse de livraison
  ├── Étape 3 : Mode de livraison (domicile ou Mondial Relay)
  └── Étape 4 : Paiement
        ↓ Edge Function create-checkout-session
        ↓ Redirect Stripe Checkout (3D Secure)
        ↓ Stripe redirige vers /checkout/success
              ↓ stripe-webhook → commande en BDD + email confirmation
```

---

## 15. Variables d'environnement

**`.env` (frontend) :**

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `VITE_ADMIN_EMAIL` | Email admin (accès `/admin`) |
| `VITE_MONDIAL_RELAY_BRAND` | Code marque Mondial Relay |

**Secrets Edge Functions (dashboard Supabase) :**

| Secret | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret signature webhook |
| `RESEND_API_KEY` | Clé API Resend |

---

## 16. Installation & démarrage

```bash
git clone https://github.com/ThomasMbd99/thaem-aeternum.git
cd thaem-aeternum
npm install
cp .env.example .env
# Remplir .env avec vos valeurs
npm run dev
# → http://localhost:5173
```

---

## 17. Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (HMR) |
| `npm run build` | Build de production → `dist/` |
| `npm run build:dev` | Build non minifié |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (mode CI) |
| `npm run test:watch` | Vitest (mode watch) |

---

## 18. Tests

```bash
npm run test              # Tests unitaires Vitest
npx playwright test       # Tests E2E
npx playwright test --ui  # Tests E2E avec interface graphique
```

---

## 19. Déploiement Vercel

`vercel.json` gère le routing SPA :

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

1. Connecter le dépôt sur vercel.com
2. Framework : **Vite** — Build : `npm run build` — Output : `dist`
3. Ajouter les variables `VITE_*` dans Settings → Environment Variables
4. Chaque push sur `main` déclenche un déploiement automatique

---

*Documentation — Thaem Aeternum*
