export const pluralize = (count: number, wordInSingularTense: string) => {
  return count === 1 ? wordInSingularTense : `${wordInSingularTense}s`;
};

export const pluralizeWithCount = (count: number, word: string) => {
  return `${count} ${pluralize(count, word)}`;
};
