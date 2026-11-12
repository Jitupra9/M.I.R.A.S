# 📱 M.I.R.A.S — Complete Build, Installation & Run Guide

This guide provides the exact commands to run the application on your **phone**, run it in the **browser**, and build an installable standalone **Android APK** using Expo and EAS.

---

## 📋 Table of Contents
1. [Method 1: Run Instantly on Phone (Expo Go — No Build Required)](#1-method-1-run-instantly-on-phone-expo-go--no-build-required)
2. [Method 2: Build & Install Standalone Android APK (.apk) with EAS](#2-method-2-build--install-standalone-android-apk-apk-with-eas)
3. [Method 3: Direct USB Cable Installation (ADB)](#3-method-3-direct-usb-cable-installation-adb)
4. [Method 4: Run in Laptop Browser (Web Mode)](#4-method-4-run-in-laptop-browser-web-mode)
5. [Method 5: Run the Backend Multi-Agent Server](#5-method-5-run-the-backend-multi-agent-server)
6. [Troubleshooting & Handy Commands](#6-troubleshooting--handy-commands)

---

## 1. Method 1: Run Instantly on Phone (Expo Go — No Build Required)

This is the fastest way to test and interact with the application directly on your physical smartphone with live hot-reloading.

### Step 1: Install Expo Go on your Phone
- **Android**: Install [Expo Go from Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
- **iOS / iPhone**: Install [Expo Go from Apple App Store](https://apps.apple.com/app/expo-go/id982107779).

### Step 2: Start Expo Development Server
Open your terminal and navigate to the `mobile` directory:
```bash
cd mobile
npx expo start
```

> 💡 **Tunnel Mode (Recommended if phone and laptop are on different Wi-Fi / Hotspot):**
> ```bash
> npx expo start --tunnel
> ```

### Step 3: Scan QR Code on your Phone
- **Android**: Open the **Expo Go** app, tap **"Scan QR code"**, and scan the QR code printed in the terminal.
- **iOS**: Open the native **Camera** app, scan the terminal QR code, and tap the prompt to open in Expo Go.

---

## 2. Method 2: Build & Install Standalone Android APK (.apk) with EAS

This method builds a complete, independent `.apk` file in the Expo cloud that can be installed directly on any Android device without needing the Expo Go app.

### Step 1: Install EAS CLI Globally
```bash
npm install -g eas-cli
```

### Step 2: Log In to Your Expo Account
```bash
npx eas login
```
*(If you do not have an account, create a free one at [expo.dev](https://expo.dev) or register directly in the terminal prompt).*

### Step 3: Configure EAS Build for the Project
```bash
cd mobile
npx eas build:configure
```
- Select **Android** when prompted.

### Step 4: Build the Standalone Android APK
```bash
npx eas build -p android --profile preview
```

- When prompted *"Would you like to generate a new Android Keystore?"*, select **Yes**.
- Expo will build the APK in the cloud.
- Once completed, EAS will provide a **direct download URL** and a **QR Code** in your terminal.

### Step 5: Install APK on Android Phone
1. Open the download link on your phone (or scan the terminal QR code).
2. Download the `.apk` file (e.g. `app-preview.apk`).
3. Tap on the downloaded file to install.
4. If Android displays *"For your security, your phone is not allowed to install unknown apps from this source"*:
   - Tap **Settings**.
   - Toggle **"Allow from this source"** to **ON**.
   - Press **Back** and tap **Install**.
5. Tap **Open** to launch **M.I.R.A.S**!

---

## 3. Method 3: Direct USB Cable Installation (ADB)

If your Android phone is connected to your computer via USB with **USB Debugging** enabled:

```bash
cd mobile
npx expo run:android
```

Or to install an already downloaded `.apk` via ADB:
```bash
adb install /path/to/downloaded-app.apk
```

---

## 4. Method 4: Run in Laptop Browser (Web Mode)

To run the mobile app directly inside your computer browser:

```bash
cd mobile
npm run web
```
*(Or `npx expo start --web`)*

Open your browser at:
```text
http://localhost:8081
```

> 📱 **View as a Mobile Phone**: Press `F12` in Chrome/Edge $\rightarrow$ Press `Ctrl + Shift + M` to toggle device mode $\rightarrow$ Select **Pixel 7** or **iPhone 14 Pro**.

---

## 5. Method 5: Run the Backend Multi-Agent Server

The mobile app connects to the FastAPI backend with Gemini multi-agent workflows:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # Add your GEMINI_API_KEY
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Interactive API documentation will be available at:
```text
http://localhost:8000/docs
```

---

## 6. Troubleshooting & Handy Commands

| Command | Purpose |
| :--- | :--- |
| `npx expo start -c` | Start Expo and clear Metro bundler cache |
| `npx expo start --tunnel` | Connect phone and computer across different networks |
| `npx eas build:list` | View status and download links of recent EAS builds |
| `npx eas credentials` | Manage Android keystores and signing certificates |
| `npx kill-port 8081` | Kill any process blocking default Expo port 8081 |
| `npm run android` | Launch app directly on connected Android device/emulator |
