export const viewPdf = (file: string) => {
  const byteCharacters = atob(file.split(",")[1]);
  const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));

  const blob = new Blob([new Uint8Array(byteNumbers)], {
    type: "application/pdf",
  });

  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1000);
};

export const downloadPdf = (file: string, name: string) => {
  const link = document.createElement("a");
  link.href = file;
  link.download = name;
  link.click();
};
