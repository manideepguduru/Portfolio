// ── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size, height: size,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '2rem auto',
      }}
    />
  );
}

// ── ErrorMessage ─────────────────────────────────────────────
export function ErrorMessage({ message }: { message: string }) {
  return (
    <div style={{
      background: 'rgba(239,68,68,0.08)',
      border: '1px solid rgba(239,68,68,0.25)',
      color: '#f87171',
      padding: '1rem 1.4rem',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.9rem',
      margin: '1rem 0',
    }}>
      ⚠️ {message}
    </div>
  );
}

// ── EmptyState ───────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      color: 'var(--text3)',
      fontSize: '0.95rem',
    }}>
      📭 {message}
    </div>
  );
}
