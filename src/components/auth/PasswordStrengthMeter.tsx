import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const result = zxcvbn(password);
  const score = result.score; // 0-4 score

  const getStrengthLabel = () => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Very Weak';
    }
  };

  const getStrengthColor = () => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const strengthPercentage = ((score + 1) / 5) * 100;

  return (
    <div className="mt-1">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getStrengthColor()} transition-all duration-300`}
          style={{ width: `${strengthPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{getStrengthLabel()}</span>
        {result.feedback.warning && (
          <span className="text-xs text-red-500">{result.feedback.warning}</span>
        )}
      </div>
      {result.feedback.suggestions.length > 0 && (
        <ul className="mt-1 text-xs text-gray-500 list-disc pl-4">
          {result.feedback.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;