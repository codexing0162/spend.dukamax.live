# DukaMax PesaSafari

> **Track Every Shilling** — *Fuata Kila Shilingi*

An offline-first Progressive Web App for shopping budget tracking, designed for entrepreneurs and market traders.

Developed by **Mujeeb (script kiddie)** · Powered by **DukaMax**

---

## Features

- Shopping sessions with budget + live remaining balance
- Instant purchase entry with category + shop tracking
- Budget alerts at 50% / 75% / 90% / exceeded
- Price history & automatic price comparison
- Business Health Score (0–100)
- Smart Advisor in English and Swahili
- Category pie charts & shop rankings
- JSON export / import
- Light / Dark / Auto theme
- 100% offline — IndexedDB + Service Worker PWA

---

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build locally
```

---

## Deployment

### Option 1 — GitHub Pages + Custom Domain (recommended)

This is the primary deployment target. The workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs automatically on every push to `main`.

**One-time GitHub setup:**

1. Push this repo to GitHub.

2. Go to **Settings → Pages**.

3. Under **Source**, select **GitHub Actions**.

4. Under **Custom domain**, enter:
   ```
   spend.dukamax.com
   ```
   GitHub will verify the CNAME file in `public/CNAME` and issue an SSL certificate automatically (takes up to 24 hours for DNS propagation).

5. Enable **Enforce HTTPS** once the certificate is issued.

**After any push to `main`:** the Actions workflow installs deps, builds, and deploys to Pages — no manual steps required.

---

### Option 2 — Cloudflare Pages

1. Connect your GitHub repo in the Cloudflare Pages dashboard.

2. Set build configuration:
   | Setting | Value |
   |---|---|
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `20` |

3. Add your custom domain in **Custom domains → Add domain** → `spend.dukamax.com`.

Cloudflare Pages automatically handles HTTPS and CDN — no additional config needed.

---

### Option 3 — Netlify

1. Connect your GitHub repo in Netlify.

2. Build settings:
   | Setting | Value |
   |---|---|
   | Build command | `npm run build` |
   | Publish directory | `dist` |

3. Add `spend.dukamax.com` under **Domain management → Add custom domain**.

4. Create `public/_redirects` if you need SPA fallback (Cloudflare/GitHub handle this via SW):
   ```
   /*  /index.html  200
   ```

---

## Cloudflare DNS Setup (for custom domain)

Configure these records in your Cloudflare DNS dashboard for `dukamax.com`:

### For GitHub Pages:
```
Type   Name     Content              Proxy
CNAME  spend    <username>.github.io  DNS only (grey cloud)
```
> Replace `<username>` with your GitHub username. Proxy must be **DNS only** (not proxied) for GitHub's SSL cert issuance to work.

### For Cloudflare Pages:
```
Type   Name     Content                        Proxy
CNAME  spend    <project>.pages.dev            Proxied (orange cloud)
```

### Verify DNS propagation:
```bash
dig spend.dukamax.com CNAME
# or
nslookup spend.dukamax.com
```

---

## PWA Verification Checklist

After deployment, verify:

- [ ] App loads at `https://spend.dukamax.com`
- [ ] HTTPS enforced (padlock in browser)
- [ ] "Add to Home Screen" prompt appears on mobile
- [ ] App works fully after going offline (airplane mode)
- [ ] Data persists after closing and reopening the app (IndexedDB)
- [ ] Service Worker registered — check DevTools → Application → Service Workers
- [ ] Manifest loaded — check DevTools → Application → Manifest
- [ ] Lighthouse PWA score ≥ 90

---

## Architecture

```
src/
├── db/             # Dexie/IndexedDB layer (sessions, purchases, priceHistory)
├── context/        # Global state (AppContext — theme, language, alerts)
├── i18n/           # en.js + sw.js translation strings
├── utils/          # formatters, calculations, export/import
├── hooks/          # useLanguage, useTheme
├── components/
│   ├── common/     # Button, Card, Modal, Badge, FAB, BudgetAlert, AnimatedCounter
│   ├── layout/     # Header, BottomNav
│   ├── dashboard/  # BudgetRing, StatCard
│   ├── session/    # SessionForm, SessionCard
│   ├── purchase/   # PurchaseForm, PurchaseItem, PurchaseList
│   ├── reports/    # CategoryChart, ShopRanking
│   └── advisor/    # HealthScore, SmartAdvisor
├── pages/          # Dashboard, Sessions, ActiveSession, Reports, History, Settings, About
├── styles/         # global.css, animations.css
├── App.jsx
└── main.jsx
```

---

## Tech Stack

| Library | Purpose |
|---|---|
| React 18 + Vite | UI framework + build tool |
| React Router v6 | Client-side routing |
| Dexie.js | IndexedDB wrapper |
| Framer Motion | Animations & transitions |
| Recharts | Charts & analytics |
| vite-plugin-pwa | Service Worker + PWA manifest |

---

## License

All Rights Reserved © DukaMax

---

*Powered by DukaMax · Developed by Mujeeb*
