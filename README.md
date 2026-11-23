# Living Corporation — GitHub Pages Edition

This edition is **100% static HTML/CSS/JavaScript**. It does not need Node.js, a backend server, or a paid hosting service. GitHub Pages can host it directly, and it works on desktop and mobile browsers.

## Upload to GitHub

1. Create a new public repository, for example `living-corporation`.
2. Upload these files directly into the repository root:
   - `index.html`
   - `style.css`
   - `game.js`
   - `app.js`
   - `README.md`
3. Commit the files.

## Turn on the playable website

1. Open your repository on GitHub.
2. Go to **Settings**.
3. Select **Pages** from the left menu.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**.
6. Press **Save**.
7. Wait a minute or two. GitHub will show your website URL, usually:
   `https://YOUR-USERNAME.github.io/living-corporation/`

Open that Pages URL on your phone. The repository's normal URL (github.com/...) is the code page, not the game.

## What works in this static edition

- Pixel-art office scene with animated worker sprites, desks, windows, furniture and plants.
- Responsive layout for mobile and desktop.
- Select workers by tapping/clicking them.
- Simulated employee conversations.
- Employees have hunger, energy, mood, and work/eat/rest behavior.
- Create custom tasks and approve/reject them as owner.
- HR hiring proposals and owner approval.
- Approved hires join the employee list.
- Local autosave using browser `localStorage`.

## Important limitations

This is a playable prototype. Because GitHub Pages is static hosting:
- Saves are stored only in the current browser/device. They do not sync between phone and PC.
- Conversations are scripted simulations, not live Claude AI.
- There is no secure way to put an Anthropic API key in this public browser code. Real Claude conversations require a separate backend server.
- Task approval is implemented, but real-world-like task execution and deliverables are not yet implemented.
- Full autonomous agents, family generations, CEO/shareholder governance, meetings, and multi-industry economy are future development stages.

For a shared online world with real AI workers and cross-device saves, add a backend and database later. This GitHub Pages version is intentionally designed to run directly from the repository's Pages website.
