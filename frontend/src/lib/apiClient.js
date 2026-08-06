// A relative URL works both locally (through Vite's proxy) and in Vercel,
// where the Express app is exposed as a serverless function at /api.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || 'Request failed');
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

function toClientEvent(event) {
  if (!event) return event
  return {
    ...event,
    id: event._id,
    event_name: event.eventName,
    event_type: event.eventType,
    event_date: event.eventDate,
    host_name: event.hostName,
    host_upi: event.hostUpi,
    delivery_address: event.deliveryAddress,
    jitsi_room: event.jitsiRoom,
    gifts_sent: event.giftsSent,
    eat_together_count: event.eatTogetherCount,
  }
}

export const api = {
  health: () => request('/health'),
  events: {
    create: async (payload) => {
      const data = await request('/events', { method: 'POST', body: JSON.stringify(payload) })
      return { ...data, event: toClientEvent(data.event) }
    },
    get: async (slug) => {
      const data = await request(`/events/${encodeURIComponent(slug)}`)
      return { ...data, event: toClientEvent(data.event) }
    },
    addBlessing: (slug, payload) => request(`/events/${encodeURIComponent(slug)}/blessings`, { method: 'POST', body: JSON.stringify(payload) }),
    addComment: (slug, payload) => request(`/events/${encodeURIComponent(slug)}/comments`, { method: 'POST', body: JSON.stringify(payload) }),
    addReaction: (slug, type) => request(`/events/${encodeURIComponent(slug)}/reactions`, { method: 'POST', body: JSON.stringify({ type }) }),
    addEngagement: (slug, type) => request(`/events/${encodeURIComponent(slug)}/engagement`, { method: 'POST', body: JSON.stringify({ type }) })
  }
};
