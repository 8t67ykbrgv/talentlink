'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-bold">TL</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">TalentLink</h1>
        <p className="text-xl text-gray-500 mb-10">La plateforme de recrutement par tests de compétences</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/candidat" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
            Je suis candidat
          </Link>
          <Link href="/recruteur" className="bg-white text-gray-900 border border-gray-200 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
            Je suis recruteur
          </Link>
        </div>
      </div>
    </main>
  )
}