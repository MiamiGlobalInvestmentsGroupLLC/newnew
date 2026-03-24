# Miami Global Investments Group LLC — Education & Professional Development Division

Ultra-premium, bilingual (EN/AR), static website project with Miami luxury modern styling.

## Project Structure

```text
/
  index.html
  programs.html
  about.html
  faq.html
  contact.html
  /assets
    /css/styles.css
    /js/main.js
    /js/i18n.js
    /js/countdown.js
    /js/programs.js
    /svg/miami-skyline.svg
    /svg/seal.svg
    /svg/whatsapp.svg
    /img/
```

## Features

- Static-only stack (HTML/CSS/vanilla JS)
- Bilingual EN | AR toggle with localStorage persistence
- RTL switch for Arabic (`dir="rtl"`) with Cairo font
- Countdown + promotion logic for pricing deadline (America/New_York reference)
- 5 full program cards with Pay Now button in each card
- Floating WhatsApp button on all pages with language-specific prefilled message
- Semantic and accessible markup, keyboard-friendly interactions, reduced-motion support

## Run Locally

### Option A: Open directly

Open `index.html` in your browser.

### Option B: Local server (recommended)

```bash
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project.
2. Ensure the root contains `index.html`.
3. In GitHub: **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your active branch)
   - **Folder**: `/ (root)`
5. Save and wait for Pages deployment.
6. Your site will be available at:
   `https://<your-username>.github.io/<repo-name>/`

## Payment Link

All payment buttons point to:

`https://buy.stripe.com/6oU00jd9V6F0dts4SxbfO00`

## WhatsApp

Floating button uses:

`https://wa.me/13056290491?text=<localized message>`

## Notes

- The countdown deadline is fixed at `2026-04-01T00:00:00-04:00` (Miami/New York DST).
- After the deadline, all promotional prices switch to `$350 USD` and show "Offer Ended".
