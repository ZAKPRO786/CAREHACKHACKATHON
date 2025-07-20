import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { X, Eye, Volume2, MousePointer, Type, Palette } from 'lucide-react';

interface AccessibilityMenuProps {
  onClose: () => void;
}

const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ onClose }) => {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-800">♿ Accessibility Settings</h2>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
            aria-label="Close accessibility menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Visual Settings */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="text-blue-600" size={24} />
              Visual Settings
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-semibold">High Contrast Mode</span>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="w-6 h-6 text-blue-600 rounded"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-semibold">Large Text</span>
                <input
                  type="checkbox"
                  checked={settings.largeText}
                  onChange={(e) => updateSetting('largeText', e.target.checked)}
                  className="w-6 h-6 text-blue-600 rounded"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-semibold">Reduced Motion</span>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  className="w-6 h-6 text-blue-600 rounded"
                />
              </label>
              
              <div className="p-3 bg-gray-50 rounded-xl">
                <label className="block font-semibold mb-2">Color Blind Support</label>
                <select
                  value={settings.colorBlindMode}
                  onChange={(e) => updateSetting('colorBlindMode', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="none">None</option>
                  <option value="protanopia">Protanopia (Red-blind)</option>
                  <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                  <option value="tritanopia">Tritanopia (Blue-blind)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Audio Settings */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Volume2 className="text-green-600" size={24} />
              Audio Settings
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-semibold">Sound Effects</span>
                <input
                  type="checkbox"
                  checked={settings.soundEffectsEnabled}
                  onChange={(e) => updateSetting('soundEffectsEnabled', e.target.checked)}
                  className="w-6 h-6 text-blue-600 rounded"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-semibold">Visual Cues for Audio</span>
                <input
                  type="checkbox"
                  checked={settings.visualCuesEnabled}
                  onChange={(e) => updateSetting('visualCuesEnabled', e.target.checked)}
                  className="w-6 h-6 text-blue-600 rounded"
                />
              </label>
            </div>
          </section>

          {/* Motor Settings */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MousePointer className="text-orange-600" size={24} />
              Motor & Control Settings
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-semibold">One-Button Mode</span>
                <input
                  type="checkbox"
                  checked={settings.oneButtonMode}
                  onChange={(e) => updateSetting('oneButtonMode', e.target.checked)}
                  className="w-6 h-6 text-blue-600 rounded"
                />
              </label>
            </div>
          </section>

          {/* Text Settings */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Type className="text-purple-600" size={24} />
              Text Settings
            </h3>
            
            <div className="p-3 bg-gray-50 rounded-xl">
              <label className="block font-semibold mb-2">
                Font Size: {Math.round(settings.fontSizeMultiplier * 100)}%
              </label>
              <input
                type="range"
                min="0.8"
                max="2"
                step="0.1"
                value={settings.fontSizeMultiplier}
                onChange={(e) => updateSetting('fontSizeMultiplier', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </section>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={resetSettings}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityMenu;