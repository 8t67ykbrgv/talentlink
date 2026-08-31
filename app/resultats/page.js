'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function Resultats() {
  const params = useSearchParams()
  const global = parseInt(params.get('global') || 0)
  const tech = parseInt(params.get('tech') || 0)
  const soft = parseInt(params.get('soft') || 0)
  const lang = parseInt(params.get('lang') || 0)
  const metier = parseInt(params.get('metier') || 0)
  const name = params.get('name') || 'Candidat'
  const poste = params.get('poste') || 'Poste'

  const code = 'TL' + Math.random().toString(36).substring(2, 8).toUpperCase()

  const certUrl = `/certificat?name=${encodeURIComponent(name)}&poste=${encodeURIComponent(poste)}&global=${global}&tech=${tech}&soft=${soft}&lang=${lang}&metier=${metier}&code=${code}`

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${global >= 70 ? 'bg-green-100' : 'bg-orange-100'}`}>
            <span className={`text-2xl font-bold ${global >= 70 ? 'text-green-600' : 'text-orange-600'}`}>{global}%</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{global >= 70 ? 'Félicitations !' : 'Test terminé'}</h1>
          <p className="text-gray-500">{global >= 70 ? "Vous avez passé le seuil d'admission" : 'Continuez à vous améliorer'}</p>
        </div>

        <div className="space-y-4 mb-8">
          {[['Technique', tech, '#378ADD'], ['Soft skills', soft, '#7F77DD'], ['Langue', lang, '#1D9E75'], ['Métier', metier, '#EF9F27']].map(([label, val, color]) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium text-gray-900">{val}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 rounded-full transition-all" style={{ width: `${val}%`, background: color }}></div>
              </div>
            </div>
          ))}
        </div>

        {global >= 70 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm font-medium text-green-700">🎉 Votre profil est maintenant dans le Talent Pool certifié</p>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/offres" className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-center hover:bg-gray-200 transition text-sm">
            Voir les offres
          </Link>
          {global >= 70 && (
            <Link href={certUrl} className="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-medium text-center hover:bg-yellow-600 transition text-sm">
              🏆 Mon certificat
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return <Suspense><Resultats /></Suspense>
}
