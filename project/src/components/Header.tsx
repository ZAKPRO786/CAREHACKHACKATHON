import React from 'react';
import { Settings, Info, Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface HeaderProps {
  onShowInstructions: () => void;
  onShowSettings: () => void;
}

export default function Header({ onShowInstructions, onShowSettings }: HeaderProps) {
  const { settings, updateSetting } = useAccessibility();

  return (
    <header className="bg-white shadow-md border-b-4 border-blue-400">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold" role="img" aria-label="Rainbow emoji">🌈</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Rainbow Memory</h1>
              <p className="text-sm text-gray-600">Inclusive fun for everyone!</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => updateSetting('audioEnabled', !settings.audioEnabled)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label={settings.audioEnabled ? 'Disable audio' : 'Enable audio'}
              title={settings.audioEnabled ? 'Disable audio' : 'Enable audio'}
            >
              {settings.audioEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-500" />
              )}
            </button>

            <button
              onClick={onShowInstructions}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Show instructions"
              title="How to play"
            >
              <Info className="w-5 h-5 text-blue-600" />
            </button>

            <button
              onClick={onShowSettings}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Open accessibility settings"
              title="Accessibility settings"
            >
              <Settings className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}