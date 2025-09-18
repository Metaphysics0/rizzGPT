export const pluralize = (count: number, word: string) => {
  return count === 1 ? word : `${word}s`;
};

export const pluralizeWithCount = (count: number, word: string) => {
  return `${count} ${pluralize(count, word)}`;
};
