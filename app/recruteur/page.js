'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function RecruteurDashboard() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', threshold: 70 })
  const [criteria, setCriteria] = useState([
    { name: 'Technique', weight: 50 },
    { name: 'Soft skills', weight: 25 },
    { name: 'Langue', weight: 15 },
    { name: 'Métier', weight: 10 },
  ])

  useEffect(() => { fetchOffers() }, [])

  async function fetchOffers() {
    const { data } = await supabase.from('job_offers').select('*').order('created_at', { ascending: false })
    setOffers(data || [])
    setLoading(false)
  }

  function updateCriterion(i, field, value) {
    const updated = [...criteria]
    updated[i][field] = field === 'weight' ? parseInt(value) || 0 : value
    setCriteria(updated)
  }

  function addCriterion() {
    setCriteria([...criteria, { name: '', weight: 0 }])
  }

  function removeCriterion(i) {
    setCriteria(criteria.filter((_, idx) => idx !== i))
  }

  const totalWeight = criteria.reduce((a, c) => a + (c.weight || 0), 0)

  async function createOffer(e) {
    e.preventDefault()
    if (totalWeight !== 100) return
    const weights = {}
    criteria.forEach(c => { if (c.name) weights[c.name] = c.weight })
    const { error } = await supabase.from('job_offers').insert([{
      title: form.title,
      description: form.description,
      threshold: parseInt(form.threshold),
      company_id: '00000000-0000-0000-0000-000000000001',
      weights,
      status: 'active'
    }])
    if (!error) {
      setShowForm(false)
      setForm({ title: '', description: '', threshold: 70 })
      setCriteria([
        { name: 'Technique', weight: 50 },
        { name: 'Soft skills', weight: 25 },
        { name: 'Langue', weight: 15 },
        { name: 'Métier', weight: 10 },
      ])
      fetchOffers()
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">TL</span>
          </div>
          <span className="font-semibold text-gray-900">TalentLink</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500 text-sm">Dashboard recruteur</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/talent-pool" className="text-sm text-gray-500 hover:text-gray-700">Talent Pool</Link>
          <Link href="/recruteur/live" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
  Live
</Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Accueil</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes offres</h1>
            <p className="text-gray-500 mt-1">{offers.length} offre{offers.length > 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-yellow-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-yellow-600 transition">
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="ex: Chargé de communication Senior" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 h-24 resize-none"
                  placeholder="Décrivez le poste..." />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Critères d'évaluation</label>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${totalWeight === 100 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    Total : {totalWeight}% {totalWeight === 100 ? '✓' : '(doit être 100%)'}
                  </span>
                </div>
                <div className="space-y-2">
                  {criteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input value={c.name} onChange={e => updateCriterion(i, 'name', e.target.value)}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Nom du critère (ex: Argumentation)" />
                      <div className="flex items-center gap-2 w-32">
                        <input type="number" min="0" max="100" value={c.weight} onChange={e => updateCriterion(i, 'weight', e.target.value)}
                          className="w-16 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                      <button type="button" onClick={() => removeCriterion(i)} className="text-gray-300 hover:text-red-500 text-xl font-light">×</button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addCriterion}
                  className="mt-2 text-sm text-yellow-600 font-medium hover:text-yellow-700">
                  + Ajouter un critère
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seuil minimum d'admission : {form.threshold}%</label>
                <input type="range" min="0" max="100" value={form.threshold}
                  onChange={e => setForm({...form, threshold: e.target.value})} className="w-full" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={totalWeight !== 100}
                  className="bg-yellow-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-yellow-600 transition disabled:opacity-50">
                  Créer l'offre
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium">Annuler</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : offers.length === 0 ? (
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
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {offer.weights && Object.entries(offer.weights).map(([key, val]) => (
                        <span key={key} className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-1 rounded-full">
                          {key} : {val}%
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${offer.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {offer.status === 'active' ? 'Active' : 'Brouillon'}
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                      Seuil : {offer.threshold}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <Link href={`/recruteur/candidats?offer=${offer.id}`} className="text-sm text-blue-600 font-medium hover:underline">
                    Voir les candidats →
                  </Link>
                  <Link href="/recruteur/tests" className="text-sm text-gray-500 font-medium hover:underline">
                    Créer un test →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
