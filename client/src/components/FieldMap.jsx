import React from 'react';
import { Stage, Layer, Circle, Rect, Text, Group, Ellipse } from 'react-konva';
import useStore from '../store/useStore';

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 800;
const CENTER_X = FIELD_WIDTH / 2;
const CENTER_Y = FIELD_HEIGHT / 2;

const FieldMap = ({ width = 800, height = 800 }) => {
    const { currentPlan, updatePlayerPosition, players, matchPhase, tournamentType } = useStore();

    // Determine restrictions
    let maxOutside = 5;
    let isPowerplay = false;

    if (tournamentType === 'T20') {
        if (matchPhase === 'powerplay') { maxOutside = 2; isPowerplay = true; }
    } else if (tournamentType === 'ODI') {
        if (matchPhase === 'powerplay1') { maxOutside = 2; isPowerplay = true; }
        else if (matchPhase === 'powerplay2') maxOutside = 4;
        else if (matchPhase === 'powerplay3') maxOutside = 5;
    } else if (tournamentType === '8Over') {
        if (matchPhase === 'powerplay') { maxOutside = 2; isPowerplay = true; }
    }

    // Count players outside inner circle (Radius 150)
    // Distance > 150 + margin
    const playersOutside = currentPlan.positions.reduce((count, pos) => {
        const dist = Math.sqrt(Math.pow(pos.x - CENTER_X, 2) + Math.pow(pos.y - CENTER_Y, 2));
        return dist > 150 ? count + 1 : count;
    }, 0);

    const isViolation = playersOutside > maxOutside;

    // Scale factor if width/height props change (responsive)
    const scale = width / FIELD_WIDTH;

    return (
        <div className="border border-gray-700 rounded-lg overflow-hidden bg-[#1a1a1a] relative">
            {/* Info Panel */}
            <div className="absolute top-4 right-4 bg-black/60 p-2 rounded text-xs text-white z-10 pointer-events-none">
                <div className={`font-bold ${isPowerplay ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {isPowerplay ? 'POWERPLAY' : 'NORMAL PHASE'}
                </div>
                <div>Max Outside: <span className="font-bold">{maxOutside}</span></div>
                <div className={isViolation ? 'text-red-500 font-bold' : 'text-green-500'}>
                    Current Outside: {playersOutside}
                </div>
            </div>

            <Stage width={width} height={height} scaleX={scale} scaleY={scale}>
                <Layer>
                    {/* Grass Field */}
                    <Ellipse
                        x={CENTER_X}
                        y={CENTER_Y}
                        radiusX={380}
                        radiusY={360}
                        fill="#2d5a27" // Dark green
                        stroke="#ffffff"
                        strokeWidth={2}
                    />

                    {/* Inner Circle / 30 Yard Circle (Approx) */}
                    <Ellipse
                        x={CENTER_X}
                        y={CENTER_Y}
                        radiusX={150}
                        radiusY={150}
                        stroke={isPowerplay ? "#fbbf24" : "rgba(255,255,255,0.4)"} // Yellow if Powerplay
                        strokeWidth={isPowerplay ? 3 : 2}
                        dash={isPowerplay ? [] : [10, 10]}
                    />

                    {/* Pitch */}
                    <Rect
                        x={CENTER_X - 15}
                        y={CENTER_Y - 60}
                        width={30}
                        height={120}
                        fill="#d2b48c" // Tan/Soil color
                    />

                    {/* Stumps (Simplified) */}
                    <Circle x={CENTER_X} y={CENTER_Y - 58} radius={2} fill="#000" />
                    <Circle x={CENTER_X} y={CENTER_Y + 58} radius={2} fill="#000" />

                </Layer>

                <Layer>
                    {/* Players */}
                    {currentPlan.positions.map((pos) => {
                        const player = players.find(p => p.id === pos.playerId);
                        const label = player ? player.name.substring(0, 2).toUpperCase() : '??';

                        return (
                            <Group
                                key={pos.playerId}
                                x={pos.x}
                                y={pos.y}
                                draggable={!useStore.getState().isViewMode}
                                onDragEnd={(e) => {
                                    updatePlayerPosition(pos.playerId, e.target.x(), e.target.y());
                                }}
                            >
                                <Circle
                                    radius={15}
                                    fill="#ffffff"
                                    shadowColor="black"
                                    shadowBlur={5}
                                    shadowOpacity={0.3}
                                />
                                <Circle
                                    radius={12}
                                    fill={player?.role === 'Bowler' ? '#ef4444' : player?.role === 'Batsman' ? '#3b82f6' : '#a855f7'}
                                />
                                <Text
                                    text={label}
                                    fontSize={10}
                                    fontStyle="bold"
                                    fill="#fff"
                                    x={-15}
                                    y={-5}
                                    width={30}
                                    align="center"
                                />
                            </Group>
                        );
                    })}
                </Layer>
            </Stage>
        </div>
    );
};

export default FieldMap;
