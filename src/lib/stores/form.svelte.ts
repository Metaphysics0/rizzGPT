import type { GeneratedResponse, RelationshipContext } from "$lib/types";

export interface GenerateRizzForm {
  relationshipContext: RelationshipContext;
  fileName: string;
}

class GenerateRizzFormStore {
  private readonly INITIAL_VALUE: GenerateRizzForm = {
    relationshipContext: { duration: 0, objective: "", notes: "" },
    fileName: "",
  };
  form = $state<GenerateRizzForm>(this.INITIAL_VALUE);

  isGenerating = $state(false);
  error = $state<string | null>(null);
  generatedResponse = $state<GeneratedResponse | null>(null);

  updateFileName(fileName: string) {
    this.form.fileName = fileName;
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
    this.form = this.INITIAL_VALUE;
    this.error = null;
    this.generatedResponse = null;
  }

  get canGenerate() {
    return this.form.fileName && !this.isGenerating;
  }
}

export const generateRizzFormStore = new GenerateRizzFormStore();
