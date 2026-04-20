import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { PanelSplitter } from './components/PanelSplitter';
import { getMyLayout, getMyProfile, login, saveMyLayout } from './lib/api';
import { PanelNode } from './types/panel';
import { AuthState } from './types/auth';

const TOKEN_STORAGE_KEY = 'split.auth.token';

const appShellStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

const topBarStyle: React.CSSProperties = {
  height: '72px',
  borderBottom: '1px solid rgba(16, 24, 39, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  background:
    'linear-gradient(120deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.68))',
  backdropFilter: 'blur(8px)',
};

const appTitleStyle: React.CSSProperties = {
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 700,
  letterSpacing: '0.02em',
  fontSize: '1.15rem',
};

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: '999px',
  padding: '10px 18px',
  fontWeight: 700,
  fontSize: '0.92rem',
  cursor: 'pointer',
  color: '#ffffff',
  background: 'linear-gradient(135deg, #0f766e 0%, #1d4ed8 100%)',
  boxShadow: '0 14px 26px rgba(29, 78, 216, 0.22)',
};

const logoutButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: 'linear-gradient(135deg, #be123c 0%, #b91c1c 100%)',
  boxShadow: '0 12px 24px rgba(185, 28, 28, 0.2)',
};

const loginPageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
};

const heroPanelStyle: React.CSSProperties = {
  padding: '56px 48px',
  color: '#0f172a',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  background:
    'radial-gradient(circle at 20% 20%, rgba(15, 118, 110, 0.22), transparent 44%), radial-gradient(circle at 80% 0%, rgba(37, 99, 235, 0.2), transparent 40%), #f9fafb',
};

const loginSideStyle: React.CSSProperties = {
  padding: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '420px',
  background: 'rgba(255, 255, 255, 0.86)',
  border: '1px solid rgba(255, 255, 255, 0.9)',
  borderRadius: '24px',
  boxShadow: '0 24px 64px rgba(15, 23, 42, 0.14)',
  padding: '30px 26px',
  backdropFilter: 'blur(8px)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '14px',
  border: '1px solid rgba(15, 23, 42, 0.15)',
  padding: '12px 14px',
  fontSize: '0.95rem',
  outline: 'none',
  background: '#ffffff',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 700,
  color: '#1f2937',
  fontSize: '0.88rem',
};

const splitAreaStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
};

/**
 * Main App Component
 */
const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    email: null,
    name: null,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [savedLayout, setSavedLayout] = useState<PanelNode | null>(null);
  const [pendingLayout, setPendingLayout] = useState<PanelNode | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const hydrateSession = useCallback(async (token: string) => {
    const profile = await getMyProfile(token);
    const layout = await getMyLayout(token);

    setAuth({
      token,
      email: profile.email,
      name: profile.name,
    });
    setSavedLayout(layout);
    setPendingLayout(layout);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!savedToken) {
      return;
    }

    setIsBusy(true);
    hydrateSession(savedToken)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => {
        setIsBusy(false);
      });
  }, [hydrateSession]);

  useEffect(() => {
    if (!auth.token || !pendingLayout || !isHydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveMyLayout(auth.token as string, pendingLayout).catch(() => {
        setMessage('Failed to save layout automatically.');
      });
    }, 550);

    return () => {
      window.clearTimeout(timeoutId);
    };
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
      setMessage(
        error instanceof Error ? error.message : 'Login failed. Please try again.'
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleLayoutChange = useCallback(
    (layout: PanelNode) => {
      if (!auth.token || !isHydrated) {
        return;
      }

      setPendingLayout(layout);
    },
    [auth.token, isHydrated]
  );

  const onLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuth({ token: null, email: null, name: null });
    setSavedLayout(null);
    setPendingLayout(null);
    setIsHydrated(false);
    setPassword('');
    setMessage(null);
  };

  if (!auth.token) {
    return (
      <div style={loginPageStyle}>
        <section style={heroPanelStyle}>
          <p
            style={{
              margin: 0,
              fontSize: '0.88rem',
              letterSpacing: '0.08em',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#0f766e',
            }}
          >
            Workspace Builder
          </p>
          <h1
            style={{
              margin: '16px 0 12px',
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              lineHeight: 1.05,
              fontSize: 'clamp(2rem, 3.8vw, 3.5rem)',
              maxWidth: '580px',
            }}
          >
            Split, resize, and continue exactly where you left off.
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: '560px',
              fontSize: '1rem',
              lineHeight: 1.72,
              color: '#334155',
            }}
          >
            Your layout now stays attached to your account. Login once, design your panel
            workspace, and restore the same view every time you come back.
          </p>
          <div style={{ marginTop: '28px' }}>
            <button style={primaryButtonStyle} type="button">
              Login
            </button>
          </div>
        </section>

        <section style={loginSideStyle}>
          <form onSubmit={onSubmitLogin} style={cardStyle}>
            <h2
              style={{
                margin: 0,
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '1.8rem',
              }}
            >
              Welcome Back
            </h2>
            <p style={{ margin: '10px 0 22px', color: '#475569' }}>
              Use your account to restore your last split layout.
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                style={inputStyle}
                placeholder="you@example.com"
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                style={inputStyle}
                placeholder="Enter your password"
              />
            </div>

            {message && (
              <p style={{ color: '#b91c1c', margin: '0 0 16px', fontWeight: 600 }}>{message}</p>
            )}

            <button style={{ ...primaryButtonStyle, width: '100%' }} type="submit" disabled={isBusy}>
              {isBusy ? 'Signing in...' : 'Login to Continue'}
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <main style={appShellStyle}>
      <header style={topBarStyle}>
        <div>
          <p style={{ ...appTitleStyle, margin: 0 }}>Panel Split Workspace</p>
          <p style={{ margin: '5px 0 0', color: '#475569', fontSize: '0.9rem' }}>
            {auth.name || auth.email}
          </p>
        </div>
        <button style={logoutButtonStyle} type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      {message && (
        <p style={{ margin: '10px 20px', color: '#b91c1c', fontWeight: 600 }}>{message}</p>
      )}

      <section style={splitAreaStyle}>
        {isBusy && !isHydrated ? (
          <div
            style={{
              height: '100%',
              display: 'grid',
              placeItems: 'center',
              fontFamily: '"Space Grotesk", sans-serif',
              color: '#334155',
            }}
          >
            Restoring your workspace...
          </div>
        ) : (
          <PanelSplitter
            initialLayout={savedLayout || undefined}
            onLayoutChange={handleLayoutChange}
          />
        )}
      </section>
    </main>
  );
};

export default App;
