# Studio Shutter Half — Quotation Generator

A **multi-step quotation generator** built for **Studio Shutter Half**, a photography and cinematography studio. It replaces manual PDF editing with a guided 6-step web form that produces a ready-to-download professional quotation PDF and optionally logs the data to Google Sheets.

---

## Purpose

Creating custom quotations for wedding and event photography packages is time-consuming when done manually. This tool streamlines the entire process:

- **Guided form** – Enter client details, event days, services, post-production, and pricing step by step.
- **Live A4 preview** – See exactly what the quotation will look like before downloading.
- **One-click PDF** – Generate a complete, branded quotation PDF merged with pre-designed cover and closing pages.
- **Auto-logging** – Optionally store every quotation in Google Sheets for record-keeping and reporting.

---

## Benefits

| Benefit | Detail |
|---|---|
| **Time savings** | Quotations that used to take 10-15 minutes can be created in under 2 minutes |
| **Consistency** | All quotations follow the same branded layout with no formatting errors |
| **Professional output** | High-quality PDF with cover page, services breakdown, pricing, and terms |
| **Data tracking** | Every quotation can be automatically logged to Google Sheets for business analytics |
| **Mobile-friendly** | Responsive form works on phones, tablets, and desktops |
| **No software install** | Runs entirely in the browser — no Word, Excel, or PDF editor needed |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript 6 |
| **Build tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 |
| **State management** | Zustand 5 |
| **Icons** | Lucide React |
| **PDF generation** | html2canvas + jsPDF + pdf-lib |
| **Sheet integration** | Google Apps Script webhook |
| **Deployment** | GitHub Pages (via GitHub Actions) |

---

## How It Works

The application is a **6-step wizard**. Each step collects specific information, and the final step shows a live preview before downloading.

### Step 0 — Client Details
Enter the client's name, contact number, venue, location, and event dates. All fields are free-text inputs with a clean two-column layout.

### Step 1 — Event Days
Add one or more event days (e.g., Day 1, Haldi, Wedding, Reception). Each day can be renamed or removed. Quick preset buttons let you add common day labels instantly.

### Step 2 — Services
For each event day, select from 9 available services and set quantities:

| Service | Category |
|---|---|
| Cinematographer | Video |
| Candid Photographer | Photo |
| Ritual Photographer | Photo |
| Ritual Videographer | Video |
| Drone | Equipment |
| Live Setup | Equipment |
| FPV Drone | Equipment |
| Family Photographer | Photo |
| Family Videographer | Video |

### Step 3 — Post Production
Select post-production deliverables and optionally provide an approximate value for each:

- Insta Reels (30/40 seconds)
- Cinematic Teaser (50 seconds)
- Cinematic Highlight (5/6 minutes)
- Cinematic Short Film (15/20 minutes)
- Traditional Film (1/2 hours)
- Edited Photos (Master data / Collectives)
- Same Day Highlight (2/3 minutes)
- All Raw Data Given

### Step 4 — Pricing
Enter the total package cost. This is displayed prominently on the final quotation page.

### Step 5 — Preview & Download
A live A4-sized preview shows the complete quotation with:
- Client information page
- Pre Production page (services grouped by event day)
- Post Production page (deliverables + total package cost)

The preview auto-scales to fit any screen width. A single "Download PDF" button generates the final document and optionally submits the data to Google Sheets simultaneously.

---

## PDF Generation Pipeline

```
[data-preview-page] elements
        │
        ▼
  html2canvas (2x scale)
        │
        ▼
  Crop to target aspect ratio
        │
        ▼
  Insert into jsPDF as JPEG
        │
        ▼
  pdf-lib merge:
    quotation-start.pdf + middle pages + quotation-end.pdf
        │
        ▼
  Download: Quotation_StudioShutterHalf - {ClientName}.pdf
```

The **quotation-start.pdf** contains pre-designed cover and introductory pages, while **quotation-end.pdf** contains terms, conditions, and closing pages. The middle pages (client info, services, pricing) are rendered dynamically from the form data.

---

## Google Sheets Integration

When the user clicks Download, the quotation data is sent to a Google Apps Script webhook which appends a row to a Google Sheet with these columns:

| Column | Data |
|---|---|
| Timestamp | Auto-generated |
| Client Name | From Step 0 |
| Contact | From Step 0 |
| Venue | From Step 0 |
| Location | From Step 0 |
| Event Dates | From Step 0 |
| Services | Formatted as `DayLabel: Service1(x1) \| Day2: Service2(x2)` |
| Post Production | Formatted as `Item ~value unit` |
| Package Cost | From Step 4 |

### Setup

1. Open the Google Sheet linked in `google-apps-script.gs`
2. Go to Extensions → Apps Script
3. Paste the contents of `google-apps-script.gs`
4. Deploy as a web app (Execute as: Me, Who has access: Anyone)
5. Copy the deployment URL and update `SHEET_WEBHOOK_URL` in `src/utils/submitToSheet.ts`

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/jayneel-pandya/shutterhalf-quotation.git
cd shutterhalf-quotation
npm install
```

### Development

```bash
npm run dev
```

Runs the Vite dev server with hot module replacement at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Runs TypeScript type checking (`tsc -b`) followed by a Vite production build. Output is written to `dist/`.

### Lint

```bash
npm run lint
```

---

## Project Structure

```
shutterhalf-quotation/
├── public/                          # Static assets (copied to dist)
│   ├── favicon.svg                  # Browser tab icon
│   ├── logo.svg / logo.png          # Studio logo
│   ├── blank-photo.jpeg             # Preview page background
│   ├── blank-page.pdf               # Blank PDF fallback
│   ├── quotation-start.pdf          # Pre-designed cover pages
│   ├── quotation-end.pdf            # Pre-designed closing pages
│   └── 404.html                     # GitHub Pages SPA fallback
├── src/
│   ├── main.tsx                     # React entry point
│   ├── App.tsx                      # Root component (wizard orchestrator)
│   ├── index.css                    # Tailwind directives + preview styles
│   ├── store/
│   │   └── useQuotationStore.ts     # Zustand store (all form state)
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── constants/
│   │   └── services.ts              # Available services, post-prod items
│   ├── utils/
│   │   ├── baseUrl.ts               # BASE_URL helper for asset paths
│   │   ├── pdfGenerator.ts          # HTML → canvas → PDF pipeline
│   │   └── submitToSheet.ts         # Google Sheets webhook client
│   ├── components/
│   │   ├── ClientInfoForm.tsx        # Step 0
│   │   ├── DayBuilder.tsx            # Step 1
│   │   ├── ServiceSelector.tsx       # Step 2
│   │   ├── PostProductionSection.tsx # Step 3
│   │   ├── PackagePricing.tsx        # Step 4
│   │   ├── PreviewPanel.tsx          # Step 5 (preview + download)
│   │   ├── StepIndicator.tsx         # Progress bar
│   │   ├── DownloadButton.tsx        # Download trigger
│   │   ├── preview/
│   │   │   ├── PageNumberContext.tsx  # Auto page numbering
│   │   │   ├── PreviewCover.tsx      # Cover page (available, not in current flow)
│   │   │   ├── PreviewClientInfo.tsx # Client details page
│   │   │   ├── PreviewDayServices.tsx# Pre Production page
│   │   │   ├── PreviewPostProduction.tsx    # Post-prod page (available, not in current flow)
│   │   │   ├── PreviewPricing.tsx           # Pricing page (available, not in current flow)
│   │   │   ├── PreviewPostProductionPricing.tsx # Post Production + pricing page
│   │   │   ├── PreviewThankYou.tsx          # Thank you page (available, not in current flow)
│   │   │   └── PreviewTerms.tsx             # Terms page (available, not in current flow)
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Checkbox.tsx
│   │       ├── Input.tsx
│   │       └── Badge.tsx
├── google-apps-script.gs            # Apps Script for sheet logging
├── .github/workflows/
│   └── deploy-pages.yml             # CI/CD to GitHub Pages
├── tailwind.config.js               # Theme (brand/ink colors, fonts)
├── vite.config.ts                   # Vite config (base path)
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── eslint.config.js
```

---

## Deployment

The project is deployed to **GitHub Pages** automatically via GitHub Actions.

### Automatic (CI/CD)

Every push to the `main` branch triggers the workflow in `.github/workflows/deploy-pages.yml`:

1. Checkout code
2. Install dependencies (`npm ci`)
3. Build (`npm run build`)
4. Upload `dist/` as a Pages artifact
5. Deploy to GitHub Pages

The live site is available at:

```
https://jayneel-pandya.github.io/shutterhalf-quotation/
```

### Manual

```bash
npm run build
npm run deploy
```

Uses the `gh-pages` package to push `dist/` to the `gh-pages` branch.

---

## Customization

### Services & Post-Production Items

Edit `src/constants/services.ts` to add, remove, or modify available services, post-production items, day label presets, and step labels.

### Colors & Fonts

Edit `tailwind.config.js` to change the `brand`, `ink` color palettes or the `display` / `body` font families.

### PDF Templates

Replace the following files in `public/` to customize the quotation bookends:
- `quotation-start.pdf` — Cover and introductory pages
- `quotation-end.pdf` — Terms and closing pages

### Preview Pages

Individual preview page components are in `src/components/preview/`. You can add or remove pages from the final quotation by editing `PreviewPanel.tsx` where the `PageProvider` wraps the preview components.

---

## License

Private project — Studio Shutter Half.
