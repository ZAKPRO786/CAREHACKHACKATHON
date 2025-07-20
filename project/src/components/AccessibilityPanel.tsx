import React from 'react';
import { X, Eye, Volume2, Gamepad2, Minimize, Type } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface AccessibilityPanelProps {
  onClose: () => void;
}

export default function AccessibilityPanel({ onClose }: AccessibilityPanelProps) {
  const { settings, updateSetting } = useAccessibility();

  const ToggleSwitch = ({ 
    checked, 
    onChange, 
    label, 
    description 
  }: { 
    checked: boolean; 
    onChange: (value: boolean) => void; 
    label: string; 
    description: string; 
  }) => (
    <div className="flex items-start justify-between p-3 rounded-lg border border-gray-200">
      <div className="flex-1">
        <label className="font-medium text-gray-800 block mb-1">{label}</label>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        onClick={() => onChange(!checked)}
        aria-label={`${checked ? 'Disable' : 'Enable'} ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Accessibility Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Visual Accessibility
            </h3>
            <div className="space-y-3">
              <ToggleSwitch
                checked={settings.highContrast}
                onChange={(value) => updateSetting('highContrast', value)}
                label="High Contrast Mode"
                description="Increases contrast for better visibility with low vision"
              />
              <ToggleSwitch
                checked={settings.reducedMotion}
                onChange={(value) => updateSetting('reducedMotion', value)}
                label="Reduced Motion"
                description="Minimizes animations and transitions"
              />
              
              <div className="p-3 rounded-lg border border-gray-200">
                <label className="font-medium text-gray-800 block mb-2">Font Size</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', e.target.value as 'small' | 'medium' | 'large')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Audio Accessibility
            </h3>
            <div className="space-y-3">
              <ToggleSwitch
                checked={settings.audioMode}
                onChange={(value) => updateSetting('audioMode', value)}
                label="Audio Mode"
                description="Enhanced audio cues for visually impaired users"
              />
              <ToggleSwitch
                checked={settings.announcements}
                onChange={(value) => updateSetting('announcements', value)}
                label="Voice Announcements"
                description="Spoken feedback for game events and actions"
              />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Motor Accessibility
            </h3>
            <div className="space-y-3">
              <ToggleSwitch
                checked={settings.oneSwitchMode}
                onChange={(value) => updateSetting('oneSwitchMode', value)}
                label="One-Switch Mode"
                description="Auto-scanning mode for users with limited motor control"
              />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Minimize className="w-5 h-5 mr-2" />
              Cognitive Accessibility
            </h3>
            <div className="space-y-3">
              <ToggleSwitch
                checked={settings.simpleMode}
                onChange={(value) => updateSetting('simpleMode', value)}
                label="Simple Mode"
                description="Fewer cards and simpler gameplay for cognitive accessibility"
              />
            </div>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">🌈 About Inclusive Design</h4>
            <p className="text-blue-700 text-sm">
              Rainbow Memory is designed to be accessible to children with various disabilities. 
              Each setting can be combined to create a personalized gaming experience that works best for individual needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}