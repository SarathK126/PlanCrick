# 🚀 Quick Start Checklist

Use this checklist to deploy PlanCrick to production.

## ✅ Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] PostgreSQL migration tested locally
- [ ] Frontend builds successfully (`cd client && npm run build`)
- [ ] Backend builds successfully (`cd server && dotnet build`)

## 📝 Deployment Steps

### 1️⃣ Backend Deployment (Railway)

- [ ] Sign up at [railway.app](https://railway.app)
- [ ] Create new PostgreSQL database
- [ ] Deploy backend from GitHub repo
- [ ] Set root directory to `server`
- [ ] Add environment variables:
  - [ ] `ASPNETCORE_ENVIRONMENT=Production`
  - [ ] `CORS_ORIGINS=https://your-vercel-url.vercel.app`
- [ ] Generate domain and copy URL
- [ ] Test backend: `https://your-backend.railway.app/health`

### 2️⃣ Frontend Deployment (Vercel)

- [ ] Sign up at [vercel.com](https://vercel.com)
- [ ] Import PlanCrick repository
- [ ] Set root directory to `client`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL=https://your-backend.railway.app`
- [ ] Deploy and copy URL
- [ ] Test frontend: `https://your-app.vercel.app`

### 3️⃣ Final Configuration

- [ ] Update backend `CORS_ORIGINS` with Vercel URL
- [ ] Redeploy backend
- [ ] Test full flow:
  - [ ] Add a player
  - [ ] Create a fielding plan
  - [ ] Save plan
  - [ ] Reload page and verify plan loads

## 🎉 Done!

Your app is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`

## 📚 Links

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)

---

**Estimated Time**: 15-20 minutes  
**Cost**: $0.00 (FREE tier)
