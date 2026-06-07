'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main style={{ fontFamily: "'Georgia', serif", background: '#FAFAF8', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrollY > 50 ? 'rgba(250,250,248,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(16px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(180,150,80,0.15)' : 'none',
        transition: 'all 0.4s ease',
        padding: '18px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #F59E0B, #FBBF24, #F59E0B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(245,158,11,0.4)'
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 14, fontFamily: 'sans-serif' }}>TL</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 20, color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'sans-serif' }}>TalentLink</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontFamily: 'sans-serif' }}>
          <Link href="/offres" style={{ color: '#4B5563', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Offres</Link>
          <Link href="/talent-pool" style={{ color: '#4B5563', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Talent Pool</Link>
          <Link href="/login" style={{ color: '#4B5563', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Connexion</Link>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #B45309, #F59E0B, #FBBF24)',
            color: 'white', padding: '10px 24px', borderRadius: 10,
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(245,158,11,0.35)',
            letterSpacing: '0.01em'
          }}>Commencer</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #FFFBEB 0%, #FAFAF8 40%, #F8F6F0 100%)',
        paddingTop: 80
      }}>
        {/* Lumière parallaxe */}
        <div style={{
          position: 'absolute', width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
          top: -200, right: -200,
          transform: `translateY(${scrollY * 0.2}px)`,
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,83,9,0.06) 0%, transparent 70%)',
          bottom: 0, left: -100,
          transform: `translateY(${scrollY * -0.15}px)`,
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'white', border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 100, padding: '7px 18px', marginBottom: 36,
          boxShadow: '0 2px 16px rgba(245,158,11,0.12)',
          fontFamily: 'sans-serif',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease'
        }}>
          <span style={{ fontSize: 14 }}>🏆</span>
          <span style={{ fontSize: 12, color: '#B45309', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Recrutement par compétences certifiées</span>
        </div>

        {/* Titre */}
        <h1 style={{
          fontSize: 'clamp(44px, 8vw, 88px)', fontWeight: 800, lineHeight: 1.05,
          letterSpacing: '-0.03em', textAlign: 'center', maxWidth: 900,
          color: '#0F172A', marginBottom: 28, padding: '0 24px',
          fontFamily: 'sans-serif',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease 0.1s'
        }}>
          Montez sur le{' '}
          <span style={{
            background: 'linear-gradient(135deg, #B45309 0%, #F59E0B 40%, #FBBF24 60%, #94A3B8 80%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', display: 'inline-block'
          }}>podium</span>
        </h1>

        <p style={{
          fontSize: 20, color: '#64748B', lineHeight: 1.7, textAlign: 'center',
          maxWidth: 560, marginBottom: 44, padding: '0 24px',
          fontFamily: 'sans-serif', fontWeight: 400,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.2s'
        }}>
          Les meilleurs talents certifiés. Les recruteurs qui trouvent vrai. Une plateforme qui récompense la compétence.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: 80, padding: '0 24px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.3s',
          fontFamily: 'sans-serif'
        }}>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #B45309, #F59E0B)',
            color: 'white', padding: '16px 40px', borderRadius: 14,
            fontSize: 16, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 8px 30px rgba(245,158,11,0.4)',
            letterSpacing: '0.01em'
          }}>Je recrute 🏆</Link>
          <Link href="/offres" style={{
            background: 'white', color: '#1A1A1A',
            border: '1.5px solid rgba(0,0,0,0.1)',
            padding: '16px 40px', borderRadius: 14,
            fontSize: 16, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>Je cherche un poste →</Link>
        </div>

        {/* PODIUM VISUEL */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          gap: 4, marginBottom: -2,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s ease 0.4s'
        }}>
          {/* 2ème - Argent */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #94A3B8, #CBD5E1, #94A3B8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(148,163,184,0.4)',
              fontSize: 20
            }}>👤</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#94A3B8', fontFamily: 'sans-serif' }}>2</div>
            <div style={{
              width: 120, height: 100,
              background: 'linear-gradient(180deg, #CBD5E1 0%, #94A3B8 100%)',
              borderRadius: '8px 8px 0 0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 -4px 20px rgba(148,163,184,0.2)'
            }}>
              <span style={{ fontSize: 28 }}>🥈</span>
            </div>
          </div>

          {/* 1er - Or */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 28 }}>👑</div>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #FBBF24, #F59E0B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(245,158,11,0.5)',
              fontSize: 24, border: '3px solid #FBBF24'
            }}>👤</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B', fontFamily: 'sans-serif' }}>1</div>
            <div style={{
              width: 140, height: 140,
              background: 'linear-gradient(180deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)',
              borderRadius: '8px 8px 0 0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 -8px 40px rgba(245,158,11,0.3)'
            }}>
              <span style={{ fontSize: 36 }}>🥇</span>
            </div>
          </div>

          {/* 3ème - Bronze */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #CD7C2F, #B45309)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(180,83,9,0.3)',
              fontSize: 18
            }}>👤</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#B45309', fontFamily: 'sans-serif' }}>3</div>
            <div style={{
              width: 110, height: 70,
              background: 'linear-gradient(180deg, #CD7C2F 0%, #B45309 100%)',
              borderRadius: '8px 8px 0 0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 -4px 20px rgba(180,83,9,0.2)'
            }}>
              <span style={{ fontSize: 24 }}>🥉</span>
            </div>
          </div>
        </div>

        {/* Sol du podium */}
        <div style={{
          width: '100%', maxWidth: 440, height: 8,
          background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), rgba(245,158,11,0.4), rgba(245,158,11,0.2), transparent)',
          borderRadius: 4
        }} />
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: 16, fontFamily: 'sans-serif' }}>
              Deux canaux,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #B45309, #F59E0B)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>un seul outil</span>
            </h2>
            <p style={{ fontSize: 18, color: '#64748B', fontFamily: 'sans-serif' }}>Offres ouvertes ou chasse directe dans le Talent Pool.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { medal: '🏆', title: 'Tests sur mesure', desc: 'QCM, code, questions ouvertes. Vos critères, vos pondérations.', bg: '#FFFBEB', border: 'rgba(245,158,11,0.2)' },
              { medal: '🥇', title: 'Talent Pool certifié', desc: 'Browsez des profils vérifiés. Recrutez sans publier d\'offre.', bg: '#FEF9EE', border: 'rgba(245,158,11,0.15)' },
              { medal: '🤖', title: 'Correction IA', desc: 'Les réponses ouvertes notées par IA avec justification détaillée.', bg: '#F8F6F0', border: 'rgba(180,83,9,0.1)' },
              { medal: '🛡️', title: 'Anti-triche intégré', desc: 'Détection des changements d\'onglet, timer par question, surveillance.', bg: '#FAFAF8', border: 'rgba(0,0,0,0.06)' },
            ].map((f, i) => (
              <div key={i} style={{
                background: f.bg, borderRadius: 20, padding: '28px 24px',
                border: `1px solid ${f.border}`,
                cursor: 'default',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(245,158,11,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.medal}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8, fontFamily: 'sans-serif' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, fontFamily: 'sans-serif' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section style={{ padding: '100px 48px', background: '#FFFBEB' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 44, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: 60, fontFamily: 'sans-serif' }}>
            De l'offre au podium
          </h2>
          <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { step: '1', icon: '📋', title: 'Publiez une offre', desc: 'Créez votre test en quelques minutes' },
              { step: '2', icon: '👥', title: 'Les candidats postulent', desc: 'Ils passent le test certifiant' },
              { step: '3', icon: '🤖', title: 'Correction automatique', desc: 'Scores en temps réel' },
              { step: '4', icon: '🏆', title: 'Le meilleur monte', desc: 'Recrutez sur la compétence réelle' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 160, padding: '0 8px' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, marginBottom: 12,
                    boxShadow: '0 4px 20px rgba(245,158,11,0.3)'
                  }}>{s.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 6, fontFamily: 'sans-serif' }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#64748B', fontFamily: 'sans-serif', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
                {i < 3 && <div style={{ marginTop: 26, color: '#F59E0B', fontSize: 20, fontWeight: 300 }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        margin: '0 40px 80px', borderRadius: 28, padding: '80px 48px', textAlign: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)'
        }} />
        <div style={{ fontSize: 48, marginBottom: 20 }}>🏆</div>
        <h2 style={{ fontSize: 44, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 16, fontFamily: 'sans-serif', position: 'relative' }}>
          Prêt à recruter les{' '}
          <span style={{
            background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>vrais talents</span> ?
        </h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', marginBottom: 40, fontFamily: 'sans-serif', position: 'relative' }}>
          Rejoignez TalentLink. Gratuit pour commencer.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', fontFamily: 'sans-serif' }}>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
            color: '#0F172A', padding: '16px 40px', borderRadius: 14,
            fontSize: 16, fontWeight: 800, textDecoration: 'none',
            boxShadow: '0 8px 30px rgba(245,158,11,0.3)'
          }}>Créer un compte recruteur</Link>
          <Link href="/offres" style={{
            background: 'rgba(255,255,255,0.08)', color: 'white',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '16px 40px', borderRadius: 14,
            fontSize: 16, fontWeight: 700, textDecoration: 'none',
          }}>Voir les offres</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '32px 48px', borderTop: '1px solid #F1F5F9',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16, fontFamily: 'sans-serif'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(245,158,11,0.3)'
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 11 }}>TL</span>
          </div>
          <span style={{ fontWeight: 700, color: '#1A1A1A', fontSize: 15 }}>TalentLink</span>
        </div>
        <p style={{ fontSize: 13, color: '#94A3B8' }}>© 2026 TalentLink · Recrutement par compétences</p>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/offres" style={{ fontSize: 13, color: '#64748B', textDecoration: 'none' }}>Offres</Link>
          <Link href="/talent-pool" style={{ fontSize: 13, color: '#64748B', textDecoration: 'none' }}>Talent Pool</Link>
          <Link href="/login" style={{ fontSize: 13, color: '#64748B', textDecoration: 'none' }}>Connexion</Link>
        </div>
      </footer>

    </main>
  )
}
