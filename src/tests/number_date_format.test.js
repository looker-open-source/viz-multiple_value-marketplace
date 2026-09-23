// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import { formatValue } from '../lib/number_date_format';

describe('formatValue with multi-condition rules (Option 2)', () => {
  const multiConditionFmt = '[>=1000000000]$0.0,,," B";[>=1000000]$0.0,," M";[>=100000]$0.0," K";$0.0';

  test('formats billions correctly (>= 1,000,000,000)', () => {
    const result = formatValue(multiConditionFmt, 5000000000, 'DEFAULT_EN');
    expect(result).toMatch(/\$5\.0\s*B/);
  });

  test('formats millions correctly (>= 1,000,000)', () => {
    const result = formatValue(multiConditionFmt, 500000000, 'DEFAULT_EN');
    expect(result).toMatch(/\$500\.0\s*M/);
  });

  test('formats thousands correctly (>= 100,000)', () => {
    const result = formatValue(multiConditionFmt, 500000, 'DEFAULT_EN');
    expect(result).toMatch(/\$500\.0\s*K/);
  });

  test('formats fallback default section (< 100,000)', () => {
    const result = formatValue(multiConditionFmt, 50000, 'DEFAULT_EN');
    expect(result).toMatch(/\$50000\.0/);
  });

  test('handles null and undefined values gracefully', () => {
    expect(formatValue(multiConditionFmt, null, 'DEFAULT_EN', 'N/A')).toBe('N/A');
    expect(formatValue(multiConditionFmt, undefined, 'DEFAULT_EN', 'N/A')).toBe('N/A');
  });
});
