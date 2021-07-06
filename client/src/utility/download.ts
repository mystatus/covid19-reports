export function downloadFile(data: any, filename: string, extension: string) {
  const objectURL = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = objectURL;
  link.setAttribute('download', safeFilename(filename, extension));
  document.body.appendChild(link);
  link.click();
}

export function safeFilename(filename: string, extension: string) {
  // Only allow letters, numbers, underscores, and hyphens in filenames.
  const name = filename.replace(/[^a-z0-9_-]/gi, '');
  return `${name}.${extension}`;
}
