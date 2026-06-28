# Pathfinding Visualizer

An interactive, browser-based visualizer for classic pathfinding algorithms built with **React**. Paint walls, pick an algorithm, and watch it explore the grid in real time before tracing the resulting path.

---

## Algorithms

| Algorithm | Guarantees Shortest Path | Notes |
|---|---|---|
| **Dijkstra's** | Weighted-graph gold standard; explores all directions uniformly |
| **A\*** | Heuristic-guided (Manhattan distance); typically much faster than Dijkstra's |
| **BFS** | Explores layer by layer; shortest path on an unweighted grid |
| **DFS** | Explores as deep as possible first; finds *a* path, not the shortest |

---

## Features

- **Interactive wall drawing** — click and drag to paint walls; click an existing wall to erase
- **Smart drag mode** — dragging never flickers: the first cell you click decides whether you're adding or removing walls for the entire drag
- **Auto-reset between runs** — re-running an algorithm automatically clears the previous visualization while keeping your walls intact
- **Start / finish node protection** — the red (start) and green (finish) nodes cannot be turned into walls
- **Animation lock** — buttons and wall-drawing are disabled while an animation is playing to prevent corrupt state

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or newer
- npm (bundled with Node.js)

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/seangebob/pathfinding-visualizer.git
cd pathfinding-visualizer

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open automatically at [http://localhost:3000](http://localhost:3000).  
The page hot-reloads whenever you save a source file.

### Production Build

```bash
npm run build
```

Outputs an optimised static bundle to the `build/` folder, ready to be served by any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## How to Use

1. **Draw walls** — click or click-and-drag on any empty cell to add a wall; drag over a wall to remove it
2. **Pick an algorithm** — click one of the algorithm buttons at the top of the page
3. **Watch the animation** — visited cells turn teal/blue; the final path turns yellow
4. **Re-run or switch** — clicking another algorithm button automatically clears the previous result and runs the new one on the same grid
5. **Clear board** — resets the entire grid (walls included) back to a blank state

---

## Project Structure

```
src/
├── algorithms/
│   ├── dijkstra.js          # Dijkstra's algorithm
│   ├── astar.js             # A* with Manhattan heuristic
│   ├── breadthfirstsearch.js
│   └── depthfirstsearch.js
└── PathfindingVisualizer/
    ├── PathfindingVisualizer.jsx   # Main grid component & animation logic
    ├── PathfindingVisualizer.css
    └── Node/
        ├── Node.jsx                # Individual cell component
        └── Node.css                # Node animations & colour states
```

---

## Tech Stack

- **React 19** (Create React App)
- Vanilla CSS with keyframe animations — no external UI libraries

---

## License

MIT
