# 📦 NVAlert

[🇬🇧 English](README.md) | [🇺🇦 Українська](README.uk.md)

**NVAlert** is an unofficial, fast, and convenient browser extension for tracking "Nova Poshta" parcels. Get Push notifications about your shipment status changes directly in your browser (Chrome, Firefox, Edge, Brave), without needing to constantly check the website.

## ✨ Key Features

- **Automatic Tracking:** Add your tracking number (TTN) once, and the extension will automatically check its status in the background.
- **Push Notifications:** Instant system notifications when your parcel's status changes (e.g., "Arrived at the branch").
- **Movement History (Timeline):** Unlike the standard API, the extension keeps a local history of all passed parcel statuses, creating a convenient visual route.
- **API Integration:** Connect your personal "Nova Poshta" API key to get extended information (delivery cost, exact route, weight, estimated arrival date).
- **Local Storage:** All your data (TTNs, history, API keys) is stored exclusively locally in your browser.
- **Multilingual:** Supports both Ukrainian and English languages.

## 🚀 Installation

### From a Ready Archive (Sideloading / Developer Mode)
1. Download the latest `nvalert.zip` archive from the [Releases](https://github.com/savrius-sys/NVAlert/releases) section (or build it yourself).
2. Extract the archive to a convenient folder.
3. **For Chrome / Edge / Brave:**
   - Open the extensions management page (`chrome://extensions/`).
   - Enable **"Developer mode"** in the top right corner.
   - Click **"Load unpacked"** and select the extracted `dist` folder.
4. **For Firefox:**
   - Open the `about:debugging#/runtime/this-firefox` page.
   - Click **"Load Temporary Add-on..."**.
   - Select the `manifest.json` file from the `dist` folder.

## 🛠 Building from Source

The project is built on a modern stack: **React + TypeScript + Vite + Lucide React**.

### Requirements:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (package manager)

### Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/savrius-sys/NVAlert.git
   cd NVAlert
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the local development server (opens as a regular web page):
   ```bash
   pnpm dev
   ```

4. Build the ready extension (files will appear in the `dist` folder):
   ```bash
   pnpm build
   ```

## 🔒 Privacy

The extension does not collect telemetry or send your data to third-party servers. All requests go exclusively from your browser directly to the official public `api.novaposhta.ua` servers.

## 📄 License

This project is distributed under the MIT License. You are free to use, modify, and distribute it.

---

*This development is not affiliated with "Nova Poshta" LLC. All rights to trademarks belong to their respective owners.*
