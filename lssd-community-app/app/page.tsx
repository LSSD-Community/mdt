'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-8">Département du Shériff</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link className="p-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 text-center" href="/suspects">
          Voir les suspects
        </Link>
        <Link className="p-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 text-center" href="/agents">
          Voir les agents
        </Link>
      </div>
    </main>
  )
}
