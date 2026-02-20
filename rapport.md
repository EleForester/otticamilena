# Rapport d'Analyse du Projet : Ottica Milena

## 1. Présentation du Projet

Le projet **Ottica Milena** est une application web e-commerce moderne dédiée à
une boutique d'optique. Elle permet aux utilisateurs de parcourir un catalogue
de produits (lunettes), de gérer un panier d'achat et de procéder au paiement en
ligne ou de réserver pour un retrait en magasin. Le site est conçu comme une
**SPA (Single Page Application)**, offrant une expérience utilisateur fluide et
réactive.

## 2. Architecture Technique

Le projet repose sur une stack technologique moderne et performante (JAMstack) :

### Frontend

- **Framework :** React 19 (via Vite 7).
- **Langage :** JavaScript (ESModules).
- **Routage :** React Router DOM v7 pour la navigation côté client.
- **Style :** CSS modulaire et global.
- **État Global :** Context API (via `CartContext`) pour la gestion du panier.

### Backend & Infrastructure

- **Backend-as-a-Service (BaaS) :** **Supabase**.
  - Utilisé pour la base de données (PostgreSQL).
  - Stockage des produits et gestion des commandes.
  - **Edge Functions :** Fonctions serverless (Deno) pour la logique sensible
    (paiements).
- **Hébergement & Déploiement :** Configuration présente pour **Vercel**
  (`vercel.json`), assurant une distribution via CDN global.

### Paiements

- **Processeur :** **Stripe**.
- **Librairies :** `@stripe/react-stripe-js` et `@stripe/stripe-js`.

---

## 3. Analyse des Fonctionnalités et Méthodes

### A. Gestion du Catalogue et "Mise à jour en direct"

- **Méthode :** Le site ne garde pas de données produits "en dur" (statistiques)
  pour l'affichage dynamique.
- **Implémentation :**
  - Au chargement de la page boutique (`Shop.jsx`) ou détail
    (`ProductDetail.jsx`), l'application interroge directement la base de
    données Supabase via l'API `productsAPI.js`.
  - **Flux :** `Client` -> `Supabase SDK` -> `Table 'products'`.
  - **Observation :** Bien que le terme "mise à jour en direct" soit évoqué, le
    code actuel utilise un modèle de **récupération à la demande (Fetch)**
    classique (`useEffect` qui appelle `fetchActiveProducts`). Il n'y a pas de
    souscription "Temps Réel" (Realtime Subscriptions) active dans le code
    analysé qui pousserait une modification de prix instantanément sans
    recharger la page, mais toute modification en base est immédiatement visible
    au prochain chargement/navigation.

### B. Implémentation des Paiements (Stripe & Klarna)

Le système de paiement est le cœur critique de l'application.

1. **Parcours Utilisateur (`Checkout.jsx`) :**
   - Collecte des informations client (Nom, Email, Téléphone, Adresse).
   - L'adresse est rendue obligatoire pour supporter les exigences de
     facturation et les méthodes de paiement différé comme **Klarna**.
   - Choix du mode de livraison (Retrait boutique ou Livraison).

2. **Flux Technique Sécurisé :**
   - **Création de Commande (Pending) :** Avant le paiement, une commande est
     créée dans Supabase avec le statut "pending".
   - **Payment Intent (Côté Serveur) :** Le frontend appelle la Supabase Edge
     Function `create-payment-intent`.
     - **Sécurité :** Cette fonction initialise Stripe avec la clé secrète
       (jamais exposée au client).
     - **Calcul du Montant :** Le total est recalculé côté serveur pour éviter
       la manipulation côté client (voir section Sécurité).
   - **Finalisation :** Le client reçoit un `clientSecret` et utilise
     `Recommended Payment Element` de Stripe. Cela permet de supporter
     automatiquement plusieurs méthodes (Carte, **Klarna**, PayPal, etc.) selon
     la configuration du Dashboard Stripe, sans changer le code frontend.

3. **Confirmation (Webhook) :**
   - Une fonction `stripe-webhook` écoute les événements de Stripe
     (`payment_intent.succeeded`).
   - À la réception du succès, elle met à jour le statut de la commande dans
     Supabase de "pending" à "paid". Cela garantit que la commande n'est validée
     que si l'argent est réellement reçu.

### C. Formulaire de Contact

- **État Actuel :** La page `Contact.jsx` contient un formulaire visuel.
- **Observation critique :** Ce formulaire est actuellement **non fonctionnel**.
  Il ne possède pas de gestionnaire `onSubmit` connecté à un service d'envoi
  d'email (comme EmailJS) ou à une table Supabase. Il rechargera simplement la
  page sans action.

---

## 4. Analyse et Enjeux de Sécurité

### Points Forts (Sécurités Mises en Place)

1. **Séparation des Rôles :** La clé privée Stripe (`STRIPE_SECRET_KEY`) est
   isolée dans une Edge Function (serveur) et n'est jamais exposée au frontend.
2. **Webhooks Signés :** Le webhook Stripe vérifie la signature cryptographique
   (`Stripe-Signature`), empêchant des acteurs malveillants de simuler des
   paiements validés.
3. **En-têtes HTTP (Headers) :** Le fichier `vercel.json` configure des en-têtes
   de sécurité robustes :
   - `X-XSS-Protection` et `X-Content-Type-Options` contre les injections.
   - `X-Frame-Options: DENY` pour empêcher le clickjacking (site affiché dans
     une iframe).
   - `Permissions-Policy` stricte (bloque caméra, micro, géolocalisation).
4. **CSP (Content Security Policy) :** Une balise `<meta>` dans `index.html`
   restreint les sources de scripts autorisées (Stripe, Google Maps, Supabase),
   réduisant le risque d'attaques XSS.

### Vulnérabilités et Points d'Attention

1. **Validation des Prix (Point Critique) :**
   - Dans `supabase/functions/create-payment-intent/index.ts`, il y a un
     commentaire d'avertissement explicite. Actuellement, le serveur fait
     confiance au prix **envoyé par le client** (`item.price_cents`).
   - **Risque :** Un utilisateur technique pourrait modifier le code JavaScript
     localement pour envoyer un prix de 0,01€ pour une paire de lunettes, et le
     serveur accepterait ce montant.
   - **Recommandation Urgent :** La fonction serveur doit récupérer les prix
     officiels depuis la base de données Supabase en utilisant les ID produits,
     et ignorer les prix envoyés par le frontend.

2. **Formulaires :**
   - L'absence de traitement backend pour le formulaire de contact n'est pas une
     faille de sécurité en soi, mais une lacune fonctionnelle. Cependant, tout
     futur formulaire devra être protégé contre le spam (Captcha).

## 5. Conclusion

Le projet Ottica Milena est techniquement solide dans son architecture globale
(SPA + Serverless). L'intégration Stripe est moderne et suit les bonnes
pratiques de flux (Intent + Webhook), permettant une flexibilité pour **Klarna**
et autres méthodes.

Cependant, deux actions sont prioritaires avant la mise en production :

1. **Sécuriser le calcul des prix** dans la Edge Function (ne plus faire
   confiance au client).
2. **Rendre fonctionnel le formulaire de contact**.
