'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function Certificat() {
  const params = useSearchParams()
  const name = params.get('name') || 'Candidat'
  const poste = params.get('poste') || 'Poste'
  const global = parseInt(params.get('global') || 0)
  const tech = parseInt(params.get('tech') || 0)
  const soft = parseInt(params.get('soft') || 0)
  const lang = parseInt(params.get('lang') || 0)
  const metier = parseInt(params.get('metier') || 0)
  const code = params.get('code') || 'XXXXXXXX'
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  async function downloadPDF() {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    // Fond
    doc.setFillColor(15, 23, 42)
    doc.rect(0, 0, 297, 210, 'F')

    // Bordure dorée
    doc.setDrawColor(245, 158, 11)
    doc.setLineWidth(1)
    doc.rect(10, 10, 277, 190)
    doc.setLineWidth(0.3)
    doc.rect(12, 12, 273, 186)

    // Logo TL
    doc.setFillColor(245, 158, 11)
    doc.roundedRect(130, 20, 37, 14, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('TalentLink', 148.5, 29, { align: 'center' })

    // Titre
    doc.setTextColor(245, 158, 11)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIFICAT DE COMPÉTENCES', 148.5, 55, { align: 'center' })

    // Ligne dorée
    doc.setDrawColor(245, 158, 11)
    doc.setLineWidth(0.5)
    doc.line(60, 60, 237, 60)

    // Nom
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(name, 148.5, 75, { align: 'center' })

    // Texte
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(180, 180, 180)
    doc.text('a validé avec succès l\'évaluation de compétences pour le poste de', 148.5, 85, { align: 'center' })

    doc.setTextColor(251, 191, 36)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(poste, 148.5, 95, { align: 'center' })

    // Score global
    doc.setFillColor(245, 158, 11)
    doc.circle(148.5, 120, 18, 'F')
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(global + '%', 148.5, 126, { align: 'center' })

    doc.setTextColor(180, 180, 180)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Score global', 148.5, 145, { align: 'center' })

    // Scores détaillés
    const details = [['Technique', tech], ['Soft skills', soft], ['Langue', lang], ['Métier', metier]]
    details.forEach(([label, score], i) => {
      const x = 55 + i * 55
      doc.setFillColor(30, 41, 59)
      doc.roundedRect(x - 18, 150, 36, 22, 2, 2, 'F')
      doc.setTextColor(245, 158, 11)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(score + '%', x, 163, { align: 'center' })
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(label, x, 169, { align: 'center' })
    })

    // Date et code
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text(`Délivré le ${date}`, 60, 192, { align: 'center' })
    doc.text(`Code de vérification : ${code}`, 148.5, 192, { align: 'center' })
    doc.text('talentlink.vercel.app', 237, 192, { align: 'center' })

    doc.save(`certificat-${name.replace(' ', '-')}-TalentLink.pdf`)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-lg w-full">

        {/* Aperçu du certificat */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          borderRadius: 20, padding: 32, marginBottom: 24,
          border: '2px solid rgba(245,158,11,0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              display: 'inline-block', background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
              borderRadius: 10, padding: '6px 16px', marginBottom: 16
            }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>TalentLink</span>
            </div>
            <div style={{ color: '#F59E0B', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
              Certificat de compétences
            </div>
            <div style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4 }}>a validé l'évaluation pour</div>
            <div style={{ color: '#FBBF24', fontSize: 16, fontWeight: 700 }}>{poste}</div>
          </div>

          {/* Score global */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px',
              boxShadow: '0 8px 25px rgba(245,158,11,0.4)'
            }}>
              <span style={{ color: '#0F172A', fontSize: 22, fontWeight: 800 }}>{global}%</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Score global</div>
          </div>

          {/* Scores détaillés */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
            {[['Technique', tech], ['Soft skills', soft], ['Langue', lang], ['Métier', metier]].map(([label, score]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
                <div style={{ color: '#F59E0B', fontSize: 16, fontWeight: 700 }}>{score}%</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Code */}
          <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginBottom: 4 }}>Code de vérification</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.1em' }}>{code}</div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 8 }}>Délivré le {date}</div>
          </div>
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={downloadPDF} style={{
            flex: 1, background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
            color: '#0F172A', padding: '14px', borderRadius: 14,
            fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(245,158,11,0.3)'
          }}>
            ⬇️ Télécharger PDF
          </button>
          <Link href="/offres" style={{
            flex: 1, background: 'white', color: '#374151',
            border: '1px solid #E5E7EB', padding: '14px', borderRadius: 14,
            fontSize: 15, fontWeight: 600, textDecoration: 'none',
            textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            Voir les offres
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return <Suspense><Certificat /></Suspense>
}
