import { cn } from '@/lib/utils/cn';

describe('cn utility function', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', true && 'bar')).toBe('foo bar');
    expect(cn('foo', false && 'bar')).toBe('foo');
  });

  it('merges Tailwind classes without conflicts', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6');
  });
});