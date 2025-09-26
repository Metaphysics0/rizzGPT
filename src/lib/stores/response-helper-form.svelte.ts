import type { GeneratedResponse, RelationshipContext } from "$lib/types";

export interface ResponseHelperForm {
  relationshipContext: RelationshipContext;
  fileName: string;
}

class ResponseHelperFormStore {
  private readonly INITIAL_VALUE: ResponseHelperForm = {
    relationshipContext: { duration: 0, objective: "", notes: "" },
    fileName: "",
  };
  form = $state<ResponseHelperForm>(this.INITIAL_VALUE);

  isGenerating = $state(false);
  error = $state<string | null>(null);
  generatedResponse = $state<GeneratedResponse | null>(null);

  setFileName(fileName: string) {
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

  setFormData(formData: FormData) {
    formData.append("fileName", this.form.fileName);
    formData.append(
      "duration",
      this.form.relationshipContext.duration.toString()
    );
    formData.append("objective", this.form.relationshipContext.objective);
    formData.append("notes", this.form.relationshipContext.notes);
  }

  get canGenerate() {
    return !!this.form.fileName && !this.isGenerating;
  }
}

export const responseHelperForm = new ResponseHelperFormStore();
