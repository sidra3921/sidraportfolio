# Sidra — AI/ML Engineer Portfolio

A fast, fully responsive personal portfolio built with **pure HTML5, modern CSS3 and vanilla JavaScript**: no frameworks and no build step.

**Features:** dark tech theme with a light-mode toggle · animated neural-network hero · typing effect · VS Code–style developer profile card with syntax highlighting · scroll-reveal animations · scroll-spy navigation · experience timeline · filterable project grid with screenshot galleries · image viewer (keyboard, swipe, thumbnails) · categorized skills · certifications grid with certificate images · contact form that works with Netlify Forms · Cloudinary-ready images · accessible (keyboard, screen reader and reduced-motion support).

## Project structure

```
sidraportfolio/
├── index.html                  # All page content and sections
├── style.css                   # Design tokens, layout, components, animations
├── script.js                   # Interactivity (theme, menu, typing, filters, form, canvas)
├── chatbot.js                  # Portfolio assistant (chat widget + its knowledge base)
├── netlify.toml                # Netlify deploy settings and headers
└── assets/
    ├── favicon.svg
    ├── Sidra-Resume.pdf        # served by the "Download Resume" button
    ├── certificates/           # certificate images (see "Certificate images" below)
    ├── projects/
    │   ├── shecan/             # SheCan AI cover + 8 app screenshots (+ thumbs/)
    │   ├── truckme/            # TruckMe cover + 8 admin/app screenshots (+ thumbs/)
    │   └── rozana/             # Rozana Budget cover + 5 screenshots (+ thumbs/)
    └── images/
        ├── sidra-profile.jpg       # profile photo (630×630 square crop)
        ├── project-rag.svg
        └── project-pipeline.svg
```

## Preview locally

Open `index.html` in a browser. To test everything the way it behaves online, serve the folder instead:

```bash
# Python
python -m http.server 8000
# or Node
npx serve .
```

Then visit http://localhost:8000.

## Make it yours

| What | Where |
|---|---|
| **Profile photo** | Replace `assets/images/sidra-profile.jpg` with a square photo of the same name. To serve it from Cloudinary instead, set `.profile-img`'s `src` in `index.html` to e.g. `https://res.cloudinary.com/<cloud-name>/image/upload/c_fill,g_face,w_600,h_600,q_auto,f_auto/sidra-profile.jpg` |
| **Project banners** | `index.html` → each `.project-media img`. A good Cloudinary transform is `c_fill,w_800,h_450,q_auto,f_auto` (16:9) |
| **Project screenshots** | The SheCan AI card shows the pattern: a `.media-gallery` link on the image plus a hidden `.gallery-data` list (one `<li data-src data-thumb data-caption>` per screenshot). Copy both into another card to give it a gallery |
| **Certificate images** | Upload each certificate to Cloudinary and paste its URL into that card's `data-cert-img` (e.g. `https://res.cloudinary.com/<cloud-name>/image/upload/v123/certificates/navttc-ai.jpg`). The site adds resizing and WebP/AVIF delivery automatically. Local files in `assets/certificates/` work too. Thumbnails and the "View all certificates" button appear automatically |
| **Credential links** | Put the verification URL (e.g. from LinkedIn's "Show credential") in the card's `data-cert-url` and a "Show credential" link appears |
| **Resume** | Replace `assets/Sidra-Resume.pdf` with a newer version (keep the filename), or point the "Download Resume" `href` to a Cloudinary or Google Drive link |
| **Project links** | Each project has `<!-- TODO -->` comments. Swap in repo URLs; for live demos, set the `href` and remove `data-demo-pending` |
| **Typing roles** | `data-roles` attribute on `#typed-text` in the hero |
| **Research status** | Update the `.paper-status` text in the Research section as the paper progresses (e.g. "Under review", "Accepted"), and link the preprint/dataset when released |
| **Profile code card** | Edit the plain text inside `#profile-code` in the hero. Highlighting, line numbers and the `Ln, Col` status are generated automatically |
| **Chatbot answers** | Edit the `INTENTS` list at the top of `chatbot.js`: each entry has `keys` (trigger words), an `answer` (HTML) and follow-up `chips`. Everything runs in the visitor's browser, so there are no API keys or costs |
| **Colours** | `:root` and `[data-theme="light"]` tokens at the top of `style.css` |
| **Social preview** | `assets/og-image.jpg` (1200×630) is the image shown when the link is shared on LinkedIn, WhatsApp, etc. If the site address changes, update the `og:url`, `og:image` and `canonical` tags in `<head>` |

## Deploy to Netlify

**Option A: Git (recommended)**

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/sidra3921/<repo-name>.git
git push -u origin main
```

In Netlify, choose **Add new site → Import an existing project**, pick the repo, leave the build command empty and set the publish directory to `.`, then click **Deploy**.

**Option B: Drag and drop.** Drag the project folder onto https://app.netlify.com/drop.

### Contact form (Netlify Forms)

The form already has `data-netlify="true"` and a honeypot spam trap. After your first deploy:

1. Open your site in Netlify and go to **Forms**, then click **Enable form detection**.
2. Redeploy once (**Deploys → Trigger deploy**) so Netlify registers the `contact` form.
3. Optionally, under **Forms → Form notifications**, add an email notification so submissions reach your inbox.

When the site is opened from disk or hosted somewhere other than Netlify, the form falls back to opening the visitor's email app with the message pre-filled.

---

© Sidra · Built with HTML/CSS/JS
