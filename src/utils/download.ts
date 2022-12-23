const downloadURL = (dataURL: string, fileName: string) => {
  let a = document.createElement("a");
  a.href = dataURL;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  a.remove();
};

export const download = (
  data: ArrayBufferLike,
  fileName = "download.bin",
  mimeType = "application/octet-stream"
) => {
  const blob = new Blob([data], {
    type: mimeType,
  });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(function () {
    return window.URL.revokeObjectURL(url);
  }, 1000);
};
