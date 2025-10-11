import { FormStateBaseClass } from "./form-state-base-class.svelte";

class ProfileOptimizerForm extends FormStateBaseClass {
  public form = $state({
    imageFileNames: [] as string[],
  });
  public canGenerate = $derived(
    this.form.imageFileNames.length > 0 && !this.response?.loading
  );

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

  setFormData(formData: FormData) {
    this.form.imageFileNames.forEach((fileName) => {
      formData.append("imageFileNames", fileName);
    });
  }
}

export const profileOptimizerForm = new ProfileOptimizerForm();
