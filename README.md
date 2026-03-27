# Konekt by Sankofa

> **Clarity Before You Ride** — Rwanda's first guaranteed fixed-fare transport platform.

Live demo: [sankofa-connect-mvp.vercel.app](https://sankofa-connect-mvp.vercel.app)

---

## 📁 Project Structure

```
konekt-app/
├── index.html      # Main HTML — all screens
├── styles.css      # All CSS styles
├── app.js          # All JavaScript logic
├── vercel.json     # Vercel deployment config
└── README.md       # This file
```

---

## 🚀 Deploy to Vercel (3 ways)

### Option 1 — Vercel CLI (fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# From inside the konekt-app folder
cd konekt-app
vercel

# Follow the prompts:
# - Set up and deploy: Y
# - Which scope: your account
# - Link to existing project: N
# - Project name: konekt-app (or anything you like)
# - Directory: ./ (current)
# - Override settings: N

# Your app is live! Vercel gives you a URL like:
# https://konekt-app-xxxx.vercel.app
```

### Option 2 — GitHub + Vercel Dashboard

1. Create a new GitHub repository
2. Push all files in this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial deploy"
   git remote add origin https://github.com/YOUR_USERNAME/konekt-app.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) → New Project
4. Import your GitHub repository
5. Click **Deploy** — done in 30 seconds

### Option 3 — Drag and Drop (no account needed for preview)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag the entire `konekt-app` folder onto the page
3. Vercel deploys it instantly

---

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| **Splash** | Brand intro, language toggle (English / Kinyarwanda), stats |
| **Home** | Quick destinations, KRC Silver Champion card, recent rides |
| **Booking Step 1** | Route selection, GPS auto-detect, vehicle picker (Moto / Bus) |
| **Booking Step 2** | Transparent fare breakdown (500 + 150/km + modifier) |
| **Booking Step 3** | Verified driver profile, Share Trip button |
| **Payment** | MTN MoMo, Airtel Money, Cash |
| **Tracking** | Animated live map, dual ETA, emergency button |
| **Success** | Trip receipt, Clarity Points earned, star rating |
| **Profile** | KRC stats, savings vs haggling, settings |

---

## 🎨 Brand

- **Primary colour:** #0D4F8A (deep navy)
- **Secondary colour:** #2EAB5F (emerald green)
- **Fonts:** Sora (headings), DM Sans (body)
- **Tagline:** *Clarity Before You Ride*

---

## 🛠 Tech Stack

Pure HTML + CSS + JavaScript. No framework, no build step, no dependencies.
Works on all modern browsers. Mobile-first responsive design.

---

## 👥 Team

- Ndayishimiye Olivier — Strategy & Operations
- Nuake Justice Tsekpo — Technology & Product
- Tiana Ogol — Marketing & Community

**African Leadership University · IBT · Term 2, 2026**
