import { applyAction } from "$app/forms";
import { goto } from "$app/navigation";
import type { SubmitFunction } from "@sveltejs/kit";

export abstract class FormStateBaseClass {
  public response = $state({ loading: false, error: "" });

  setFormData(formData: FormData): void {
    throw new Error("Not implemented");
  }

  handleEnhance: SubmitFunction = async ({ formData }) => {
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
        this.response.error = "Generation Failed";
        return;
      }
      await applyAction(result);
    };
  };
}
