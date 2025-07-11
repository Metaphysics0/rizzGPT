import type { RelationshipContext } from "$lib/types";

export function getRelationshipContextForUpload(
  relationshipContext: RelationshipContext
): RelationshipContext | null {
  if (
    !relationshipContext.duration &&
    !relationshipContext.objective &&
    !relationshipContext.notes
  ) {
    return null;
  }

  return {
    duration: relationshipContext.duration,
    objective: relationshipContext.objective,
    notes: relationshipContext.notes || "",
  };
}
