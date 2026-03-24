# MGI Education Website (Static)

## Project tree

```
/
  index.html
  programs.html
  about.html
  faq.html
  contact.html
  register.html
  pay.html
  verify.html
  admin-add-certificate.html
  /assets
    /css/styles.css
    /css/admin-add-certificate.css
    /js/main.js
    /js/i18n.js
    /js/countdown.js
    /js/programs.js
    /js/programs-page.js
    /js/verify.js
    /js/admin-add-certificate.js
    /data/certificates.json
    /vendor/qrcode.min.js
    /svg/miami-skyline.svg
    /svg/seal.svg
    /svg/whatsapp.svg
    /img/
```

## Run locally

### Option A: Open directly
1. Double-click `index.html`.
2. Browse to other pages via the header.

### Option B: Tiny local server
```bash
python3 -m http.server 8000
```
Then open: `http://localhost:8000`

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or your default branch) and `/ (root)`
4. Click **Save**.
5. Wait for deployment and open the provided Pages URL.

## Notes
- Bilingual EN/AR toggle is built-in and persisted in `localStorage`.
- Countdown deadline uses Miami time (`America/New_York`) at `2026-04-01T00:00:00`.
- All `Pay Now` buttons use the Stripe link provided.


## Vercel persistent certificate storage (KV)

The certificate APIs use persistent KV on Vercel when configured. In local/dev only, they can run with in-memory fallback.

Set these environment variables in your Vercel project:

- `KV_REST_API_URL` + `KV_REST_API_TOKEN`
  - or `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

Endpoints:

- `POST /api/add-certificate`
- `GET /api/get-certificate?serial=...&lastName=...`

In production, missing KV variables return an explicit configuration error. In local/dev, in-memory fallback is enabled for testing.
