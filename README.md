# Sankey Studio

A tiny browser tool for sketching Sankey flow diagrams from plain text. Built for two recurring use cases: tracking a personal monthly budget and visualizing a job application funnel.

Type lines like `Source [value] Target` in the left panel — the diagram on the right re-renders as you type. Drafts auto-save to your browser; named saves persist across sessions. Export the result as SVG or share the source as `.txt`.

## Run it

Open `index.html` in any browser. No build step, no server.

## Stack

D3 v7 + d3-sankey, plain HTML/CSS/JS, `localStorage` for persistence.

## Files

- `index.html` — markup
- `styles.css` — styles
- `js/data.js` — color palette and built-in presets
- `js/parser.js` — text → `{ nodes, links }`
- `js/storage.js` — `localStorage` wrapper
- `js/render.js` — d3-sankey layout and SVG drawing
- `js/app.js` — DOM wiring, events, boot
