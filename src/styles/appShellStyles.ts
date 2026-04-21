import React from 'react';

export const appShellStyle: React.CSSProperties = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
};

export const topBarStyle: React.CSSProperties = {
  height: '74px',
  borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 18px',
  background: 'rgba(255, 255, 255, 0.92)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
};

export const topBarLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

export const appBadgeStyle: React.CSSProperties = {
  width: '38px',
  height: '38px',
  borderRadius: '12px',
  display: 'grid',
  placeItems: 'center',
  fontWeight: 800,
  color: '#ffffff',
  background: 'linear-gradient(135deg, #0f766e 0%, #2563eb 100%)',
  boxShadow: '0 10px 20px rgba(37, 99, 235, 0.24)',
};

export const appTitleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 700,
  fontSize: '1.04rem',
  letterSpacing: '0.02em',
  color: '#0f172a',
};

export const appSubtitleStyle: React.CSSProperties = {
  margin: '3px 0 0',
  fontSize: '0.8rem',
  color: '#64748b',
};

export const topBarRightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

export const userPillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '999px',
  border: '1px solid rgba(15, 23, 42, 0.1)',
  background: '#ffffff',
  padding: '8px 12px',
  fontSize: '0.84rem',
  color: '#334155',
  fontWeight: 600,
};

export const userDotStyle: React.CSSProperties = {
  width: '8px',
  height: '8px',
  borderRadius: '999px',
  background: '#16a34a',
  boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.14)',
};

export const primaryButtonStyle: React.CSSProperties = {
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

export const logoutButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: 'linear-gradient(135deg, #be123c 0%, #b91c1c 100%)',
  boxShadow: '0 12px 24px rgba(185, 28, 28, 0.2)',
};

export const loginPageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
};

export const heroPanelStyle: React.CSSProperties = {
  padding: '56px 48px',
  color: '#0f172a',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  background:
    'radial-gradient(circle at 20% 20%, rgba(15, 118, 110, 0.22), transparent 44%), radial-gradient(circle at 80% 0%, rgba(37, 99, 235, 0.2), transparent 40%), #f9fafb',
};

export const loginSideStyle: React.CSSProperties = {
  padding: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '420px',
  background: 'rgba(255, 255, 255, 0.86)',
  border: '1px solid rgba(255, 255, 255, 0.9)',
  borderRadius: '24px',
  boxShadow: '0 24px 64px rgba(15, 23, 42, 0.14)',
  padding: '30px 26px',
  backdropFilter: 'blur(8px)',
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '14px',
  border: '1px solid rgba(15, 23, 42, 0.15)',
  padding: '12px 14px',
  fontSize: '0.95rem',
  outline: 'none',
  background: '#ffffff',
};

export const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 700,
  color: '#1f2937',
  fontSize: '0.88rem',
};

export const splitAreaStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  overflow: 'hidden',
};

export const splitterContainerStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
};

export const tabStripStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  borderBottom: '1px solid #e5e7eb',
  marginBottom: '16px',
};

export const authTabButtonStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '10px',
  border: 'none',
  background: 'transparent',
  fontWeight: 700,
  color: active ? '#101827' : '#9ca3af',
  borderBottom: active ? '2px solid #0f766e' : '2px solid transparent',
  cursor: 'pointer',
});

export const authMetaRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
};

export const textLinkButtonStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: '#0f766e',
  cursor: 'pointer',
  fontWeight: 700,
  padding: 0,
  fontSize: '0.86rem',
};

export const secondaryButtonStyle: React.CSSProperties = {
  border: '1px solid rgba(15, 23, 42, 0.18)',
  borderRadius: '999px',
  padding: '10px 16px',
  fontWeight: 700,
  fontSize: '0.9rem',
  cursor: 'pointer',
  color: '#0f172a',
  background: '#ffffff',
};