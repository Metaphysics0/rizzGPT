export class ImageHandler {
  public fileNames = $state<string[]>([]);

  constructor(public maxCount: number = 5) {}

  add(fileName: string) {
    if (this.fileNames.length < this.maxCount) {
      this.fileNames.push(fileName);
    }
  }

  remove(fileName: string) {
    const index = this.fileNames.indexOf(fileName);
    if (index > -1) {
      this.fileNames.splice(index, 1);
    }
  }

  appendToFormData(formData: FormData, key: string = "imageFileNames") {
    this.fileNames.forEach((fileName) => {
      formData.append(key, fileName);
    });
  }
}
