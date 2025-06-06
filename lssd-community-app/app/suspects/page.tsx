'use client'
import { useState, useMemo } from 'react'
import { useArrests, Entry } from '@/lib/useArrests'

export default function SuspectsPage() {
  const fullData = useArrests()

  // États des filtres
  const [suspectQuery, setSuspectQuery] = useState('')
  const [agentQuery, setAgentQuery] = useState('')
  const [affiliationQuery, setAffiliationQuery] = useState('')
  const [motifQuery, setMotifQuery] = useState('')

  // Fonction pour regrouper par suspect
  function groupBySuspect(data: Entry[]) {
    const grouped: Record<string, Entry[]> = {}
    data.forEach(entry => {
      const key = `${entry['Nom du suspect']}|${entry['Prénom du suspect']}|${entry['Date de naissance du suspect']}`
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(entry)
    })
    return grouped
  }

  // Données filtrées
  const filteredData = useMemo(() => {
    return fullData.filter(entry => {
      const suspect = `${entry['Prénom du suspect']} ${entry['Nom du suspect']}`.toLowerCase()
      const agent = `${entry["Prénom de l'agent"]} ${entry["Nom de l'agent"]}`.toLowerCase()
      const affiliations = (entry['Affiliation'] || '').toLowerCase()
      const motifs = (
        (entry["Motifs d'arrestation (pleinement réalisé)"] || '') +
        (entry["Motifs d'arrestation (tentative)"] || '') +
        (entry["Motifs d'arrestation (complicité)"] || '')
      ).toLowerCase()

      return (
        suspect.includes(suspectQuery.toLowerCase()) &&
        agent.includes(agentQuery.toLowerCase()) &&
        affiliations.includes(affiliationQuery.toLowerCase()) &&
        motifs.includes(motifQuery.toLowerCase())
      )
    })
  }, [fullData, suspectQuery, agentQuery, affiliationQuery, motifQuery])

  const groupedSuspects = useMemo(() => groupBySuspect(filteredData), [filteredData])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Liste des suspects</h1>

      {/* Filtres */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Filtrer par nom de suspect"
          value={suspectQuery}
          onChange={(e) => setSuspectQuery(e.target.value)}
          className="p-2 rounded border border-gray-300 w-full"
        />
        <input
          type="text"
          placeholder="Filtrer par agent"
          value={agentQuery}
          onChange={(e) => setAgentQuery(e.target.value)}
          className="p-2 rounded border border-gray-300 w-full"
        />
        <input
          type="text"
          placeholder="Filtrer par affiliation"
          value={affiliationQuery}
          onChange={(e) => setAffiliationQuery(e.target.value)}
          className="p-2 rounded border border-gray-300 w-full"
        />
        <input
          type="text"
          placeholder="Filtrer par motif"
          value={motifQuery}
          onChange={(e) => setMotifQuery(e.target.value)}
          className="p-2 rounded border border-gray-300 w-full"
        />
      </div>

      {/* Liste des suspects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groupedSuspects).map(([key, records]) => {
          const [nom, prenom, dob] = key.split('|')

          return (
            <div key={key} className="bg-white p-4 rounded shadow hover:bg-gray-100 cursor-pointer">
              <h2 className="text-xl font-semibold">{prenom} {nom}</h2>
              <p className="text-sm text-gray-600">Né(e) le : {dob}</p>
              <p className="text-xs text-gray-500">{records.length} arrestation(s)</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
