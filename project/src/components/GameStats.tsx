import React from 'react';
import { Trophy, Target, Star, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function GameStats() {
  const { state } = useGame();

  const accuracy = state.attempts > 0 ? Math.round((state.matches / state.attempts) * 100) : 0;

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    color 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number; 
    color: string; 
  }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Game Statistics</h3>
      
      <div className="space-y-3">
        <StatCard
          icon={Star}
          label="Score"
          value={state.score}
          color="bg-yellow-500"
        />
        
        <StatCard
          icon={Trophy}
          label="Matches"
          value={`${state.matches}/${state.cards.length / 2 || 0}`}
          color="bg-green-500"
        />
        
        <StatCard
          icon={Target}
          label="Accuracy"
          value={`${accuracy}%`}
          color="bg-blue-500"
        />
        
        <StatCard
          icon={Clock}
          label="Attempts"
          value={state.attempts}
          color="bg-purple-500"
        />
      </div>

      {state.gameCompleted && (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg text-center">
          <h4 className="font-bold mb-1">🎉 Amazing!</h4>
          <p className="text-sm opacity-90">You completed the game!</p>
        </div>
      )}
    </div>
  );
}