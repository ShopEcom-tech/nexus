# Rapport d'Audit & Review de Code - Nexus V5

## 1. Architecture Générale & Structure du Projet

### 🛑 Problème Majeur : Incohérence des Imports (Modules vs Tags)
Le projet souffre d'une "schizophrénie" architecturale entre la page d'accueil et les autres pages :

*   **`index.html`** : Utilise une approche moderne `type="module"` avec `src="/js/main.js"`. C'est la bonne pratique si vous utilisez Vite.
*   **Les pages (`pages/contact.html`, etc.)** : Utilisent une approche "Old School" avec des balises `<script>` multiples (`script.js`, `three-effects.js`, `gsap-animations.js`...).

**Conséquences :**
*   **Maintenance cauchemardesque** : Si vous corrigez un bug dans `main.js`, il ne sera pas corrigé sur la page contact car elle ne l'utilise pas (ou partiellement).
*   **Doublons de code** : `script.js` contient du code pour la navbar, le formulaire de contact, etc. Ce fichier est importé par `main.js` MAIS aussi inclus manuellement dans les pages. Risque d'exécuter 2 fois les mêmes événements.
*   **Perte de performance** : Les pages internes ne bénéficient pas du "Tree Shaking" (élimination du code mort) de Vite.

### 💡 Recommandation
Utiliser **exclusivement** le système de modules Vite.
*   Toutes les pages HTML devraient pointer vers un point d'entrée JS unique (ex: `main.js`) ou spécifique (ex: `pages/contact.main.js`) qui importe ce dont il a besoin.
*   Supprimer les balises `<script src="...">` manuelles dans les fichiers HTML au profit de `import` dans les fichiers JS.

---

## 2. Qualité du Code JavaScript (`js/`)

### 📂 "Script Soup" (52 fichiers à la racine)
Le dossier `js/` contient 52 fichiers à plat. C'est difficile à naviguer.
*   **`script.js` (12KB)** : C'est un fichier "fourre-tout" (God Object). Il gère à la fois les particules, la navbar, le menu mobile, les animations au scroll, le formulaire de contact...
    *   **Violation du principe de responsabilité unique (SRP)**.
*   **`main.js`** : Importe 52 modules d'un coup. Même si le navigateur gère, charger 50 fichiers séparés ralentit le chargement initial (waterfall effect).

### 💡 Recommandation
Restructurer le dossier `js/` :
*   `js/components/` : (navbar.js, mobile-menu.js, footer.js...)
*   `js/features/` : (particles.js, chat.js, auth.js...)
*   `js/utils/` : (validators.js, formatters.js...)
*   **Refactorer `script.js`** : Découper ce fichier et distribuer son contenu dans des modules spécifiques.

---

## 3. Styles & CSS (`css/`)

### 🎨 Monolithe `style.css` (80KB)
Bien que le projet utilise des `@import` pour `components/`, le fichier `style.css` contient encore **4000+ lignes** de code CSS "en vrac" (Sections Benefits, Pricing, Services, etc.).

**Risques :**
*   Conflits de sélecteurs (ex: `.card` défini à plusieurs endroits ?).
*   Difficile de trouver où modifier un style spécifique.

### 💡 Recommandation
Déplacer TOUT le CSS restant dans :
*   `css/pages/` (home.css, contact.css...)
*   `css/sections/` (hero.css, pricing.css, benefits.css...)
Le fichier `style.css` ne devrait contenir QUE des `@import`.

---

## 4. Performance & Optimisation

### 🐢 Surcharge Visuelle & Scripts Lourds
La page `index.html` charge :
1.  **Three.js** (Lourd)
2.  **GSAP** (Lourd)
3.  **WasmFluid** (Lourd - WebAssembly)
4.  **Canvas Particles** (Script custom dans `script.js`)

Avoir 3 ou 4 moteurs d'animation/rendu graphique qui tournent en même temps est un tueur de batterie sur mobile et peut causer des lags importants lors du scroll.

### 💡 Recommandation
*   Choisir **UN** effet "Wow" principal (ex: Fluid ou Particles, pas les deux superposés).
*   Charger Three.js et les effets lourds uniquement si l'appareil est assez puissant (vérifier `navigator.hardwareConcurrency` ou la batterie).

---

## 5. Sécurité (`js/config.js` & `js/auth.js`)

### 🔐 Supabase & Clés API
*   Les clés `anonKey` et `stripePublicKey` sont exposées dans `config.js`. **C'est normal** pour une application cliente (SPA), À CONDITION QUE :
    1.  **Row Level Security (RLS)** soit activé et STRICT sur Supabase. (Vérifier que personne ne peut faire `delete * from users` avec la clé anon).
    2.  Les Webhooks Stripe soient sécurisés côté serveur (Edge Functions).

### ⚠️ Mode Démo
`auth.js` contient un mode "Démo" qui simule un login si Supabase n'est pas configuré.
*   **Danger** : Si la config saute en prod, les utilisateurs pourraient croire qu'ils sont loggués alors qu'ils sont en mode "faux compte local".

---

## Plan d'Action Prioritaire 🛠️

1.  **Nettoyage HTML** : Uniformiser les imports de scripts (tout passer par `main.js` / modules).
2.  **Explosion de `script.js`** : Extraire `Navbar`, `ContactForm`, `Testimonials` dans des fichiers séparés.
3.  **Refactor CSS** : Déplacer les grosses sections de `style.css` vers des fichiers dédiés.
4.  **Optimisation** : Désactiver `WasmFluid` sur mobile ou si `Three.js` est déjà actif. 
