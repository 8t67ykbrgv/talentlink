'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function OffreDetail() {
  const { id } = useParams()
  const [offre, setOffre] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOffre() }, [id])

  async function fetchOffre() {
    const { data } = await supabase.from('job_offers').select('*, companies(name)').eq('id', id).single()
    setOffre(data)
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Chargement...</div>
  if (!offre) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Offre introuvable</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-white text-sm font-bold">TL</span></div>
          <span className="font-semibold text-gray-900">TalentLink</span>
        </div>
        <Link href="/offres" className="text-sm text-gray-500 hover:text-gray-700">← Offres</Link>
      </nav>
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
              {offre.companies?.name?.charAt(0) || 'E'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{offre.title}</h1>
              <p className="text-gray-500 mt-1">{offre.companies?.name || 'Entreprise'}</p>
            </div>
          </div>
          {offre.description && <p className="text-gray-600 mb-6 leading-relaxed">{offre.description}</p>}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-lg font-semibold text-gray-900">{offre.threshold}%</div>
              <div className="text-xs text-gray-500 mt-1">Seuil requis</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-lg font-semibold text-gray-900">Certifié</div>
              <div className="text-xs text-gray-500 mt-1">Si admis</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-lg font-semibold text-gray-900">Gratuit</div>
              <div className="text-xs text-gray-500 mt-1">Pour le candidat</div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
            <div className="space-y-2">
              {['Créez votre profil candidat','Passez le test de compétences','Obtenez votre score et certificat','Le recruteur reçoit vos résultats'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0">{i+1}</div>
                  <span className="text-sm text-blue-800">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/candidat" className="block w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition text-center">
            Postuler et passer le test →
          </Link>
        </div>
      </div>
    </main>
  )
}
