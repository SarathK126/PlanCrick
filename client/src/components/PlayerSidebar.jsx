import React, { useState } from 'react';
import useStore from '../store/useStore';
import { User, Plus, Trash2, X, Users, MinusCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const PlayerSidebar = () => {
    const { players, currentPlan, updatePlayerPosition, addPlayer, deletePlayer, removePlayerFromField } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Team 1'); // 'Team 1' or 'Team 2'
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [newPlayer, setNewPlayer] = useState({ name: '', role: 'Batsman', bowlingStyle: 'None', handedness: 'Right', teamName: 'Team 1' });

    const activePlayerIds = new Set(currentPlan.positions.map(p => p.playerId));

    const addToField = (player) => {
        if (!activePlayerIds.has(player.id)) {
            updatePlayerPosition(player.id, 400, 400);
        }
    };

    const handleCreatePlayer = async () => {
        try {
            const res = await fetch('/api/players', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlayer)
            });
            if (res.ok) {
                const created = await res.json();
                addPlayer(created);
                setIsAddModalOpen(false);
                setNewPlayer({ name: '', role: 'Batsman', bowlingStyle: 'None', handedness: 'Right', teamName: activeTab });
            }
        } catch (error) {
            console.error("Failed to create player", error);
        }
    };

    const handleDeletePlayer = async (id, e) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this player?")) return;

        try {
            await fetch(`/api/players/${id}`, { method: 'DELETE' });
            deletePlayer(id);
        } catch (error) {
            console.error("Failed to delete player", error);
        }
    };

    const handleRemoveFromField = (id, e) => {
        e.stopPropagation();
        removePlayerFromField(id);
    }

    const filteredPlayers = players.filter(p =>
        (p.teamName === activeTab || (!p.teamName && activeTab === 'Team 1')) && // Handle legacy/null as Team 1
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full text-white">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User size={20} /> Squad
                </h2>

                {/* Team Tabs */}
                <div className="flex bg-gray-800 rounded p-1 mb-4">
                    <button
                        onClick={() => setActiveTab('Team 1')}
                        className={`flex-1 py-1 text-sm font-medium rounded ${activeTab === 'Team 1' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Team 1
                    </button>
                    <button
                        onClick={() => setActiveTab('Team 2')}
                        className={`flex-1 py-1 text-sm font-medium rounded ${activeTab === 'Team 2' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Team 2
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search players..."
                    className="w-full bg-gray-800 border-none rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                <button
                    onClick={() => { setNewPlayer({ ...newPlayer, teamName: activeTab }); setIsAddModalOpen(true); }}
                    className="mt-3 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded text-sm font-medium flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Add New Player
                </button>

                {currentPlan.positions.length > 0 && (
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to clear all players from the field?')) {
                                useStore.getState().clearAllField();
                            }
                        }}
                        className="mt-2 w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <X size={16} /> Clear All Field
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredPlayers.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">No players in {activeTab}</div>
                )}
                {filteredPlayers.map(player => {
                    const isOnField = activePlayerIds.has(player.id);
                    return (
                        <div
                            key={player.id}
                            className={`p-3 rounded-lg flex justify-between items-center group ${isOnField ? 'bg-green-900/20 border border-green-900/50' : 'bg-gray-800 hover:bg-gray-750'}`}
                        >
                            <div className="flex-1 min-w-0 mr-2">
                                <div className="font-semibold truncate">{player.name}</div>
                                <div className="text-xs text-gray-400 truncate">{player.role} • {player.bowlingStyle}</div>
                            </div>

                            <div className="flex items-center gap-1">
                                {isOnField ? (
                                    <button
                                        onClick={(e) => handleRemoveFromField(player.id, e)}
                                        className="p-1.5 text-red-400 hover:bg-red-900/30 rounded transition-colors"
                                        title="Remove from Field"
                                    >
                                        <MinusCircle size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => addToField(player)}
                                        className="p-1.5 bg-blue-600 rounded hover:bg-blue-500 transition-colors"
                                        title="Add to Field"
                                    >
                                        <Plus size={16} />
                                    </button>
                                )}

                                <button
                                    onClick={(e) => handleDeletePlayer(player.id, e)}
                                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-700 rounded transition-colors"
                                    title="Delete Player"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Player Modal */}
            <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm rounded bg-[#1a1a1a] p-6 border border-gray-700 text-white">
                        <Dialog.Title className="text-lg font-bold mb-4">Add Player to {activeTab}</Dialog.Title>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                <input
                                    className="w-full bg-gray-800 rounded p-2 text-white border border-gray-700 focus:border-blue-500 outline-none"
                                    value={newPlayer.name}
                                    onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Role</label>
                                <select
                                    className="w-full bg-gray-800 rounded p-2 text-white border border-gray-700 outline-none"
                                    value={newPlayer.role}
                                    onChange={e => setNewPlayer({ ...newPlayer, role: e.target.value })}
                                >
                                    <option>Batsman</option>
                                    <option>Bowler</option>
                                    <option>All-rounder</option>
                                    <option>Wicketkeeper</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Bowling Style</label>
                                <input
                                    className="w-full bg-gray-800 rounded p-2 text-white border border-gray-700 outline-none"
                                    value={newPlayer.bowlingStyle}
                                    onChange={e => setNewPlayer({ ...newPlayer, bowlingStyle: e.target.value })}
                                    placeholder="e.g. Right-arm Fast"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-400 mb-1">Handedness</label>
                                    <select
                                        className="w-full bg-gray-800 rounded p-2 text-white border border-gray-700 outline-none"
                                        value={newPlayer.handedness}
                                        onChange={e => setNewPlayer({ ...newPlayer, handedness: e.target.value })}
                                    >
                                        <option>Right</option>
                                        <option>Left</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3 justify-end">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded text-gray-300 hover:text-white">Cancel</button>
                            <button onClick={handleCreatePlayer} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 font-medium">Create</button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default PlayerSidebar;
