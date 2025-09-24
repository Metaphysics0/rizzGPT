<script lang="ts">
  import { onMount } from "svelte";
  import FormStep from "./FormStep.svelte";
  import Dropzone from "dropzone";
  import "dropzone/dist/dropzone.css";

  onMount(() => {
    try {
      new Dropzone("#dropzone", {
        url: "/api/drop-file", // Required but not used due to autoProcessQueue: false
        paramName: "file",
        maxFilesize: 2, // MB
        // addedfile: function (file) {
        //   console.log("File added:", file);
        // },
        accept: function (file, done) {
          if (file.name == "justinbieber.jpg") {
            done("Naha, you don't.");
          } else {
            done();
          }
        },
      });
    } catch (error) {
      console.error("Error initializing dropzone", error);
    }
  });
</script>

<FormStep title="Dropzone">
  <div class="dropzone dropzone-previews" id="dropzone"></div>
</FormStep>
