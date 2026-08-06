// Generate a unique shareable slug from an event name.
export function generateSlug(eventName) {
  const base = eventName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base || 'event'}-${suffix}`
}

// Derive a Jitsi room name from a slug (alphanumeric + hyphens only).
export function jitsiRoomFromSlug(slug) {
  return `humsaath-${slug}`
}

// Build a UPI deep link for sending a blessing.
export function buildUpiLink({ upiId, payeeName, amount, note }) {
  const params = new URLSearchParams()
  params.set('pa', upiId)
  params.set('pn', payeeName)
  if (amount) params.set('am', amount.toString())
  params.set('cu', 'INR')
  if (note) params.set('tn', note)
  return `upi://pay?${params.toString()}`
}

// Build a Swiggy search deep link for a city.
export function buildFoodLink(city) {
  // Swiggy supports city-scoped search via the public URL.
  const citySlug = city.toLowerCase().trim().replace(/\s+/g, '-')
  return `https://www.swiggy.com/city/${encodeURIComponent(citySlug)}`
}

// Format currency in INR.
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
