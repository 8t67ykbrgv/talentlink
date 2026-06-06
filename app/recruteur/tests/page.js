'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function CreerTest() {
  const [step, setStep] = useState(1)
  const [test, setTest] = useState({ title: '', duration_minutes: 30 })
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState({ type: 'qcm', category: 'tech', content: '', points: 10, options: ['', '', '', ''], correct_answer: 0 })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function addQuestion() {
    if (!currentQ.content) return
    setQuestions([...questions, { ...currentQ, id: Date.now() }])
    setCurrentQ({ type: 'qcm', category: 'tech', content: '', points: 10, options: ['', '', '', ''], correct_answer: 0 })
  }

  function removeQuestion(id) {
    setQuestions(questions.filter(q => q.id !== id))
  }

  async function saveTest() {
    setSaving(true)
    const { data: testData, error } = await supabase.from('tests').insert([{
      title: test.title,
      duration_minutes: parseInt(test.duration_minutes),
      offer_id: '00000000-0000-0000-0000-000000000001',
      status: 'active'
    }]).select().single()

    if (!error && testData) {
      const questionsToInsert = questions.map((q, i) => ({
        test_id: testData.id,
        type: q.type,
        category: q.category,
        content: q.content,
        points: q.points,
        position: i,
        options: q.type === 'qcm' ? { choices: q.options.map((o, idx) => ({ label: String.fromCharCode(65+idx), text: o })) } : null,
        correct_answer: q.type === 'qcm' ? { index: q.correct_answer } : null,
      }))
      await supabase.from('questions').insert(questionsToInsert)
      setSaved(true)
    }
    setSaving(false)
  }

  if (saved) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Test créé !</h1>
        <p className="text-gray-500 mb-6">{questions.length} question{questions.length > 1 ? 's' : ''} ajoutée{questions.length > 1 ? 's' : ''}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/recruteur" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
            Dashboard
          </Link>
          <button onClick={() => { setSaved(false); setStep(1); setTest({ title: '', duration_minutes: 30 }); setQuestions([]) }}
            className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
            Créer un autre
          </button>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">TL</span>
          </div>
          <span className="font-semibold text-gray-900">TalentLink</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500 text-sm">Créer un test</span>
        </div>
        <Link href="/recruteur" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</Link>
      </nav>

      <div className="max-w-3xl mx-auto p-8">

        {/* Étapes */}
        <div className="flex items-center gap-4 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
              <span className={`text-sm ${step >= s ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {s === 1 ? 'Infos' : s === 2 ? 'Questions' : 'Révision'}
              </span>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        {/* Étape 1 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations du test</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du test</label>
                <input value={test.title} onChange={e => setTest({...test, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Test Data Engineer Senior" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée : {test.duration_minutes} minutes</label>
                <input type="range" min="10" max="120" step="5" value={test.duration_minutes}
                  onChange={e => setTest({...test, duration_minutes: e.target.value})} className="w-full" />
              </div>
              <button onClick={() => test.title && setStep(2)}
                disabled={!test.title}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* Étape 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une question</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={currentQ.type} onChange={e => setCurrentQ({...currentQ, type: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="qcm">QCM</option>
                      <option value="open">Question ouverte</option>
                      <option value="code">Code</option>
                      <option value="situation">Mise en situation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select value={currentQ.category} onChange={e => setCurrentQ({...currentQ, category: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="tech">Technique</option>
                      <option value="soft">Soft skills</option>
                      <option value="lang">Langue</option>
                      <option value="metier">Métier</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                  <textarea value={currentQ.content} onChange={e => setCurrentQ({...currentQ, content: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    placeholder="Rédigez votre question..." />
                </div>
                {currentQ.type === 'qcm' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Choix de réponses</label>
                    {currentQ.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-3 mb-2">
                        <input type="radio" name="correct" checked={currentQ.correct_answer === i}
                          onChange={() => setCurrentQ({...currentQ, correct_answer: i})} />
                        <input value={opt} onChange={e => {
                          const opts = [...currentQ.options]
                          opts[i] = e.target.value
                          setCurrentQ({...currentQ, options: opts})
                        }}
                          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Choix ${String.fromCharCode(65+i)}`} />
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 mt-1">Sélectionnez la bonne réponse avec le bouton radio</p>
                  </div>
                )}
                <button onClick={addQuestion} disabled={!currentQ.content}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
                  + Ajouter cette question
                </button>
              </div>
            </div>

            {questions.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">{questions.length} question{questions.length > 1 ? 's' : ''} ajoutée{questions.length > 1 ? 's' : ''}</h3>
                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <div key={q.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <span className="text-xs font-medium text-gray-400 mt-0.5 w-4">{i+1}</span>
                      <div className="flex-1">
                        <div className="flex gap-2 mb-1">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{q.type}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{q.category}</span>
                        </div>
                        <p className="text-sm text-gray-700">{q.content}</p>
                      </div>
                      <button onClick={() => removeQuestion(q.id)} className="text-gray-300 hover:text-red-500 text-lg">×</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(3)} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                  Continuer → Révision
                </button>
              </div>
            )}
          </div>
        )}

        {/* Étape 3 */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Révision avant publication</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Titre</span>
                <span className="font-medium text-gray-900">{test.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Durée</span>
                <span className="font-medium text-gray-900">{test.duration_minutes} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Questions</span>
                <span className="font-medium text-gray-900">{questions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Points total</span>
                <span className="font-medium text-gray-900">{questions.reduce((a, q) => a + q.points, 0)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition">
                ← Modifier
              </button>
              <button onClick={saveTest} disabled={saving || questions.length === 0}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                {saving ? 'Publication...' : 'Publier le test'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}