# 📱 M.I.R.A.S — Complete Build, Installation & Run Guide

This step-by-step guide walks you through running the application on your **laptop**, running it instantly on your **physical smartphone**, and compiling a standalone **Android APK** to install directly on your phone.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [How to Run on Laptop (Browser Mode)](#2-how-to-run-on-laptop-browser-mode)
3. [How to Run on Phone Instantly (Expo Go — No Build Needed)](#3-how-to-run-on-phone-instantly-expo-go--no-build-needed)
4. [How to Build Android APK via Cloud (EAS Build — Recommended)](#4-how-to-build-android-apk-via-cloud-eas-build--recommended)
5. [How to Build Android APK Locally (Gradle / Android SDK)](#5-how-to-build-android-apk-locally-gradle--android-sdk)
6. [How to Install the APK Directly on Your Phone](#6-how-to-install-the-apk-directly-on-your-phone)
7. [How to Run the Backend Multi-Agent Server](#7-how-to-run-the-backend-multi-agent-server)
8. [Troubleshooting & FAQ](#8-troubleshooting--faq)

---

## 1. Prerequisites

Ensure you have the following installed on your laptop:
- **Node.js** >= 18 (e.g. Node v20 or v24)
- **npm** (bundled with Node.js)
- A web browser (Google Chrome, Microsoft Edge, Brave, or Firefox)

Verify your installation in terminal:
```bash
node -v
npm -v
```

---

## 2. How to Run on Laptop (Browser Mode)

You can run the entire mobile app directly in your laptop's browser with zero mobile installation.

### Step 1: Open Terminal & Navigate to `mobile`
```bash
cd mobile
```

### Step 2: Install Web Dependencies (First Time Only)
```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

### Step 3: Start the Web Server
```bash
npm run web
```
*(Or `npx expo start --web`)*

Your browser will automatically open at:
```text
http://localhost:8081
```

### 💡 Pro Tip: Make It Look Like a Real Mobile Screen
To view the exact mobile phone layout on your laptop screen:
1. In your browser (Chrome/Edge/Brave), press **`F12`** (or right-click anywhere and click **Inspect**).
2. Press **`Ctrl + Shift + M`** (or click the **Mobile Device icon** in the top-left of the inspect window).
3. From the top dropdown, choose **iPhone 14 Pro**, **Pixel 7**, or **Samsung Galaxy**.
4. You can now test the voice assistant, typewriter header, signal waves, camera vision, and flight cards exactly like on a physical phone.

---

## 3. How to Run on Phone Instantly (Expo Go — No Build Needed)

If you want to test on your actual physical phone right now without waiting 10 minutes for an APK to build:

1. **Install Expo Go on your phone**:
   - **Android**: Install [Expo Go from Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
   - **iOS**: Install [Expo Go from Apple App Store](https://apps.apple.com/app/expo-go/id982107779).
2. **Connect phone and laptop to the same Wi-Fi network**.
3. **In your laptop terminal, run**:
   ```bash
   cd mobile
   npm start
   ```
4. **Scan the QR Code**:
   - On **Android**: Open the **Expo Go** app and tap **"Scan QR code"**. Point your camera at the terminal QR code.
   - On **iOS**: Open the native **Camera app**, point at the QR code, and tap the Expo notification.
5. The app will bundle and open on your phone in ~10 seconds with live hot-reloading!

---

## 4. How to Build Android APK via Cloud (EAS Build — Recommended)

This is the easiest and cleanest way to get a standalone `.apk` file. **You do NOT need Android Studio, Java, or NDK installed on your laptop.** Expo compiles it on their secure build servers.

### Step 1: Install EAS CLI
In your laptop terminal, install the Expo Application Services CLI globally:
```bash
npm install -g eas-cli
```

### Step 2: Log In to Expo
```bash
eas login
```
*(If you don't have an Expo account yet, create a free account at [expo.dev](https://expo.dev) or register directly in the terminal prompt).*

### Step 3: Start the APK Build
The project already includes a pre-configured `eas.json` for APK generation. Run:
```bash
cd mobile
eas build -p android --profile preview
```

### Step 4: Follow Terminal Prompts
- If prompted: *"Would you like to generate a new Android Keystore?"* $\rightarrow$ Select **Yes**.
- The build will be queued and compiled in the cloud (usually takes 5–8 minutes).
- Once finished, EAS will print a **direct `.apk` download URL** and display a **QR Code** in your terminal!

---

## 5. How to Build Android APK Locally (Gradle / Android SDK)

If you prefer building offline on your machine without cloud servers:

### Prerequisites:
- **Java Development Kit (JDK 17)** installed (`java -version`).
- **Android Studio** with Android SDK and command-line tools installed.
- Environment variables configured: `ANDROID_HOME` pointing to your Android SDK.

### Build Steps:
1. **Prebuild the native Android project**:
   ```bash
   cd mobile
   npx expo prebuild --platform android
   ```
2. **Compile the APK via Gradle**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   *(For an unsigned debug build, use `./gradlew assembleDebug`).*
3. **Locate your compiled APK**:
   ```text
   mobile/android/app/build/outputs/apk/release/app-release.apk
   ```

---

## 6. How to Install the APK Directly on Your Phone

Once your APK is built (from EAS Cloud or Gradle), install it using any of these methods:

### Method A: Direct Download via Phone Browser (Easiest)
1. Open your phone's browser or camera.
2. Scan the QR code or visit the download link generated by `eas build`.
3. Tap **Download `app-release.apk`**.
4. When download completes, tap the file in your notification bar or **Downloads** folder.
5. If Android shows a prompt saying *"For your security, your phone is not allowed to install unknown apps from this source"*:
   - Tap **Settings** on the prompt.
   - Toggle **"Allow from this source"** to **ON**.
   - Press **Back** and tap **Install**.
6. Tap **Open** to launch **M.I.R.A.S**!

### Method B: Install via USB Cable & ADB
If your laptop has Android platform-tools installed:
1. Enable **Developer Options** and **USB Debugging** on your phone (Settings $\rightarrow$ About Phone $\rightarrow$ tap *Build Number* 7 times $\rightarrow$ System $\rightarrow$ Developer options $\rightarrow$ USB Debugging).
2. Connect your phone to your laptop via USB cable.
3. In terminal, run:
   ```bash
   adb install mobile/android/app/build/outputs/apk/release/app-release.apk
   ```
4. The app will be installed directly on your home screen.

### Method C: Send via Cloud / Messaging
You can upload the `.apk` to **Google Drive**, send it to yourself via **WhatsApp / Telegram**, download it on your phone, and tap it to install.

---

## 7. How to Run the Backend Multi-Agent Server

The mobile client communicates with the autonomous LangGraph multi-agent backend:

### Step 1: Open Terminal in `backend`
```bash
cd backend
```

### Step 2: Create a Python Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure API Keys
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```
Key configuration values:
- `GEMINI_API_KEY`: Google Gemini API key.
- `LANGCHAIN_API_KEY`: (Optional) LangSmith tracing key.

### Step 5: Start the FastAPI Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API Documentation will be live at `http://localhost:8000/docs`.

---

## 8. Troubleshooting & FAQ

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| **Port 8081 is already in use** | Another Metro or Node process is running. | Run `npx kill-port 8081` or launch on another port: `npx expo start --port 8082`. |
| **Expo Go shows "Network response timed out"** | Phone and laptop are not on the same Wi-Fi network, or laptop firewall blocked port 8081. | Ensure both devices share the exact same Wi-Fi. Run `npm start -- --tunnel` to bypass local router firewall rules. |
| **Android blocks APK installation** | Google Play Protect or Android unknown sources restriction. | Tap **Settings** on the prompt and enable *"Allow from this source"*. On Play Protect warning, tap *"More details"* $\rightarrow$ *"Install anyway"*. |
| **Microphone permission denied** | Browser or phone blocked audio input. | In browser, click the lock icon in the URL bar and set **Microphone** to **Allow**. On mobile, tap **Allow** when prompted for mic permissions. |
| **EAS login fails** | No active Expo CLI session. | Run `npx eas-cli login` and enter your Expo account credentials. |
