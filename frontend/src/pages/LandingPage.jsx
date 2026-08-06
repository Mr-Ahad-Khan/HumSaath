import { Link } from 'react-router-dom'
import { SectionDivider, BorderMotif } from '../components/Motifs.jsx'

const HERO_IMAGE = 'https://images.pexels.com/photos/33508474/pexels-photo-33508474.jpeg?auto=compress&cs=tinysrgb&h=900'

const features = [
  {
    num: 'I',
    title: 'Watch Live',
    desc: 'Join the ceremony via live video — be present for every ritual, every smile, every tear of joy, from wherever you are.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="5" width="14" height="14" rx="2" />
        <path d="M16 9l5-3v12l-5-3" />
        <circle cx="9" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: 'II',
    title: 'Send Blessing',
    desc: 'Send shagun — blessing money — directly to the host via UPI with a single tap.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14 2 9.5h7.5z" />
      </svg>
    ),
  },
  {
    num: 'III',
    title: 'Send a Gift',
    desc: 'Choose from curated gifts — flowers, mithai, dry fruits, ittar — delivered to the host.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="8" width="18" height="13" rx="1" />
        <path d="M3 12h18M12 8v13" />
        <path d="M12 8C12 8 10 4 7.5 4S4 8 12 8zM12 8c0 0 2-4 4.5-4S20 8 12 8z" />
      </svg>
    ),
  },
  {
    num: 'IV',
    title: 'Eat Together',
    desc: 'Order your favourite dish and share the meal — because celebration tastes better together.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 3v9a3 3 0 003 3v6" />
        <path d="M9 3v6M6 3h6" />
        <path d="M17 3c-1.5 0-3 2-3 5s1.5 4 3 4v9" />
      </svg>
    ),
  },
]

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="fade-in">
            <p className="hero__eyebrow">Jahan bhi ho&hellip;</p>
            <h1 className="hero__title">
              HumSaath
              <span className="accent">— together, even from afar</span>
            </h1>
            <p className="hero__lede">
              Can't make it to the wedding? HumSaath lets you join the celebration from anywhere —
              watch the ceremony live, send your blessings, gift something thoughtful, and share a
              meal together. Because distance should never come between family.
            </p>
            <div className="hero__actions">
              <Link to="/create" className="btn btn--primary btn--lg">
                Create an Event
              </Link>
              <a href="#how-it-works" className="btn btn--outline btn--lg">
                How it works
              </a>
            </div>
          </div>
          <div className="hero__visual fade-in" style={{ animationDelay: '0.15s' }}>
            <img src={HERO_IMAGE} alt="Marigold garlands at an Indian wedding venue" loading="eager" />
            <p className="hero__visual-caption">"Door hi sahi, HumSaath zaroor."</p>
          </div>
        </div>
      </section>

      {/* Four things guests can do */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <p className="section-head__eyebrow">Four ways to be present</p>
            <h2 className="section-head__title">Your guests can do all this</h2>
            <SectionDivider />
          </div>

          <div className="features">
            <div className="feature-card feature-card--tall">
              <div className="feature-card__icon">{features[0].icon}</div>
              <h3 className="feature-card__title">{features[0].title}</h3>
              <p className="feature-card__desc">{features[0].desc}</p>
              <span className="feature-card__num">— {features[0].num} —</span>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">{features[1].icon}</div>
              <h3 className="feature-card__title">{features[1].title}</h3>
              <p className="feature-card__desc">{features[1].desc}</p>
              <span className="feature-card__num">— {features[1].num} —</span>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">{features[2].icon}</div>
              <h3 className="feature-card__title">{features[2].title}</h3>
              <p className="feature-card__desc">{features[2].desc}</p>
              <span className="feature-card__num">— {features[2].num} —</span>
            </div>
            <div className="feature-card" style={{ gridColumn: 'span 2' }}>
              <div className="feature-card__icon">{features[3].icon}</div>
              <h3 className="feature-card__title">{features[3].title}</h3>
              <p className="feature-card__desc">{features[3].desc}</p>
              <span className="feature-card__num">— {features[3].num} —</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-head">
            <p className="section-head__eyebrow">Simple, in three steps</p>
            <h2 className="section-head__title">How HumSaath works</h2>
            <SectionDivider />
          </div>
          <div className="howitworks">
            <div className="howitworks__step">
              <div className="howitworks__num">1</div>
              <h3 className="howitworks__title">Host creates the event</h3>
              <p className="howitworks__desc">
                Fill in the event details — name, date, your UPI ID for blessings, and city for
                food. Get a shareable link instantly.
              </p>
            </div>
            <div className="howitworks__step">
              <div className="howitworks__num">2</div>
              <h3 className="howitworks__title">Share with loved ones</h3>
              <p className="howitworks__desc">
                Send the link on WhatsApp to family and friends who can't attend. No app to
                download, no sign-up needed.
              </p>
            </div>
            <div className="howitworks__step">
              <div className="howitworks__num">3</div>
              <h3 className="howitworks__title">Celebrate together</h3>
              <p className="howitworks__desc">
                Guests join live, send blessings and gifts, and order food to eat together.
                After the event, a beautiful summary card is ready to share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="section">
        <div className="container">
          <div className="cta-strip">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, color: 'var(--gold-400)', overflow: 'hidden', paddingTop: '0.5rem' }}>
              <BorderMotif color="var(--gold-400)" className="border-motif-stretch" />
            </div>
            <h2 className="cta-strip__title">Ready to bring everyone together?</h2>
            <p className="cta-strip__text">
              Create your event in under two minutes. Share the link. Let the love flow in from
              every corner of the world.
            </p>
            <Link to="/create" className="btn btn--gold btn--lg">
              Create an Event
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
