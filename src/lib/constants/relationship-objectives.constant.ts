export interface RelationshipObjective {
  id: string;
  label: string;
  emoji: string;
}

export const relationshipObjectives: RelationshipObjective[] = [
  {
    id: "new-friends",
    label: "New Friends",
    emoji: "😊",
  },
  {
    id: "long-term-partner",
    label: "Long-term partner",
    emoji: "💑",
  },
  {
    id: "short-term-fun",
    label: "Short-term fun",
    emoji: "🎉",
  },
  {
    id: "long-term-open-to-short",
    label: "Long-term, open to short",
    emoji: "😄",
  },
  {
    id: "short-term-open-to-long",
    label: "Short-term, open to long",
    emoji: "😊",
  },
  {
    id: "still-figuring-out",
    label: "Still figuring it out",
    emoji: "🤔",
  },
];

// Helper function to find objective by id
export function getObjectiveById(
  id: string
): RelationshipObjective | undefined {
  return relationshipObjectives.find((obj) => obj.id === id);
}
