import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Package, Tag, Heart, Info, CheckCheck, Trash2, AlertTriangle } from 'lucide-react'
import { useSelector } from 'react-redux'
import notificationService from '../../services/notificationService'
import * as signalR from '@microsoft/signalr'
import toast from 'react-hot-toast'

// ─── Notification types config ────────────────────────────────────────────────
const TYPE_CONFIG = {
  order:   { Icon: Package, color: '#00f3ff', bg: 'rgba(0,243,255,0.1)'   },
  promo:   { Icon: Tag,     color: '#a820ff', bg: 'rgba(168,32,255,0.1)'  },
  wishlist:{ Icon: Heart,   color: '#ff4d7d', bg: 'rgba(255,77,125,0.1)'  },
  info:    { Icon: Info,    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  alert:   { Icon: AlertTriangle, color: '#ff3333', bg: 'rgba(255,51,51,0.1)' },
}

// ─── Time formatting ──────────────────────────────────────────────────────────
function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60)  return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NotificationsPanel() {
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const [filter, setFilter] = useState('all')
  const panelRef = useRef(null)

  // Fetch initial notifications from DB
  useEffect(() => {
    if (!user) return;
    
    const loadNotifs = async () => {
      try {
        const data = await notificationService.getNotifications();
        const mapped = data.map(n => ({
          id: n.id,
          type: n.title.toLowerCase().includes('order') ? 'order' 
                : n.title.toLowerCase().includes('stock') ? 'alert' 
                : 'info',
          title: n.title,
          body: n.message,
          time: new Date(n.createdAt),
          read: n.isRead,
        }));
        
        // No mock data - only display real notifications from the DB
        
        setNotifs(mapped.sort((a, b) => b.time - a.time));
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };
    
    loadNotifs();
  }, [user]);

  // Setup SignalR Real-time Connection
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('bb_token');
    let isMounted = true;
    
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7142/hubs/notifications", {
        accessTokenFactory: () => token
      })
      .configureLogging(signalR.LogLevel.Warning) // Hides Information logs
      .withAutomaticReconnect()
      .build();

    connection.on("NewOrderPlaced", (data) => {
      setNotifs(prev => [{
        id: `order-${data.orderId}-${Date.now()}`, type: 'order',
        title: 'New Order Placed!', body: `Order #${data.orderId} has been successfully placed.`,
        time: new Date(), read: false
      }, ...prev]);
      toast('New Order Placed!', { icon: '📦' });
    });

    connection.on("LowStockAlert", (data) => {
      setNotifs(prev => [{
        id: `stock-${data.productId}-${Date.now()}`, type: 'alert',
        title: 'Low Stock Alert', body: `Product ID ${data.productId} is running low! Only ${data.availableStock} left.`,
        time: new Date(), read: false
      }, ...prev]);
      toast.error(`Low Stock Alert for Product ${data.productId}`);
    });

    connection.on("FlashSaleStarted", (data) => {
      setNotifs(prev => [{
        id: `flash-${Date.now()}`, type: 'promo',
        title: '🔥 Flash Sale!', body: 'A new flash sale has just started!',
        time: new Date(), read: false
      }, ...prev]);
    });

    const startConnection = async () => {
      try {
        await connection.start();
        if (isMounted) console.log("SignalR Notification Hub Connected");
      } catch (err) {
        if (err.name === 'AbortError' || err.message?.includes('negotiation')) {
          // Ignore StrictMode abort errors
          return;
        }
        console.error("SignalR Connection Error: ", err);
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      connection.stop();
    };
  }, [user]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const unreadCount = notifs.filter(n => !n.read).length
  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.type === filter)

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  
  const markRead = async (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (!id.toString().startsWith('promo')) {
      try { await notificationService.markAsRead(id); } catch (e) {}
    }
  }
  
  const dismiss = (id) => setNotifs(prev => prev.filter(n => n.id !== id))
  const clearAll = () => setNotifs([])

  return (
    <div className="position-relative" ref={panelRef}>
      {/* ── Bell Button ── */}
      <button
        id="notifications-bell"
        onClick={() => setOpen(o => !o)}
        className="btn border-0 p-1 p-lg-2 position-relative d-flex align-items-center justify-content-center text-theme-muted hover-scale"
        style={{
          background: open ? 'rgba(0,243,255,0.1)' : 'transparent',
          color: open ? 'var(--bb-accent)' : 'var(--bb-muted)',
          transition: 'all 0.2s ease',
        }}
        title="Notifications"
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 5 }}
        >
          <Bell size={24} />
        </motion.div>
        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-black"
              style={{
                top: 0, right: 0,
                width: 16, height: 16,
                background: 'linear-gradient(135deg, #a820ff, #ff4d7d)',
                color: '#fff',
                fontSize: '0.55rem',
                boxShadow: '0 0 8px rgba(168,32,255,0.6)',
                zIndex: 2,
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ── Sliding Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="position-absolute rounded-4 overflow-hidden notification-dropdown-panel"
            style={{
              top: 'calc(100% + 15px)',
              width: '90vw',
              maxWidth: 360,
              maxHeight: '80vh',
              background: 'var(--bb-surface-2)',
              border: '1px solid rgba(0,243,255,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,32,255,0.1)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              className="d-flex align-items-center justify-content-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--bb-border)', flexShrink: 0 }}
            >
              <div className="d-flex align-items-center gap-2">
                <Bell size={16} style={{ color: 'var(--bb-accent)' }} />
                <span className="fw-black text-theme-title" style={{ fontSize: '0.95rem' }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span
                    className="rounded-pill px-2 fw-bold"
                    style={{
                      background: 'rgba(168,32,255,0.15)',
                      color: '#d161ff',
                      fontSize: '0.68rem',
                      border: '1px solid rgba(168,32,255,0.3)',
                    }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="btn border-0 p-1 d-flex align-items-center gap-1"
                    style={{ color: 'var(--bb-accent)', fontSize: '0.72rem', fontWeight: 700, background: 'transparent' }}
                    title="Mark all read"
                  >
                    <CheckCheck size={13} /> All read
                  </button>
                )}
                {notifs.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="btn border-0 p-1"
                    style={{ color: 'var(--bb-muted)', background: 'transparent' }}
                    title="Clear all"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="btn border-0 p-1"
                  style={{ color: 'var(--bb-muted)', background: 'transparent' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div
              className="d-flex gap-1 px-3 py-2"
              style={{ borderBottom: '1px solid var(--bb-border)', flexShrink: 0 }}
            >
              {['all', 'order', 'promo', 'wishlist'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="btn fw-bold text-capitalize"
                  style={{
                    borderRadius: 20,
                    padding: '3px 12px',
                    fontSize: '0.72rem',
                    border: filter === f ? '1px solid var(--bb-accent)' : '1px solid var(--bb-border)',
                    background: filter === f ? 'rgba(0,243,255,0.1)' : 'transparent',
                    color: filter === f ? 'var(--bb-accent)' : 'var(--bb-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="overflow-auto flex-grow-1" style={{ overflowX: 'hidden' }}>
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="d-flex flex-column align-items-center justify-content-center py-5 px-4 text-center"
                  >
                    <Bell size={36} style={{ color: 'var(--bb-border)', marginBottom: 12 }} />
                    <p className="text-theme-muted fw-semibold mb-0" style={{ fontSize: '0.88rem' }}>
                      No notifications here
                    </p>
                  </motion.div>
                ) : (
                  filtered.map((notif, idx) => {
                    const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info
                    const NIcon = cfg.Icon
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.22, delay: idx * 0.04 }}
                        onClick={() => markRead(notif.id)}
                        className="d-flex align-items-start gap-3 px-4 py-3 position-relative"
                        style={{
                          borderBottom: '1px solid var(--bb-border)',
                          background: notif.read ? 'transparent' : 'rgba(0,243,255,0.03)',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                      >
                        {/* Unread dot */}
                        {!notif.read && (
                          <span
                            className="position-absolute rounded-circle"
                            style={{
                              width: 7, height: 7,
                              background: 'var(--bb-accent)',
                              top: 14, left: 10,
                              boxShadow: '0 0 6px rgba(0,243,255,0.6)',
                            }}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                          style={{
                            width: 36, height: 36,
                            background: cfg.bg,
                            border: `1px solid ${cfg.color}40`,
                          }}
                        >
                          <NIcon size={15} style={{ color: cfg.color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-grow-1 min-width-0">
                          <p
                            className="fw-bold mb-0 text-theme-title"
                            style={{ fontSize: '0.82rem', opacity: notif.read ? 0.7 : 1 }}
                          >
                            {notif.title}
                          </p>
                          <p
                            className="text-theme-muted mb-1"
                            style={{ fontSize: '0.75rem', lineHeight: 1.4 }}
                          >
                            {notif.body}
                          </p>
                          <span style={{ fontSize: '0.65rem', color: 'var(--bb-muted)', fontWeight: 600 }}>
                            {timeAgo(notif.time)}
                          </span>
                        </div>

                        {/* Dismiss */}
                        <button
                          onClick={(e) => { e.stopPropagation(); dismiss(notif.id) }}
                          className="btn border-0 p-0 flex-shrink-0"
                          style={{ color: 'var(--bb-muted)', background: 'transparent', opacity: 0.5, marginTop: 2 }}
                        >
                          <X size={13} />
                        </button>
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
