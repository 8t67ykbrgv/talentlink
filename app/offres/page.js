'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Offres() {
  const [offres, setOffres] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  useEffect(() => { fetchOffres() }, [])
  async function fetchOffres() {
    const { data } = await supabase.from('job_offers').select('*, companies(name)').eq('status', 'active').order('created_at', { ascending: false })
    setOffres(data || [])
    setLoading(false)
  }
  const filtered = offres.filter(o => o.title.toLowerCase().includes(search.toLowerCase()))
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-white text-sm font-bold">TL</span></div>
          <span className="font-semibold text-gray-900">TalentLink</span>
        </div>
        <Link href="/" className="text-sm text-gray-500">Accueil</Link>
      </nav>
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Offres disponibles</h1>
        <p className="text-gray-500 mb-6">Postulez et passez un test pour vous démarquer</p>
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-6" placeholder="Rechercher un poste..." />
        {loading ? <div className="text-center py-12 text-gray-400">Chargement...</div> : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200"><p className="text-gray-400">Aucune offre disponible</p></div>
        ) : (
          <div className="space-y-4">
            {filtered.map(offre => (
              <div key={offre.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-200 transition">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-gray-900">{offre.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{offre.companies?.name || 'Entreprise'}</p>
                    {offre.description && <p className="text-sm text-gray-500 mt-2">{offre.description}</p>}
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Test requis</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Seuil : {offre.threshold}%</span>
                    </div>
                  </div>
                  <Link href={`/offres/${offre.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition flex-shrink-0">Postuler</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
