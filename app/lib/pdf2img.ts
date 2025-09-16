export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  console.log("Loading PDF.js library...");

  try {
    loadPromise = import("pdfjs-dist").then((lib) => {
      console.log("PDF.js imported successfully");
      // Set the worker source to use local file
lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs`;      console.log("Worker source set to:", lib.GlobalWorkerOptions.workerSrc);
      pdfjsLib = lib;
      isLoading = false;
      return lib;
    });

    return loadPromise;
  } catch (error) {
    console.error("Failed to load PDF.js:", error);
    throw error;
  }
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    console.log("1. Starting PDF conversion for:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const lib = await loadPdfJs();
    console.log("2. PDF.js library loaded successfully");

    const arrayBuffer = await file.arrayBuffer();
    console.log(
      "3. File converted to ArrayBuffer, size:",
      arrayBuffer.byteLength
    );

    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    console.log("4. PDF document parsed successfully, pages:", pdf.numPages);

    const page = await pdf.getPage(1);
    console.log("5. First page loaded successfully");

    const viewport = page.getViewport({ scale: 4 });
    console.log("6. Viewport created:", {
      width: viewport.width,
      height: viewport.height,
    });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    console.log("7. Canvas created");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      console.log("8. Canvas context configured");
    }

    await page.render({ canvasContext: context!, viewport }).promise;
    console.log("9. Page rendered to canvas successfully");

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("10. Blob created successfully, size:", blob.size);
            // Create a File from the blob with the same name as the pdf
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });
            console.log("11. Image file created:", imageFile.name);

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            console.error("10. Failed to create blob from canvas");
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0
      );
    });
  } catch (err) {
    console.error("PDF conversion failed with error:", err);
    console.error("Error details:", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err instanceof Error ? err.message : err}`,
    };
  }
}
