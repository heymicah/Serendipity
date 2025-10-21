import React from 'react';

const EmailValidationIndicator = ({ isValid, message }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginTop: '8px',
      fontSize: '13px',
      color: isValid ? '#4CAF50' : '#dc3545',
      transition: 'color 0.3s ease'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: isValid ? '#4CAF50' : '#dc3545',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '8px',
        transition: 'all 0.3s ease'
      }}>
        {isValid ? (
          // Green checkmark
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path 
              d="M2 6L5 9L10 3" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Red X
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path 
              d="M1 1L9 9M9 1L1 9" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <span>{message}</span>
    </div>
  );
};

export default EmailValidationIndicator;