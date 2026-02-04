# Git Commit and Push Script for Deployment Setup

Write-Host "🚀 PlanCrick - Preparing for Deployment" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not found. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

# Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "📝 Files to commit:" -ForegroundColor Yellow
Write-Host "  ✅ Backend PostgreSQL migration" -ForegroundColor Green
Write-Host "  ✅ Deployment configurations (Vercel, Railway, Render)" -ForegroundColor Green
Write-Host "  ✅ Environment variable examples" -ForegroundColor Green
Write-Host "  ✅ Deployment documentation" -ForegroundColor Green
Write-Host "  ✅ Updated README.md" -ForegroundColor Green
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Do you want to stage all changes? (y/n)"

if ($confirm -eq 'y' -or $confirm -eq 'Y') {
    Write-Host "📦 Staging all changes..." -ForegroundColor Cyan
    git add .
    
    Write-Host "💬 Committing changes..." -ForegroundColor Cyan
    git commit -m "chore: prepare app for free deployment

- Migrate from SQL Server to PostgreSQL
- Add Vercel configuration for frontend
- Add Railway/Render configuration for backend
- Create comprehensive deployment guides
- Add environment variable examples
- Update README with deployment info
- Create fresh PostgreSQL migrations"
    
    Write-Host ""
    Write-Host "✅ Changes committed successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Check if remote exists
    $hasRemote = git remote -v | Select-String "origin"
    
    if ($hasRemote) {
        Write-Host "🌐 Remote repository found" -ForegroundColor Cyan
        $push = Read-Host "Do you want to push to GitHub? (y/n)"
        
        if ($push -eq 'y' -or $push -eq 'Y') {
            Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Cyan
            git push origin main
            
            Write-Host ""
            Write-Host "🎉 Successfully pushed to GitHub!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📋 Next Steps:" -ForegroundColor Yellow
            Write-Host "  1. Open DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
            Write-Host "  2. Follow the deployment steps" -ForegroundColor White
            Write-Host "  3. Your app will be live in 15-20 minutes!" -ForegroundColor White
        }
    } else {
        Write-Host "⚠️  No remote repository configured" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To add a remote repository:" -ForegroundColor Cyan
        Write-Host "  git remote add origin https://github.com/YOUR-USERNAME/PlanCrick.git" -ForegroundColor White
        Write-Host "  git push -u origin main" -ForegroundColor White
    }
} else {
    Write-Host "❌ Cancelled" -ForegroundColor Red
}

Write-Host ""
Write-Host "📚 Documentation available:" -ForegroundColor Cyan
Write-Host "  📖 DEPLOYMENT_READY.md - Overview of changes" -ForegroundColor White
Write-Host "  ✅ DEPLOYMENT_CHECKLIST.md - Quick deployment guide" -ForegroundColor White
Write-Host "  📝 DEPLOYMENT.md - Detailed deployment instructions" -ForegroundColor White
