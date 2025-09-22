import type { GeneratedResponse, RelationshipContext } from "$lib/types";

export interface GenerateRizzForm {
  relationshipContext: RelationshipContext;
  blobUrl: string;
}

class GenerateRizzFormStore {
  form = $state<GenerateRizzForm>({
    relationshipContext: { duration: 0, objective: "", notes: "" },
    blobUrl: "",
  });

  isGenerating = $state(false);
  error = $state<string | null>(null);
  generatedResponse = $state<GeneratedResponse | null>(null);

  updateBlobUrl(blobUrl: string) {
    this.form.blobUrl = blobUrl;
  }

  updateRelationshipContext(context: Partial<RelationshipContext>) {
    Object.assign(this.form.relationshipContext, context);
  }

  setGenerating(isGenerating: boolean) {
    this.isGenerating = isGenerating;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setGeneratedResponse(response: GeneratedResponse | null) {
    this.generatedResponse = response;
  }

  reset() {
    this.form = {
      relationshipContext: { duration: 0, objective: "", notes: "" },
      blobUrl: "",
    };
    this.error = null;
    this.generatedResponse = null;
  }

  get canGenerate() {
    return this.form.blobUrl && !this.isGenerating;
  }
}

export const generateRizzFormStore = new GenerateRizzFormStore();
