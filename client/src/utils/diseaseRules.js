
 const diseaseRules = {
  cow: [
    {
      name: 'Foot and Mouth Disease',
      symptoms: ['fever', 'mouth blisters', 'drooling', 'lameness'],
      prevention: 'Vaccinate annually. Quarantine new animals.',
      treatment: 'No cure; supportive care. Report to vet immediately.'
    },
    {
      name: 'Mastitis',
      symptoms: ['swollen udder', 'clotted milk', 'fever', 'loss of appetite'],
      prevention: 'Maintain hygiene during milking. Dry cow therapy.',
      treatment: 'Intramammary antibiotics. Frequent milking of affected quarter.'
    },
    {
      name: 'Bloat',
      symptoms: ['distended abdomen', 'difficulty breathing', 'restlessness'],
      prevention: 'Avoid sudden diet changes. Provide roughage.',
      treatment: 'Administer anti-foaming agent. Emergency trocarization if severe.'
    }
  ],

  goat: [
    {
      name: 'Peste des Petits Ruminants (PPR)',
      symptoms: ['fever', 'nasal discharge', 'mouth sores', 'diarrhea'],
      prevention: 'Vaccinate annually.',
      treatment: 'Supportive care; no specific treatment.'
    },
    {
      name: 'Pneumonia',
      symptoms: ['cough', 'fever', 'difficulty breathing', 'nasal discharge'],
      prevention: 'Avoid stress. Provide proper ventilation.',
      treatment: 'Antibiotics (oxytetracycline). Anti-inflammatories.'
    }
  ],

  sheep: [
    {
      name: 'Sheep Pox',
      symptoms: ['fever', 'skin lesions', 'nasal discharge'],
      prevention: 'Vaccinate in endemic areas.',
      treatment: 'Supportive care and isolation.'
    }
  ],

  chicken: [
    {
      name: 'Newcastle Disease',
      symptoms: ['cough', 'twisted neck', 'diarrhea', 'drop in egg production'],
      prevention: 'Routine vaccination.',
      treatment: 'No cure; isolate infected birds.'
    }
  ]
}

export default diseaseRules