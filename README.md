# 🏏 PlanCrick - Cricket Strategy & Field Management

A full-stack web application for cricket teams to plan, visualize, and manage fielding strategies with an interactive field map.

![PlanCrick](https://img.shields.io/badge/Status-Production_Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![.NET](https://img.shields.io/badge/.NET-9.0-purple)
![React](https://img.shields.io/badge/React-19-blue)

## ✨ Features

- 🎯 **Interactive Field Map** - Drag-and-drop fielding position management using Konva.js
- 👥 **Player Management** - Create and manage your team roster
- 📋 **Fielding Plans** - Save and load different fielding strategies
- 🏆 **Match Scenarios** - Plan for different match phases (Powerplay, Middle, Death)
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and Headless UI

## 🚀 Live Demo

**Frontend**: [https://plancrick.vercel.app](https://plancrick.vercel.app) *(Your URL here)*  
**Backend API**: [https://plancrick-backend.railway.app](https://plancrick-backend.railway.app) *(Your URL here)*

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Konva.js** - Canvas rendering for field visualization
- **Zustand** - State management
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **ASP.NET Core 9** - Web API
- **Entity Framework Core** - ORM
- **PostgreSQL** - Database
- **Minimal APIs** - Lightweight API endpoints

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- .NET 9 SDK
- PostgreSQL (or use Docker)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PlanCrick.git
   cd PlanCrick
   ```

2. **Setup Backend**
   ```bash
   cd server
   
   # Update connection string in appsettings.json
   # Install dependencies (auto-restore on build)
   dotnet restore
   
   # Run migrations
   dotnet ef database update
   
   # Run the API
   dotnet run
   ```
   Backend will run on `http://localhost:5017`

3. **Setup Frontend**
   ```bash
   cd client
   
   # Install dependencies
   npm install
   
   # Run dev server
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🌐 Deployment

We provide **FREE** deployment options using:
- **Vercel** (Frontend)
- **Railway** or **Render** (Backend + PostgreSQL)

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide**

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/PlanCrick)

## 📂 Project Structure

```
PlanCrick/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config/        # Configuration files
│   │   ├── store/         # Zustand state management
│   │   └── App.jsx        # Main application
│   ├── vercel.json        # Vercel configuration
│   └── package.json
│
├── server/                # ASP.NET Core backend
│   ├── Data/             # EF Core DbContext
│   ├── Models/           # Entity models
│   ├── Program.cs        # API endpoints
│   ├── railway.json      # Railway configuration
│   └── Procfile          # Render configuration
│
├── DEPLOYMENT.md         # Deployment guide
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env`):
```bash
VITE_API_URL=http://localhost:5017  # Backend URL
```

**Backend** (Environment/Railway/Render):
```bash
ConnectionStrings__DefaultConnection=<postgres-connection-string>
CORS_ORIGINS=http://localhost:5173,https://your-app.vercel.app
ASPNETCORE_ENVIRONMENT=Production
```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players` | Get all players |
| POST | `/api/players` | Create new player |
| PUT | `/api/players/{id}` | Update player |
| DELETE | `/api/players/{id}` | Delete player |
| GET | `/api/plans` | Get all fielding plans |
| POST | `/api/plans` | Save fielding plan |
| GET | `/api/plans/{id}` | Get specific plan |
| GET | `/health` | Health check |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Cricket field diagram inspiration from various cricket strategy tools
- Built with modern web technologies
- Deployed on free-tier hosting platforms

## 📧 Contact

Your Name - [@yourhandle](https://twitter.com/yourhandle)

Project Link: [https://github.com/yourusername/PlanCrick](https://github.com/yourusername/PlanCrick)

---

Made with ❤️ and 🏏 by the PlanCrick Team
