import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { PanelSplitter } from './components/PanelSplitter';
import { getMyLayout, getMyProfile, login, logout, register, saveMyLayout } from './lib/api';
import { PanelNode } from './types/panel';
import { AuthState } from './types/auth';
import {
  appBadgeStyle,
  appShellStyle,
  appSubtitleStyle,
  appTitleStyle,
  authTabButtonStyle,
  cardStyle,
  heroPanelStyle,
  inputStyle,
  labelStyle,
  loginPageStyle,
  loginSideStyle,
  logoutButtonStyle,
  primaryButtonStyle,
  splitAreaStyle,
  splitterContainerStyle,
  tabStripStyle,
  topBarLeftStyle,
  topBarRightStyle,
  topBarStyle,
  userDotStyle,
  userPillStyle,
} from './styles/appShellStyles';

const TOKEN_STORAGE_KEY = 'split.auth.token';
type AuthMode = 'login' | 'register';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ token: null, email: null, name: null });
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [savedLayout, setSavedLayout] = useState<PanelNode | null>(null);
  const [pendingLayout, setPendingLayout] = useState<PanelNode | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const hydrateSession = useCallback(async (token: string) => {
    const profile = await getMyProfile(token);
    const layout = await getMyLayout(token);
    setAuth({ token, email: profile.email, name: profile.name });
    setSavedLayout(layout);
    setPendingLayout(layout);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!savedToken) return;
    setIsBusy(true);
    hydrateSession(savedToken)
      .catch(() => localStorage.removeItem(TOKEN_STORAGE_KEY))
      .finally(() => setIsBusy(false));
  }, [hydrateSession]);

  useEffect(() => {
    if (!auth.token || !pendingLayout || !isHydrated) return;
    const timeoutId = window.setTimeout(() => {
      saveMyLayout(auth.token as string, pendingLayout).catch(() => {
        setMessage('Failed to save layout automatically.');
      });
    }, 550);
    return () => window.clearTimeout(timeoutId);
  }, [auth.token, isHydrated, pendingLayout]);

  const onSubmitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsBusy(true);
    try {
      const result = await login({ email, password });
      localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
      await hydrateSession(result.token);
      setPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsBusy(false);
    }
  };

  const onSubmitRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsBusy(true);
    try {
      if (regPassword !== regConfirmPassword) throw new Error('Passwords do not match');
      if (regPassword.length < 6) throw new Error('Password must be at least 6 characters');
      await register({ name: regName, email: regEmail, password: regPassword });
      setAuthMode('login');
      setEmail(regEmail);
      setPassword('');
      setMessage('Registration successful. Please login to continue.');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleLayoutChange = useCallback((layout: PanelNode) => {
    if (!auth.token || !isHydrated) return;
    setPendingLayout(layout);
  }, [auth.token, isHydrated]);

  const onLogout = async () => {
    setIsBusy(true);
    try {
      if (auth.token) await logout(auth.token);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setAuth({ token: null, email: null, name: null });
      setSavedLayout(null);
      setPendingLayout(null);
      setIsHydrated(false);
      setAuthMode('login');
      setPassword('');
      setMessage(null);
      setIsBusy(false);
    }
  };

  if (!auth.token) {
    return (
      <div style={loginPageStyle}>
        <section style={heroPanelStyle}>
          <p style={{ margin: 0, fontSize: '0.88rem', letterSpacing: '0.08em', fontWeight: 800, textTransform: 'uppercase', color: '#0f766e' }}>Workspace Builder</p>
          <h1 style={{ margin: '16px 0 12px', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, lineHeight: 1.05, fontSize: 'clamp(2rem, 3.8vw, 3.5rem)', maxWidth: '580px' }}>Split, resize, and continue exactly where you left off.</h1>
          <p style={{ margin: 0, maxWidth: '560px', fontSize: '1rem', lineHeight: 1.72, color: '#334155' }}>Your layout now stays attached to your account. Login once, design your panel workspace, and restore the same view every time you come back.</p>
          <div style={{ marginTop: '28px' }}><button style={primaryButtonStyle} type="button" onClick={() => setAuthMode('login')}>Get Started</button></div>
        </section>
        <section style={loginSideStyle}>
          {authMode === 'login' && (
            <form onSubmit={onSubmitLogin} style={cardStyle}>
              <div style={tabStripStyle}>
                <button type="button" onClick={() => setAuthMode('login')} style={authTabButtonStyle(true)}>Login</button>
                <button type="button" onClick={() => setAuthMode('register')} style={authTabButtonStyle(false)}>Register</button>
              </div>
              <h2 style={{ margin: '0 0 10px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.8rem' }}>Welcome Back</h2>
              <p style={{ margin: '0 0 22px', color: '#475569' }}>Use your account to restore your last split layout.</p>
              <div style={{ marginBottom: '14px' }}><label style={labelStyle} htmlFor="login-email">Email</label><input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" /></div>
              <div style={{ marginBottom: '18px' }}><label style={labelStyle} htmlFor="login-password">Password</label><input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="Enter your password" /></div>
              {message && <p style={{ color: '#b91c1c', margin: '0 0 16px', fontWeight: 600 }}>{message}</p>}
              <button style={{ ...primaryButtonStyle, width: '100%' }} type="submit" disabled={isBusy}>{isBusy ? 'Signing in...' : 'Login to Continue'}</button>
            </form>
          )}
          {authMode === 'register' && (
            <form onSubmit={onSubmitRegister} style={cardStyle}>
              <div style={tabStripStyle}>
                <button type="button" onClick={() => setAuthMode('login')} style={authTabButtonStyle(false)}>Login</button>
                <button type="button" onClick={() => setAuthMode('register')} style={authTabButtonStyle(true)}>Register</button>
              </div>
              <h2 style={{ margin: '0 0 10px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.8rem' }}>Create Account</h2>
              <p style={{ margin: '0 0 22px', color: '#475569' }}>Join and start building your perfect workspace layout.</p>
              <div style={{ marginBottom: '14px' }}><label style={labelStyle} htmlFor="reg-name">Full Name</label><input id="reg-name" type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} style={inputStyle} placeholder="John Doe" /></div>
              <div style={{ marginBottom: '14px' }}><label style={labelStyle} htmlFor="reg-email">Email</label><input id="reg-email" type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" /></div>
              <div style={{ marginBottom: '14px' }}><label style={labelStyle} htmlFor="reg-password">Password</label><input id="reg-password" type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} style={inputStyle} placeholder="At least 6 characters" /></div>
              <div style={{ marginBottom: '18px' }}><label style={labelStyle} htmlFor="reg-confirm">Confirm Password</label><input id="reg-confirm" type="password" required value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} style={inputStyle} placeholder="Confirm your password" /></div>
              {message && <p style={{ color: '#b91c1c', margin: '0 0 16px', fontWeight: 600 }}>{message}</p>}
              <button style={{ ...primaryButtonStyle, width: '100%' }} type="submit" disabled={isBusy}>{isBusy ? 'Creating Account...' : 'Register & Login'}</button>
            </form>
          )}
        </section>
      </div>
    );
  }

  return (
    <main style={appShellStyle}>
      <header style={topBarStyle}>
        <div style={topBarLeftStyle}>
          <div style={appBadgeStyle}>PS</div>
          <div>
            <p style={appTitleStyle}>Panel Split Workspace</p>
            <p style={appSubtitleStyle}>Professional workspace layout editor</p>
          </div>
        </div>
        <div style={topBarRightStyle}>
          <div style={userPillStyle}>
            <span style={userDotStyle} />
            <span>{auth.name || auth.email}</span>
          </div>
          <button style={logoutButtonStyle} type="button" onClick={onLogout} disabled={isBusy}>{isBusy ? 'Logging out...' : 'Logout'}</button>
        </div>
      </header>
      {message && <p style={{ margin: '10px 20px', color: '#b91c1c', fontWeight: 600 }}>{message}</p>}
      <section style={splitAreaStyle}>
        {isBusy && !isHydrated ? (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', fontFamily: '"Space Grotesk", sans-serif', color: '#334155' }}>Restoring your workspace...</div>
        ) : (
          <div style={splitterContainerStyle}>
            <PanelSplitter initialLayout={savedLayout || undefined} onLayoutChange={handleLayoutChange} />
          </div>
        )}
      </section>
    </main>
  );
};

export default App;
