<script lang="ts">
  import { onMount } from "svelte";
  import FormStep from "./FormStep.svelte";
  import Dropzone from "dropzone";
  import "dropzone/dist/dropzone.css";

  onMount(() => {
    try {
      new Dropzone("#dropzone", {
        url: "api/generate-client-upload-url", // placeholder, will be overridden
        paramName: "file",
        sending: async function (file, xhr, formData) {
          try {
            // Get upload URL from your API
            const response = await fetch("/api/generate-client-upload-url");
            const uploadData = await response.json();

            // Override the URL for this upload
            xhr.open("POST", uploadData.uploadUrl, true);

            // Add any required headers from the upload data
            if (uploadData.authorizationToken) {
              xhr.setRequestHeader(
                "Authorization",
                uploadData.authorizationToken
              );
            }
          } catch (error) {
            console.error("Failed to get upload URL:", error);
          }
        },
        maxFilesize: 2, // MB
        complete(file) {
          console.log("COMPLETE", file);
        },
        addedfile: function (file) {
          console.log("File added:", file);
        },
        accept: function (file, done) {
          console.log("ACCEPTED", file);

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
