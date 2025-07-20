import React from 'react';
import { X, Gamepad2, Eye, Volume2, Settings } from 'lucide-react';

interface InstructionsProps {
  onClose: () => void;
}

export default function Instructions({ onClose }: InstructionsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">How to Play Rainbow Memory</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Close instructions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Game Objective</h3>
            <p className="text-gray-700">
              Find matching pairs of cards by flipping them over. Each card has a colorful symbol. 
              Remember where you saw each symbol and match them to win!
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🎮 How to Play</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click on any card to flip it over and see the symbol</li>
              <li>Click on a second card to see if it matches the first</li>
              <li>If the cards match, they stay face up - great job!</li>
              <li>If they don't match, they flip back over</li>
              <li>Continue until you've found all the matching pairs</li>
              <li>Try to complete the game in as few attempts as possible!</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">♿ Accessibility Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">Visual Accessibility</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• High contrast mode for low vision</li>
                  <li>• Adjustable font sizes</li>
                  <li>• Reduced motion options</li>
                  <li>• Clear visual feedback</li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold">Audio Accessibility</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Sound effects for each card</li>
                  <li>• Voice announcements</li>
                  <li>• Audio mode for blind users</li>
                  <li>• Screen reader support</li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Gamepad2 className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold">Motor Accessibility</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• One-switch scanning mode</li>
                  <li>• Keyboard navigation support</li>
                  <li>• Large click targets</li>
                  <li>• Auto-scanning with space bar</li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold">Cognitive Accessibility</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Simple mode with fewer cards</li>
                  <li>• Clear, consistent interface</li>
                  <li>• Encouraging feedback</li>
                  <li>• No time pressure</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">⌨️ Keyboard Controls</h3>
            <div className="space-y-2 text-gray-700">
              <p><kbd className="bg-gray-200 px-2 py-1 rounded">Tab</kbd> - Navigate between cards</p>
              <p><kbd className="bg-gray-200 px-2 py-1 rounded">Enter</kbd> or <kbd className="bg-gray-200 px-2 py-1 rounded">Space</kbd> - Flip selected card</p>
              <p><kbd className="bg-gray-200 px-2 py-1 rounded">Space</kbd> - Start/stop scanning (One-switch mode)</p>
            </div>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🌈 Inclusive Design</h3>
            <p className="text-blue-700">
              Rainbow Memory is designed to be enjoyed by children of all abilities. 
              Every child deserves to have fun and feel included in play. 
              Use the accessibility settings to customize the game for your specific needs!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}