import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, AtSign, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { Mascot } from 'page-mascot';
import { useAuth } from '../context/AuthContext';
import '../styles/marketing.css';
import '../styles/auth.css';

const brand = (
  <Link className="auth-brand" to="/" aria-label="AutoLar home">
    <img className="auth-brand-logo" src="/logo.png" alt="AutoLar" />
    <span>AutoLar</span>
  </Link>
);

export default function AuthPage({ signup = false }) {
  const { user, authenticate } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [transition, setTransition] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);

  if (user && !busy && !transition) return <Navigate to="/dashboard" replace />;

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const account = await authenticate(signup ? 'register' : 'login', {
        name: String(form.get('name') || ''),
        email: String(form.get('email') || '').trim(),
        password: String(form.get('password') || ''),
      });
      const name = (account?.name || String(form.get('name') || form.get('email') || '').trim().split('@')[0] || 'there').slice(0, 36);
      setIsLeaving(true);
      await new Promise((resolve) => window.setTimeout(resolve, 360));
      setTransition({ phase: 'welcome', name });
      await new Promise((resolve) => window.setTimeout(resolve,6200));
      setTransition({ phase: 'loading', name });
      await new Promise((resolve) => window.setTimeout(resolve, 7250));
      navigate('/dashboard', { replace: true });
    } catch (e) {
      const message = e.response?.data?.message || e.response?.data?.detail;
      setError(message || (e.code === 'ERR_NETWORK' || e.message === 'Network Error'
        ? 'The browser could not reach the service. Check the Cloud API address in Settings.'
        : e.message || 'We could not open the workspace. Please try again.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`auth-page auth-page-redesign${isLeaving || transition ? ' auth-page-authenticating' : ''}`}>
      <main className="auth-panel auth-panel-redesign">
        <div className="auth-mobile-brand">{brand}</div>
        {transition ? (
          <section className={`auth-success auth-success-${transition.phase} auth-form-redesign`} aria-live="polite" aria-atomic="true" key={transition.phase}>
            <div className="auth-mascot-halo" aria-hidden="true"><i /><i /><i /></div>
            <Mascot
              className="auth-mascot"
              directions="/mascots/glasses-directions.webp"
              reactions="/mascots/glasses-reactions.webp"
              size={72}
              label="AutoLar helper"
            />
            <div className="auth-success-copy">
              <span className="auth-form-kicker"><i /> {transition.phase === 'welcome' ? 'AUTOLAR' : 'GETTING THINGS READY'}</span>
              <h2>{transition.phase === 'welcome'
                ? `${signup ? 'Welcome' : 'Welcome back'}, ${transition.name}`
                : signup ? 'Setting up your account' : 'Fetching your account'}</h2>
              <p>{transition.phase === 'welcome'
                ? 'We are getting your solar workspace ready.'
                : 'Just a moment while we prepare your dashboard.'}</p>
            </div>
            <div className="auth-progress" aria-hidden="true"><span /></div>
          </section>
        ) : <form className={`auth-form auth-form-redesign${isLeaving ? ' auth-form-leaving' : ''}`} onSubmit={submit}>
          <div className="auth-mascot-halo" aria-hidden="true"><i /><i /><i /></div>
          <Mascot
            className="auth-mascot"
            directions="/mascots/glasses-directions.webp"
            reactions="/mascots/glasses-reactions.webp"
            size={72}
            label="AutoLar helper"
          />

          <div className="auth-form-heading">
            <span className="auth-form-kicker"><i /> {signup ? 'YOUR SOLAR WORKSPACE' : 'WELCOME BACK'}</span>
            <h2>{signup ? 'Create your account' : 'Sign in to AutoLar'}</h2>
            <p>{signup ? 'Set up your demo workspace in a moment.' : 'Your tracker dashboard is ready when you are.'}</p>
          </div>

          <div className="auth-fields">
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
        </form>}
        <small className="auth-mobile-footer">© 2026 AutoLar · Solar tracking workspace</small>
      </main>
    </div>
  );
}
