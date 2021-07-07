import hasRussianLetter from './hasRussianLetter';


describe('Testing hasRussianLetter function', () => {
  it('it should be true or false', () => {
    const wordInput = 'мама';
    expect(hasRussianLetter(wordInput)).toBe(true);
  });

  it('it should be true or false', () => {
    const wordInput = 'ded';
    expect(hasRussianLetter(wordInput)).toBe(false);
  });

  it('it should be true or false', () => {
    const wordInput = '';
    expect(hasRussianLetter(wordInput)).toBe(false);
  });
});
