import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/apiClient.js'
import { buildUpiLink, buildFoodLink, formatINR } from '../lib/slug.js'
import { GIFTS } from '../lib/gifts.js'
import { GiftIcon } from '../components/GiftIcon.jsx'
import { SectionDivider } from '../components/Motifs.jsx'
import { VoiceInputButton } from '../components/VoiceInputButton.jsx'
import { CelebrationWall } from '../components/CelebrationWall.jsx'
import '../event.css'

const PRESET_AMOUNTS = [101, 501, 1001]
const LANGUAGES = {
  en: { label: 'English', locale: 'en-IN', speech: 'en-IN', live: 'Live Ceremony', hosted: 'Hosted by', gift: 'Send a Gift', giftSub: 'Choose something special for', blessing: 'Send a Blessing', blessingSub: 'Send shagun directly to', name: 'Your Name', namePlaceholder: 'Enter your name', note: 'Note (optional)', notePlaceholder: 'A message for the host', send: 'Send Blessing', eat: 'Eat Together', eatText: 'Order your favourite dish and join the celebration', wallTitle: 'Celebration Wall', wallSubtitle: 'Share your joy with the family', reactions: 'reactions', wallName: 'Your name (optional)', commentPlaceholder: 'Write a warm wish…', postComment: 'Post wish', commentRequired: 'Please write a wish first.', guest: 'Guest' },
  hi: { label: 'हिंदी', locale: 'hi-IN', speech: 'hi-IN', live: 'लाइव समारोह', hosted: 'मेज़बान', gift: 'उपहार भेजें', giftSub: 'के लिए कुछ खास चुनें', blessing: 'शगुन भेजें', blessingSub: 'को सीधे UPI से शगुन भेजें', name: 'आपका नाम', namePlaceholder: 'अपना नाम लिखें', note: 'संदेश (वैकल्पिक)', notePlaceholder: 'मेज़बान के लिए संदेश', send: 'शगुन भेजें', eat: 'साथ में खाएँ', eatText: 'अपना पसंदीदा खाना ऑर्डर करें और उत्सव में शामिल हों', wallTitle: 'उत्सव दीवार', wallSubtitle: 'परिवार के साथ अपनी खुशी बाँटें', reactions: 'प्रतिक्रियाएं', wallName: 'आपका नाम (वैकल्पिक)', commentPlaceholder: 'शुभकामना लिखें…', postComment: 'शुभकामना भेजें', commentRequired: 'कृपया पहले शुभकामना लिखें।', guest: 'मेहमान' },
  ur: { label: 'اردو', locale: 'ur-PK', speech: 'ur-PK', live: 'براہِ راست تقریب', hosted: 'میزبان', gift: 'تحفہ بھیجیں', giftSub: 'کے لیے کچھ خاص منتخب کریں', blessing: 'نذرانہ بھیجیں', blessingSub: 'کو براہِ راست UPI سے نذرانہ بھیجیں', name: 'آپ کا نام', namePlaceholder: 'اپنا نام درج کریں', note: 'پیغام (اختیاری)', notePlaceholder: 'میزبان کے لیے پیغام', send: 'نذرانہ بھیجیں', eat: 'ساتھ کھائیں', eatText: 'اپنا پسندیدہ کھانا آرڈر کریں اور تقریب میں شامل ہوں', wallTitle: 'تقریب کی وال', wallSubtitle: 'خاندان کے ساتھ اپنی خوشی بانٹیں', reactions: 'ردعمل', wallName: 'آپ کا نام (اختیاری)', commentPlaceholder: 'نیک خواہش لکھیں…', postComment: 'خواہش بھیجیں', commentRequired: 'براہ کرم پہلے نیک خواہش لکھیں۔', guest: 'مہمان' },
}

export default function EventPage() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Blessing form state
  const [guestName, setGuestName] = useState('')
  const [amount, setAmount] = useState(501)
  const [customAmount, setCustomAmount] = useState('')
  const [note, setNote] = useState('')
  const [blessingError, setBlessingError] = useState('')
  const [blessingLogged, setBlessingLogged] = useState(false)
  const [language, setLanguage] = useState('en')

  // Summary state
  const [totalAmount, setTotalAmount] = useState(0)
  const [wellwisherCount, setWellwisherCount] = useState(0)

  const logTimeoutRef = useRef(null)

  // Load event
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      if (cancelled) return
      try {
        const data = await api.events.get(slug)
        if (cancelled) return
        setEvent(data.event)
        setTotalAmount(data.totals.blessingAmount)
        setWellwisherCount(data.totals.wellwisherCount)
      } catch (err) { setError(err.message || 'Event not found. Please check your link.') }
      finally { if (!cancelled) setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [slug])

  // Load blessing totals
  const loadTotals = useCallback(async () => {
    if (!event) return
    const data = await api.events.get(event.slug)
    setTotalAmount(data.totals.blessingAmount)
    setWellwisherCount(data.totals.wellwisherCount)
  }, [event])

  useEffect(() => {
    loadTotals()
  }, [loadTotals])

  // Determine if event is in the past
  const eventDate = event ? new Date(event.event_date + 'T23:59:59') : null
  const isPast = eventDate ? eventDate < new Date() : false

  const effectiveAmount = customAmount ? Number(customAmount) : amount
  const t = LANGUAGES[language]

  function handleAmountChip(value) {
    setAmount(value)
    setCustomAmount('')
  }

  function handleCustomAmount(value) {
    const num = value.replace(/[^0-9]/g, '')
    setCustomAmount(num)
  }

  async function handleSendBlessing() {
    setBlessingError('')
    if (!guestName.trim()) {
      setBlessingError('Please enter your name so the host knows who blessed them.')
      return
    }
    if (!effectiveAmount || effectiveAmount < 1) {
      setBlessingError('Please choose or enter a valid amount.')
      return
    }

    // Log the blessing attempt
    try {
      await api.events.addBlessing(event.slug, { guestName: guestName.trim(), amount: effectiveAmount, note: note.trim() })
    } catch {
      setBlessingError('Could not log your blessing. Please try again.')
      return
    }

    setBlessingLogged(true)
    loadTotals()

    // Open UPI deep link
    const upiLink = buildUpiLink({
      upiId: event.host_upi,
      payeeName: event.host_name,
      amount: effectiveAmount,
      note: note.trim() || `Shagun from ${guestName.trim()}`,
    })
    window.location.href = upiLink

    // Reset logged indicator after a delay
    if (logTimeoutRef.current) clearTimeout(logTimeoutRef.current)
    logTimeoutRef.current = setTimeout(() => setBlessingLogged(false), 5000)
  }

  async function handleGiftClick() {
    // Increment gift counter
    await api.events.addEngagement(event.slug, 'gift')
    setEvent((prev) => ({ ...prev, gifts_sent: (prev.gifts_sent || 0) + 1 }))
  }

  async function handleEatTogether() {
    await api.events.addEngagement(event.slug, 'eatTogether')
    setEvent((prev) => ({ ...prev, eat_together_count: (prev.eat_together_count || 0) + 1 }))
  }

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="event-page">
        <div className="container">
          <div className="state-box">
            <div className="state-box__icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="24" cy="24" r="20" strokeDasharray="4 4" />
                <circle cx="24" cy="24" r="6" fill="currentColor" />
              </svg>
            </div>
            <p className="text-muted">Loading the celebration…</p>
          </div>
        </div>
      </div>
    )
  }

  // ---- Error state ----
  if (error) {
    return (
      <div className="event-page">
        <div className="container">
          <div className="state-box">
            <div className="state-box__icon" style={{ color: 'var(--maroon-500)' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="24" cy="24" r="20" />
                <path d="M16 16l16 16M32 16L16 32" />
              </svg>
            </div>
            <h3>{error}</h3>
            <Link to="/" className="btn btn--outline mt-3">Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  const jitsiUrl = `https://meet.jit.si/${event.jitsi_room}#config.startWithVideoMuted=true&config.startWithAudioMuted=false&interfaceConfig.SHOW_CHROME_EXTENSION_BANNER=false`

  return (
    <div className="event-page">
      <div className="container">
        {/* Header */}
        <div className="event-page__head fade-in">
          <Link to="/" className="event-page__backlink">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            HumSaath
          </Link>
          <span className="event-page__type">{event.event_type}</span>
          <label className="language-picker"><span className="sr-only">Language</span><select value={language} onChange={(e) => setLanguage(e.target.value)}>{Object.entries(LANGUAGES).map(([code, item]) => <option key={code} value={code}>{item.label}</option>)}</select></label>
          <h1 className="event-page__title">{event.event_name}</h1>
          <div className="event-page__meta">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>
              {new Date(event.event_date).toLocaleDateString(t.locale, { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>
              {t.hosted} {event.host_name}
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z" /><circle cx="12" cy="9" r="2.5" /></svg>
              {event.city}
            </span>
          </div>
        </div>

        {/* Event ended banner */}
        {isPast && (
          <div className="event-ended-banner">
            This event has concluded. <Link to={`/event/${event.slug}/summary`}>View the celebration summary &rarr;</Link>
          </div>
        )}

        <SectionDivider />

        {/* Main layout */}
        <div className="event-layout">
          {/* Video + gifts */}
          <div>
            <div className="video-section">
              <div className="video-section__head">
                <span className="video-section__label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="14" height="14" rx="2" /><path d="M16 9l5-3v12l-5-3" /></svg>
                  {t.live}
                </span>
                {!isPast && <span className="video-section__live"><span className="live-dot" />LIVE</span>}
              </div>
              <div className="video-section__embed">
                <iframe
                  src={jitsiUrl}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  allowFullScreen
                  title="Live ceremony video"
                />
              </div>
            </div>

            {/* Gifts section */}
            <div className="gifts-card mt-3">
              <h3 className="gifts-card__title">{t.gift}</h3>
              <p className="gifts-card__sub">
                {t.giftSub} {event.host_name}. Gifts ship to their address.
              </p>
              <div className="gifts-grid">
                {GIFTS.map((gift) => (
                  <a
                    key={gift.id}
                    href={gift.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gift-tile"
                    onClick={handleGiftClick}
                  >
                    <GiftIcon name={gift.icon} size={36} className="gift-tile__icon" />
                    <span className="gift-tile__name">{gift.name}</span>
                    <span className="gift-tile__desc">{gift.description}</span>
                    <span className="gift-tile__badge">View on Amazon →</span>
                  </a>
                ))}
              </div>
              <p className="form-hint mt-2">
                Delivery address: {event.delivery_address}
              </p>
            </div>
            <CelebrationWall slug={event.slug} copy={{ ...t, namePlaceholder: t.wallName }} />
          </div>

          {/* Side panel: blessing + eat together */}
          <div className="event-side">
            {/* Blessing card */}
            <div className="blessing-card">
              <div className="blessing-card__head">
                <div className="blessing-card__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14 2 9.5h7.5z" /></svg>
                </div>
                <div>
                  <h3 className="blessing-card__title">{t.blessing}</h3>
                  <p className="blessing-card__sub">{t.blessingSub} {event.host_name} via UPI</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="guest_name">{t.name}</label>
                <input
                  id="guest_name"
                  className="form-input"
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
                <VoiceInputButton language={t.speech} onTranscript={(value) => setGuestName((current) => `${current}${current ? ' ' : ''}${value}`)} label="Speak your name" />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <div className="amount-chips">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`amount-chip ${!customAmount && amount === amt ? 'amount-chip--active' : ''}`}
                      onClick={() => handleAmountChip(amt)}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  className="form-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="Or enter a custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="note">{t.note}</label>
                <input
                  id="note"
                  className="form-input"
                  type="text"
                  placeholder={t.notePlaceholder}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <VoiceInputButton language={t.speech} onTranscript={(value) => setNote((current) => `${current}${current ? ' ' : ''}${value}`)} label="Speak your message" />
              </div>

              {blessingError && <div className="alert alert--error">{blessingError}</div>}
              {blessingLogged && <div className="alert alert--info">Your blessing has been recorded! Opening UPI…</div>}

              <button className="btn btn--gold btn--block mt-2" onClick={handleSendBlessing}>
                {t.send} ₹{effectiveAmount || 0}
              </button>

              <div className="blessing-total">
                <div className="blessing-total__amount">{formatINR(totalAmount)}</div>
                <div className="blessing-total__label">collected from {wellwisherCount} {wellwisherCount === 1 ? 'well-wisher' : 'well-wishers'} so far</div>
              </div>
            </div>

            {/* Eat together card */}
            <a
              href={buildFoodLink(event.city)}
              target="_blank"
              rel="noopener noreferrer"
              className="eat-card"
              onClick={handleEatTogether}
            >
              <svg className="eat-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 3v9a3 3 0 003 3v6" />
                <path d="M9 3v6M6 3h6" />
                <path d="M17 3c-1.5 0-3 2-3 5s1.5 4 3 4v9" />
              </svg>
              <h3 className="eat-card__title">{t.eat}</h3>
              <p className="eat-card__text">{t.eatText}</p>
              <p className="eat-card__city">Food delivery in {event.city} →</p>
            </a>

            {isPast && (
              <Link to={`/event/${event.slug}/summary`} className="btn btn--outline btn--block">
                View Celebration Summary
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
