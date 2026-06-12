// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

function square(n) {
  return n * n;
}

describe('example square test', () => {
  test('should calculate the square of a number', () => {
    expect(square(-3)).toBe(9);
    expect(square(-2)).toBe(4);
    expect(square(-1)).toBe(1);
    expect(square(0)).toBe(0);
    expect(square(1)).toBe(1);
    expect(square(2)).toBe(4);
    expect(square(3)).toBe(9);
  });
});
