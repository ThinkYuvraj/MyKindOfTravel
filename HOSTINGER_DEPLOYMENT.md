# 🚀 Hostinger Deployment Guide — My Kind of Travel

This guide provides step-by-step instructions to deploy the **My Kind of Travel** web application on **Hostinger** (hPanel Node.js App Manager, Shared Hosting, or Hostinger VPS).

---

## 📁 Architecture Overview

- **Frontend**: React 19 + Vite SPA (Client UI, Google Maps, Admin Dashboard)
- **Backend**: Express Node.js Server (`backend/src/server.ts`)
- **Environment Management**: Backend `.env` configuration for API keys and Admin Credentials.
- **Production Build**: Single command `npm run build` generates a unified production output in `dist/`.

---

## 🛠️ Deployment Option 1: Hostinger hPanel Node.js Web App (Recommended)

### Step 1: Upload Files
1. Zip your project folder (exclude `node_modules` and `.git`).
2. Log in to **Hostinger hPanel** ➔ Go to **File Manager**.
3. Upload and extract your project files into `public_html` (or your domain directory).

### Step 2: Configure Node.js Web App in Hostinger hPanel
1. In hPanel, search for **Setup Node.js App**.
2. Click **Create Application**.
3. Set the following fields:
   - **Node.js Version**: Select **18.x** or **20.x** (or highest available).
   - **Application Mode**: `Production`
   - **Application Root**: `public_html` (or project subfolder)
   - **Application URL**: `https://yourdomain.com`
   - **Application Startup File**: `dist/server.js` (or `server.ts` if using tsx)
4. Click **Create**.

### Step 3: Configure Environment Variables (`.env`)
1. Open the File Manager and edit `.env` in the root folder (or `backend/.env`).
2. Add your live environment keys:
   ```env
   PORT=3000
   NODE_ENV=production
   ADMIN_EMAIL=your_admin_email@domain.com
   ADMIN_PASSWORD=YourSecurePassword123!
   GOOGLE_MAPS_API_KEY=AIzaSy...
   GEMINI_API_KEY=AIzaSy...
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=marketing2glue@gmail.com
   SMTP_PASS=znmx pweu zfmt osnq
   ```

### Step 4: Run NPM Install & Build
1. In hPanel Node.js app dashboard, click **Run NPM Install**.
2. Run build command or execute in SSH terminal:
   ```bash
   npm run build
   ```
3. Click **Restart Application**.

---

## 🌐 Deployment Option 2: Hostinger Shared Hosting (Static + Node Proxy)

If using Hostinger Shared Web Hosting without Node.js root execution:
1. Run `npm run build` on your local machine.
2. Upload contents of `dist/` directly into `public_html`.
3. Ensure `.htaccess` (included in repository) is present in `public_html` to handle React Router client-side page refreshes.

---

## 🖥️ Deployment Option 3: Hostinger VPS (Ubuntu + PM2 + Nginx)

If deploying on a Hostinger VPS:
1. SSH into your VPS: `ssh root@YOUR_HOSTINGER_IP`
2. Clone repository & install dependencies:
   ```bash
   git clone <repo-url> /var/www/mykindoftravel
   cd /var/www/mykindoftravel
   npm install
   npm run build
   ```
3. Start application with PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name "mykindoftravel"
   pm2 save
   pm2 startup
   ```
4. Configure Nginx Reverse Proxy:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔒 Security & Best Practices

1. **Never commit `.env` with live production passwords to public GitHub repositories.**
2. **Back up CMS Data**: Your admin CMS content is stored safely in `cms-data.json`, `cms-credentials.json`, and `inquiries.json`.
3. **Hero Videos**: Video uploads are saved to `/public/hero-video.mp4` and served continuously on infinite loop without controls.

---

## 📞 Support & Maintenance
For assistance with domain mapping or SSL activation, refer to Hostinger Knowledge Base or your server admin.
