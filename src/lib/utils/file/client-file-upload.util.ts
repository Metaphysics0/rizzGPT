export async function triggerClientFileUpload(
  file: File,
  userId: string
): Promise<string> {
  const { authorizationToken, uploadUrl } = await getClientUploadUrl();

  const uploadResult = await uploadFileToBackblaze({
    uploadUrl,
    authorizationToken,
    file,
    userId,
  });

  return uploadResult.fileName;
}

async function uploadFileToBackblaze({
  uploadUrl,
  authorizationToken,
  file,
  userId,
}: {
  uploadUrl: string;
  authorizationToken: string;
  file: File;
  userId: string;
}) {
  const { fileContent, fileHash } = await getFileContentToUpload(file);
  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    mode: "cors",
    body: fileContent,
    headers: {
      "Content-Type": "b2/x-auto",
      Authorization: authorizationToken,
      "X-Bz-File-Name": encodeURIComponent(constructFilePath(file, userId)),
      "X-Bz-Content-Sha1": fileHash,
    },
  });
  const uploadResult = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed: ${uploadResponse.statusText}`);
  }
  return uploadResult;
}

async function getClientUploadUrl(): Promise<{
  authorizationToken: string;
  uploadUrl: string;
}> {
  try {
    const response = await fetch("/api/generate-client-upload-url");
    const { authorizationToken, uploadUrl } = await response.json();
    return {
      authorizationToken,
      uploadUrl,
    };
  } catch (e) {
    console.error("Generate client upload url failed", e);
    throw new Error("Generate client upload url failed");
  }
}

async function getFileContentToUpload(file: File) {
  const fileContent = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-1", fileContent);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fileHash = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return {
    fileContent,
    fileHash,
  };
}

function constructFilePath(file: File, userId: string): string {
  const extension = file.name.split(".").pop() || "bin";
  return `uploads/${userId}/${crypto.randomUUID()}.${extension}`;
}

// our api returns a 302 pointing to the actual download link
export function getSignedUrlFromFilePath(objectPath: string) {
  const fileName = objectPath.split("/").at(-1);
  return `/api/files/${fileName}/get-signed-download-url`;
}
