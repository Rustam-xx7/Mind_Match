# ✨ MindMatch | Premium Memory Card Matching Game

MindMatch is a premium, highly responsive, and beautifully designed Memory Card Matching Game built with **React**, **Vite (JavaScript)**, and **Tailwind CSS v4**. It features smooth 3D card-flip animations, three difficulty levels, local high-score tracking, and a custom high-performance canvas-based confetti engine.

The project is structured to deploy seamlessly on **Vercel** with zero configuration.

---

## 🚀 Live Demo & Visuals

- **Theme**: Futuristic Dark Glassmorphic Theme (`#030712` background, frosted transparent panels, glowing borders, and modern typography).
- **Responsive Layout**: Adapts gracefully from large desktop monitors down to 320px mobile screens, with touch-friendly tap targets and auto-sizing grids.
- **Victory Screen**: Floating success modal with detailed statistics, record badges, and falling particle confetti.

---

## 🌟 Core Features

1. **Robust Gameplay Engine**:
   - Shuffles cards using the **Fisher-Yates** algorithm on every start/restart.
   - Restricts flips to a maximum of 2 cards at a time.
   - Locks interaction during card comparison delays (~800ms for mismatches) to prevent double-clicking or third-card cheats.
   - Tracks current moves (1 move = 1 pair attempt) and elapsed time (`mm:ss`).

2. **Adaptive Difficulty Levels**:
   - **Easy**: 4x4 Grid (16 cards, 8 animal pairs)
   - **Medium**: 6x4 Grid (24 cards, 12 animal pairs)
   - **Hard**: 6x6 Grid (36 cards, 18 animal pairs)

3. **Personal Best Tracking (`localStorage`)**:
   - Persists best scores locally.
   - Stores **Best Time** and **Fewest Moves** independently per difficulty level.
   - Highlights new record achievements immediately on the win screen.

4. **Premium Animations & Aesthetics**:
   - **3D Card Flips**: Uses CSS 3D transforms (`perspective`, `rotateY`, and `backface-visibility`) for realistic card rotations.
   - **Match Animation**: Employs a physical scale bounce and glowing halo animation (`animate-match`) when a pair matches.
   - **Celebration Confetti**: A lightweight, self-contained HTML5 Canvas particle system that triggers on victory, rendering falling confetti at 60 FPS without external dependencies.
   - **Floating Panels**: Smooth animations that breathe life into the glassmorphic panels.

5. **Advanced Mobile Responsiveness**:
   - Viewport-based sizing (`vmin`/`vw`) ensures the 6x6 hard mode grid fits completely within a mobile portrait screen without vertical or horizontal scrolling.
   - **Smart Reflow**: The **Medium (6x4)** layout dynamically reflows to a **4x6** grid on mobile portrait screens for an optimized layout.
   - Standardized `touch-manipulation` attributes ensure zero-latency tap response on iOS/Android.

---

## 🛠️ Project Structure

```text
memory-match-game/
├── index.html          # HTML Entry point (Google Fonts, SEO Meta Tags)
├── package.json        # Dependencies (React 19, Vite 8, Tailwind v4)
├── vite.config.js      # Vite configuration with @tailwindcss/vite plugin
├── README.md           # Setup & Documentation
├── src/
│   ├── main.jsx        # App mounting and entry point
│   ├── App.jsx         # Centralized game coordinator & state management
│   ├── index.css       # Global styles, Tailwind imports, and custom animations
│   ├── components/     # Modulized React functional components
│   │   ├── Board.jsx              # Responsive grid wrapper
│   │   ├── Card.jsx               # Individual 3D card
│   │   ├── DifficultySelector.jsx # Game mode selection buttons
│   │   ├── ScoreBoard.jsx         # Current stats & personal records bar
│   │   └── WinModal.jsx           # Success overlay & Canvas confetti
│   └── utils/          # Logic helpers
│       └── gameAssets.js          # Fisher-Yates shuffler and asset generator
```

---

## ⚡ Setup & Installation

Follow these steps to run the project locally:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) installed.

### 2. Install Dependencies
Navigate to the project root and run:
```bash
npm install
```

### 3. Start Development Server
Launch the hot-reloading development server:
```bash
npm run dev
```
Open your browser and navigate to the local URL (usually `http://localhost:5173`).

### 4. Build for Production
Compile a highly optimized production bundle:
```bash
npm run build
```
This outputs a clean, ready-to-deploy static website in the `dist/` folder.

### 5. Preview Production Build
Run a local server to inspect the compiled production build:
```bash
npm run preview
```

---

## ☁️ Deployment on Vercel

This project is fully optimized for **Vercel** with zero additional configuration:
- Vercel automatically detects the **Vite** build tool.
- It will run `npm run build` and serve the compiled `dist/` folder automatically.

### Deploying via Vercel CLI
If you have the Vercel CLI installed, deploy instantly by running:
```bash
vercel
```

### Deploying via GitHub
1. Push this project to a GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
3. Import your repository and click **Deploy**.
