/**
 * The questions volunteers in the stands are actually asked, as one-tap
 * chips. Each chip label is what the volunteer scans in one glance; the
 * question is the full text sent through the grounded concierge pathway,
 * phrased to hit the stadium facts knowledge base.
 */

export interface CommonQuestion {
  id: string;
  /** Short chip label a volunteer reads in one glance. */
  label: string;
  /** The full question sent through the concierge pathway. */
  question: string;
}

export const COMMON_QUESTIONS: readonly CommonQuestion[] = [
  {
    id: 'seat',
    label: 'Find my seat',
    question: 'How do I find my seat? Which sections are on which level?',
  },
  { id: 'restroom', label: 'Nearest restroom', question: 'Where is the nearest restroom?' },
  { id: 'water', label: 'Free water', question: 'Where can I refill a water bottle for free?' },
  { id: 'prayer', label: 'Prayer room', question: 'Where is the nearest prayer or quiet room?' },
  { id: 'halal', label: 'Halal food', question: 'Where can I find halal food?' },
  { id: 'first-aid', label: 'First aid', question: 'Where is the nearest first aid station?' },
  {
    id: 'lost-child',
    label: 'Lost child',
    question: 'A child in my group is lost. What should I do right now?',
  },
  {
    id: 'exit',
    label: 'Exits',
    question: 'Where is the nearest exit, and how does leaving after the match work?',
  },
  {
    id: 'transit',
    label: 'Train & rideshare',
    question: 'How do I get to the train or the rideshare pickup zone?',
  },
  { id: 'cashless', label: 'Paying with cash', question: 'Can I pay with cash at the stadium?' },
  { id: 'bags', label: 'Bag policy', question: 'What bags are allowed inside the stadium?' },
  {
    id: 're-entry',
    label: 'Re-entry',
    question: 'Can I leave the stadium and come back in later?',
  },
];
