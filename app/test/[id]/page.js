'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function PasserTest() {
  const { id } = useParams()
  const router = useRouter()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => { fetchTest() }, [id])

  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) { submitTest(); return }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  async function fetchTest() {
    const { data } = await supabase.from('tests').select('*, questions(*)').eq('id', id).single()
    if (data) {
      setQuestions(data.questions.sort((a,b) => a.position - b.position))
      setTimeLeft(data.duration_minutes * 60)
    }
    setLoading(false)
  }

  function selectAnswer(questionId, value) {
    setAnswers({...answers, [questionId]: value})
  }

  async function submitTest() {
    setSubmitting(true)
    let scoreTotal = 0
    let scoreTech = 0, scoreSoft = 0, scoreLang = 0, scoreMetier = 0
    let countTech = 0, countSoft = 0, countLang = 0, countMetier = 0

    questions.forEach(q => {
      const answer = answers[q.id]
      let points = 0
      if (q.type === 'qcm' && answer !== undefined && q.correct_answer?.index === answer) {
        points = q.points
      } else if (q.type !== 'qcm' && answer) {
        points = Math.round(q.points * 0.7)
      }
      scoreTotal += points
      if (q.category === 'tech') { scoreTech += points; countTech += q.points }
      if (q.category === 'soft') { scoreSoft += points; countSoft += q.points }
      if (q.category === 'lang') { scoreLang += points; countLang += q.points }
      if (q.category === 'metier') { scoreMetier += points; countMetier += q.points }
    })

    const totalPoints = questions.reduce((a, q) => a + q.points, 0)
    const globalScore = totalPoints > 0 ? Math.round(scoreTotal / totalPoints * 100) : 0
    const techScore = countTech > 0 ? Math.round(scoreTech / countTech * 100) : 0
    const softScore = countSoft > 0 ? Math.round(scoreSoft / countSoft * 100) : 0
    const langScore = countLang > 0 ? Math.round(scoreLang / countLang * 100) : 0
    const metierScore = countMetier > 0 ? Math.round(scoreMetier / countMetier * 100) : 0

    router.push(`/resultats?global=${globalScore}&tech=${techScore}&soft=${softScore}&lang=${langScore}&metier=${metierScore}`)
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Chargement du test...</div>
  if (questions.length === 0) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Aucune question disponible</div>

  const q = questions[current]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((current + 1) / questions.length) * 100

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-white text-sm font-bold">TL</span></div>
          <span className="font-semibold text-gray-900">Test en cours</span>
        </div>
        <div className={`flex items-center gap-2 text-sm font-medium ${timeLeft < 300 ? 'text-red-500' : 'text-gray-600'}`}>
          ⏱ {minutes}:{seconds < 10 ? '0' : ''}{seconds}
        </div>
      </nav>

      <div className="h-1 bg-gray-200">
        <div className="h-1 bg-blue-600 transition-all" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="max-w-2xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">Question {current + 1} / {questions.length}</span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            q.category === 'tech' ? 'bg-blue-50 text-blue-700' :
            q.category === 'soft' ? 'bg-purple-50 text-purple-700' :
            q.category === 'lang' ? 'bg-green-50 text-green-700' :
            'bg-orange-50 text-orange-700'
          }`}>{q.category}</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <p className="text-lg font-medium text-gray-900 mb-6 leading-relaxed">{q.content}</p>

          {q.type === 'qcm' && q.options?.choices && (
            <div className="space-y-3">
              {q.options.choices.map((choice, i) => (
                <button key={i} onClick={() => selectAnswer(q.id, i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition ${answers[q.id] === i ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
                  <span className="font-medium mr-2">{choice.label}.</span>{choice.text}
                </button>
              ))}
            </div>
          )}

          {(q.type === 'open' || q.type === 'situation') && (
            <textarea value={answers[q.id] || ''} onChange={e => selectAnswer(q.id, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              placeholder="Rédigez votre réponse..." />
          )}

          {q.type === 'code' && (
            <textarea value={answers[q.id] || ''} onChange={e => selectAnswer(q.id, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-none font-mono bg-gray-900 text-green-400"
              placeholder="// Écrivez votre code ici..." />
          )}
        </div>

        <div className="flex gap-3">
          {current > 0 && (
            <button onClick={() => setCurrent(c => c - 1)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition">
              ← Précédent
            </button>
          )}
          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent(c => c + 1)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              Suivant →
            </button>
          ) : (
            <button onClick={submitTest} disabled={submitting} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50">
              {submitting ? 'Calcul du score...' : 'Terminer le test ✓'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
