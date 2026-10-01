# Solyx Website

Static, mobile-first product website for Solyx. Open `index.html` directly in a browser; no build step or runtime dependencies are required.

For a local browser preview, run `node scripts/preview.mjs` and open `http://127.0.0.1:4175/`. The server binds only to this Mac and does not publish the site.

- Home: `/`
- Support: `/support/`
- Privacy Policy: `/privacy/`
- Legacy confirmation URL: `/confirmed/` (generic product introduction)
- Terms: Apple's standard EULA

## Launch

Solyx is live on the App Store. Download links are in the HTML so they work even without JavaScript. App ID: `6775335663`. Apple's official badge is stored at `assets/app-store-badge.svg`.

The production domain is `solyxapp.com`. The galaxy redesign and App Store download links were approved for publication on October 1, 2026. GitHub Pages publishes the `main` branch of `solyxapp/solyxapp.github.io`.

## Assets and motion

The existing product screenshots are preserved unchanged. Typography uses Opal's system font stack; no web font download is needed. The hero is a locally rendered Three.js galaxy with continuous motion and system Reduced Motion support. Rendering stops offscreen or in a hidden tab. A bitmap fallback remains if WebGL is unavailable. Three.js 0.180.0 is self-hosted with its MIT license in assets; no external runtime requests, signup forms, or tracking libraries are loaded. Sequential feature sections use angled Three.js phones, alternating on desktop and stacking on mobile. Screenshots remain readable without JavaScript or WebGL. A scroll-lit statement and opposing catalog rows replace the old tabbed tour. Collection textures load near the viewport, and the temporary planet renderer is released after generating portraits.
