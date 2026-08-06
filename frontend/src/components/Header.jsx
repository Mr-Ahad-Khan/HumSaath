import { Link } from 'react-router-dom'
import { BorderMotif } from './Motifs.jsx'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__logo">
          <span className="site-header__mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" fill="currentColor" />
            </svg>
          </span>
          <span className="site-header__name">HumSaath</span>
        </Link>
        <nav className="site-header__nav">
          <Link to="/create" className="site-header__cta">Create an Event</Link>
        </nav>
      </div>
      <div className="site-header__border">
        <BorderMotif color="var(--gold-500)" className="border-motif-stretch" />
      </div>
    </header>
  )
}
