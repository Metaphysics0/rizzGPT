import isEmpty from "lodash/isEmpty";

export function areAllObjectValuesEmpty(obj: Record<string, any>): boolean {
  return Object.values(obj).every((value) => isEmpty(value));
}
