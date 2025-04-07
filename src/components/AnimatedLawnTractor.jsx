// src/components/AnimatedLawnTractor.jsx
import React from 'react';

const AnimatedLawnTractor = () => {
  return (
    <div className="w-full overflow-hidden h-24 mt-4 relative">
      <div className="w-full absolute bottom-0 h-8 bg-green-600 rounded-t-md"></div>
      
      {/* Animated Riding Mower with Driver */}
      <div 
        className="absolute bottom-8 left-0" 
        style={{
          animation: 'drive 20s linear infinite',
          willChange: 'transform'
        }}
      >
        <svg width="90" height="60" viewBox="0 0 90 60">
          {/* Mower Body */}
          <rect x="25" y="25" width="35" height="12" fill="#d93636" rx="2" />
          
          {/* Engine Hood */}
          <rect x="50" y="18" width="15" height="7" fill="#d93636" rx="2" />
          
          {/* Steering Wheel */}
          <circle cx="40" cy="22" r="3" fill="#333" />
          <line x1="38" y1="22" x2="42" y2="22" stroke="#333" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="40" y2="24" stroke="#333" strokeWidth="1.5" />
          
          {/* Seat Back */}
          <rect x="32" y="15" width="6" height="8" fill="#333" rx="1" />
          
          {/* Seat */}
          <rect x="30" y="23" width="10" height="4" fill="#333" rx="1" />
          
          {/* Driver */}
          <circle cx="35" cy="12" r="4" fill="#f6e05e" /> {/* Head */}
          <rect x="32" y="16" width="6" height="7" fill="#4299e1" /> {/* Torso */}
          <rect x="32" y="23" width="3" height="5" fill="#2b6cb0" /> {/* Left Leg */}
          <rect x="35" y="23" width="3" height="6" fill="#2b6cb0" /> {/* Right Leg */}
          
          {/* Grass Catcher */}
          <rect x="60" y="24" width="10" height="8" fill="#68d391" rx="1" />
          
          {/* Mower Deck */}
          <rect x="15" y="35" width="50" height="4" fill="#4a5568" rx="1" />
          
          {/* Wheels */}
          <circle cx="20" cy="40" r="5" fill="#2d3748" />
          <circle cx="20" cy="40" r="2" fill="#4a5568" />
          <circle cx="65" cy="40" r="5" fill="#2d3748" />
          <circle cx="65" cy="40" r="2" fill="#4a5568" />
          
          {/* Exhaust */}
          <rect x="53" y="15" width="2" height="3" fill="#718096" />
          <circle cx="54" cy="14" r="1" fill="#a0aec0" />
        </svg>
      </div>
      
      {/* Cut Grass Pattern */}
      <div className="absolute bottom-0 w-full">
        <div className="flex justify-between">
          {[...Array(24)].map((_, index) => (
            <div 
              key={index} 
              className="h-3 w-2 bg-green-500 mx-0.5"
              style={{ 
                animation: 'grow 3s ease-in-out infinite',
                animationDelay: `${index * 0.1}s` 
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedLawnTractor;