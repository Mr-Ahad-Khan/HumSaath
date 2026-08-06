import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/apiClient.js'
import { generateSlug, jitsiRoomFromSlug } from '../lib/slug.js'
import { SectionDivider } from '../components/Motifs.jsx'

const EVENT_TYPES = ['Mehendi', 'Sangeet', 'Nikah', 'Walima', 'Baraat', 'Rukhsati']
const publicSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL?.replace(/\/$/, '')

const initialForm = {
  event_name: '',
  event_type: 'Nikah',
  event_date: '',
  host_name: '',
  host_upi: '',
  delivery_address: '',
  city: '',
}

export default function CreateEventPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [createdEvent, setCreatedEvent] = useState(null)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.event_name.trim()) e.event_name = 'Please enter the event name'
    if (!form.event_type) e.event_type = 'Select an event type'
    if (!form.event_date) e.event_date = 'Pick the event date'
    if (!form.host_name.trim()) e.host_name = 'Enter the host name'
    if (!form.host_upi.trim()) e.host_upi = 'Enter your UPI ID for receiving blessings'
    else if (!/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z0-9.\-_]{2,}$/.test(form.host_upi.trim()))
      e.host_upi = 'Enter a valid UPI ID (e.g. name@upi)'
    if (!form.delivery_address.trim()) e.delivery_address = 'Enter a delivery address for gifts'
    if (!form.city.trim()) e.city = 'Enter your city for food suggestions'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setServerError('')
    if (!validate()) return

    setSubmitting(true)
    const slug = generateSlug(form.event_name)
    const payload = {
      slug,
      eventName: form.event_name.trim(),
      eventType: form.event_type,
      eventDate: form.event_date,
      hostName: form.host_name.trim(),
      hostUpi: form.host_upi.trim(),
      deliveryAddress: form.delivery_address.trim(),
      city: form.city.trim(),
      jitsiRoom: jitsiRoomFromSlug(slug),
    }

    try {
      const { event } = await api.events.create(payload)
      setCreatedEvent({ ...event, id: event._id })
    } catch (error) {
      setServerError(error.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }
    setSubmitting(false)
  }

  function handleReset() {
    setCreatedEvent(null)
    setForm(initialForm)
  }

  if (createdEvent) {
    // Preview deployments can be access-protected. Always prefer the public,
    // production site URL for links sent to guests.
    const shareUrl = `${publicSiteUrl || window.location.origin}/event/${createdEvent.slug}`
    return (
      <div className="create-page">
        <div className="container">
          <div className="create-success fade-in">
            <div className="create-success__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2>Your event is ready!</h2>
            <p className="text-muted mt-2">
              Share this link with your family and friends on WhatsApp. They can join without any
              sign-up.
            </p>
            <div className="create-success__link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-600)" strokeWidth="1.5">
                <path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" />
                <path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" />
              </svg>
              <span>{shareUrl}</span>
            </div>
            <div className="create-success__actions">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`You're invited! Join ${createdEvent.event_name} on HumSaath: ${shareUrl}`)}`}
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
              <Link to={`/event/${createdEvent.slug}`} className="btn btn--primary">
                Open Event Page
              </Link>
            </div>
            <button className="btn btn--outline mt-3" onClick={handleReset} style={{ fontSize: '0.85rem' }}>
              Create another event
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="create-page">
      <div className="container">
        <div className="create-page__head">
          <p className="section-head__eyebrow">Host your celebration</p>
          <h2>Create an Event</h2>
          <SectionDivider />
          <p className="text-muted mt-2" style={{ maxWidth: '34em', margin: '0 auto' }}>
            Fill in the details below. We'll generate a shareable link you can send to your guests
            right away.
          </p>
        </div>

        {serverError && <div className="alert alert--error" style={{ maxWidth: 640, margin: '0 auto var(--space-2)' }}>{serverError}</div>}

        <form className="create-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="event_name">
              Event Name <span className="req">*</span>
            </label>
            <input
              id="event_name"
              className="form-input"
              type="text"
              placeholder="e.g. Aisha & Daniyal's Nikah"
              value={form.event_name}
              onChange={(e) => updateField('event_name', e.target.value)}
            />
            {errors.event_name && <p className="form-error">{errors.event_name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Event Type <span className="req">*</span></label>
            <div className="event-types">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`event-type-chip ${form.event_type === type ? 'event-type-chip--active' : ''}`}
                  onClick={() => updateField('event_type', type)}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.event_type && <p className="form-error">{errors.event_type}</p>}
          </div>

          <div className="form-row form-row--2">
            <div className="form-group">
              <label className="form-label" htmlFor="event_date">
                Event Date <span className="req">*</span>
              </label>
              <input
                id="event_date"
                className="form-input"
                type="date"
                value={form.event_date}
                onChange={(e) => updateField('event_date', e.target.value)}
              />
              {errors.event_date && <p className="form-error">{errors.event_date}</p>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="host_name">
                Host Name <span className="req">*</span>
              </label>
              <input
                id="host_name"
                className="form-input"
                type="text"
                placeholder="e.g. Imran Khan"
                value={form.host_name}
                onChange={(e) => updateField('host_name', e.target.value)}
              />
              {errors.host_name && <p className="form-error">{errors.host_name}</p>}
            </div>
          </div>

          <div className="form-row form-row--2">
            <div className="form-group">
              <label className="form-label" htmlFor="host_upi">
                Your UPI ID <span className="req">*</span>
              </label>
              <input
                id="host_upi"
                className="form-input"
                type="text"
                placeholder="e.g. imran@okhdfcbank"
                value={form.host_upi}
                onChange={(e) => updateField('host_upi', e.target.value)}
              />
              <p className="form-hint">Blessings (shagun) will be sent directly to this UPI ID.</p>
              {errors.host_upi && <p className="form-error">{errors.host_upi}</p>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="city">
                City <span className="req">*</span>
              </label>
              <input
                id="city"
                className="form-input"
                type="text"
                placeholder="e.g. Lucknow"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
              />
              <p className="form-hint">Used to suggest food delivery options for "Eat Together".</p>
              {errors.city && <p className="form-error">{errors.city}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="delivery_address">
              Delivery Address <span className="req">*</span>
            </label>
            <textarea
              id="delivery_address"
              className="form-textarea"
              placeholder="Where gifts should be delivered"
              value={form.delivery_address}
              onChange={(e) => updateField('delivery_address', e.target.value)}
            />
            <p className="form-hint">Shown to guests so they know where to send gifts.</p>
            {errors.delivery_address && <p className="form-error">{errors.delivery_address}</p>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Event & Get Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
