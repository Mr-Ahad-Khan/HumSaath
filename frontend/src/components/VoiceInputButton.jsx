/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'

export function VoiceInputButton({ onTranscript, language = 'en-IN', label = 'Use voice input' }) {
  const recognitionRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [unsupported, setUnsupported] = useState(false)
  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) { setUnsupported(true); return undefined }
    const recognition = new Recognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onresult = (event) => onTranscript(event.results[0][0].transcript)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    return () => recognition.abort()
  }, [onTranscript])
  function toggleListening() {
    const recognition = recognitionRef.current
    if (!recognition) return
    if (listening) recognition.stop()
    else { recognition.lang = language; setListening(true); recognition.start() }
  }
  if (unsupported) return null
  return <button type="button" className={`voice-button ${listening ? 'voice-button--active' : ''}`} onClick={toggleListening} aria-label={label} title={label}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v4M8 22h8" /></svg><span>{listening ? 'Listening…' : 'Speak'}</span></button>
}
