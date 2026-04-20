import { useState, useEffect, useRef, useCallback } from 'react'

const HERO_VIDEO_ID = '2czqr_96020'   // WATCH OUT MV — hero bg visuals
const AUDIO_ID = 'VcNb6YDT1Hs'       // WATCH OUT official song — site audio
const HERO_VIDEO_START = 30           // visually interesting section of MV
const HERO_VIDEO_END = 38             // 8 second loop
const AUDIO_START = 3                 // skip any silence at the top

function App() {
  const [loaded, setLoaded] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)
  const [heroVideoReady, setHeroVideoReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const audioPlayerRef = useRef(null)
  const heroPlayerRef = useRef(null)
  const wantsAutoplay = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) return
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  }, [])

  // Audio player — full song, skip silent intro
  useEffect(() => {
    const init = () => {
      audioPlayerRef.current = new window.YT.Player('yt-audio', {
        videoId: AUDIO_ID,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, rel: 0, showinfo: 0, start: AUDIO_START },
        events: {
          onReady: (e) => {
            setAudioReady(true)
            if (wantsAutoplay.current) {
              e.target.playVideo()
              setAudioLoading(true)
            }
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) { setAudioPlaying(true); setAudioLoading(false) }
            if (e.data === window.YT.PlayerState.ENDED) setAudioPlaying(false)
            if (e.data === window.YT.PlayerState.BUFFERING) setAudioLoading(true)
          },
        },
      })
    }
    if (window.YT && window.YT.Player) init()
    else window.onYouTubeIframeAPIReady = init
  }, [])

  // Hero video — muted, loops 8 seconds from middle of MV
  useEffect(() => {
    const check = setInterval(() => {
      if (!window.YT || !window.YT.Player) return
      clearInterval(check)
      heroPlayerRef.current = new window.YT.Player('yt-hero', {
        videoId: HERO_VIDEO_ID,
        playerVars: {
          autoplay: 1, controls: 0, disablekb: 1, fs: 0, loop: 0,
          modestbranding: 1, mute: 1, rel: 0, showinfo: 0, start: HERO_VIDEO_START,
          playsinline: 1,
        },
        events: {
          onReady: (e) => { e.target.mute(); e.target.playVideo() },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setHeroVideoReady(true)
              const loopCheck = setInterval(() => {
                const t = e.target.getCurrentTime()
                if (t >= HERO_VIDEO_END) e.target.seekTo(HERO_VIDEO_START, true)
              }, 200)
              e.target._loopInterval = loopCheck
            }
          },
        },
      })
    }, 100)
    return () => clearInterval(check)
  }, [])

  // Autoplay audio on first user interaction (browsers require a gesture)
  useEffect(() => {
    const startAudio = () => {
      wantsAutoplay.current = true
      const p = audioPlayerRef.current
      if (p && p.getPlayerState) {
        // Player is ready — play now
        setAudioLoading(true)
        p.playVideo()
      }
      // If player isn't ready yet, onReady will pick up wantsAutoplay
    }
    document.addEventListener('click', startAudio, { once: true })
    document.addEventListener('touchstart', startAudio, { once: true })
    return () => {
      document.removeEventListener('click', startAudio)
      document.removeEventListener('touchstart', startAudio)
    }
  }, [])

  const toggleAudio = useCallback(() => {
    const p = audioPlayerRef.current
    if (!p || !p.getPlayerState) return
    const state = p.getPlayerState()
    if (state === window.YT.PlayerState.PLAYING) {
      p.pauseVideo()
      setAudioPlaying(false)
      setAudioLoading(false)
    } else {
      setAudioLoading(true)
      p.playVideo()
    }
  }, [])

  // Load IG embed script
  useEffect(() => {
    const s = document.createElement('script')
    s.src = 'https://www.instagram.com/embed.js'
    s.async = true
    document.body.appendChild(s)
    return () => { if (s.parentNode) s.parentNode.removeChild(s) }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Hidden audio player */}
      <div className="fixed" style={{ width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <div id="yt-audio" />
      </div>

      {/* ═══ AUDIO TOGGLE ═══ */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-5 right-5 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/15 active:scale-95 transition-all duration-300 group"
        aria-label={audioPlaying ? 'Pause music' : 'Play music'}
      >
        {audioLoading ? <SpinnerIcon /> : audioPlaying ? <PauseIcon /> : <AudioPlayIcon />}
        <span className="hidden sm:block absolute right-14 bg-black/80 backdrop-blur-sm text-white text-xs tracking-wide px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {audioLoading ? 'Loading...' : audioPlaying ? 'Pause' : 'WATCH OUT — El Rey'}
        </span>
      </button>

      {/* ═══ HERO ═══ */}
      <section className="relative h-[100svh] flex flex-col items-center justify-center overflow-hidden">
        {/* Poster image — shows instantly while video loads */}
        <div className="absolute inset-0">
          <img
            src={`https://img.youtube.com/vi/${HERO_VIDEO_ID}/maxresdefault.jpg`}
            alt=""
            className="w-full h-full object-cover"
            style={{
              opacity: heroVideoReady ? 0 : 1,
              transition: 'opacity 1.5s ease',
            }}
          />
        </div>

        {/* YouTube video background — fades in once playing */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            overflow: 'hidden',
            opacity: heroVideoReady ? 1 : 0,
            transition: 'opacity 1.5s ease',
          }}
        >
          <div
            id="yt-hero"
            className="absolute"
            style={{
              top: '50%', left: '50%',
              width: isMobile ? '300vw' : '120vw',
              height: isMobile ? '300vh' : '120vh',
              minWidth: isMobile ? '300vw' : '120vw',
              minHeight: isMobile ? '100vh' : '120vh',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#0a0a0a]/40 to-[#0a0a0a]" />

        <div
          className="relative z-10 text-center px-5 sm:px-6"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/30 mb-6 sm:mb-8">
            Artist &middot; Creator &middot; Influencer
          </p>
          <h1
            className="leading-[0.85] tracking-tight"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(3.2rem, 14vw, 10rem)',
            }}
          >
            Reggie
            <br />
            <em>Bobanga</em>
          </h1>

          <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a
              href="https://www.instagram.com/reggiebobangaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-white/90 active:scale-[0.97] transition-all duration-300"
            >
              <IgIcon />
              Follow
            </a>
            <a
              href="https://www.youtube.com/@Reggiebobangaa"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-xs tracking-[0.15em] uppercase font-medium hover:bg-white/5 hover:border-white/40 active:scale-[0.97] transition-all duration-300"
            >
              <YtIcon />
              Subscribe
            </a>
          </div>
        </div>

        <div
          className="absolute bottom-8 sm:bottom-12 z-10"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s ease 1.2s' }}
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-bounce text-white/25">
            <path d="M8 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <FadeSection>
        <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-10">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/25 mb-8 sm:mb-10">About</p>
            <p
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed font-light text-white/75"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Creating worlds through music, visuals, and culture.
              <span className="text-white/30"> Every song is a story. Every post is a moment.</span>
            </p>
          </div>
        </section>
      </FadeSection>

      {/* ═══ MUSIC ═══ */}
      <FadeSection>
        <section id="music" className="py-20 sm:py-28 md:py-36 px-5 sm:px-10 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/25 mb-4 sm:mb-6">Music</p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] mb-12 sm:mb-20"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Latest <em>Releases</em>
            </h2>

            {/* Featured — WATCH OUT MV */}
            <div className="aspect-video w-full border border-white/[0.06] overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/2czqr_96020"
                title="WATCH OUT (OFFICIAL MUSIC VIDEO)"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="mt-3 text-white/40 text-sm" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              El Rey Ft. EZZE — WATCH OUT (Official Music Video)
            </p>

            {/* All songs */}
            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              {[
                { id: 'VcNb6YDT1Hs', title: 'WATCH OUT [Official Song]' },
                { id: 'z3mmcbE6WGg', title: 'N.E.H. (New Era Hyphy) ft. Trippy Tali' },
                { id: 'XgW83Y9aL4Q', title: 'Holy Trinity (feat. Come & Palak)' },
              ].map((v) => (
                <HoverVideo key={v.id} id={v.id} title={v.title} isMobile={isMobile} />
              ))}
            </div>

            <div className="mt-10 sm:mt-16 flex flex-wrap gap-2 sm:gap-3 justify-center">
              <a href="https://www.youtube.com/@Reggiebobangaa" target="_blank" rel="noopener noreferrer"
                className="px-5 sm:px-6 py-2.5 border border-white/10 text-white/30 text-xs sm:text-sm tracking-wide hover:border-white/20 hover:text-white/50 hover:bg-white/[0.03] active:scale-[0.97] transition-all duration-300">
                YouTube
              </a>
              <span className="px-5 sm:px-6 py-2.5 border border-white/10 text-white/20 text-xs sm:text-sm tracking-wide cursor-default">Spotify — Soon</span>
              <span className="px-5 sm:px-6 py-2.5 border border-white/10 text-white/20 text-xs sm:text-sm tracking-wide cursor-default">Apple Music — Soon</span>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ═══ CONTENT GRID ═══ */}
      <FadeSection>
        <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/25 mb-4 sm:mb-6">Content</p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] mb-12 sm:mb-20"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              The <em>Visual</em>
            </h2>

            {/* YouTube grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2">
              {[
                { id: '2czqr_96020', title: 'WATCH OUT (Official Music Video)' },
                { id: 'JmPHwJF8M-A', title: 'Almost Drowned at Wai Kai — Hawaii Vlog' },
                { id: '8RJgxrXIlnE', title: 'Speaking Japanese in Hawaii!' },
                { id: '8iSsM1px8-U', title: 'UCSB #1 Party School — Deltopia' },
                { id: 'Vl36YSwKZsY', title: 'Noise Complaint — Short Film' },
                { id: 'G-FDLLvVKSY', title: 'Parallel Routes — Short Film' },
              ].map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden border border-white/[0.06] hover:border-white/15 active:scale-[0.98] transition-all duration-300"
                >
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5 sm:p-4">
                    <p className="text-white text-[10px] sm:text-xs leading-snug line-clamp-2">{v.title}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      <PlayIcon />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Instagram embed section */}
            <div className="mt-12 sm:mt-16">
              <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/25 mb-6 sm:mb-8">Instagram</p>
              <div className="flex justify-center">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink="https://www.instagram.com/reggiebobangaa/"
                  data-instgrm-version="14"
                  style={{
                    background: '#111',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 0,
                    margin: '0 auto',
                    maxWidth: '540px',
                    width: '100%',
                    minWidth: '280px',
                    padding: 0,
                  }}
                />
              </div>
            </div>

            <div className="mt-8 sm:mt-10 flex justify-center gap-6 sm:gap-8">
              <a href="https://www.instagram.com/reggiebobangaa/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-[10px] sm:text-xs tracking-[0.1em] uppercase transition-colors duration-300">
                Instagram <ArrowUpRight />
              </a>
              <a href="https://www.youtube.com/@Reggiebobangaa" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-[10px] sm:text-xs tracking-[0.1em] uppercase transition-colors duration-300">
                YouTube <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ═══ CONNECT ═══ */}
      <FadeSection>
        <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-10 bg-white/[0.02]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/25 mb-8 sm:mb-10">Connect</p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-5 sm:mb-6"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Let's <em>Work</em>
            </h2>
            <p className="text-white/30 text-base sm:text-lg font-light mb-10 sm:mb-14">Bookings, features, collaborations</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a href="https://www.instagram.com/reggiebobangaa/" target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-white/90 active:scale-[0.97] transition-all duration-300">
                <IgIcon /> DM on Instagram
              </a>
              <a href="https://www.youtube.com/@Reggiebobangaa" target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 border border-white/20 text-xs tracking-[0.15em] uppercase font-medium hover:bg-white/5 hover:border-white/40 active:scale-[0.97] transition-all duration-300">
                <YtIcon /> YouTube
              </a>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-6 sm:py-8 px-5 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-white/15 text-xs sm:text-sm">&copy; 2026 Reggie Bobanga</p>
          <div className="flex gap-5">
            <a href="https://www.instagram.com/reggiebobangaa/" target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-white/40 transition-colors duration-300 p-1"><IgIcon size={16} /></a>
            <a href="https://www.youtube.com/@Reggiebobangaa" target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-white/40 transition-colors duration-300 p-1"><YtIcon size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}


/* ─── Hover-to-play video thumbnail (desktop), tap-to-open (mobile) ─── */
function HoverVideo({ id, title, isMobile }) {
  const [hovering, setHovering] = useState(false)

  return (
    <a
      href={`https://www.youtube.com/watch?v=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden border border-white/[0.06] hover:border-white/15 active:scale-[0.98] transition-all duration-300"
      onMouseEnter={() => !isMobile && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ opacity: hovering ? 0 : 1, transition: 'opacity 0.3s' }}
        />
        {hovering && !isMobile && (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&start=15&playsinline=1`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay"
            style={{ border: 'none' }}
          />
        )}
        {!hovering && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <PlayIcon />
            </div>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300 line-clamp-2">{title}</p>
      </div>
    </a>
  )
}


/* ─── Scroll fade-in wrapper ─── */
function FadeSection({ children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  )
}


/* ─── Icons ─── */
function IgIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YtIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function AudioPlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-0.5">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin text-white">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  )
}

export default App
