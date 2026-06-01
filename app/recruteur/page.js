'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function RecruteurDashboard() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', threshold: 70 })

  useEffect(() => { fetchOffers() }, [])

  async function fetchOffers() {
    const { data } = await supabase.from('job_offers').select('*').order('created_at', { ascending: false })
    setOffers(data || [])
    setLoading(false)
  }

  async function createOffer(e) {
    e.preventDefault()
    const { error } = await supabase.from('job_offers').insert([{
      title: form.title,
      description: form.description,
      threshold: parseInt(form.threshold),
      company_id: '00000000-0000-0000-0000-000000000001',
      weights: { tech: 50, soft: 25, lang: 15, metier: 10 },
      status: 'active'
    }])
    if (!error) { setShowForm(false); setForm({ title: '', description: '', threshold: 70 }); fetchOffers() }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">TL</span>
          </div>
          <span className="font-semibold text-gray-900">TalentLink</span>
        </div>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Accueil</Link>
      </nav>
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Mes offres</h1>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition">
            + Nouvelle offre
          </button>
        </div>
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Créer une offre</h2>
            <form onSubmit={createOffer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intitulé du poste</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Data Engineer Senior" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="Décrivez le poste..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seuil minimum : {form.threshold}%</label>
                <input type="range" min="0" max="100" value={form.threshold}
                  onChange={e => setForm({...form, threshold: e.target.value})} className="w-full" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium">Créer</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium">Annuler</button>
              </div>
            </form>
          </div>
        )}
        {loading ? <div className="text-center py-12 text-gray-400">Chargement...</div> : offers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-400">Aucune offre pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map(offer => (
              <div key={offer.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{offer.description || 'Aucune description'}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${offer.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {offer.status === 'active' ? 'Active' : 'Brouillon'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}