import { VisionMode, VisionItemData, LensQuestionItem } from '../types/vision';

export const VISION_PRESETS: Record<VisionMode, VisionItemData> = {
  identify: {
    title: '💊 Amoxicillin 500mg',
    pillTag: 'Take 1 capsule twice daily with meal',
    cardTitle: 'Amoxicillin 500mg Antibiotic',
    details: [
      'Rx: 1234567-A • Patient: Alex M.',
      'Dosage: Take 1 capsule twice daily',
      'Prescriber: Dr. E. Hartman',
      'Pharmacy: CVS Pharmacy #4829',
    ],
    speechAnalysis:
      'I can see the bottle clearly! The instructions indicate taking one capsule with breakfast and one with dinner. Would you like me to set daily reminders for this?',
    reminderLabel: 'Yes, set reminder (8 AM & 7 PM)',
    secondaryLabel: 'Explain precautions & side effects',
  },
  document: {
    title: '📄 Residential Lease Agreement',
    pillTag: 'Rent Due: 1st of every month • $2,450',
    cardTitle: 'Apartment Lease Terms',
    details: [
      'Term: 12 Months (Nov 1 – Oct 31)',
      'Monthly Rent: $2,450 (Due on 1st)',
      'Grace Period: Until 5th (5% late fee after)',
      'Utilities: Water included, Gas/Electric tenant',
    ],
    speechAnalysis:
      'I scanned the lease agreement. The key point is your monthly rent of $2,450 is due on the 1st of every month with a grace period until the 5th.',
    reminderLabel: 'Set calendar reminder for rent (1st of month)',
    secondaryLabel: 'Summarize all tenant obligations',
  },
  translate: {
    title: '🌐 Spanish Food Label Translation',
    pillTag: 'Translated: Gluten Free • Keep Refrigerated',
    cardTitle: 'Artisan Gourmet Salsa Fresca',
    details: [
      'Original: "Sin gluten y sin conservantes"',
      'English: "Gluten-free and preservative-free"',
      'Original: "Mantener refrigerado tras abrir"',
      'English: "Keep refrigerated after opening"',
    ],
    speechAnalysis:
      'The Spanish food packaging says Gluten-Free and No Preservatives. It also advises keeping it refrigerated once opened.',
    reminderLabel: 'Save recipe & allergy notes to memory',
    secondaryLabel: 'Check for potential allergen ingredients',
  },
};

export const LENS_QUESTIONS: Record<VisionMode, LensQuestionItem[]> = {
  identify: [
    {
      q: 'Can I take this on an empty stomach?',
      a: 'Amoxicillin is best taken with a meal or snack to minimize stomach upset and nausea.',
    },
    {
      q: 'What should I do if I miss a scheduled dose?',
      a: 'Take the missed capsule as soon as you remember. If it is almost time for your next dose, skip the missed one. Do not double up.',
    },
    {
      q: 'Does this interact with dairy or milk?',
      a: 'No, unlike tetracycline antibiotics, Amoxicillin does not interact with calcium or dairy products.',
    },
  ],
  document: [
    {
      q: 'What is the late fee policy?',
      a: 'Rent is due on the 1st of each month. A grace period is provided until the 5th, after which a 5% late fee ($122.50) is assessed.',
    },
    {
      q: 'Which utilities are included in the lease?',
      a: 'Water and trash services are covered by the property owner. Gas and electric services are billed directly to the tenant.',
    },
  ],
  translate: [
    {
      q: 'Does this contain gluten or preservatives?',
      a: 'The label states: "Sin gluten y sin conservantes", meaning it is 100% gluten-free and free of chemical preservatives.',
    },
    {
      q: 'How should this be stored after opening?',
      a: 'The packaging states "Mantener refrigerado tras abrir", which means keep refrigerated after opening and consume within 7 days.',
    },
  ],
};
