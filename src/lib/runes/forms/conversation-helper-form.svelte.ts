import { FormStateBaseClass } from "./form-state-base-class.svelte";

class ConversationHelperForm extends FormStateBaseClass {
  public form = $state({
    relationshipContext: { duration: 0, objective: "", notes: "" },
    fileName: "",
  });
  public canGenerate = $derived(
    !!this.form.fileName && !this.response?.loading
  );

  setFormData(formData: FormData) {
    formData.append("fileName", this.form.fileName);
    formData.append(
      "relationshipContext",
      JSON.stringify(this.form.relationshipContext)
    );
  }
}

export const conversationHelperForm = new ConversationHelperForm();
