export const sample = <T>(arr: T[], sampleSize: number): T[] =>
  arr.sort(() => Math.random() - 0.5).slice(0, sampleSize);

export const getRandomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
