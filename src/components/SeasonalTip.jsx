import React from 'react';

const SeasonalTip = () => {
  const tips = [
    "Water your lawn in the early morning to minimize evaporation.",
    "Leave grass clippings on your lawn to return nutrients to the soil.",
    "Mow your lawn to a height of 2.5-3 inches for optimal health.",
    "Spring and fall are the best times for lawn aeration.",
    "Overseed thin areas of your lawn in early fall for best results."
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  return (
    <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
      <h3 className="text-sm font-semibold text-green-800">Seasonal Lawn Tip:</h3>
      <p className="text-green-700 text-sm">{randomTip}</p>
    </div>
  );
};

export default SeasonalTip;