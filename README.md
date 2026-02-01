# Robinio Marketing Website

Production-ready, mobile-first marketing site for Robinio built with Next.js App Router, TypeScript, and Tailwind CSS. Includes URL-based locales (`/en` and `/et`) and the required pages for Google Play website compliance.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/en` or `http://localhost:3000/et`.

## Build

```bash
npm run build
```

## Hosting / Zone.ee export strategy

Two viable approaches:

1) **VPS / Node hosting (recommended for future growth)**
   - Build: `npm run build`
   - Start: `npm run start`
   - This keeps the full Next.js server runtime for future features.

2) **Static export (if you need a purely static site)**
   - If a static export is required later, we can configure `next.config.ts` for `output: "export"` and use `next export` (or `next build` for supported static output).
   - This is optional and can be added when needed.

## Windows development

Next.js 16 defaults to Turbopack, but on some Windows setups SWC falls back to WASM and Turbopack fails. We use Webpack via `--webpack`. Start development with:

```bash
npm run dev
```
