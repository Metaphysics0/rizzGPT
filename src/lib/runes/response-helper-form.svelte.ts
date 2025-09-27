import { applyAction } from "$app/forms";
import { goto } from "$app/navigation";
import type { SubmitFunction } from "@sveltejs/kit";

class ResponseHelperForm {
  public form = $state({
    relationshipContext: { duration: 0, objective: "", notes: "" },
    fileName: "",
  });
  public response = $state({ loading: false, error: "" });
  public canGenerate = $derived(
    !!this.form.fileName && !this.response?.loading
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
        this.response.error = "Generation Failed";
        return;
      }
      await applyAction(result);
    };
  };

  private setFormData(formData: FormData) {
    formData.append("fileName", this.form.fileName);
    formData.append(
      "relationshipContext",
      JSON.stringify(this.form.relationshipContext)
    );
  }
}

export const responseHelperForm = new ResponseHelperForm();
