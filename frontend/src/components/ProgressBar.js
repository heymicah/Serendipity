import React from 'react';

const ProgressBar = ({ currentStep, totalSteps, labels }) => {
  return (
    <div style={{ width: '100%', marginBottom: '30px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: '10px'
      }}>
        {/* Progress Line Background */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '0',
          right: '0',
          height: '4px',
          backgroundColor: '#e0e0e0',
          zIndex: 0
        }} />
        
        {/* Progress Line Filled */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '0',
          width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          height: '4px',
          backgroundColor: '#4CAF50',
          transition: 'width 0.3s ease',
          zIndex: 1
        }} />

        {/* Step Circles */}
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div
              key={stepNumber}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isCompleted || isCurrent ? '#4CAF50' : '#e0e0e0',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                border: isCurrent ? '3px solid #45a049' : 'none',
                boxShadow: isCurrent ? '0 0 0 4px rgba(76, 175, 80, 0.2)' : 'none'
              }}>
                {isCompleted ? '✓' : stepNumber}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Step Labels */}
      {labels && labels.length === totalSteps && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '8px'
        }}>
          {labels.map((label, index) => (
            <span key={index} style={{ fontSize: '12px', color: '#666' }}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;