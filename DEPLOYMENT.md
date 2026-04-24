# Deployment

This app is a static Vite SPA with local-only progress stored in the browser.

## Vercel

- Import the repository into Vercel.
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites are already configured in [vercel.json](/Users/colinbingham/Documents/GitHub/jchattr-1/vercel.json).

## Netlify

- Import the repository into Netlify.
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects are already configured in [netlify.toml](/Users/colinbingham/Documents/GitHub/jchattr-1/netlify.toml).

## Local-first behavior

- Mission progress, review state, and settings stay in `localStorage`.
- Data does not sync across browsers or devices.
- A fresh browser profile starts with empty local study state.
