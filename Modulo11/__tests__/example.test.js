function soma(a, b) {
  return a + b;
}

test('soma 4 e 5 deve ser 9', () => {
  const res = soma(4, 5);
  expect(res).toBe(9);
});
