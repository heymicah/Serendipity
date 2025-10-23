import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import ProgressBar from './ProgressBar';
import EmailValidationIndicator from './EmailValidationIndicator';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    school: '',
    gradeLevel: '',
    interests: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  // validate email
  const [emailValid, setEmailValid] = useState(false);
  // validate password
  const [passwordValid, setPasswordValid] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    // email
    if (field === 'email') {
      setEmailValid(validateEmail(value));
    }
    // password
    if (field === 'password') {
      setPasswordValid(validatePassword(value));
    }
  };
  // validate password
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // validate email
  const validateEmail = (email) => {
    return email.toLowerCase().endsWith('.edu');
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName) {
          setError('Please enter your first and last name');
          return false;
        }
        break;
      case 2:
        if (!formData.email || !formData.password) {
          setError('Please enter your email and password');
          return false;
        }
        if (!emailValid) {
          setError('Email must end with .edu');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        break;
      case 3:
        if (!formData.gender || !formData.school || !formData.gradeLevel) {
          setError('Please fill in all fields');
          return false;
        }
        break;
      case 4:
        if (formData.interests.length === 0) {
          setError('Please select at least one interest');
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);

    try {
      // LOCALHOST TO 127.0.0.1
      const response = await fetch('http://127.0.0.1:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          school: formData.school,
          grade_level: formData.gradeLevel,
          interests: formData.interests
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      login(data.user, data.token);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // disable next
  const isStepComplete = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName;
      case 2:
        return formData.email && formData.password && emailValid && passwordValid;
      case 3:
        return formData.gender && formData.school && formData.gradeLevel;
      case 4:
        return formData.interests.length > 0;
      default:
        return false;
    }
  };

  const interestOptions = [
    'Sports', 'Music', 'Art', 'Technology', 'Science',
    'Reading', 'Gaming', 'Cooking', 'Travel'
  ];

  return (
    <div className="auth-container signup-layout">
      <div className="progress-bar-container">
        <ProgressBar
          currentStep={step}
          totalSteps={4}
          labels={['Personal details', 'Socials', 'Interests', 'Preferences']}
        />
      </div>

      <div className="auth-card">
        <h1>{step === 1 ? "Welcome, first things first..." : "Sign Up"}</h1>
        {step === 1 && <p style={{ fontSize: '18px', fontWeight: 'normal', marginTop: '-15px', textAlign: 'center', fontStyle: 'italic' }}>Tell us about yourself</p>}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Name */}
          {step === 1 && (
            <>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Step 2: Account */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
                <EmailValidationIndicator 
                  isValid={emailValid}
                  message="Email must end with .edu"
                  isEmpty={formData.email.trim() === ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                />
                <EmailValidationIndicator 
                  isValid={passwordValid}
                  message="Password must be at least 6 characters"
                  isEmpty={formData.password.trim() === ''}
                />
              </div>
            </>
          )}

          {/* Step 3: Profile Info */}
          {step === 3 && (
            <>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={formData.gender ? 'selected' : 'unselected'}
                  required
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="school">School</label>
                <select
                  id="school"
                  value={formData.school}
                  onChange={(e) => handleChange('school', e.target.value)}
                  className={formData.school ? 'selected' : 'unselected'}
                  required
                >
                  <option value="">Select...</option>
                  <option value="uf">University of Florida</option>
                  <option value="fsu">Florida State University</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gradeLevel">Grade Level</label>
                <select
                  id="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={(e) => handleChange('gradeLevel', e.target.value)}
                  className={formData.gradeLevel ? 'selected' : 'unselected'}
                  required
                >
                  <option value="">Select...</option>
                  <option value="College Freshman">College Freshman</option>
                  <option value="College Sophomore">College Sophomore</option>
                  <option value="College Junior">College Junior</option>
                  <option value="College Senior">College Senior</option>
                </select>
              </div>
            </>
          )}

          {/* Step 4: Interests */}
          {step === 4 && (
          <>
              <div className="form-group">
              <label>Interests (select at least one)</label>
              <div className="interests-container">
                  {interestOptions.map(interest => (
                  <div
                      key={interest}
                      className={`interest-bubble ${formData.interests.includes(interest) ? 'selected' : ''}`}
                      onClick={() => handleInterestToggle(interest)}
                  >
                      {interest}
                  </div>
                  ))}
              </div>
              </div>
          </>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="auth-button"
                style={{ flex: 1, backgroundColor: '#6c757d' }}
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="auth-button"
                style={{ flex: 1 }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !isStepComplete()}
                className="auth-button"
                style={{ flex: 1 }}
              >
                {loading ? 'Creating Account...' : 'Complete Sign Up'}
              </button>
            )}
          </div>
        </form>
        {step === 1 ? (
          <p className="auth-link" style={{ marginTop: '20px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        ) : (
          <p></p>
        )}
        
      </div>
    </div>
  );
};

export default Signup;
