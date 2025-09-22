export async function triggerClientFileUpload(file: File): Promise<string> {
  const filename = constructFileName(file);
  const response = await fetch("/api/generate-client-upload-url");
  const { authorizationToken, uploadUrl } = await response.json();

  const fileContent = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-1", fileContent);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "b2/x-auto",
      Authorization: authorizationToken,
      "X-Bz-File-Name": encodeURIComponent(filename),
      "X-Bz-Content-Sha1": hashHex,
    },
    body: fileContent,
  });

  const uploadResult = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed: ${uploadResponse.statusText}`);
  }

  return `https://f005.backblazeb2.com/file/rizz-gpt/${uploadResult.fileName}`;
}

function constructFileName(file: File): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2);
  const extension = file.name.split(".").pop() || "bin";
  return `uploads/${timestamp}-${randomId}.${extension}`;
}
