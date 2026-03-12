export const downloadCSV = (blobData: any, baseName: string) => {
  const blob = new Blob([blobData], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const today = new Date().toISOString().split("T")[0];

  const link = document.createElement("a");
  link.href = url;
  link.download = `${baseName}_${today}.csv`;
  link.click();
};