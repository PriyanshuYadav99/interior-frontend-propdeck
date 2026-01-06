import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertCircle, Mail, Phone, User } from 'lucide-react';

// ✅ FIXED: Use Railway URL instead of localhost
const API_BASE_URL = 'https://interior-backend-production.up.railway.app';

const RegistrationModal = ({ isOpen, onClose, onSuccess, generatedCount = 0, sessionId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('IN');

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setCountryCode('IN');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const handleClose = () => {
    // ✅ BLOCK CLOSING - User must complete registration
    setError('⚠️ Please complete registration to continue generating images');
    setTimeout(() => setError(''), 3000);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    // ✅ VALIDATION
    if (!fullName.trim() || fullName.length < 2) {
      setError('Please enter your full name (minimum 2 characters)');
      setLoading(false);
      return;
    }

    // ✅ EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // ✅ PHONE VALIDATION
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number (10 digits minimum)');
      setLoading(false);
      return;
    }

    try {
      console.log('[MODAL] Submitting registration...');
      console.log('[MODAL] Using API URL:', `${API_BASE_URL}/api/simple-register`);
      
      // ✅ FIXED: Use Railway URL
      const response = await fetch(`${API_BASE_URL}/api/simple-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone_number: phoneNumber.trim(),
          country_code: countryCode,
          session_id: sessionId,
          generated_count: generatedCount
        })
      });

      console.log('[MODAL] Response status:', response.status);

      const data = await response.json();
      console.log('[MODAL] Response data:', data);

      if (response.ok && data.success) {
        console.log('[MODAL] Registration successful!', data);
        
        setSuccess('🎉 Registration complete! Redirecting...');
        
        // ✅ WAIT 1.5 SECONDS TO SHOW SUCCESS MESSAGE
        setTimeout(() => {
          onSuccess({
            user_id: data.user_id,
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phoneNumber.trim(),
            registered: true
          });
        }, 1500);
        
      } else {
        console.error('[MODAL] Registration failed:', data);
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('[MODAL] Registration error:', error);
      setError('❌ Failed to register. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '0.5rem',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '420px',
        maxHeight: '95vh',
        overflowY: 'auto',
        position: 'relative',
        animation: 'slideIn 0.3s ease-out',
        margin: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem',
          borderBottom: '2px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: 0, lineHeight: '1.3' }}>
              🎨 Register to Continue
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', lineHeight: '1.3' }}>
              Unlock unlimited designs!
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              color: '#d1d5db',
              opacity: 0.5,
              flexShrink: 0
            }}
            title="Complete registration to close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1rem' }}>
          {/* Alert Banner */}
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.75rem', color: '#92400e', margin: 0, fontWeight: '600' }}>
              🔒 <strong>2/2 Free Generations Used</strong>
            </p>
            <p style={{ fontSize: '0.7rem', color: '#b45309', margin: '0.25rem 0 0', fontWeight: '500' }}>
              Register below for unlimited access!
            </p>
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#374151', marginBottom: '0.375rem' }}>
              <User size={14} style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: 'middle' }} />
              Full Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              disabled={loading || success}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.4rem',
                fontSize: '0.875rem',
                outline: 'none',
                opacity: loading || success ? 0.6 : 1
              }}
              onFocus={(e) => e.target.style.borderColor = '#9333ea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#374151', marginBottom: '0.375rem' }}>
              <Mail size={14} style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: 'middle' }} />
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              disabled={loading || success}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.4rem',
                fontSize: '0.875rem',
                outline: 'none',
                opacity: loading || success ? 0.6 : 1
              }}
              onFocus={(e) => e.target.style.borderColor = '#9333ea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              💡 We'll send you a welcome email
            </p>
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#374151', marginBottom: '0.375rem' }}>
              <Phone size={14} style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: 'middle' }} />
              Phone Number <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                disabled={loading || success}
                style={{
                  padding: '0.625rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.4rem',
                  fontSize: '0.875rem',
                  background: 'white',
                  cursor: 'pointer',
                  minWidth: '90px',
                  opacity: loading || success ? 0.6 : 1
                }}
              >
                <option value="IN">🇮🇳 +91</option>
                <option value="US">🇺🇸 +1</option>
                <option value="GB">🇬🇧 +44</option>
                <option value="CA">🇨🇦 +1</option>
                <option value="AU">🇦🇺 +61</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="1234567890"
                maxLength={15}
                disabled={loading || success}
                style={{
                  flex: 1,
                  padding: '0.625rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.4rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  opacity: loading || success ? 0.6 : 1
                }}
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginBottom: '0.75rem',
              padding: '0.625rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.4rem',
              color: '#dc2626',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <AlertCircle size={14} />
              <span style={{ lineHeight: '1.3' }}>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{
              marginBottom: '0.75rem',
              padding: '0.625rem',
              background: '#ecfdf5',
              border: '1px solid #6ee7b7',
              borderRadius: '0.4rem',
              color: '#047857',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <CheckCircle size={14} />
              <span style={{ lineHeight: '1.3' }}>{success}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || success || !fullName.trim() || !email.trim() || !phoneNumber}
            style={{
              width: '100%',
              background: (loading || success || !fullName.trim() || !email.trim() || !phoneNumber) 
                ? '#d1d5db' 
                : 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.4rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              border: 'none',
              cursor: (loading || success || !fullName.trim() || !email.trim() || !phoneNumber) 
                ? 'not-allowed' 
                : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              boxShadow: (loading || success || !fullName.trim() || !email.trim() || !phoneNumber) 
                ? 'none' 
                : '0 3px 5px rgba(147, 51, 234, 0.25)'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Registering...
              </>
            ) : success ? (
              <>
                <CheckCircle size={16} />
                Success!
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Register & Start Creating
              </>
            )}
          </button>

          <p style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.7rem', color: '#9ca3af', lineHeight: '1.3' }}>
            🔒 Your information is secure and will never be shared
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RegistrationModal;