const reverse = require('../test_utils/for_testing').reverse;

describe('average', () => {
  test('reverse of a', () => {
    const result = reverse('a');
    expect(result).toBe('a');
  });

  test('reverse of react', () => {
    const result = reverse('react');
    expect(result).toBe('tcaer');
  });

  test('reverse of releveler', () => {
    const result = reverse('releveler');
    expect(result).toBe('releveler');
  });

  test('palindrome of react', () => {
    const result = reverse('react');
    expect(result).toBe('tcaer');
  });
});

