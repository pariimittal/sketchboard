🖊️ Sketchboard

A lightweight, browser-based digital whiteboard — no sign-up, no install, just open the link and start drawing.

Live demo: sketchboard-kohl.vercel.app

About:
Sketchboard is a canvas-based drawing app built from scratch using the native HTML5 Canvas API — no third-party drawing library. It started as a way to combine two things I care about: data structures (undo/redo here is genuinely just a stack pop/push) and clean, minimal UI. I built it as a solo project rather than cloning an existing tutorial one-to-one, so every part of the architecture — the component split, the drawing engine, the redraw logic — is my own.

Features:
✏️ Freehand drawing with adjustable colour and brush size
🧼 Eraser tool
📐 Shapes — line, rectangle, circle (drag to draw)
↶↷ Undo / Redo — implemented as a two-stack stroke history
🌙 Dark mode — flips both the UI and the canvas background
💾 Save & load named boards (stored locally in the browser)
⬇️ Export as PNG
📱 Responsive canvas that resizes cleanly with the window

Tech Stack:
Layer	Choice
Build tool	Vite
UI library	React
Styling	Tailwind CSS
Drawing	Native HTML5 Canvas API
Hosting	Vercel
Getting Started


Project Structure:
sketchboard/
├── src/
│   ├── components/
│   │   ├── Canvas.jsx     # drawing engine — strokes, undo/redo, shapes
│   │   └── Toolbar.jsx    # presentational controls only
│   ├── App.jsx            # shared state + save/load logic
│   └── index.css
├── index.html
├── vite.config.js
└── package.json

Canvas.jsx owns all drawing state and exposes a small imperative API (undo, redo, clear, download, getStrokes, loadStrokes) via useImperativeHandle, so Toolbar.jsx stays purely presentational and never touches canvas internals directly.

How Undo/Redo Works:

Every stroke (freehand or shape) is pushed onto an array as it's drawn. Undo pops the most recent stroke off into a redo stack; redo pushes it back. The entire canvas is cleared and redrawn from this array on every change — simple, and correct by construction, at the cost of a small redraw overhead on very large boards.

js
undo: () => {
  const updated = strokes.slice(0, -1);
  setRedoStack((r) => [strokes[strokes.length - 1], ...r]);
  setStrokes(updated);
  redraw(updated);
}

Deployment:
The project auto-deploys to Vercel on every push to main. If you fork this and deploy your own copy, note the vercel.json isn't currently needed unless you re-add auth (see below).


Roadmap:
 Labelled, accessible toolbar icons (currently emoji-only)
 Keyboard shortcuts for undo/redo
 Pan & zoom for an effectively infinite canvas
 Layered/off-screen canvas rendering for large boards
 Revisit Google sign-in with redirect flow + correct COOP headers from the start
 Real-time multi-user collaboration
 
Author:
Pari Mittal B.Tech CSE (AI), First Year — IGDTUW, Delhi 

License
MIT
