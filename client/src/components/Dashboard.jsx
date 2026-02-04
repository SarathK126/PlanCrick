import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { Users, Shield, TrendingUp, Target, Eye } from 'lucide-react';

const Dashboard = () => {
    const { players, loadPlan, setCurrentView, setIsViewMode } = useStore();
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        // Fetch saved plans
        fetch('/api/plans')
            .then(res => res.json())
            .then(data => setPlans(data))
            .catch(err => console.error("Failed to fetch plans", err));
    }, []);

    const team1Players = players.filter(p => p.teamName === 'Team 1');
    const team2Players = players.filter(p => p.teamName === 'Team 2');

    const getTeamStats = (teamPlayers) => {
        const batsmen = teamPlayers.filter(p => p.role === 'Batsman').length;
        const bowlers = teamPlayers.filter(p => p.role === 'Bowler').length;
        const allRounders = teamPlayers.filter(p => p.role === 'All-rounder').length;
        const wicketkeepers = teamPlayers.filter(p => p.role === 'Wicketkeeper').length;
        return { batsmen, bowlers, allRounders, wicketkeepers };
    };

    const team1Stats = getTeamStats(team1Players);
    const team2Stats = getTeamStats(team2Players);

    const handleViewPlan = (plan) => {
        // Load the plan into current state
        loadPlan(plan);
        // Enable view mode
        useStore.setState({ isViewMode: true });
        // Switch to field view
        setCurrentView('field');
    };

    return (
        <div className="p-3 md:p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-3">
                <Shield className="text-green-500" size={32} />
                PlanCrick Dashboard
            </h1>

            {/* Teams Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Team 1 */}
                <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-blue-400">Team 1</h2>
                        <div className="bg-blue-900/30 px-3 py-1 rounded-full text-blue-400 font-bold text-sm">
                            {team1Players.length} Players
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-gray-400 text-xs md:text-sm">Batsmen</div>
                            <div className="text-xl md:text-2xl font-bold text-blue-400">{team1Stats.batsmen}</div>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-gray-400 text-xs md:text-sm">Bowlers</div>
                            <div className="text-xl md:text-2xl font-bold text-red-400">{team1Stats.bowlers}</div>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-gray-400 text-xs md:text-sm">All-rounders</div>
                            <div className="text-xl md:text-2xl font-bold text-purple-400">{team1Stats.allRounders}</div>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-gray-400 text-xs md:text-sm">Wicketkeepers</div>
                            <div className="text-xl md:text-2xl font-bold text-yellow-400">{team1Stats.wicketkeepers}</div>
                        </div>
                    </div>
                </div>

                {/* Team 2 */}
                <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-orange-400">Team 2</h2>
                        <div className="bg-orange-900/30 px-3 py-1 rounded-full text-orange-400 font-bold text-sm">
                            {team2Players.length} Players
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-gray-400 text-xs md:text-sm">Batsmen</div>
                            <div className="text-xl md:text-2xl font-bold text-blue-400">{team2Stats.batsmen}</div>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-gray-400 text-xs md:text-sm">Bowlers</div>
                            <div className="text-xl md:text-2xl font-bold text-red-400">{team2Stats.bowlers}</div>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-gray-400 text-xs md:text-sm">All-rounders</div>
                            <div className="text-xl md:text-2xl font-bold text-purple-400">{team2Stats.allRounders}</div>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded">
                            <div className="text-gray-400 text-xs md:text-sm">Wicketkeepers</div>
                            <div className="text-xl md:text-2xl font-bold text-yellow-400">{team2Stats.wicketkeepers}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Saved Plans */}
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
                <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                    <Target className="text-green-500" size={24} />
                    Saved Fielding Plans ({plans.length})
                </h2>

                {plans.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No plans saved yet. Create your first strategy!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plans.map(plan => (
                            <div key={plan.id} className="bg-gray-900/50 p-4 rounded border border-gray-700 hover:border-green-500 transition-all group">
                                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                                <p className="text-sm text-gray-400 mb-2">{plan.description || 'No description'}</p>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-500">
                                        {plan.positions?.length || 0} players positioned
                                    </div>
                                    <button
                                        onClick={() => handleViewPlan(plan)}
                                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                    >
                                        <Eye size={14} />
                                        <span>View</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-600/10 rounded-lg p-6 border border-blue-800/50">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-blue-400" size={24} />
                        <div className="text-gray-400 text-sm">Total Players</div>
                    </div>
                    <div className="text-3xl font-bold text-blue-400">{players.length}</div>
                </div>

                <div className="bg-gradient-to-br from-green-900/20 to-green-600/10 rounded-lg p-6 border border-green-800/50">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="text-green-400" size={24} />
                        <div className="text-gray-400 text-sm">Saved Plans</div>
                    </div>
                    <div className="text-3xl font-bold text-green-400">{plans.length}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-purple-600/10 rounded-lg p-6 border border-purple-800/50">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-purple-400" size={24} />
                        <div className="text-gray-400 text-sm">Teams Formed</div>
                    </div>
                    <div className="text-3xl font-bold text-purple-400">2</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
