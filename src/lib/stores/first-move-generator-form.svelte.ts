import { applyAction } from "$app/forms";
import { goto } from "$app/navigation";
import type { SubmitFunction } from "@sveltejs/kit";

class FirstMoveGeneratorForm {
  public form = $state({
    relationshipContext: { objective: "", notes: "" },
    imageFileNames: [] as string[],
  });
  public response = $state({ loading: false, error: "" });
  public canGenerate = $derived(
    this.form.imageFileNames.length > 0 && !this.response?.loading
  );

  public handleEnhance: SubmitFunction = async ({ formData }) => {
    this.setFormData(formData);
    this.response.loading = true;
    return async ({ result }) => {
      this.response.loading = false;
      if (result.type === "redirect") {
        goto(result.location);
        return;
      }
      if (result.type === "failure") {
        console.error("Generation failed", result.data);
        firstMoveGeneratorForm.response.error = "Generation Failed";
        return;
      }
      await applyAction(result);
    };
  };

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

  private setFormData(formData: FormData) {
    this.form.imageFileNames.forEach((fileName) => {
      formData.append("imageFileNames", fileName);
    });
    formData.append(
      "relationshipContext",
      JSON.stringify(this.form.relationshipContext)
    );
  }
}

export const firstMoveGeneratorForm = new FirstMoveGeneratorForm();
