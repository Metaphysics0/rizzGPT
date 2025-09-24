import type { GeneratedResponse, RelationshipContext } from "$lib/types";

export interface FirstMoveGeneratorForm {
  relationshipContext: Omit<RelationshipContext, 'duration'>;
  imageFileNames: string[];
}

class FirstMoveGeneratorFormStore {
  private readonly INITIAL_VALUE: FirstMoveGeneratorForm = {
    relationshipContext: { objective: "", notes: "" },
    imageFileNames: [],
  };
  form = $state<FirstMoveGeneratorForm>(this.INITIAL_VALUE);

  isGenerating = $state(false);
  error = $state<string | null>(null);
  generatedResponse = $state<GeneratedResponse | null>(null);

  addImageFileName(fileName: string) {
    if (this.form.imageFileNames.length < 5) {
      this.form.imageFileNames.push(fileName);
    }
  }

  removeImageFileName(fileName: string) {
    const index = this.form.imageFileNames.indexOf(fileName);
    if (index > -1) {
      this.form.imageFileNames.splice(index, 1);
    }
  }

  clearAllImages() {
    this.form.imageFileNames = [];
  }

  updateRelationshipContext(context: Partial<Omit<RelationshipContext, 'duration'>>) {
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
    this.form = { ...this.INITIAL_VALUE };
    this.error = null;
    this.generatedResponse = null;
  }

  setFormData(formData: FormData) {
    this.form.imageFileNames.forEach(fileName => {
      formData.append("imageFileNames", fileName);
    });
    formData.append("objective", this.form.relationshipContext.objective);
    formData.append("notes", this.form.relationshipContext.notes);
  }

  get canGenerate() {
    return this.form.imageFileNames.length > 0 && !this.isGenerating;
  }

  get hasMaxImages() {
    return this.form.imageFileNames.length >= 5;
  }
}

export const firstMoveGeneratorFormStore = new FirstMoveGeneratorFormStore();