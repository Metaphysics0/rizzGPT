import type { RelationshipContext } from "$lib/types";
import { areAllObjectValuesEmpty } from "./object/are-all-object-values-empty.util";

export function getRelationshipContextForUpload(
  relationshipContextForm: RelationshipContext
): RelationshipContext | undefined {
  if (areAllObjectValuesEmpty(relationshipContextForm)) return;
  return relationshipContextForm;
}
