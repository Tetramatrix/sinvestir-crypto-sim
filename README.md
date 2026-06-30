# Simulateur Crypto-monnaie | S'investir

Simulateur d'investissement crypto en DCA (Dollar Cost Averaging) avec l'identité visuelle S'investir.

## Fonctionnalités

- **Recherche de crypto** — plus de 7000 cryptomonnaies via l'API CoinGecko
- **Modes d'investissement** — One-shot, quotidien, hebdomadaire, mensuel
- **Graphiques interactifs** — évolution du portefeuille et plus-value/moins-value
- **Indicateurs clés** — investi, accumulé, performance, prix moyen, valeur actuelle
- **Responsive** — desktop et mobile
- **Design S'investir** — thème dark navy, accents bleus, cartes glassmorphism

## Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **Recharts** pour les graphiques
- **Lucide React** pour les icônes
- **CoinGecko API** pour les données crypto

## Lancement

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000

## Déploiement Vercel

```bash
npx vercel
```

## Structure

```
app/
  layout.tsx          # Layout racine (Lexend, dark theme)
  page.tsx            # Page principale du simulateur
  globals.css         # Design tokens S'investir + styles
components/
  CryptoSearch.tsx    # Recherche autocomplete de cryptos
  SimulatorForm.tsx   # Formulaire de paramètres
  ResultsCards.tsx    # Affichage des indicateurs clés
  HistoryChart.tsx    # Graphique évolution portefeuille
  ProfitLossChart.tsx # Graphique plus-value/moins-value
  Header.tsx          # En-tête S'investir
lib/
  types.ts            # Types TypeScript
  coingecko.ts        # Appels API CoinGecko
  simulator.ts        # Moteur de calcul DCA
```

## Partis pris

- **Next.js** choisi pour correspondre à la stack S'investir (Next.js, Vercel)
- **Client-side uniquement** — pas de backend, les appels CoinGecko se font côté navigateur
- **Pas de Supabase** — le simulateur est autonome, pas besoin de stockage
- **Tailwind CSS v4** — même version que simulateurs.sinvestir.fr
- **Lexend** — même police que le design system S'investir
- **Recharts** — léger, natif React, idéal pour des données financières

## Données

Toutes les données proviennent de l'API CoinGecko (gratuite, pas de clé API requise).
