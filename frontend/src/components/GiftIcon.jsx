// Simple line-art SVG icons for gift categories.

export function GiftIcon({ name, className = '', size = 36 }) {
  const props = { width: size, height: size, viewBox: '0 0 36 36', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, className, 'aria-hidden': true }

  switch (name) {
    case 'flower':
      return (
        <svg {...props}>
          <circle cx="18" cy="18" r="3" />
          <path d="M18 15c0-4 3-6 0-9-3 3 0 5 0 9zM18 21c0 4 3 6 0 9-3-3 0-5 0-9zM15 18c-4 0-6-3-9 0 3 3 5 0 9 0zM21 18c4 0 6 3 9 0-3-3-5 0-9 0z" />
        </svg>
      )
    case 'sweet':
      return (
        <svg {...props}>
          <path d="M6 14h24v14a2 2 0 01-2 2H8a2 2 0 01-2-2V14z" />
          <path d="M6 14l3-6h18l3 6" />
          <path d="M14 14v-6M22 14v-6" />
          <circle cx="14" cy="22" r="1.5" fill="currentColor" />
          <circle cx="22" cy="22" r="1.5" fill="currentColor" />
        </svg>
      )
    case 'dryfruit':
      return (
        <svg {...props}>
          <ellipse cx="18" cy="20" rx="10" ry="8" />
          <path d="M18 12c0-3 2-5 5-5M18 12c0-3-2-5-5-5" />
          <circle cx="14" cy="20" r="1.5" fill="currentColor" />
          <circle cx="22" cy="18" r="1.5" fill="currentColor" />
          <circle cx="19" cy="24" r="1.5" fill="currentColor" />
        </svg>
      )
    case 'ittar':
      return (
        <svg {...props}>
          <path d="M14 6h8v4l-2 2v6a4 4 0 01-4 0v-6l-2-2V6z" />
          <path d="M12 28h12l-2-8H14l-2 8z" />
          <line x1="14" y1="10" x2="22" y2="10" />
        </svg>
      )
    case 'decor':
      return (
        <svg {...props}>
          <path d="M18 6l4 6h-8l4-6z" />
          <path d="M18 30l4-6h-8l4 6z" />
          <path d="M6 18l6-4v8l-6-4z" />
          <path d="M30 18l-6-4v8l6-4z" />
          <circle cx="18" cy="18" r="2" fill="currentColor" />
        </svg>
      )
    case 'diya':
      return (
        <svg {...props}>
          <path d="M8 22c0 4 4 6 10 6s10-2 10-6H8z" />
          <path d="M18 22c0-6 0-10-4-12 6 0 8 4 8 8 0 2-2 4-4 4z" fill="currentColor" fillOpacity="0.15" />
          <path d="M18 8c0 2 2 3 2 5s-2 3-2 3-2-1-2-3 2-3 2-5z" />
          <ellipse cx="18" cy="24" rx="6" ry="1.5" fill="currentColor" fillOpacity="0.1" />
        </svg>
      )
    default:
      return null
  }
}
