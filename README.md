# 🧠 MindMatch — Memory Card Matching Game

MindMatch is a responsive Memory Card Matching Game built with **React**, **Vite**, and **Tailwind CSS v4**. It includes 3D card-flip animations, three difficulty levels, local high-score tracking, and a lightweight canvas-based confetti effect on the win screen.

**🔗 Live Demo:** [https://mind-match-gold.vercel.app/](https://mind-match-gold.vercel.app/)

---

## Features

- **4x4 / 6x4 / 6x6** grids for Easy / Medium / Hard difficulty
- Cards shuffle randomly (Fisher–Yates algorithm) on every new game
- Click to reveal a card; only 2 cards can be flipped at a time
- Matched pairs stay revealed; mismatches flip back automatically after a short delay
- Move counter and live timer (mm:ss)
- "Congratulations! You Won" screen showing final time and total moves
- Restart button to reshuffle and reset the game
- Best score (time + moves) saved per difficulty using `localStorage`
- 3D CSS flip animations and a confetti celebration on win
- Fully responsive — works on desktop, tablet, and mobile, including the 6x6 grid on small screens

---

## Tech Stack

- React 19 (functional components + hooks: `useState`, `useEffect`, `useCallback`)
- Vite for build tooling
- Tailwind CSS v4 for styling
- Plain HTML5 Canvas for the confetti effect (no extra animation libraries)
- Deployed on Vercel

---

## Project Structure

```text
memory-match-game/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx                    # Game state: cards, moves, timer, difficulty
│   ├── index.css
│   ├── components/
│   │   ├── Board.jsx               # Renders the grid of cards
│   │   ├── Card.jsx                # Single card, flip animation
│   │   ├── DifficultySelector.jsx  # Easy / Medium / Hard buttons
│   │   ├── ScoreBoard.jsx          # Moves, timer, best score display
│   │   └── WinModal.jsx            # Win screen + confetti
│   └── utils/
│       └── gameAssets.js           # Shuffle logic + card data
```

---

## How It Works (Game Logic)

- **Shuffling:** Each card pair is duplicated and shuffled using Fisher–Yates before every game/restart, so the layout is different each time.
- **Flip rule:** Clicking a card flips it face-up. Once 2 cards are face-up, further clicks are ignored until the comparison resolves.
- **Matching:** If the 2 flipped cards match, they're marked permanently matched. If not, both flip back after ~800ms.
- **Moves:** The move counter increments once per pair comparison (not per click).
- **Timer:** Starts on the first card flip and stops the moment the last pair is matched.
- **Best score:** On a win, the current time/moves are compared against the stored best for that difficulty in `localStorage`, and updated if it's a new record.

---

## Running Locally

### Prerequisites
[Node.js](https://nodejs.org/) v18 or higher.

### Install
```bash
npm install
```

### Development server
```bash
npm run dev
```
Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Production build
```bash
npm run build
```
Outputs a static, deployable site to `dist/`.

### Preview the production build locally
```bash
npm run preview
```

---

## Deployment

Deployed on Vercel directly from this GitHub repository. Vercel auto-detects the Vite build and runs `npm run build`, serving the `dist/` folder — no extra configuration was needed.

To redeploy your own copy:
1. Push this repo to GitHub.
2. Import it in the [Vercel Dashboard](https://vercel.com/dashboard) → **Add New → Project**.
3. Deploy with default settings.

---

## Possible Improvements

- Sound effects on flip/match/win
- Multiplayer / pass-and-play mode
- Leaderboard synced across devices instead of per-browser `localStorage`