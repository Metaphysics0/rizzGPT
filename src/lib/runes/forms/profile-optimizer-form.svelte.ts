import { FormStateBaseClass } from "./form-state-base-class.svelte";
import { ImageHandler } from "./image-handler.svelte";

class ProfileOptimizerForm extends FormStateBaseClass {
  images = new ImageHandler(5);

  canGenerate = $derived(
    this.images.fileNames.length > 0 && !this.response?.loading
  );

  setFormData(formData: FormData) {
    this.images.appendToFormData(formData);
  }
}

export const profileOptimizerForm = new ProfileOptimizerForm();
