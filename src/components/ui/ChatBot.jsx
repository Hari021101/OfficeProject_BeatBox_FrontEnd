import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, X, Send, Bot, User,
  Minimize2, Maximize2, RotateCcw
} from 'lucide-react'
import { BOT_NAME, QUICK_REPLIES, matchIntent } from './chatbotData'

// ── Markdown-lite renderer (bold, line breaks, bullet points) ──
function RenderMessage({ text }) {
  const lines = text.split('\n')
  return (
    <div style={{ lineHeight: '1.6' }}>
      {lines.map((line, i) => {
        // Bold **text**
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <div key={i} style={{ marginBottom: line === '' ? '6px' : '0' }}>
            {parts.map((part, j) =>
              j % 2 === 1
                ? <strong key={j} style={{ color: 'var(--bb-accent)' }}>{part}</strong>
                : <span key={j}>{part}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Typing indicator dots ──────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="bb-typing-dot"
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--bb-accent)', display: 'inline-block'
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

// ── Individual chat bubble ─────────────────────────────────────
function MessageBubble({ msg }) {
  const isBot = msg.role === 'bot'
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        display: 'flex',
        flexDirection: isBot ? 'row' : 'row-reverse',
        gap: '10px',
        alignItems: 'flex-end',
        marginBottom: '14px',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isBot
          ? 'linear-gradient(135deg, #7c3aed, #00f3ff)'
          : 'linear-gradient(135deg, #ff2a6d, #a820ff)',
        boxShadow: isBot
          ? '0 0 16px rgba(0,243,255,0.35)'
          : '0 0 12px rgba(168,32,255,0.3)',
        fontSize: 14,
      }}>
        {isBot ? <Bot size={16} color="#fff" /> : <User size={15} color="#fff" />}
      </div>

      {/* Bubble */}
      <div
        className={isBot ? 'bb-bot-bubble' : 'bb-user-bubble'}
        style={{
          maxWidth: '78%',
          background: isBot
            ? 'linear-gradient(135deg, rgba(0,243,255,0.07), rgba(124,58,237,0.05))'
            : 'linear-gradient(135deg, rgba(168,32,255,0.22), rgba(255,42,109,0.12))',
          border: isBot
            ? '1px solid rgba(0,243,255,0.2)'
            : '1px solid rgba(168,32,255,0.35)',
          borderRadius: isBot ? '6px 18px 18px 18px' : '18px 6px 18px 18px',
          padding: '11px 15px',
          fontSize: '0.84rem',
          color: '#e8ecf0',
          backdropFilter: 'blur(10px)',
          boxShadow: isBot
            ? '0 4px 16px rgba(0,0,0,0.25)'
            : '0 4px 16px rgba(168,32,255,0.15)',
        }}
      >
        {msg.typing ? <TypingDots /> : <RenderMessage text={msg.text} />}

        {/* Optional CTA link */}
        {msg.link && (
          <a
            href={msg.link.path}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: '10px',
              padding: '7px 16px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,243,255,0.3)',
              letterSpacing: '0.3px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {msg.link.label} →
          </a>
        )}

        {/* Timestamp */}
        <div
          className="bb-timestamp"
          style={{
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.28)',
            marginTop: 5,
            textAlign: isBot ? 'left' : 'right'
          }}
        >
          {msg.time}
        </div>
      </div>
    </motion.div>
  )
}

// ── Utility: get current time string ──────────────────────────
function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ── Main ChatBot Component ─────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [minimized, setMin]   = useState(false)
  const [input, setInput]     = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'bot', time: now(),
      text: `👋 Hi there! I'm **BeatBot**, your BeatBox shopping assistant.\n\nHow can I help you today? You can ask me about:\n• 🎧 Products & recommendations\n• 🚚 Shipping & delivery\n• ↩️ Returns & warranty\n• 💰 Deals & offers`,
    }
  ])
  const [typing, setTyping]   = useState(false)
  const [unread, setUnread]   = useState(0)
  const [showHint, setShowHint] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Focus input when chat opens
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open, minimized])

  // Clear unread when opened
  useEffect(() => {
    if (open) { setUnread(0); setShowHint(false) }
  }, [open])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Proactive hint after 4 seconds if chat not opened yet
  useEffect(() => {
    const t = setTimeout(() => { if (!open) setShowHint(true) }, 4000)
    return () => clearTimeout(t)
  }, [])

  const addBotMessage = (intent) => {
    setTyping(true)
    const delay = 700 + Math.random() * 600

    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'bot',
          time: now(),
          text: intent.response,
          link: intent.link || null,
        }
      ])
      if (!open) setUnread(n => n + 1)
    }, delay)
  }

  const handleSend = (textOverride) => {
    const text = (textOverride || input).trim()
    if (!text) return

    // Add user message
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', time: now(), text }])
    setInput('')

    // Match and respond
    const intent = matchIntent(text)
    addBotMessage(intent)
  }

  const handleReset = () => {
    setMessages([{
      id: Date.now(), role: 'bot', time: now(),
      text: `👋 Hi again! I'm **BeatBot**. How can I help you today?`,
    }])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <motion.button
        onClick={() => { setOpen(o => !o); setMin(false) }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 9999,
          width: 58,
          height: 58,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))',
          boxShadow: open
            ? '0 0 0 3px rgba(0,243,255,0.4), 0 12px 35px var(--bb-accent-glow)'
            : '0 8px 30px var(--bb-primary-glow), 0 0 0 1px rgba(168,32,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 0.3s ease',
        }}
        aria-label="Toggle BeatBot Chat"
        id="beatbot-toggle-btn"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} color="#fff" />
            </motion.div>
          ) : (
            <motion.div key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} color="#fff" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {!open && unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute', top: -4, right: -4,
              width: 20, height: 20, borderRadius: '50%',
              background: '#ff2a6d',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800, color: '#fff',
              border: '2px solid var(--bb-bg-navy)',
              boxShadow: '0 0 10px rgba(255,42,109,0.7)',
            }}
          >
            {unread}
          </motion.span>
        )}
      </motion.button>

      {/* Ping ring animation on button */}
      {!open && (
        <motion.div
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 9998,
            width: 58, height: 58, borderRadius: '50%',
            border: '2px solid var(--bb-accent)',
            pointerEvents: 'none',
          }}
          animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Proactive hint bubble */}
      <AnimatePresence>
        {showHint && !open && (
          <motion.div
            id="beatbot-hint"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            style={{
              position: 'fixed', bottom: 100, right: 28, zIndex: 9997,
              background: 'rgba(6,11,25,0.95)',
              border: '1px solid rgba(0,243,255,0.3)',
              borderRadius: '14px 14px 4px 14px',
              padding: '10px 14px',
              maxWidth: 220,
              boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,243,255,0.08)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
            }}
            onClick={() => { setOpen(true); setShowHint(false) }}
          >
            <div className="bb-hint-title" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', marginBottom: 3 }}>
              👋 Need help shopping?
            </div>
            <div className="bb-hint-sub" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)' }}>
              Ask BeatBot — I'm here 24/7!
            </div>
            <button
              className="bb-hint-close"
              onClick={e => { e.stopPropagation(); setShowHint(false) }}
              style={{
                position: 'absolute', top: 6, right: 8,
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0,
              }}
            >×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Window (Centered Modal) ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              key="chat-window"
              id="beatbot-window"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              style={{
                width: '100%',
                maxWidth: '500px',
                height: minimized ? '68px' : '85vh',
                maxHeight: '750px',
                borderRadius: '24px',
                border: '1px solid rgba(0,243,255,0.25)',
                background: 'rgba(5, 9, 22, 0.96)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0,243,255,0.1)'
              }}
            >
            {/* ── Header ── */}
            <div
              className="bb-chat-header"
              style={{
                padding: '14px 18px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(0,243,255,0.06))',
                borderBottom: '1px solid rgba(0,243,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexShrink: 0,
              }}
            >
              {/* Bot avatar with pulse ring */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #00f3ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(0,243,255,0.4)',
                }}>
                  <Bot size={20} color="#fff" />
                </div>
                <span style={{
                  position: 'absolute', bottom: 1, right: 1,
                  width: 11, height: 11, borderRadius: '50%',
                  background: '#00e676',
                  border: '2px solid rgba(5,9,22,0.96)',
                  boxShadow: '0 0 6px #00e676',
                  animation: 'pulse-green 2s infinite',
                }} />
              </div>

              {/* Name & status */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span className="bb-bot-name" style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '0.2px' }}>
                    {BOT_NAME}
                  </span>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.8px',
                    padding: '2px 7px', borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(0,243,255,0.4))',
                    color: '#e0f7ff',
                    border: '1px solid rgba(0,243,255,0.25)',
                  }}>
                    AI
                  </span>
                </div>
                <div className="bb-status-text" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                  🟢 Online · Typically replies instantly
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                <button onClick={handleReset} title="Reset chat" className="bb-icon-btn" style={iconBtnStyle}>
                  <RotateCcw size={13} />
                </button>
                <button onClick={() => setMin(m => !m)} title={minimized ? 'Expand' : 'Minimize'} className="bb-icon-btn" style={iconBtnStyle}>
                  {minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
                </button>
                <button onClick={() => setOpen(false)} title="Close" className="bb-icon-btn"
                  style={{ ...iconBtnStyle, color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.25)' }}>
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            {!minimized && (
              <>
                <div
                  className="bb-messages-area"
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    padding: '16px 14px 8px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0,243,255,0.2) transparent',
                  }}
                >
                  {messages.map(msg => (
                    <MessageBubble key={msg.id} msg={msg} />
                  ))}

                  {/* Typing indicator */}
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}
                    >
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 12px var(--bb-accent-glow)', flexShrink: 0,
                      }}>
                        <Bot size={15} color="#fff" />
                      </div>
                      <div style={{
                        background: 'rgba(0,243,255,0.06)',
                        border: '1px solid rgba(0,243,255,0.18)',
                        borderRadius: '4px 16px 16px 16px',
                        padding: '10px 14px',
                      }}>
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}

                  <div ref={bottomRef} />
                </div>

                {/* ── Quick Replies ── */}
                <div
                  className="bb-quick-replies"
                  style={{
                    padding: '8px 14px',
                    display: 'flex',
                    gap: '7px',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(0,0,0,0.3)',
                    flexShrink: 0,
                  }}
                >
                  <style>{`.beatbot-qr::-webkit-scrollbar{display:none}`}</style>
                  {QUICK_REPLIES.map(qr => (
                    <motion.button
                      key={qr.intent}
                      className="bb-qr-btn"
                      onClick={() => handleSend(qr.label)}
                      whileHover={{ scale: 1.06, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '6px 13px',
                        borderRadius: '20px',
                        border: '1px solid rgba(0,243,255,0.22)',
                        background: 'linear-gradient(135deg, rgba(0,243,255,0.07), rgba(124,58,237,0.05))',
                        color: 'rgba(255,255,255,0.82)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        letterSpacing: '0.2px',
                      }}
                    >
                      {qr.label}
                    </motion.button>
                  ))}
                </div>

                {/* ── Input Area ── */}
                <div
                  className="bb-input-area"
                  style={{
                    padding: '12px 14px 16px',
                    background: 'rgba(0,0,0,0.35)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                    <input
                      ref={inputRef}
                      id="beatbot-input"
                      value={input}
                      onChange={e => setInput(e.target.value.slice(0, 300))}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything about BeatBox..."
                      maxLength={300}
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(0,243,255,0.18)',
                        borderRadius: '26px',
                        padding: '10px 18px',
                        color: '#e8ecf0',
                        fontSize: '0.86rem',
                        outline: 'none',
                        transition: 'border-color 0.25s, box-shadow 0.25s',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#00f3ff'
                        e.target.style.boxShadow = '0 0 0 3px rgba(0,243,255,0.12), 0 2px 12px rgba(0,0,0,0.3)'
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(0,243,255,0.18)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                    <motion.button
                      onClick={() => handleSend()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.88, rotate: 15 }}
                      disabled={!input.trim()}
                      style={{
                        width: 42, height: 42,
                        borderRadius: '50%',
                        border: 'none',
                        cursor: input.trim() ? 'pointer' : 'default',
                        background: input.trim()
                          ? 'linear-gradient(135deg, #7c3aed, #00f3ff)'
                          : 'rgba(255,255,255,0.07)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: input.trim() ? '0 4px 18px rgba(0,243,255,0.35)' : 'none',
                        transition: 'all 0.25s ease',
                      }}
                      aria-label="Send message"
                      id="beatbot-send-btn"
                    >
                      <Send size={17} color={input.trim() ? '#fff' : 'rgba(255,255,255,0.25)'} />
                    </motion.button>
                  </div>
                  {input.length > 200 && (
                    <div
                      className={`bb-char-counter${input.length > 270 ? ' warn' : ''}`}
                      style={{ fontSize: '0.65rem', textAlign: 'right', marginTop: 4 }}
                    >
                      {input.length}/300
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline keyframes + comprehensive light mode */}
      <style>{`
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 6px #00e676; }
          50% { box-shadow: 0 0 14px #00e676, 0 0 4px #00e676; }
        }
        #beatbot-toggle-btn { outline: none; }

        /* ── Light Mode Overrides ── */
        [data-theme="light"] #beatbot-window {
          background: rgba(248, 250, 255, 0.98) !important;
          border-color: rgba(0, 120, 180, 0.2) !important;
          box-shadow: 0 32px 80px rgba(0,0,100,0.12), 0 0 0 1px rgba(0,120,180,0.1) !important;
        }

        /* Header */
        [data-theme="light"] #beatbot-window .bb-chat-header {
          background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(0,180,220,0.08)) !important;
          border-bottom-color: rgba(0,120,180,0.15) !important;
        }
        [data-theme="light"] #beatbot-window .bb-bot-name { color: #0f172a !important; }
        [data-theme="light"] #beatbot-window .bb-status-text { color: rgba(0,0,0,0.45) !important; }

        /* Messages area */
        [data-theme="light"] #beatbot-window .bb-messages-area {
          background: #f5f7ff !important;
        }

        /* Bot bubble */
        [data-theme="light"] #beatbot-window .bb-bot-bubble {
          background: linear-gradient(135deg, rgba(0,140,200,0.08), rgba(124,58,237,0.05)) !important;
          border-color: rgba(0,140,200,0.22) !important;
          color: #0f172a !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.07) !important;
        }

        /* User bubble */
        [data-theme="light"] #beatbot-window .bb-user-bubble {
          background: linear-gradient(135deg, rgba(124,58,237,0.18), rgba(168,32,255,0.12)) !important;
          border-color: rgba(124,58,237,0.3) !important;
          color: #0f172a !important;
          box-shadow: 0 2px 10px rgba(124,58,237,0.15) !important;
        }

        /* Bold text inside bubbles */
        [data-theme="light"] #beatbot-window .bb-bot-bubble strong,
        [data-theme="light"] #beatbot-window .bb-user-bubble strong {
          color: #0078b4 !important;
        }

        /* Timestamp */
        [data-theme="light"] #beatbot-window .bb-timestamp { color: rgba(0,0,0,0.3) !important; }

        /* Quick replies strip */
        [data-theme="light"] #beatbot-window .bb-quick-replies {
          background: rgba(0,0,0,0.04) !important;
          border-top-color: rgba(0,0,0,0.08) !important;
        }
        [data-theme="light"] #beatbot-window .bb-qr-btn {
          background: rgba(0,120,200,0.07) !important;
          border-color: rgba(0,120,200,0.2) !important;
          color: #0f172a !important;
        }

        /* Input area */
        [data-theme="light"] #beatbot-window .bb-input-area {
          background: rgba(0,0,0,0.04) !important;
          border-top-color: rgba(0,0,0,0.08) !important;
        }
        [data-theme="light"] #beatbot-window #beatbot-input {
          background: rgba(255,255,255,0.9) !important;
          color: #0f172a !important;
          border-color: rgba(0,120,200,0.25) !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08) !important;
        }
        [data-theme="light"] #beatbot-window #beatbot-input::placeholder {
          color: rgba(0,0,0,0.38) !important;
        }
        [data-theme="light"] #beatbot-window #beatbot-input:focus {
          border-color: #0078b4 !important;
          box-shadow: 0 0 0 3px rgba(0,120,180,0.15) !important;
        }

        /* Icon buttons */
        [data-theme="light"] #beatbot-window .bb-icon-btn {
          border-color: rgba(0,0,0,0.12) !important;
          background: rgba(0,0,0,0.04) !important;
          color: #374151 !important;
        }

        /* Typing dots */
        [data-theme="light"] #beatbot-window .bb-typing-dot {
          background: #0078b4 !important;
        }

        /* Counter */
        [data-theme="light"] #beatbot-window .bb-char-counter { color: rgba(0,0,0,0.35) !important; }
        [data-theme="light"] #beatbot-window .bb-char-counter.warn { color: #dc2626 !important; }

        /* Proactive hint bubble */
        [data-theme="light"] #beatbot-hint {
          background: rgba(255,255,255,0.97) !important;
          border-color: rgba(0,120,180,0.25) !important;
          box-shadow: 0 8px 30px rgba(0,0,100,0.1) !important;
        }
        [data-theme="light"] #beatbot-hint .bb-hint-title { color: #0f172a !important; }
        [data-theme="light"] #beatbot-hint .bb-hint-sub { color: rgba(0,0,0,0.5) !important; }
        [data-theme="light"] #beatbot-hint .bb-hint-close { color: rgba(0,0,0,0.4) !important; }
      `}</style>
    </>
  )
}

// ── Shared icon button style ───────────────────────────────────
const iconBtnStyle = {
  width: 28, height: 28, borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
  transition: 'all 0.2s',
}
