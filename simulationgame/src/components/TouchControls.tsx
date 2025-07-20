import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Hand, Sparkles } from 'lucide-react';

const TouchControls: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeControl, setActiveControl] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleControlPress = (direction: string) => {
    setActiveControl(direction);
    
    // Simulate keyboard events for the game engine
    const keyMap: { [key: string]: string } = {
      'up': 'ArrowUp',
      'down': 'ArrowDown',
      'left': 'ArrowLeft',
      'right': 'ArrowRight',
      'interact': 'Space'
    };

    const event = new KeyboardEvent('keydown', { code: keyMap[direction] });
    window.dispatchEvent(event);

    // Auto-release after short delay
    setTimeout(() => {
      const releaseEvent = new KeyboardEvent('keyup', { code: keyMap[direction] });
      window.dispatchEvent(releaseEvent);
      setActiveControl(null);
    }, 150);
  };

  if (!isMobile) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Movement Controls */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <div className="relative w-32 h-32">
          {/* Center circle */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30"></div>
          
          {/* Up */}
          <button
            onTouchStart={() => handleControlPress('up')}
            onMouseDown={() => handleControlPress('up')}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-150 ${
              activeControl === 'up' ? 'scale-110 bg-blue-400/80' : 'hover:scale-105'
            }`}
            aria-label="Move forward"
          >
            <ChevronUp size={24} className="text-gray-700" />
          </button>
          
          {/* Down */}
          <button
            onTouchStart={() => handleControlPress('down')}
            onMouseDown={() => handleControlPress('down')}
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-150 ${
              activeControl === 'down' ? 'scale-110 bg-blue-400/80' : 'hover:scale-105'
            }`}
            aria-label="Move backward"
          >
            <ChevronDown size={24} className="text-gray-700" />
          </button>
          
          {/* Left */}
          <button
            onTouchStart={() => handleControlPress('left')}
            onMouseDown={() => handleControlPress('left')}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-150 ${
              activeControl === 'left' ? 'scale-110 bg-blue-400/80' : 'hover:scale-105'
            }`}
            aria-label="Move left"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          
          {/* Right */}
          <button
            onTouchStart={() => handleControlPress('right')}
            onMouseDown={() => handleControlPress('right')}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-150 ${
              activeControl === 'right' ? 'scale-110 bg-blue-400/80' : 'hover:scale-105'
            }`}
            aria-label="Move right"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Interaction Button */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <button
          onTouchStart={() => handleControlPress('interact')}
          onMouseDown={() => handleControlPress('interact')}
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center transition-all duration-150 ${
            activeControl === 'interact' ? 'scale-110' : 'hover:scale-105'
          }`}
          aria-label="Interact with objects"
        >
          <Sparkles size={28} className="text-white" />
        </button>
      </div>

      {/* Touch instruction */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Hand size={16} />
            Touch to explore the magical forest!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TouchControls;