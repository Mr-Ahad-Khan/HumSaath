/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/apiClient.js'

const REACTIONS = [{ emoji: '❤️', name: 'Love' }, { emoji: '👏', name: 'Applause' }, { emoji: '🎉', name: 'Celebrate' }, { emoji: '🤲', name: 'Blessings' }]

export function CelebrationWall({ slug, copy }) {
  const [reactions, setReactions] = useState({})
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const totalReactions = useMemo(() => Object.values(reactions).reduce((sum, value) => sum + value, 0), [reactions])

  useEffect(() => {
    let cancelled = false
    api.events.get(slug).then((data) => {
      if (cancelled) return
      setReactions(Object.fromEntries(data.reactions.map((reaction) => [reaction.type, reaction.count])))
      setComments(data.comments)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [slug])

  async function react(type) {
    try {
      const { reaction } = await api.events.addReaction(slug, type)
      setReactions((current) => ({ ...current, [type]: reaction.count }))
    } catch { setError('Could not save your reaction. Please try again.') }
  }

  async function postComment(event) {
    event.preventDefault()
    if (!message.trim()) { setError(copy.commentRequired); return }
    try {
      const { comment } = await api.events.addComment(slug, { guestName: name.trim() || copy.guest, message: message.trim() })
      setComments((current) => [comment, ...current])
      setName(''); setMessage(''); setError('')
    } catch { setError('Could not post your wish. Please try again.') }
  }

  return <section className="wall-card" aria-label={copy.wallTitle}><div className="wall-card__head"><div><h3>{copy.wallTitle}</h3><p>{copy.wallSubtitle}</p></div><span className="wall-card__count">{totalReactions} {copy.reactions}</span></div><div className="reaction-row">{REACTIONS.map(({ emoji, name: reactionName }) => <button key={reactionName} type="button" className="reaction-button" onClick={() => react(reactionName)} aria-label={reactionName}>{emoji}<span>{reactions[reactionName] || 0}</span></button>)}</div><form className="comment-form" onSubmit={postComment}><input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={copy.namePlaceholder} maxLength="50" /><textarea className="form-textarea" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={copy.commentPlaceholder} maxLength="280" rows="3" />{error && <p className="form-error">{error}</p>}<button className="btn btn--primary" type="submit">{copy.postComment}</button></form>{comments.length > 0 && <div className="comment-list">{comments.map((comment) => <article className="comment" key={comment._id}><div className="comment__avatar">{comment.guestName.charAt(0).toUpperCase()}</div><div><strong>{comment.guestName}</strong><p>{comment.message}</p></div></article>)}</div>}</section>
}
