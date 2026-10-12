import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleAuthButton = ({ text = 'continue_with', mode = 'login' }) => {
  const { loginWithGoogle, showToast } = useAuth();
  const navigate = useNavigate();
  const buttonContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isConfigured = clientId && !clientId.includes('your-google-oauth-client-id');

  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      showToast('Google ID token was not received. Please try again.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await loginWithGoogle(response.credential);
      setLoading(false);

      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoading(false);
      showToast('Google Sign-In failed on the server. Please check your credentials.', 'error');
    }
  };

  useEffect(() => {
    // Check if Google Identity Services is available in window
    const checkGoogle = () => {
      if (window.google?.accounts?.id && isConfigured) {
        setGoogleAvailable(true);
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          if (buttonContainerRef.current) {
            buttonContainerRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(buttonContainerRef.current, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              text: text,
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 380
            });
          }
        } catch (e) {
          console.warn('Google Identity initialization notice:', e);
        }
      }
    };

    checkGoogle();
    const interval = setInterval(checkGoogle, 500);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [clientId, isConfigured, text]);

  const handleManualGoogleClick = () => {
    if (!isConfigured) {
      showToast(
        'Google OAuth Client ID is using template configuration. Configure VITE_GOOGLE_CLIENT_ID in client/.env to connect your Google Cloud Project.',
        'info'
      );
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          showToast('Google One Tap modal was closed or blocked. Use standard Google button.', 'info');
        }
      });
    } else {
      showToast('Connecting to Google Identity Services... Please ensure internet connectivity.', 'info');
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.75rem 0' }}>
      {/* Official Google Button Render Container */}
      <div 
        ref={buttonContainerRef} 
        style={{ 
          display: googleAvailable ? 'flex' : 'none', 
          justifyContent: 'center', 
          width: '100%',
          minHeight: '44px' 
        }} 
      />

      {/* Styled Fallback / Brand Button if SDK button is rendering or offline/template */}
      {!googleAvailable && (
        <button
          type="button"
          onClick={handleManualGoogleClick}
          disabled={loading}
          className="btn btn-outline"
          style={{
            width: '100%',
            padding: '0.625rem 1rem',
            backgroundColor: '#ffffff',
            borderColor: '#dadce0',
            color: '#3c4043',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            transition: 'background-color 200ms ease, box-shadow 200ms ease',
            cursor: 'pointer'
          }}
        >
          {/* Official Google G Logo SVG */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
            />
          </svg>
          <span>
            {loading ? 'Authenticating with Google...' : mode === 'register' ? 'Sign up with Google' : 'Sign in with Google'}
          </span>
        </button>
      )}

      {/* Helpful developer/viva note if placeholder client ID */}
      {!isConfigured && (
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: '0.4rem',
          lineHeight: 1.3
        }}>
          💡 Google OAuth ready: set <code style={{ fontSize: '0.7rem' }}>VITE_GOOGLE_CLIENT_ID</code> in <code style={{ fontSize: '0.7rem' }}>client/.env</code>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;
