import React, { useEffect } from 'react';
import FieldMap from './components/FieldMap';
import PlayerSidebar from './components/PlayerSidebar';
import useStore from './store/useStore';
import { RefreshCw, Save, Shield } from 'lucide-react';

function App() {
  const { setPlayers, currentPlan } = useStore();

  useEffect(() => {
    // Fetch players
    fetch('/api/players')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPlayers(data);
        } else {
          // Seed mock data if empty (for demo)
          const mockPlayers = [
            { id: 1, name: 'Virat Kohli', role: 'Batsman', bowlingStyle: 'Right-arm Medium', handedness: 'Right', teamName: 'Team 1' },
            { id: 2, name: 'Jasprit Bumrah', role: 'Bowler', bowlingStyle: 'Right-arm Fast', handedness: 'Right', teamName: 'Team 1' },
            { id: 3, name: 'Ravindra Jadeja', role: 'All-rounder', bowlingStyle: 'Left-arm Spin', handedness: 'Left', teamName: 'Team 1' },
            { id: 4, name: 'Rohit Sharma', role: 'Batsman', bowlingStyle: 'Right-arm Offbreak', handedness: 'Right', teamName: 'Team 1' },
            { id: 5, name: 'Hardik Pandya', role: 'All-rounder', bowlingStyle: 'Right-arm Fast-Medium', handedness: 'Right', teamName: 'Team 1' },
            { id: 6, name: 'MS Dhoni', role: 'Batsman', bowlingStyle: 'Right-arm Medium', handedness: 'Right', teamName: 'Team 1' },
            { id: 7, name: 'Rishabh Pant', role: 'Batsman', bowlingStyle: 'Right-arm Medium', handedness: 'Left', teamName: 'Team 1' },
            { id: 8, name: 'R. Ashwin', role: 'Bowler', bowlingStyle: 'Right-arm Offbreak', handedness: 'Right', teamName: 'Team 1' },
            { id: 9, name: 'Mohsin Khan', role: 'Bowler', bowlingStyle: 'Left-arm Medium-Fast', handedness: 'Left', teamName: 'Team 1' },
            { id: 10, name: 'Steve Smith', role: 'Batsman', bowlingStyle: 'Right-arm Legbreak', handedness: 'Right', teamName: 'Team 2' },
            { id: 11, name: 'Pat Cummins', role: 'Bowler', bowlingStyle: 'Right-arm Fast', handedness: 'Right', teamName: 'Team 2' },
            { id: 12, name: 'David Warner', role: 'Batsman', bowlingStyle: 'Right-arm Legbreak', handedness: 'Left', teamName: 'Team 2' },
          ];
          // Seed database
          if (data.length === 0) {
            (async () => {
              for (const p of mockPlayers) {
                // Remove ID to let DB generate it
                const { id, ...playerData } = p;
                await fetch('/api/players', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(playerData)
                });
              }
              // Re-fetch to get actual IDs
              fetch('/api/players')
                .then(res => res.json())
                .then(newData => setPlayers(newData));
            })();
          } else {
            setPlayers(data);
          }
        }
      })
      .catch(err => console.error("Failed to fetch players", err));
  }, [setPlayers]);

  return (
    <div className="flex flex-col h-screen bg-[#111] text-white font-sans">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 flex items-center px-6 justify-between bg-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <Shield className="text-green-500" size={28} />
          <h1 className="text-xl font-bold tracking-tight">PlanCrick <span className="text-green-500 text-xs uppercase px-1.5 py-0.5 bg-green-900/30 rounded border border-green-800 ml-2">Beta</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">Current Plan: <span className="text-white font-medium">{currentPlan.name}</span></div>
          <button
            onClick={() => useStore.getState().toggleViewMode()}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${useStore.getState().isViewMode ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {useStore.getState().isViewMode ? 'View Mode' : 'Edit Mode'}
          </button>

          <button
            onClick={async () => {
              const plan = useStore.getState().currentPlan;
              if (!plan.name) return alert("Please name your plan");

              try {
                // Prepare clean payload
                const payload = {
                  ...plan,
                  id: plan.id || 0, // Ensure integer
                  positions: plan.positions.map(p => ({
                    playerId: p.playerId,
                    x: p.x,
                    y: p.y
                  }))
                };

                const res = await fetch('/api/plans', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                if (res.ok) {
                  const saved = await res.json();
                  alert("Plan saved successfully! ID: " + saved.id);
                  // Update local ID if needed, or clear
                }
                else alert("Failed to save plan");
              } catch (e) {
                console.error(e);
                alert("Error saving plan");
              }
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            <Save size={16} /> Save Plan
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Field Area */}
        <div className="flex-1 overflow-auto p-4 flex justify-center items-center bg-[#0d0d0d] relative">
          <FieldMap width={800} height={800} />

          {/* Overlay Controls */}
          <div className="absolute top-6 left-6 flex gap-2">
            {/* Tournament Type Selector */}
            <select
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm"
              value={useStore.getState().tournamentType}
              onChange={(e) => useStore.getState().setTournamentType(e.target.value)}
            >
              <option value="T20">T20 (20 Overs)</option>
              <option value="ODI">ODI (50 Overs)</option>
              <option value="8Over">8 Over (Local)</option>
            </select>

            {/* Phase Selector (Dynamic) */}
            <select
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm"
              value={useStore.getState().matchPhase}
              onChange={(e) => useStore.getState().setMatchPhase(e.target.value)}
            >
              {useStore.getState().tournamentType === 'T20' && (
                <>
                  <option value="powerplay">Powerplay (1-6)</option>
                  <option value="middle">Middle Overs (7-15)</option>
                  <option value="death">Death Overs (16-20)</option>
                </>
              )}
              {useStore.getState().tournamentType === 'ODI' && (
                <>
                  <option value="powerplay1">Powerplay 1 (1-10)</option>
                  <option value="powerplay2">Powerplay 2 (11-40)</option>
                  <option value="powerplay3">Powerplay 3 (41-50)</option>
                </>
              )}
              {useStore.getState().tournamentType === '8Over' && (
                <>
                  <option value="powerplay">Powerplay (Over 1)</option>
                  <option value="nonpowerplay">Non-Powerplay (2-8)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Sidebar */}
        <PlayerSidebar />
      </div>
    </div>
  );
}

export default App;
