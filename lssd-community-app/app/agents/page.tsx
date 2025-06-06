'use client'
import { useArrests } from '../../lib/useArrests'

export default function Suspects() {
  const fullData = useArrests()
  // Termine avec ton filtering & rendering existants
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Liste des suspects</h1>
      {/* filtre & carte suspects ici */}
    </div>
  )
}
