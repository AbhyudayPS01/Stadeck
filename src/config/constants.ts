import type { Module } from '../types/module';

/** Demo venue for all mock data: the FIFA World Cup 2026 Final host. */
export const STADIUM_NAME = 'MetLife Stadium';
export const STADIUM_ID = 'metlife-2026-final';
export const STADIUM_CAPACITY = 82_500;

/**
 * The eight modules named exactly after the challenge clauses. Drives route
 * generation and navigation — see App.tsx.
 */
export const MODULES: readonly Module[] = [
  { id: 'navigation', label: 'Navigation', path: '/navigation' },
  { id: 'crowd-management', label: 'Crowd Management', path: '/crowd-management' },
  { id: 'accessibility', label: 'Accessibility', path: '/accessibility' },
  { id: 'transportation', label: 'Transportation', path: '/transportation' },
  { id: 'sustainability', label: 'Sustainability', path: '/sustainability' },
  {
    id: 'multilingual-assistance',
    label: 'Multilingual Assistance',
    path: '/multilingual-assistance',
  },
  {
    id: 'operational-intelligence',
    label: 'Operational Intelligence',
    path: '/operational-intelligence',
  },
  {
    id: 'real-time-decision-support',
    label: 'Real-Time Decision Support',
    path: '/real-time-decision-support',
  },
];
