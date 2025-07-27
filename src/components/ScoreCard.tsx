import React from 'react';

interface ScoreCardProps {
  score: number;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  let label = '';
  if (score > 80) label = 'Excellent';
  else if (score > 60) label = 'Good';
  else if (score > 40) label = 'Moderate';
  else label = 'Poor';

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center">
      <h2 className="text-4xl font-bold text-white">{score}</h2>
      <p className="text-sm text-gray-300 mt-2">{label}</p>
    </div>
  );
}
