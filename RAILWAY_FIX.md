# 🔧 Railway Deployment - Troubleshooting Guide

## Issue: .NET Restore Failing on Railway

### ✅ **SOLUTION - Files Created**

I've created the following files to fix the Railway .NET 9 deployment issue:

1. **`server/nixpacks.toml`** - Tells Railway to use .NET SDK 9
2. **`server/.railwayignore`** - Excludes build artifacts
3. **Updated `server/railway.json`** - Explicit build/start commands

---

## 🚀 How to Deploy to Railway (Updated)

### Step 1: Push These New Files to GitHub

```bash
git add .
git commit -m "fix: add Railway nixpacks config for .NET 9"
git push origin main
```

### Step 2: Railway Deployment Options

#### **Option A: Using Railway CLI (Recommended)**

1. **Install Railway CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://railway.app/install.ps1 | iex
   ```

2. **Login and Deploy**
   ```bash
   # Navigate to server folder
   cd server
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   
   # Add PostgreSQL
   railway add
   # Select "PostgreSQL" from the menu
   
   # Deploy
   railway up
   
   # Get your URL
   railway domain
   ```

#### **Option B: Using Railway Dashboard**

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your PlanCrick repository

2. **Configure Service**
   - Railway will create a service automatically
   - Click on the service
   - Go to **Settings** tab:
     - **Root Directory**: `server`
     - **Watch Paths**: `server/**`
   
3. **Add PostgreSQL Database**
   - In your project dashboard, click "+ New"
   - Select "Database" → "Add PostgreSQL"
   - Railway will auto-link it to your service

4. **Set Environment Variables**
   - Click on your backend service
   - Go to **Variables** tab
   - Add these variables:
     ```
     ASPNETCORE_ENVIRONMENT=Production
     CORS_ORIGINS=http://localhost:5173
     ```
   - **Note**: `DATABASE_URL` is automatically provided by Railway

5. **Generate Domain**
   - Go to **Settings** tab
   - Scroll to **Networking**
   - Click **"Generate Domain"**
   - Copy your backend URL (e.g., `https://plancrick-backend.up.railway.app`)

6. **Update CORS**
   - After deploying frontend, come back and update `CORS_ORIGINS`:
     ```
     CORS_ORIGINS=https://your-frontend.vercel.app
     ```

---

## 🔍 Verify Railway Configuration

### Check These Files Exist in Your Repo:

- ✅ `server/nixpacks.toml` - .NET 9 SDK configuration
- ✅ `server/railway.json` - Build commands
- ✅ `server/.railwayignore` - Ignore build artifacts
- ✅ `server/PlanCrick.Backend.csproj` - .NET 9 project file

### Verify .NET Version

Your `PlanCrick.Backend.csproj` should have:
```xml
<TargetFramework>net9.0</TargetFramework>
```

✅ **Confirmed**: Your project uses .NET 9.0

---

## 🐛 Common Railway Errors & Fixes

### Error 1: "dotnet restore failed with exit code: 1"

**Cause**: Missing `nixpacks.toml` or wrong .NET SDK version

**Fix**: 
- ✅ Created `server/nixpacks.toml` with `dotnet-sdk_9`
- Push to GitHub and redeploy

### Error 2: "Could not find project file"

**Cause**: Root directory not set correctly

**Fix**:
1. Railway Dashboard → Service → Settings
2. Set **Root Directory**: `server`
3. Set **Watch Paths**: `server/**`

### Error 3: "Connection string error"

**Cause**: Railway's `DATABASE_URL` not being read

**Fix**:
Update `server/Program.cs` to handle both connection string formats:

```csharp
// Add this before builder.Services.AddDbContext
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
if (!string.IsNullOrEmpty(connectionString))
{
    // Railway provides DATABASE_URL in different format
    // Convert postgresql:// to Npgsql format if needed
    if (connectionString.StartsWith("postgresql://"))
    {
        var uri = new Uri(connectionString);
        connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.Trim('/')};Username={uri.UserInfo.Split(':')[0]};Password={uri.UserInfo.Split(':')[1]};SSL Mode=Require;Trust Server Certificate=true";
    }
    builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;
}
```

### Error 4: "Port binding error"

**Cause**: Not using Railway's PORT environment variable

**Fix**: 
- ✅ Already fixed in `Program.cs`:
  ```csharp
  var port = Environment.GetEnvironmentVariable("PORT") ?? "5017";
  app.Run($"http://0.0.0.0:{port}");
  ```

### Error 5: "Migration failed"

**Cause**: Auto-migration running but database not connected

**Fix**:
1. Check Railway logs for connection errors
2. Verify PostgreSQL service is linked
3. Check environment variables are set

---

## 📝 Railway Deployment Checklist

- [ ] `server/nixpacks.toml` exists
- [ ] `server/railway.json` has build commands
- [ ] `server/.railwayignore` exists
- [ ] Code pushed to GitHub
- [ ] PostgreSQL database added in Railway
- [ ] Root directory set to `server`
- [ ] Environment variables configured
- [ ] Domain generated
- [ ] CORS updated with frontend URL
- [ ] `/health` endpoint returns 200

---

## 🧪 Test Your Deployment

### 1. Check Health Endpoint
```bash
curl https://your-backend.railway.app/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-04T11:30:00.000Z"
}
```

### 2. Check Players API
```bash
curl https://your-backend.railway.app/api/players
```

**Expected Response**:
```json
[]
```
or a list of players if database has data

### 3. Check Railway Logs
```bash
# Using Railway CLI
railway logs
```

Or view in Dashboard → Service → Logs

---

## 🎯 Alternative: Deploy to Render Instead

If Railway continues to have issues, you can use Render:

### Render Configuration

Create `server/render.yaml`:
```yaml
services:
  - type: web
    name: plancrick-backend
    env: dotnet
    buildCommand: dotnet restore && dotnet publish -c Release -o out
    startCommand: dotnet out/PlanCrick.Backend.dll
    envVars:
      - key: ASPNETCORE_ENVIRONMENT
        value: Production
      - key: CORS_ORIGINS
        sync: false
      - key: DATABASE_URL
        fromDatabase:
          name: plancrick-db
          property: connectionString

databases:
  - name: plancrick-db
    plan: free
```

---

## 💡 Quick Tips

1. **Railway auto-detects .NET** when it finds `.csproj` files
2. **nixpacks.toml** overrides Railway's auto-detection
3. **DATABASE_URL** is automatically provided by Railway's PostgreSQL
4. **Logs are your friend** - always check them first
5. **Redeploy** after any configuration change

---

## 📞 Still Stuck?

1. **Check Railway Status**: [status.railway.app](https://status.railway.app)
2. **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
3. **Railway Docs**: [docs.railway.app](https://docs.railway.app)

---

**Summary**: Your Railway configuration is now fixed! Push to GitHub and redeploy. 🚀
