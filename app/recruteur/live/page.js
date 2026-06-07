'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LiveDashboard() {
  const [sessions, setSessions] = useState([])
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    fetchData()
    const sub = supabase
      .channel('live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'test_sessions' }, () => { fetchData(); setLastUpdate(new Date()) })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, () => { fetchData(); setLastUpdate(new Date()) })
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [])

  async function fetchData() {
    const { data: s } = await supabase.from('test_sessions').select('*, invitations(*, users(full_name), job_offers(title, threshold))').order('started_at', { ascending: false }).limit(20)
    const { data: sc } = await supabase.from('scores').select('*').order('computed_at', { ascending: false }).limit(20)
    setSessions(s || [])
    setScores(sc || [])
    setLoading(false)
  }

  const inProgress = sessions.filter(s => s.status === 'in_progress')
  const completed = sessions.filter(s => s.status === 'completed')
  const flagged = sessions.filter(s => s.status === 'flagged')

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center"><span className="text-white text-sm font-bold">TL</span></div>
          <span className="font-semibold text-gray-900">TalentLink · Live</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-gray-500">En direct · {lastUpdate.toLocaleTimeString('fr-FR')}</span>
          </div>
          <Link href="/recruteur" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto p-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div><span className="text-sm text-gray-500">En cours</span></div>
            <div className="text-3xl font-bold text-blue-600">{inProgress.length}</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-green-400"></div><span className="text-sm text-gray-500">Terminés</span></div>
            <div className="text-3xl font-bold text-green-600">{completed.length}</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-red-400"></div><span className="text-sm text-gray-500">Signalés</span></div>
            <div className="text-3xl font-bold text-red-600">{flagged.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Sessions en temps réel</h2>
            <span className="text-xs text-gray-400">Mise à jour automatique</span>
          </div>
          {loading ? <div className="text-center py-12 text-gray-400">Chargement...</div> : sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-2">Aucune session pour le moment</p>
              <p className="text-sm text-gray-300">Les candidats apparaîtront ici dès qu ils commencent un test</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {sessions.map(session => {
                const user = session.invitations?.users
                const offer = session.invitations?.job_offers
                const score = scores.find(s => s.session_id === session.id)
                const initials = user?.full_name?.split(' ').map(n => n[0]).join('') || '?'
                const duration = session.completed_at ? Math.round((new Date(session.completed_at) - new Date(session.started_at)) / 60000) : Math.round((new Date() - new Date(session.started_at)) / 60000)
                const statusMap = { completed: { bg: 'bg-green-50', text: 'text-green-700', label: 'Terminé' }, in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'En cours' }, flagged: { bg: 'bg-red-50', text: 'text-red-700', label: 'Signalé' } }
                const status = statusMap[session.status] || { bg: 'bg-gray-50', text: 'text-gray-500', label: session.status }
                return (
                  <div key={session.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-medium text-sm flex-shrink-0">{initials}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-gray-900 text-sm">{user?.full_name || 'Candidat'}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.text}`}>{status.label}</span>
                          {session.tab_switches > 0 && <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{session.tab_switches} changement{session.tab_switches > 1 ? 's' : ''} onglet</span>}
                        </div>
                        <div className="text-xs text-gray-500">{offer?.title || 'Poste inconnu'} · {duration} min</div>
                      </div>
                      {score ? (
                        <div className={`text-xl font-bold px-4 py-2 rounded-xl ${score.admitted ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{score.score_global}%</div>
                      ) : session.status === 'in_progress' ? (
                        <div className="flex items-center gap-2 text-blue-500">
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">En cours...</span>
                        </div>
                      ) : <span className="text-sm text-gray-400">—</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
