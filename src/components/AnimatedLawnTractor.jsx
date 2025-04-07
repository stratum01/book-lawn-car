import React from 'react';

const AnimatedLawnTractor = () => {
  return (
    <div className="w-full overflow-hidden h-24 mt-4 relative">
      <div className="w-full absolute bottom-0 h-8 bg-green-600 rounded-t-md"></div>
      
      {/* Animated Tractor */}
      <div 
        className="absolute bottom-8 left-0" 
        style={{
          animation: 'drive 20s linear infinite',
          willChange: 'transform'
        }}
      >
        <svg width="80" height="50" viewBox="0 0 80 50">
          {/* Tractor Body */}
          <rect x="25" y="20" width="30" height="15" fill="#e53e3e" rx="2" />
          <rect x="48" y="10" width="15" height="10" fill="#e53e3e" rx="2" />
          
          {/* Cab */}
          <rect x="50" y="5" width="10" height="5" fill="#718096" rx="1" />
          
          {/* Wheels */}
          <circle cx="20" cy="35" r="10" fill="#2d3748" />
          <circle cx="20" cy="35" r="5" fill="#718096" />
          <circle cx="55" cy="35" r="10" fill="#2d3748" />
          <circle cx="55" cy="35" r="5" fill="#718096" />
          
          {/* Lawn Mower Attachment */}
          <rect x="5" y="33" width="20" height="5" fill="#4a5568" />
          <rect x="0" y="30" width="5" height="8" fill="#4a5568" rx="1" />
          
          {/* Driver */}
          <circle cx="53" cy="12" r="3" fill="#f6e05e" />
          <rect x="52" y="15" width="2" height="5" fill="#f6e05e" />
          
          {/* Exhaust */}
          <rect x="28" y="10" width="2" height="10" fill="#4a5568" />
        </svg>
      </div>
      
      {/* Cut Grass Pattern */}
      <div className="absolute bottom-0 w-full">
        <div className="flex justify-between">
          {[...Array(20)].map((_, index) => (
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