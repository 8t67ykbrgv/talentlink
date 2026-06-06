'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function TalentPool() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ category: 'all', minScore: 0 })

  useEffect(() => { fetchCandidates() }, [])

  async function fetchCandidates() {
    const { data } = await supabase
      .from('scores')
      .select(`
        *,
        test_sessions(
          invitations(
            users(full_name, email),
            job_offers(title)
          )
        )
      `)
      .eq('admitted', true)
      .order('score_global', { ascending: false })
    setCandidates(data || [])
    setLoading(false)
  }

  const filtered = candidates.filter(c => {
    if (filters.minScore > 0 && c.score_global < filters.minScore) return false
    if (filters.category === 'tech' && c.score_tech < 70) return false
    if (filters.category === 'soft' && c.score_soft < 70) return false
    if (filters.category === 'lang' && c.score_lang < 70) return false
    return true
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">TL</span>
          </div>
          <span className="font-semibold text-gray-900">TalentLink</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500 text-sm">Talent Pool</span>
        </div>
        <Link href="/recruteur" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</Link>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Talent Pool</h1>
          <p className="text-gray-500 mt-1">{filtered.length} candidat{filtered.length > 1 ? 's' : ''} certifié{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex gap-4 flex-wrap items-center">
          <div className="flex gap-2">
            {[['all','Tous'],['tech','Technique'],['soft','Soft skills'],['lang','Langue']].map(([val, label]) => (
              <button key={val} onClick={() => setFilters({...filters, category: val})}
                className={`text-sm px-4 py-2 rounded-xl font-medium transition ${filters.category === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-gray-500">Score min : {filters.minScore}%</span>
            <input type="range" min="0" max="100" step="10" value={filters.minScore}
              onChange={e => setFilters({...filters, minScore: parseInt(e.target.value)})}
              className="w-32" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-400 mb-2">Aucun candidat certifié pour le moment</p>
            <p className="text-sm text-gray-300">Les candidats apparaissent ici après avoir validé un test</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(c => {
              const user = c.test_sessions?.invitations?.users
              const offer = c.test_sessions?.invitations?.job_offers
              const initials = user?.full_name?.split(' ').map(n => n[0]).join('') || '?'
              return (
                <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-200 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{user?.full_name || 'Candidat'}</span>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Certifié</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">Évalué pour : {offer?.title || 'Poste non spécifié'}</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{c.score_global}%</div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
                    {[['Technique', c.score_tech, '#378ADD'], ['Soft skills', c.score_soft, '#7F77DD'], ['Langue', c.score_lang, '#1D9E75'], ['Métier', c.score_metier, '#EF9F27']].map(([label, val, color]) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{label}</span><span>{val}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div className="h-1.5 rounded-full" style={{ width: `${val}%`, background: color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                    <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
                      Contacter
                    </button>
                    <button className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition">
                      Voir le certificat
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}