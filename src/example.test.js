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
