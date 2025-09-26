import type { GeneratedResponse, RelationshipContext } from "$lib/types";

const DEFAULT_FORM = {
  relationshipContext: {
    objective: "",
    notes: "",
  },
  imageFileNames: [] as string[],
};

class FirstMoveGeneratorFormStore {
  public form = $state({ ...DEFAULT_FORM });
  public isGenerating = $state(false);
  public error = $state<string | null>(null);
  public generatedResponse = $state<GeneratedResponse | null>(null);

  public canGenerate = $derived(
    () => this.form.imageFileNames.length > 0 && !this.isGenerating
  );
  public hasMaxImages = $derived(() => this.form.imageFileNames.length >= 5);

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

  updateRelationshipContext(
    context: Partial<Omit<RelationshipContext, "duration">>
  ) {
    Object.assign(this.form.relationshipContext, context);
  }

  reset() {
    this.form = { ...DEFAULT_FORM };
    this.error = null;
    this.generatedResponse = null;
  }

  setFormData(formData: FormData) {
    this.form.imageFileNames.forEach((fileName) => {
      formData.append("imageFileNames", fileName);
    });
    formData.append("objective", this.form.relationshipContext.objective);
    formData.append("notes", this.form.relationshipContext.notes);
  }
}

export const firstMoveGeneratorFormStore = new FirstMoveGeneratorFormStore();
