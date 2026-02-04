# 🚀 PlanCrick - Free Deployment Guide

Complete guide to deploy **PlanCrick** for **FREE** using **Vercel** (Frontend) + **Railway/Render** (Backend + Database).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Railway - Recommended)](#backend-deployment-railway)
3. [Alternative: Backend Deployment (Render)](#alternative-backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [x] GitHub account
- [x] Push your code to GitHub repository
- [x] Railway/Render account (free tier)
- [x] Vercel account (free tier)

---

## 🎯 Backend Deployment (Railway)

### Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app/)
2. Click **"Start a New Project"**
3. Sign in with GitHub

### Step 2: Create PostgreSQL Database

1. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will create a PostgreSQL instance
3. Copy the **`DATABASE_URL`** (it will be auto-injected)

### Step 3: Deploy Backend

1. In Railway, click **"+ New"** → **"GitHub Repo"**
2. Select your `PlanCrick` repository
3. Railway will detect it's a .NET project

### Step 4: Configure Backend Service

1. Click on your backend service
2. Go to **"Settings"** tab:
   - **Root Directory**: `server`
   - **Build Command**: `dotnet publish -c Release -o out`
   - **Start Command**: `dotnet out/PlanCrick.Backend.dll`

3. Go to **"Variables"** tab and add:
   ```bash
   ASPNETCORE_ENVIRONMENT=Production
   CORS_ORIGINS=https://your-app.vercel.app
   ```
   
   **Note**: Railway automatically provides `DATABASE_URL` which our app uses

4. Click **"Deploy"** 

### Step 5: Get Backend URL

1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy your backend URL (e.g., `https://plancrick-backend.up.railway.app`)

---

## 🔄 Alternative: Backend Deployment (Render)

### Step 1: Sign Up for Render

1. Go to [render.com](https://render.com/)
2. Sign in with GitHub

### Step 2: Create PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Fill in:
   - **Name**: `plancrick-db`
   - **Database**: `plancrick`
   - **User**: (auto-generated)
   - **Region**: Choose closest to you
   - **Plan**: **Free**
3. Click **"Create Database"**
4. Copy the **Internal Database URL**

### Step 3: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Fill in:
   - **Name**: `plancrick-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Docker` or `.NET`
   - **Build Command**: `dotnet publish -c Release -o out`
   - **Start Command**: `dotnet out/PlanCrick.Backend.dll`
   - **Plan**: **Free**

4. Add **Environment Variables**:
   ```bash
   ASPNETCORE_ENVIRONMENT=Production
   ConnectionStrings__DefaultConnection=<your-postgres-internal-url>
   CORS_ORIGINS=https://your-app.vercel.app
   ```

5. Click **"Create Web Service"**
6. Copy your backend URL (e.g., `https://plancrick-backend.onrender.com`)

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com/)
2. Sign in with GitHub

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your `PlanCrick` repository
3. Vercel will auto-detect it's a Vite project

### Step 3: Configure Frontend

1. **Root Directory**: `client`
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Step 4: Add Environment Variables

1. Go to **"Environment Variables"** section
2. Add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   Replace with your Railway/Render backend URL from previous steps

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Copy your frontend URL (e.g., `https://plancrick.vercel.app`)

### Step 6: Update Backend CORS

1. Go back to your **Railway/Render** backend
2. Update **`CORS_ORIGINS`** environment variable:
   ```bash
   CORS_ORIGINS=https://plancrick.vercel.app
   ```
3. Redeploy backend

---

## ✅ Post-Deployment

### Test Your App

1. Visit your Vercel URL: `https://plancrick.vercel.app`
2. Test these features:
   - [ ] Add players
   - [ ] Create fielding plans
   - [ ] Save and load plans
   - [ ] Dashboard view

### Custom Domain (Optional)

**Vercel:**
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

**Railway:**
1. Go to **Settings** → **Networking**
2. Add custom domain
3. Update DNS records

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: 500 Internal Server Error

**Solution**:
```bash
# Check Railway/Render logs
# Ensure DATABASE_URL is set correctly
# Verify CORS_ORIGINS includes your Vercel URL
```

**Problem**: Database connection failed

**Solution**:
```bash
# Railway: DATABASE_URL is auto-injected
# Render: Check ConnectionStrings__DefaultConnection format:
# Host=<host>;Database=<db>;Username=<user>;Password=<pass>
```

### Frontend Issues

**Problem**: API calls fail (CORS error)

**Solution**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Ensure `CORS_ORIGINS` in backend includes your Vercel URL
3. Redeploy both frontend and backend

**Problem**: Blank page after deployment

**Solution**:
1. Check browser console for errors
2. Verify build completed successfully
3. Check Vercel build logs

### Migration Issues

**Problem**: Database tables not created

**Solution**:
```bash
# The app auto-runs migrations in production
# Check backend logs to verify migration ran
# Manually run migrations if needed:
# In Railway/Render shell:
cd server
dotnet ef database update
```

---

## 🎉 Success!

Your PlanCrick app is now live and FREE!

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **Database**: PostgreSQL (Managed by Railway/Render)

### Free Tier Limits

**Vercel:**
- Unlimited bandwidth
- 100 GB-hours/month

**Railway:**
- $5 free credit/month
- ~500 hours/month execution time

**Render:**
- 750 hours/month
- Spins down after 15 min inactivity

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 🤝 Need Help?

- Check logs in Railway/Render dashboard
- Check deployment logs in Vercel
- Test API endpoints using `/health` endpoint
- Verify environment variables are set correctly

Made with ❤️ by PlanCrick Team
