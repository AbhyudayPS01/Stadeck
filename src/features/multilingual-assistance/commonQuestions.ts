import type { VolunteerStringKey } from '../../services/data/uiStringsVolunteer';

/**
 * The questions volunteers in the stands are actually asked, as one-tap
 * chips. Chip labels come from the interface-string tables (labelKey); the
 * question is the full ENGLISH text sent through the grounded concierge
 * pathway — it is a prompt, not display text, so it is not translated.
 */

export interface CommonQuestion {
  id: string;
  /** uiStrings key for the chip label a volunteer reads in one glance. */
  labelKey: VolunteerStringKey;
  /** The full question sent through the concierge pathway. */
  question: string;
}

export const COMMON_QUESTIONS: readonly CommonQuestion[] = [
  {
    id: 'seat',
    labelKey: 'volunteer.chip.seat',
    question: 'How do I find my seat? Which sections are on which level?',
  },
  {
    id: 'restroom',
    labelKey: 'volunteer.chip.restroom',
    question: 'Where is the nearest restroom?',
  },
  {
    id: 'water',
    labelKey: 'volunteer.chip.water',
    question: 'Where can I refill a water bottle for free?',
  },
  {
    id: 'prayer',
    labelKey: 'volunteer.chip.prayer',
    question: 'Where is the nearest prayer or quiet room?',
  },
  { id: 'halal', labelKey: 'volunteer.chip.halal', question: 'Where can I find halal food?' },
  {
    id: 'first-aid',
    labelKey: 'volunteer.chip.firstAid',
    question: 'Where is the nearest first aid station?',
  },
  {
    id: 'lost-child',
    labelKey: 'volunteer.chip.lostChild',
    question: 'A child in my group is lost. What should I do right now?',
  },
  {
    id: 'exit',
    labelKey: 'volunteer.chip.exits',
    question: 'Where is the nearest exit, and how does leaving after the match work?',
  },
  {
    id: 'transit',
    labelKey: 'volunteer.chip.transit',
    question: 'How do I get to the train or the rideshare pickup zone?',
  },
  {
    id: 'cashless',
    labelKey: 'volunteer.chip.cashless',
    question: 'Can I pay with cash at the stadium?',
  },
  {
    id: 'bags',
    labelKey: 'volunteer.chip.bags',
    question: 'What bags are allowed inside the stadium?',
  },
  {
    id: 're-entry',
    labelKey: 'volunteer.chip.reEntry',
    question: 'Can I leave the stadium and come back in later?',
  },
];
