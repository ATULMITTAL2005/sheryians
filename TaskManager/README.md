Task Manager — Vanilla JavaScript

Overview
- A single-page Task Manager demonstrating DOM manipulation, event delegation, event propagation (bubbling & capturing), attributes vs properties, and the browser rendering pipeline.

Files
- index.html — HTML structure and UI
- style.css — styling and themes
- script.js — modular JavaScript with comments and localStorage persistence

How to run
- Open `index.html` in a browser. No build step required.

Key Concepts Explained

DOM Manipulation
- Uses: `createElement`, `createTextNode`, `append`, `prepend`, `before`, `after`, `replaceWith`, `remove`.
- Tasks are created dynamically and inserted into the DOM without page refresh.

Event Delegation
- A single `click` listener on the tasks container handles `Edit`, `Complete`, and `Delete` using `event.target`, `closest()`, and `matches()`.
- This is more efficient than attaching listeners to every button.

Event Bubbling vs Capturing
- Bubbling: events propagate from the innermost target up to ancestors. Demonstrated by console logs: `Child Clicked` → `Parent Clicked` → `Grandparent Clicked`.
- Capturing: events travel from document root down to the target when listeners are registered with the `capture` flag (third param `true`). Console logs: `Grandparent Captured` → `Parent Captured` → `Child Captured`.

Attributes vs Properties
- Attributes reflect the HTML markup and are accessed via `getAttribute`/`setAttribute`.
- Properties are JavaScript object properties on DOM nodes (e.g., `input.value`, `checkbox.checked`).
- `dataset` provides convenient access to `data-*` attributes.

Browser Rendering Pipeline (brief)
1. Parsing HTML → creates tokens → builds DOM tree.
2. Parsing CSS → builds CSSOM tree.
3. Layout/Render tree creation → styling + geometry calculations.
4. Painting → rasterize into pixels.
5. Composite → final display on screen.

Notes
- Validation prevents empty or whitespace-only titles.
- Theme toggling persists choice to `localStorage` using `data-theme` on the `body`.
- Bonus: Search, filter by category/status, clear completed, and localStorage persistence implemented.

If you want, I can:
- Add unit tests or example tasks seeded on first load.
- Commit these files to your repo.
