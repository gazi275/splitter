import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { PanelSplitter } from './components/PanelSplitter';
import {
  forgotPassword,
  getMyLayout,
  getMyProfile,
  login,
  logout,
  register,
  resetPassword,
  saveMyLayout,
  verifyForgotPassword,
} from './lib/api';
import { PanelNode } from './types/panel';
import { AuthState } from './types/auth';
import {
  appBadgeStyle,
  appShellStyle,
  appSubtitleStyle,
  appTitleStyle,
  authMetaRowStyle,
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
  secondaryButtonStyle,
  tabStripStyle,
  textLinkButtonStyle,
  topBarLeftStyle,
  topBarRightStyle,
  topBarStyle,
  userDotStyle,
  userPillStyle,
} from './styles/appShellStyles';

const TOKEN_STORAGE_KEY = 'split.auth.token';
const LAYOUT_CACHE_STORAGE_KEY = 'split.layout.cache';
type AuthMode = 'login' | 'register';
type ForgotPasswordStep = 'request' | 'verify' | 'reset';

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const getCachedLayout = (): PanelNode | null => {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(LAYOUT_CACHE_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PanelNode;
  } catch {
    localStorage.removeItem(LAYOUT_CACHE_STORAGE_KEY);
    return null;
  }
};

const App: React.FC = () => {
  const initialToken = getStoredToken();
  const initialLayout = getCachedLayout();

  const [auth, setAuth] = useState<AuthState>({ token: initialToken, email: null, name: null });
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const [isForgotBusy, setIsForgotBusy] = useState(false);
  const [isForgotFlowOpen, setIsForgotFlowOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotPasswordStep>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [savedLayout, setSavedLayout] = useState<PanelNode | null>(initialLayout);
  const [pendingLayout, setPendingLayout] = useState<PanelNode | null>(initialLayout);
  const [isHydrated, setIsHydrated] = useState(Boolean(initialToken));

  const resetForgotState = useCallback(() => {
    setIsForgotFlowOpen(false);
    setForgotStep('request');
    setForgotEmail('');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
  }, []);

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
    setIsAuthBusy(true);
    hydrateSession(savedToken)
      .catch(() => {
        console.error('Session restore failed. Keeping cached workspace state.');
        setIsHydrated(true);
      })
      .finally(() => setIsAuthBusy(false));
  }, [hydrateSession]);

  useEffect(() => {
    if (!auth.token || !pendingLayout) return;
    localStorage.setItem(LAYOUT_CACHE_STORAGE_KEY, JSON.stringify(pendingLayout));
  }, [auth.token, pendingLayout]);

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
    if (isForgotFlowOpen) {
      setMessage('Finish or cancel forgot password flow before login.');
      return;
    }
    setMessage(null);
    setIsAuthBusy(true);
    try {
      const result = await login({ email, password });
      localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
      await hydrateSession(result.token);
      setPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsAuthBusy(false);
    }
  };

  const onForgotOpen = () => {
    setMessage(null);
    setIsForgotFlowOpen(true);
    setForgotStep('request');
    setForgotEmail(email || forgotEmail);
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
  };

  const onForgotSendOtp = async () => {
    setMessage(null);
    setIsForgotBusy(true);
    try {
      if (!forgotEmail) throw new Error('Email is required');
      await forgotPassword({ email: forgotEmail });
      setForgotStep('verify');
      setMessage('OTP sent to your email. Please verify OTP.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send OTP.');
    } finally {
      setIsForgotBusy(false);
    }
  };

  const onForgotVerifyOtp = async () => {
    setMessage(null);
    setIsForgotBusy(true);
    try {
      if (!forgotOtp) throw new Error('OTP is required');
      await verifyForgotPassword({ email: forgotEmail, otp: forgotOtp });
      setForgotStep('reset');
      setMessage('OTP verified. Please set your new password.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'OTP verification failed.');
    } finally {
      setIsForgotBusy(false);
    }
  };

  const onForgotResetPassword = async () => {
    setMessage(null);
    setIsForgotBusy(true);
    try {
      if (forgotNewPassword.length < 6) throw new Error('Password must be at least 6 characters');
      if (forgotNewPassword !== forgotConfirmPassword) throw new Error('Passwords do not match');

      await resetPassword({ email: forgotEmail, newPassword: forgotNewPassword });
      setEmail(forgotEmail);
      setPassword('');
      resetForgotState();
      setMessage('Password reset successful. Please login.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Password reset failed.');
    } finally {
      setIsForgotBusy(false);
    }
  };

  const onSubmitRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsAuthBusy(true);
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
      setIsAuthBusy(false);
    }
  };

  const handleLayoutChange = useCallback((layout: PanelNode) => {
    if (!auth.token) return;
    setPendingLayout(layout);
  }, [auth.token]);

  const onLogout = async () => {
    setIsAuthBusy(true);
    try {
      if (auth.token) await logout(auth.token);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(LAYOUT_CACHE_STORAGE_KEY);
      setAuth({ token: null, email: null, name: null });
      setSavedLayout(null);
      setPendingLayout(null);
      setIsHydrated(false);
      setAuthMode('login');
      resetForgotState();
      setEmail('');
      setPassword('');
      setMessage(null);
      setIsAuthBusy(false);
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
                <button type="button" onClick={() => { resetForgotState(); setAuthMode('login'); }} style={authTabButtonStyle(true)}>Login</button>
                <button type="button" onClick={() => { resetForgotState(); setAuthMode('register'); }} style={authTabButtonStyle(false)}>Register</button>
              </div>
              <h2 style={{ margin: '0 0 10px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.8rem' }}>Welcome Back</h2>
              <p style={{ margin: '0 0 22px', color: '#475569' }}>Use your account to restore your last split layout.</p>
              <div style={{ marginBottom: '14px' }}><label style={labelStyle} htmlFor="login-email">Email</label><input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" /></div>
              <div style={{ marginBottom: '8px' }}><label style={labelStyle} htmlFor="login-password">Password</label><input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="Enter your password" /></div>
              <div style={authMetaRowStyle}>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Need help signing in?</span>
                <button type="button" style={textLinkButtonStyle} onClick={onForgotOpen}>Forgot password?</button>
              </div>

              {isForgotFlowOpen && (
                <div
                  style={{ border: '1px solid rgba(15, 118, 110, 0.18)', borderRadius: '14px', padding: '14px', marginBottom: '16px', background: 'rgba(240, 253, 250, 0.55)' }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') event.preventDefault();
                  }}
                >
                  <p style={{ margin: '0 0 10px', color: '#0f766e', fontWeight: 700, fontSize: '0.9rem' }}>Reset Password</p>
                  {forgotStep === 'request' && (
                    <>
                      <div style={{ marginBottom: '10px' }}><label style={labelStyle} htmlFor="forgot-email">Account Email</label><input id="forgot-email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" /></div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={onForgotSendOtp} style={{ ...primaryButtonStyle, flex: 1 }} disabled={isForgotBusy}>{isForgotBusy ? 'Sending...' : 'Send OTP'}</button>
                        <button type="button" onClick={resetForgotState} style={{ ...secondaryButtonStyle, flex: 1 }} disabled={isForgotBusy}>Cancel</button>
                      </div>
                    </>
                  )}
                  {forgotStep === 'verify' && (
                    <>
                      <div style={{ marginBottom: '10px' }}><label style={labelStyle} htmlFor="forgot-otp">OTP</label><input id="forgot-otp" type="text" value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} style={inputStyle} placeholder="6 digit OTP" /></div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={onForgotVerifyOtp} style={{ ...primaryButtonStyle, flex: 1 }} disabled={isForgotBusy}>{isForgotBusy ? 'Verifying...' : 'Verify OTP'}</button>
                        <button type="button" onClick={() => setForgotStep('request')} style={{ ...secondaryButtonStyle, flex: 1 }} disabled={isForgotBusy}>Back</button>
                      </div>
                    </>
                  )}
                  {forgotStep === 'reset' && (
                    <>
                      <div style={{ marginBottom: '10px' }}><label style={labelStyle} htmlFor="forgot-new-password">New Password</label><input id="forgot-new-password" type="password" value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} style={inputStyle} placeholder="At least 6 characters" /></div>
                      <div style={{ marginBottom: '10px' }}><label style={labelStyle} htmlFor="forgot-confirm-password">Confirm Password</label><input id="forgot-confirm-password" type="password" value={forgotConfirmPassword} onChange={(e) => setForgotConfirmPassword(e.target.value)} style={inputStyle} placeholder="Confirm password" /></div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={onForgotResetPassword} style={{ ...primaryButtonStyle, flex: 1 }} disabled={isForgotBusy}>{isForgotBusy ? 'Resetting...' : 'Reset Password'}</button>
                        <button type="button" onClick={() => setForgotStep('verify')} style={{ ...secondaryButtonStyle, flex: 1 }} disabled={isForgotBusy}>Back</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {message && <p style={{ color: '#b91c1c', margin: '0 0 16px', fontWeight: 600 }}>{message}</p>}
              <button style={{ ...primaryButtonStyle, width: '100%' }} type="submit" disabled={isAuthBusy}>{isAuthBusy ? 'Signing in...' : 'Login to Continue'}</button>
            </form>
          )}
          {authMode === 'register' && (
            <form onSubmit={onSubmitRegister} style={cardStyle}>
              <div style={tabStripStyle}>
                <button type="button" onClick={() => { resetForgotState(); setAuthMode('login'); }} style={authTabButtonStyle(false)}>Login</button>
                <button type="button" onClick={() => { resetForgotState(); setAuthMode('register'); }} style={authTabButtonStyle(true)}>Register</button>
              </div>
              <h2 style={{ margin: '0 0 10px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.8rem' }}>Create Account</h2>
              <p style={{ margin: '0 0 22px', color: '#475569' }}>Join and start building your perfect workspace layout.</p>
              <div style={{ marginBottom: '14px' }}><label style={labelStyle} htmlFor="reg-name">Full Name</label><input id="reg-name" type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} style={inputStyle} placeholder="John Doe" /></div>
              <div style={{ marginBottom: '14px' }}><label style={labelStyle} htmlFor="reg-email">Email</label><input id="reg-email" type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" /></div>
              <div style={{ marginBottom: '14px' }}><label style={labelStyle} htmlFor="reg-password">Password</label><input id="reg-password" type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} style={inputStyle} placeholder="At least 6 characters" /></div>
              <div style={{ marginBottom: '18px' }}><label style={labelStyle} htmlFor="reg-confirm">Confirm Password</label><input id="reg-confirm" type="password" required value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} style={inputStyle} placeholder="Confirm your password" /></div>
              {message && <p style={{ color: '#b91c1c', margin: '0 0 16px', fontWeight: 600 }}>{message}</p>}
              <button style={{ ...primaryButtonStyle, width: '100%' }} type="submit" disabled={isAuthBusy}>{isAuthBusy ? 'Creating Account...' : 'Register & Login'}</button>
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
          <button style={logoutButtonStyle} type="button" onClick={onLogout} disabled={isAuthBusy}>{isAuthBusy ? 'Logging out...' : 'Logout'}</button>
        </div>
      </header>
      {message && <p style={{ margin: '10px 20px', color: '#b91c1c', fontWeight: 600 }}>{message}</p>}
      <section style={splitAreaStyle}>
        <div style={splitterContainerStyle}>
          <PanelSplitter initialLayout={savedLayout || undefined} onLayoutChange={handleLayoutChange} />
        </div>
      </section>
    </main>
  );
};

export default App;
