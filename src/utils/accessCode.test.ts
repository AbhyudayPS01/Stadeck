import { describe, expect, it } from 'vitest';
import { DEMO_ACCESS_CODES } from '../config/constants';
import { resolveAccessCode } from './accessCode';

describe('resolveAccessCode', () => {
  it('resolves the volunteer demo code to the volunteer role', () => {
    expect(resolveAccessCode(DEMO_ACCESS_CODES.volunteer)).toBe('volunteer');
  });

  it('resolves the organizer demo code to the organizer role', () => {
    expect(resolveAccessCode(DEMO_ACCESS_CODES.organizer)).toBe('organizer');
  });

  it('ignores case and surrounding whitespace', () => {
    expect(resolveAccessCode(`  ${DEMO_ACCESS_CODES.volunteer.toLowerCase()}  `)).toBe('volunteer');
  });

  it('returns null for an unknown code', () => {
    expect(resolveAccessCode('NOT-A-REAL-CODE')).toBeNull();
  });

  it('returns null for empty and whitespace-only input', () => {
    expect(resolveAccessCode('')).toBeNull();
    expect(resolveAccessCode('   ')).toBeNull();
  });
});
