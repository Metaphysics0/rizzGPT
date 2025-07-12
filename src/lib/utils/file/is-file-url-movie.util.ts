export function isFileUrlMovie(url: string) {
  return [
    ".mp4",
    ".mov",
    ".webm",
    ".avi",
    ".mkv",
    ".wmv",
    ".flv",
    ".mpeg",
    ".mpg",
    ".m4v",
    ".m4a",
    ".m4b",
    ".m4p",
    ".m4v",
    ".m4a",
    "video",
  ].some((extension) => url.toLowerCase().endsWith(extension));
}
