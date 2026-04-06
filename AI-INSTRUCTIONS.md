# AI Bot Instructions — Property Compliance App

## Project Type
This is a **React JSX application** (NOT plain HTML). Serverless, client-side only.

- **React 18** with hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
- **Create React App** as the build tool
- **Vercel** for serverless deployment (see `vercel.json`)
- **Inline CSS** via React style objects — no external CSS framework
- **localStorage** polyfill for `window.storage` API (originally built for Vercel v0)

## Serverless Architecture (mirrors fightready-web pattern)
- **No backend / no API routes / no serverless functions**
- All logic runs client-side in the browser
- Data persistence via `window.storage` (polyfilled to `localStorage`)
- Deployment: static build output to Vercel (`npm run build` → `/build/`)
- Config: `vercel.json` with `buildCommand`, `outputDirectory`, `framework`

## AI Bot Integration
- The AI Compliance Bot (`AIBot` component) runs **entirely client-side**
- No API keys, no external AI service calls
- Uses rule-based analysis of the live compliance data state
- Capabilities: categorization, risk scoring, trend analysis, action recommendations
- Located inside `src/App.js` alongside all other components

## File Compatibility
- `src/App.js` is the **main application file** — exports default `App` component
- `compliance-app_1 - Copy.jsx` is the **original source** (kept for reference)
- Must remain valid React JSX with `import`/`export` syntax
- All UI is rendered via React components with inline styles

## Key Architecture
- **Single-file app**: Dashboard, PropertyForm, ComplianceChecklist, HistoryView, ReportGenerator, AIBot
- **Data**: `HK_COMPLIANCE_TEMPLATE` — static compliance checklist for HK property management
- **Storage**: `window.storage.get/set/delete` polyfilled to `localStorage` in `src/index.js`
- **Language**: Chinese (Traditional/Simplified mix for HK context)

## Running Locally
```bash
npm install
npm start
# Opens at http://localhost:3000
```

## Building & Deploying
```bash
npm run build        # Output in /build
# Deploy to Vercel: push to GitHub, Vercel auto-builds
```

## When Modifying
- Keep the `export default function App()` pattern
- Keep the `window.storage` API — works on Vercel v0 and locally via polyfill
- The app is self-contained — no API backend required
- AI bot responses are in the `getResponse()` function inside `AIBot`
