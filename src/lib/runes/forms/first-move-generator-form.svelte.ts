import { FormStateBaseClass } from "./form-state-base-class.svelte";
import { ImageHandler } from "./image-handler.svelte";

class FirstMoveGeneratorForm extends FormStateBaseClass {
  public images = new ImageHandler(5);
  public form = $state({
    relationshipContext: { objective: "", notes: "" },
  });

  public canGenerate = $derived(
    this.images.fileNames.length > 0 && !this.response?.loading
  );

  setFormData(formData: FormData) {
    this.images.appendToFormData(formData);
    formData.append(
      "relationshipContext",
      JSON.stringify(this.form.relationshipContext)
    );
  }
}

export const firstMoveGeneratorForm = new FirstMoveGeneratorForm();
