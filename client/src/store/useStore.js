import { create } from 'zustand'

const useStore = create((set) => ({
    players: [],
    setPlayers: (players) => set({ players }),

    // The active plan being edited
    currentPlan: {
        id: null,
        name: 'New Plan',
        positions: [] // Array of { id (local or db), playerId, x, y }
    },

    setPlanName: (name) => set((state) => ({
        currentPlan: { ...state.currentPlan, name }
    })),

    // Update a player's position in the current plan
    updatePlayerPosition: (playerId, x, y) => set((state) => {
        const existing = state.currentPlan.positions.find(p => p.playerId === playerId);
        let newPositions;
        if (existing) {
            newPositions = state.currentPlan.positions.map(p =>
                p.playerId === playerId ? { ...p, x, y } : p
            );
        } else {
            newPositions = [...state.currentPlan.positions, { playerId, x, y }];
        }
        return { currentPlan: { ...state.currentPlan, positions: newPositions } };
    }),

    // Load a full plan
    loadPlan: (plan) => set({ currentPlan: plan }),

    isViewMode: false,
    toggleViewMode: () => set((state) => ({ isViewMode: !state.isViewMode })),

    tournamentType: 'T20', // T20, ODI, 8Over
    setTournamentType: (type) => set({ tournamentType: type }),

    matchPhase: 'powerplay',
    setMatchPhase: (phase) => set({ matchPhase: phase }),

    addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),

    deletePlayer: (id) => set((state) => ({
        players: state.players.filter(p => p.id !== id),
        currentPlan: {
            ...state.currentPlan,
            positions: state.currentPlan.positions.filter(pos => pos.playerId !== id)
        }
    })),

    removePlayerFromField: (playerId) => set((state) => ({
        currentPlan: {
            ...state.currentPlan,
            positions: state.currentPlan.positions.filter(pos => pos.playerId !== playerId)
        }
    })),
}))

export default useStore
