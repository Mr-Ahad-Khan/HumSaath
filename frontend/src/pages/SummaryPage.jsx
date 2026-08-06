import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/apiClient.js'
import { formatINR } from '../lib/slug.js'
import { BorderMotif } from '../components/Motifs.jsx'
import '../event.css'

export default function SummaryPage() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [totals, setTotals] = useState({ blessingAmount: 0, wellwisherCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await api.events.get(slug)
        if (cancelled) return
        setEvent(data.event)
        setTotals(data.totals)
      } catch (err) { setError(err.message || 'Event not found.') }
      finally { if (!cancelled) setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className="summary-page">
        <div className="state-box">
          <p className="text-muted">Loading summary…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="summary-page">
        <div className="state-box">
          <h3>{error}</h3>
          <Link to="/" className="btn btn--outline mt-3">Back to Home</Link>
        </div>
      </div>
    )
  }

  const totalAmount = totals.blessingAmount
  const wellwishers = totals.wellwisherCount
  const giftsSent = event.gifts_sent || 0
  const eatTogether = event.eat_together_count || 0
  const shareText = `${event.event_name} — Celebrated together on HumSaath! ${formatINR(totalAmount)} in blessings from ${wellwishers} well-wishers, ${giftsSent} gifts sent, and ${eatTogether} joined to eat together. Jahan bhi ho, HumSaath.`
  const shareUrl = window.location.href

  return (
    <div className="summary-page">
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Shareable card */}
        <div className="summary-card fade-in">
          <div className="summary-card__border-top">
            <BorderMotif color="var(--maroon-900)" className="border-motif-stretch" />
          </div>
          <div className="summary-card__body">
            <p className="summary-card__brand">HumSaath</p>
            <p className="summary-card__tagline">Jahan bhi ho, HumSaath</p>

            <div className="summary-card__divider" />

            <h2 className="summary-card__event-name">{event.event_name}</h2>
            <p className="summary-card__event-type">
              {event.event_type} · {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <div className="summary-card__stats">
              <div className="summary-stat summary-stat--full">
                <div className="summary-stat__value">{formatINR(totalAmount)}</div>
                <div className="summary-stat__label">in blessings collected</div>
              </div>
              <div className="summary-stat">
                <div className="summary-stat__value">{wellwishers}</div>
                <div className="summary-stat__label">well-wishers</div>
              </div>
              <div className="summary-stat">
                <div className="summary-stat__value">{giftsSent}</div>
                <div className="summary-stat__label">gifts sent</div>
              </div>
              <div className="summary-stat summary-stat--full">
                <div className="summary-stat__value">{eatTogether}</div>
                <div className="summary-stat__label">joined to eat together</div>
              </div>
            </div>

            <p className="summary-card__message">
              "Door theek hai, par HumSaath zaroor."
            </p>
          </div>
          <div className="summary-card__border-bottom">
            <BorderMotif color="var(--maroon-900)" className="border-motif-stretch" />
          </div>
          <div className="summary-card__footer">
            HumSaath · humsaath.app
          </div>
        </div>

        {/* Share actions */}
        <div className="summary-actions">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--emerald"
          >
            Share on WhatsApp
          </a>
          <button
            className="btn btn--outline"
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
          >
            Copy Link
          </button>
          <Link to={`/event/${event.slug}`} className="btn btn--outline">
            Back to Event
          </Link>
        </div>
      </div>
    </div>
  )
}
