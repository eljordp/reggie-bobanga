import { useState, useEffect, useRef } from 'react'

function App() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/50 via-transparent to-[#0a0a0a]" />

        <div
          className="relative z-10 text-center px-6"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <p className="text-xs tracking-[0.35em] uppercase text-white/30 mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
            Artist &middot; Creator &middot; Influencer
          </p>
          <h1
            className="leading-[0.85] tracking-tight"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(4rem, 12vw, 10rem)',
            }}
          >
            Reggie
            <br />
            <em>Bobanga</em>
          </h1>

          <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://www.instagram.com/reggiebobangaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-white/90 transition-colors duration-300"
            >
              <IgIcon />
              Follow
            </a>
            <a
              href="https://www.youtube.com/@Reggiebobangaa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 border border-white/20 text-xs tracking-[0.15em] uppercase font-medium hover:bg-white/5 hover:border-white/40 transition-all duration-300"
            >
              <YtIcon />
              Subscribe
            </a>
          </div>
        </div>

        {/* scroll arrow */}
        <div
          className="absolute bottom-12"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease 1.2s',
          }}
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-bounce text-white/25">
            <path d="M8 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <FadeSection>
        <section className="py-28 sm:py-36 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs tracking-[0.35em] uppercase text-white/25 mb-10">About</p>
            <p
              className="text-2xl sm:text-3xl md:text-4xl leading-relaxed font-light text-white/75"
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
        <section id="music" className="py-28 sm:py-36 px-6 sm:px-10 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs tracking-[0.35em] uppercase text-white/25 mb-6">Music</p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-20"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Latest <em>Releases</em>
            </h2>

            {/* Featured video — big embed */}
            <div className="aspect-video w-full border border-white/[0.06] overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/Vl36YSwKZsY"
                title="WATCH OUT (OFFICIAL MUSIC VIDEO)"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="mt-3 text-white/40 text-sm" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              El Rey Ft. EZZE — WATCH OUT (Official Music Video)
            </p>

            {/* More videos grid */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: '8RJgxrXIlnE', title: 'N.E.H. (New Era Hyphy) ft. Trippy Tali' },
                { id: 'VcNb6YDT1Hs', title: 'Black Guy Speaking Japanese in Hawaii!' },
                { id: 'JmPHwJF8M-A', title: 'Holy Trinity (feat. Come & Palak)' },
                { id: '2czqr_96020', title: 'WATCH OUT [Official Song]' },
              ].map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden border border-white/[0.06] hover:border-white/15 transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                        <PlayIcon />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">{v.title}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-16 flex flex-wrap gap-3 justify-center">
              <a
                href="https://www.youtube.com/@Reggiebobangaa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 border border-white/10 text-white/30 text-sm tracking-wide hover:border-white/20 hover:text-white/50 hover:bg-white/[0.03] transition-all duration-300"
              >
                YouTube
              </a>
              <span className="px-6 py-2.5 border border-white/10 text-white/20 text-sm tracking-wide cursor-default">
                Spotify — Soon
              </span>
              <span className="px-6 py-2.5 border border-white/10 text-white/20 text-sm tracking-wide cursor-default">
                Apple Music — Soon
              </span>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ═══ CONTENT GRID ═══ */}
      <FadeSection>
        <section className="py-28 sm:py-36 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs tracking-[0.35em] uppercase text-white/25 mb-6">Content</p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-20"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              The <em>Visual</em>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { id: 'z3mmcbE6WGg', title: 'Almost Drowned at Wai Kai Waterpark — Hawaii Vlog' },
                { id: 'Xdjy1aNAnz0', title: 'Touchdown in the Island — Hawaii Vlog' },
                { id: 'fw2pfUXaE48', title: 'UCSB #1 Party School — Deltopia Vlog' },
                { id: 'qTXRqp008T8', title: 'The Night Before Deltopia' },
                { id: 'tDf-8zXr1Fo', title: 'Family, Farewells & New Beginnings' },
                { id: 'rBFoknKAqMw', title: 'Deltopia Weekend Begins' },
              ].map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden border border-white/[0.06] hover:border-white/15 transition-all duration-300"
                >
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-xs leading-snug">{v.title}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayIcon />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-10 flex justify-center gap-8">
              <a
                href="https://www.instagram.com/reggiebobangaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-[0.1em] uppercase transition-colors duration-300"
              >
                Instagram <ArrowUpRight />
              </a>
              <a
                href="https://www.youtube.com/@Reggiebobangaa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-[0.1em] uppercase transition-colors duration-300"
              >
                YouTube <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ═══ CONNECT ═══ */}
      <FadeSection>
        <section className="py-28 sm:py-36 px-6 sm:px-10 bg-white/[0.02]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.35em] uppercase text-white/25 mb-10">Connect</p>
            <h2
              className="text-5xl sm:text-6xl md:text-7xl leading-[0.9] mb-6"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Let's <em>Work</em>
            </h2>
            <p className="text-white/30 text-lg font-light mb-14">
              Bookings, features, collaborations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.instagram.com/reggiebobangaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase font-medium hover:bg-white/90 transition-colors duration-300"
              >
                <IgIcon />
                DM on Instagram
              </a>
              <a
                href="https://www.youtube.com/@Reggiebobangaa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 border border-white/20 text-xs tracking-[0.15em] uppercase font-medium hover:bg-white/5 hover:border-white/40 transition-all duration-300"
              >
                <YtIcon />
                YouTube
              </a>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/15 text-sm">&copy; 2026 Reggie Bobanga</p>
          <div className="flex gap-5">
            <a
              href="https://www.instagram.com/reggiebobangaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/15 hover:text-white/40 transition-colors duration-300"
            >
              <IgIcon size={16} />
            </a>
            <a
              href="https://www.youtube.com/@Reggiebobangaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/15 hover:text-white/40 transition-colors duration-300"
            >
              <YtIcon size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
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
      { threshold: 0.15 }
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


/* ─── Components ─── */
function TrackRow({ title, subtitle, year }) {
  return (
    <div className="group flex items-center gap-6 p-6 border border-white/[0.06] hover:border-white/12 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer">
      <div className="w-14 h-14 shrink-0 bg-white/[0.04] flex items-center justify-center">
        <MusicIcon />
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-base font-medium text-white/70 group-hover:text-white transition-colors duration-300">{title}</h3>
        <p className="text-white/25 text-sm mt-1">{subtitle}</p>
      </div>
      <span className="text-xs tracking-[0.2em] uppercase text-white/15 hidden sm:block">{year}</span>
    </div>
  )
}


/* ─── Icons (inline SVG, no deps) ─── */
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function MusicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-white/40 transition-colors duration-300">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
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
