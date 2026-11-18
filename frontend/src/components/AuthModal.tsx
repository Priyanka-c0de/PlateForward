import React, { useState } from 'react';
import { loginUser, registerUser, forgotPassword } from '../api';
import { User, RegisterPayload } from '../types';
import { CrossIcon, MapPinIcon, ShieldLockIcon } from './Icons';
import { Language, translations } from '../i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  language,
}) => {
  const t = translations[language];

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [orgName, setOrgName] = useState('');
  const [role, setRole] = useState<'Food Donor' | 'Food Recipient' | 'Administrator'>('Food Recipient');
  const [locationText, setLocationText] = useState('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [locating, setLocating] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  if (!isOpen) return null;

  // GPS Location Grabber
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(5)));
        setLng(Number(pos.coords.longitude.toFixed(5)));
        if (!locationText) {
          setLocationText(`GPS (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`);
        }
        setLocating(false);
      },
      (err) => {
        alert('Could not retrieve browser location. You can enter your address or coordinates manually.');
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await loginUser({ email: loginEmail, password: loginPassword });
      localStorage.setItem('urban_food_token', res.data.access_token);
      localStorage.setItem('urban_food_user', JSON.stringify(res.data.user));
      onAuthSuccess(res.data.user);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload: RegisterPayload = {
        full_name: fullName,
        email: registerEmail,
        password: registerPassword,
        confirm_password: confirmPassword,
        phone_number: phone || undefined,
        organization_name: orgName || undefined,
        role,
        location: locationText || 'Delhi NCR',
        latitude: lat,
        longitude: lng,
      };
      const res = await registerUser(payload);
      localStorage.setItem('urban_food_token', res.data.access_token);
      localStorage.setItem('urban_food_user', JSON.stringify(res.data.user));
      onAuthSuccess(res.data.user);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await forgotPassword(forgotEmail);
      setSuccessMsg(res.data.message || 'Reset instructions sent to your email.');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Failed to request reset');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Demo fill buttons for presentations
  const fillDemoCreds = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container auth-modal-container">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <ShieldLockIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="modal-title">
              {mode === 'login' ? t.signIn : mode === 'register' ? t.register : 'Reset Password'}
            </h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <CrossIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        {mode !== 'forgot' && (
          <div className="auth-tab-bar">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            >
              {t.signIn}
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            >
              {t.register}
            </button>
          </div>
        )}

        {error && <div className="modal-error-alert">{error}</div>}
        {successMsg && <div className="modal-success-alert">{successMsg}</div>}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="modal-form">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                placeholder="name@organization.org"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center">
                <label className="form-label">Password *</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="btn-link text-xs"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary w-full mt-2">
              {submitting ? t.loading : t.signIn}
            </button>

            {/* Presentation Quick Fill helper */}
            <div className="demo-credentials-helper">
              <span className="demo-helper-title">Demo Quick Fill:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => fillDemoCreds('admin@urbanfoodwaste.org', 'Admin@12345')}
                  className="demo-chip-btn"
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCreds('donor@metrofoods.org', 'Donor@12345')}
                  className="demo-chip-btn"
                >
                  📦 Food Donor
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCreds('ngo@hopefoundation.org', 'Ngo@12345')}
                  className="demo-chip-btn"
                >
                  🤝 Recipient NGO
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="modal-form max-h-96 overflow-y-auto">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Rohit Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">User Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="form-select"
                >
                  <option value="Food Recipient">Food Recipient (NGO/Shelter)</option>
                  <option value="Food Donor">Food Donor (Restaurant/Store)</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Organization Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Metro Supermarket or Robin Hood Army"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center">
                <label className="form-label">{t.location}</label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={locating}
                  className="btn-gps-detect"
                >
                  <MapPinIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{locating ? 'Locating...' : 'Get GPS'}</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. Connaught Place, New Delhi"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                className="form-input"
              />
              {lat && lng && (
                <span className="text-xs text-emerald-700 font-mono mt-1">
                  GPS: {lat}, {lng}
                </span>
              )}
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary w-full mt-2">
              {submitting ? t.loading : t.register}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="modal-form">
            <p className="text-sm text-gray-600 mb-2">
              Enter your registered email address and we will dispatch password recovery instructions.
            </p>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                placeholder="user@organization.org"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                className="btn btn-secondary"
              >
                Back to Sign In
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? t.loading : 'Send Instructions'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
