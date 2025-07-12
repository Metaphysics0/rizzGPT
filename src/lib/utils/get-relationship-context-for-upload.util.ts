import type { RelationshipContext } from "$lib/types";
import { areAllObjectValuesEmpty } from "./object/are-all-object-values-empty.util";

export function getRelationshipContextForUpload(
  relationshipContext: RelationshipContext
): RelationshipContext | undefined {
  if (areAllObjectValuesEmpty(relationshipContext)) return;

  return {
    duration: relationshipContext.duration,
    objective: relationshipContext.objective,
    notes: relationshipContext.notes || "",
  };
}
