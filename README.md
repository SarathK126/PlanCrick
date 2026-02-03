# PlanCrick - Cricket Strategy & Field Management

A full-stack application for managing cricket fielding strategies.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Zustand, React Konva
- **Backend**: ASP.NET Core 9 Web API, Entity Framework Core, SQL Server

## Prerequisites
- .NET 9.0 SDK
- Node.js (v18+)
- SQL Server (LocalDB or Standard)

## How to Run

You need to run both the Backend (API) and Frontend (Client) simultaneously.

### 1. Start the Backend (API)
Open a terminal and run:
```bash
cd server
dotnet run
```
The API will start at `http://localhost:5017`.

### 2. Start the Frontend (Client)
Open a **new** terminal window and run:
```bash
cd client
npm install  # Only needed the first time
npm run dev
```
The application will start at `http://localhost:5173`.

## Features
- **Interactive Field Map**: Drag and drop players.
- **Team Management**: Manage Team 1 & Team 2 squads.
- **Match Scenarios**: Toggle between T20, ODI, and 8-Over formats.
- **Rules Engine**: Visual warnings for fielding restrictions (Powerplay).
- **Save Plans**: Persist your strategies to the database.

## Troubleshooting
- **Database Issues**: If you see DB errors, run `dotnet ef database update` in the `server` folder to apply migrations.
- **Port Conflicts**: Ensure ports 5017 (Server) and 5173 (Client) are free.
