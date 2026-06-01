'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CandidatPage() {
  const [step, setStep] = useState('home')
  const [form, setForm] = useState({ full_name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function register(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('users').insert([{ ...form, role: 'candidate' }])
    if (error) {
      setMessage(error.code === '23505' ? 'Cet email est déjà enregistré.' : 'Une erreur est survenue.')
    } else {
      setStep('done')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
          <span className="text-white font-bold">TL</span>
        </div>
        {step === 'home' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Espace candidat</h1>
            <p className="text-gray-500 mb-6">Créez votre profil pour passer vos tests.</p>
            <form onSubmit={register} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sophie Martin" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="sophie@example.com" required />
              </div>
              {message && <p className="text-sm text-red-500">{message}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                {loading ? 'Création...' : 'Créer mon profil'}
              </button>
            </form>
          </>
        )}
        {step === 'done' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil créé !</h1>
            <p className="text-gray-500">Vous recevrez votre invitation par email.</p>
          </div>
        )}
      </div>
    </main>
  )
}