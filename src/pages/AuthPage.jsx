import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, AtSign, Cloud, Eye, EyeOff, LockKeyhole, ShieldCheck, Sun, UserRound, Zap } from 'lucide-react';
import { Mascot } from 'page-mascot';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl, setApiBaseUrl } from '../api/axiosClient';
import '../styles/marketing.css';
import '../styles/auth.css';

const brand = (
  <Link className="auth-brand" to="/" aria-label="AutoLar home">
    <img className="auth-brand-logo" src="/logo.png" alt="AutoLar" />
  </Link>
);

export default function AuthPage({ signup = false }) {
  const { user, authenticate } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());

  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      setApiBaseUrl(apiUrl);
      await authenticate(signup ? 'register' : 'login', {
        name: String(form.get('name') || ''),
        email: String(form.get('email') || '').trim(),
        password: String(form.get('password') || ''),
      });
      navigate('/dashboard', { replace: true });
    } catch (e) {
      const message = e.response?.data?.message || e.response?.data?.detail;
      setError(message || (e.code === 'ERR_NETWORK' || e.message === 'Network Error'
        ? 'The browser could not reach the API. Check the address, HTTPS, and backend CORS settings.'
        : e.message || 'We could not open the workspace. Check the API address and try again.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page auth-page-redesign">
      <aside className="auth-story auth-story-redesign">
        {brand}

        <div className="auth-story-main">
          <span className="auth-story-kicker"><i /> SOLAR, MADE CLEARER</span>
          <h1>See your system<br />in a better light.</h1>
          <p>Live tracker readings, system health, and cloud recommendations—together in one clear workspace.</p>

          <div className="auth-solar-scene" aria-hidden="true">
            <span className="auth-scene-halo" />
            <span className="auth-scene-orbit auth-scene-orbit-one" />
            <span className="auth-scene-orbit auth-scene-orbit-two" />
            <span className="auth-scene-sun"><Sun size={38} strokeWidth={1.5} /></span>
            <div className="auth-scene-panel">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>
            <span className="auth-scene-neck" />
            <span className="auth-scene-post" />
            <span className="auth-scene-foot" />
            <span className="auth-scene-caption"><Zap size={13} /> CLOUD-CONNECTED SOLAR TRACKING</span>
          </div>

          <div className="auth-story-note"><ShieldCheck size={17} /> Connect to your live device API</div>
        </div>

        <small className="auth-story-footer">© 2026 AutoLar <span>·</span> Solar tracking workspace</small>
      </aside>

      <main className="auth-panel auth-panel-redesign">
        <div className="auth-mobile-brand">{brand}<span>DEMO WORKSPACE</span></div>
        <form className="auth-form auth-form-redesign" onSubmit={submit}>
          <div className="auth-mascot-halo" aria-hidden="true"><i /><i /><i /></div>
          <Mascot
            className="auth-mascot"
            directions="/mascots/glasses-directions.webp"
            reactions="/mascots/glasses-reactions.webp"
            size={104}
            label="AutoLar helper"
          />

          <div className="auth-form-heading">
            <span className="auth-form-kicker"><i /> {signup ? 'YOUR SOLAR WORKSPACE' : 'WELCOME BACK'}</span>
            <h2>{signup ? 'Create your account' : 'Sign in to AutoLar'}</h2>
            <p>{signup ? 'Set up your demo workspace in a moment.' : 'Your tracker dashboard is ready when you are.'}</p>
          </div>

          <div className="auth-fields">
            <label className="auth-field">
              <span className="auth-field-label"><Cloud size={14} /> Cloud API address</span>
              <span className="auth-input-shell">
                <Cloud size={16} aria-hidden="true" />
                <input name="apiUrl" type="text" value={apiUrl} onChange={(event) => setApiUrl(event.target.value)} placeholder="/api or https://api.example.com/api" required />
              </span>
              <small>Use /api for this site’s Vercel proxy, or an HTTPS API address.</small>
            </label>

            {signup && <label className="auth-field">
              <span className="auth-field-label"><UserRound size={14} /> Full name</span>
              <span className="auth-input-shell">
                <UserRound size={16} aria-hidden="true" />
                <input name="name" autoComplete="name" placeholder="Your name" required maxLength="100" />
              </span>
            </label>}

            <label className="auth-field">
              <span className="auth-field-label"><AtSign size={14} /> Email address</span>
              <span className="auth-input-shell">
                <AtSign size={16} aria-hidden="true" />
                <input name="email" type="text" autoComplete="username" placeholder="you@example.com" required maxLength="254" />
              </span>
            </label>

            <label className="auth-field">
              <span className="auth-field-label"><LockKeyhole size={14} /> Password</span>
              <span className="auth-input-shell auth-password-shell">
                <LockKeyhole size={16} aria-hidden="true" />
                <input name="password" type={showPassword ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'} placeholder="Enter your password" required />
                <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <button className="auth-submit-redesign" disabled={busy}>
            <span>{busy ? 'Opening workspace…' : signup ? 'Create demo account' : 'Continue to dashboard'}</span>
            <span className="auth-submit-arrow"><ArrowRight size={18} /></span>
          </button>

          <div className="auth-switch">
            <span>{signup ? 'Already have a demo account?' : 'New to AutoLar?'}</span>
            <Link to={signup ? '/login' : '/signup'}>{signup ? 'Sign in' : 'Create an account'}</Link>
          </div>

          <div className="auth-demo-note"><ShieldCheck size={14} /> Demo access only. No account is created on the server.</div>
        </form>
        <small className="auth-mobile-footer">© 2026 AutoLar · Solar tracking workspace</small>
      </main>
    </div>
  );
}
