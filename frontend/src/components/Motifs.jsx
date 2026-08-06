// Mughal/Lucknowi-inspired geometric SVG border patterns.
// These are simple, hand-drawn geometric motifs — not clipart.

export function BorderMotif({ className = '', color = 'currentColor' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 12"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke={color} strokeWidth="1" fill="none">
        {/* Central medallion */}
        <circle cx="60" cy="6" r="3" />
        <circle cx="60" cy="6" r="1.2" fill={color} />
        {/* Symmetrical arcs */}
        <path d="M60 1 Q70 6 60 11" />
        <path d="M60 1 Q50 6 60 11" />
        {/* Repeating leaf forms */}
        <path d="M48 6 Q42 3 36 6 Q42 9 48 6" />
        <path d="M72 6 Q78 3 84 6 Q78 9 72 6" />
        <path d="M34 6 Q28 3 22 6 Q28 9 34 6" />
        <path d="M86 6 Q92 3 98 6 Q92 9 86 6" />
        {/* End dots */}
        <circle cx="6" cy="6" r="1.5" fill={color} />
        <circle cx="114" cy="6" r="1.5" fill={color} />
        {/* Connecting lines */}
        <line x1="8" y1="6" x2="20" y2="6" />
        <line x1="100" y1="6" x2="112" y2="6" />
      </g>
    </svg>
  )
}

export function CornerOrnament({ className = '', color = 'currentColor', size = 60 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      aria-hidden="true"
    >
      <g stroke={color} strokeWidth="1" fill="none">
        <path d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40 Z" fill={color} fillOpacity="0.06" />
        <path d="M4 4 Q30 4 30 30 Q4 30 4 4" />
        <circle cx="30" cy="30" r="2" fill={color} />
        <path d="M10 10 L20 10 M10 10 L10 20" />
        <circle cx="10" cy="10" r="1.5" fill={color} />
      </g>
    </svg>
  )
}

export function SectionDivider({ color = 'var(--gold-500)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', margin: 'var(--space-2) 0' }}>
      <svg width="80" height="20" viewBox="0 0 80 20" fill="none" aria-hidden="true">
        <g stroke={color} strokeWidth="1" fill="none">
          <line x1="0" y1="10" x2="28" y2="10" />
          <path d="M28 10 Q34 4 40 10 Q46 4 52 10" />
          <line x1="52" y1="10" x2="80" y2="10" />
        </g>
      </svg>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1" fill="none" />
        <circle cx="8" cy="8" r="2.5" fill={color} />
      </svg>
      <svg width="80" height="20" viewBox="0 0 80 20" fill="none" aria-hidden="true">
        <g stroke={color} strokeWidth="1" fill="none">
          <line x1="0" y1="10" x2="28" y2="10" />
          <path d="M52 10 Q46 4 40 10 Q34 4 28 10" transform="translate(24 0)" />
          <line x1="52" y1="10" x2="80" y2="10" />
        </g>
      </svg>
    </div>
  )
}
