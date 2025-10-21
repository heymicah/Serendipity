import React from 'react';

const ProgressBar = ({ currentStep, totalSteps, labels }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 0'
    }}>
      {[...Array(totalSteps)].map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <React.Fragment key={stepNumber}>
            {/* Step Item */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {/* Circle with Number */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isCurrent ? '#1a1a1a' : (isCompleted ? '#1a1a1a' : '#f0f0f0'),
                color: isCurrent || isCompleted ? 'white' : '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}>
                {stepNumber}
              </div>

              {/* Label */}
              {labels && labels[index] && (
                <span style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: isCurrent ? '#1a1a1a' : (isCompleted ? '#1a1a1a' : '#999'),
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease'
                }}>
                  {labels[index]}
                </span>
              )}
            </div>

            {/* Arrow between steps */}
            {stepNumber < totalSteps && (
              <div style={{
                fontSize: '20px',
                color: '#d0d0d0',
                fontWeight: '300'
              }}>
                ›
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressBar;