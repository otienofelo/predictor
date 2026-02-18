import diseaseRules from './diseaseRules'

export const runDiagnosis = (species, selectedSymptoms) => {
  const diseases = diseaseRules[species] || []

  const normalizedSelected = selectedSymptoms.map(s => s.toLowerCase().trim())

  const results = diseases.map(disease => {
    const normalizedDiseaseSymptoms = disease.symptoms.map(s => s.toLowerCase().trim())
    const matchedSymptoms = normalizedDiseaseSymptoms.filter(s => normalizedSelected.includes(s))
    const matchCount = matchedSymptoms.length
    const confidence = disease.symptoms.length > 0
      ? Math.round((matchCount / disease.symptoms.length) * 100)
      : 0

    return {
      ...disease,
      matchCount,
      matchedSymptoms,
      confidence
    }
  })

  return results
    .filter(r => r.matchCount > 0)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
}