import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'primary', subtext }) => {
  const colorMap = {
    primary: { bg: 'var(--primary-light)', text: 'var(--primary)', border: '#c7d2fe' },
    success: { bg: 'var(--success-light)', text: 'var(--success)', border: '#a7f3d0' },
    warning: { bg: 'var(--warning-light)', text: '#b45309', border: '#fde68a' },
    secondary: { bg: 'var(--secondary-light)', text: 'var(--secondary)', border: '#a5f3fc' },
    danger: { bg: 'var(--danger-light)', text: 'var(--danger)', border: '#fecaca' }
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: c.bg,
            color: c.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
        {value}
      </div>

      {subtext && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {subtext}
        </span>
      )}
    </div>
  );
};

export const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1rem',
    gap: '0.75rem'
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: '3px solid var(--border-light)',
      borderTopColor: 'var(--primary)',
      animation: 'spin 800ms linear infinite'
    }} />
    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
      {text}
    </span>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => (
  <div style={{
    textAlign: 'center',
    padding: '3rem 1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    border: '1px dashed var(--border-light)',
    margin: '1rem 0'
  }}>
    {Icon && (
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-subtle)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem auto'
      }}>
        <Icon size={28} />
      </div>
    )}
    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
      {title}
    </h3>
    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
      {description}
    </p>
    {actionText && onAction && (
      <button onClick={onAction} className="btn btn-primary btn-sm">
        {actionText}
      </button>
    )}
  </div>
);
