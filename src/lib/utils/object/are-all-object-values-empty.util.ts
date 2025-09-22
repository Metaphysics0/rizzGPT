export function areAllObjectValuesEmpty(obj: Record<string, any>): boolean {
  return Object.values(obj).every(
    (value) =>
      value === "" || value === null || value === undefined || value === 0
  );
}
