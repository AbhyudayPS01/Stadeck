import { GATES, SECTIONS } from '../services/data/stadiumLayout';
import type { Gate, StadiumSection } from '../types/stadium';

/**
 * Shared lookup helpers for tests that need a specific gate or section from
 * the real stadium layout — throwing on a miss so a renamed id fails the test
 * loudly instead of passing against undefined.
 */

export function findGate(id: string): Gate {
  const gate = GATES.find((candidate) => candidate.id === id);
  if (!gate) {
    throw new Error(`missing test gate ${id}`);
  }
  return gate;
}

export function findSection(id: string): StadiumSection {
  const section = SECTIONS.find((candidate) => candidate.id === id);
  if (!section) {
    throw new Error(`missing test section ${id}`);
  }
  return section;
}
