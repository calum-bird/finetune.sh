import { useEffect, useState } from "react";
import { tempJsonlUpload } from "../services/lib/tempJsonlUpload";

interface FileSize {
  decimal: number;
  unit: string;
}

const getSizeUnit = (size: number): FileSize => {
  if (size < 1024) {
    return {
      decimal: size,
      unit: "B",
    };
  } else if (size < 1024 * 1024) {
    return {
      decimal: size / 1024,
      unit: "KB",
    };
  } else if (size < 1024 * 1024 * 1024) {
    return {
      decimal: size / (1024 * 1024),
      unit: "MB",
    };
  } else {
    return {
      decimal: size / (1024 * 1024 * 1024),
      unit: "GB",
    };
  }
};

export default function FileUploader(props: any) {
  const MAX_FILE_SIZE = 1024 * 1024 * 1024 * 5; // 5gb
  const {
    setUploadedFilePath,
    setUploadedFileName,
    uploadedFileName,
  }: {
    setUploadedFilePath: (filePath: string) => void;
    setUploadedFileName: (fileName: string | undefined) => void;
    uploadedFileName: string | undefined;
  } = props;

  const [fileSize, setFileSize] = useState(-1);
  const [jsonlFile, setJsonlFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if (jsonlFile && !isUploaded) {
      tempJsonlUpload(
        jsonlFile,
        (path) => {
          setUploadedFilePath(path);
          setIsUploaded(true);
          setUploadedFileName(jsonlFile.name);
        },
        (error) => {
          alert("failed to upload file: " + error);
          console.error("failed to upload file: ", error);
        }
      );
    }

    if (jsonlFile) {
      setFileSize(jsonlFile.size);
    }

    console.log("Uploaded @ fileUploader:", uploadedFileName);
    if (!jsonlFile && uploadedFileName !== undefined) {
      // Create a fake file object
      setJsonlFile(
        new File([], uploadedFileName, { type: "application/jsonl" })
      );
    }
  }, [jsonlFile, uploadedFileName]);

  return (
    <div>
      <div className="sm:grid sm:grid-cols-2 sm:items-start sm:gap-4 sm:pt-5">
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              {jsonlFile === null ? (
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <ul className="list">
                  <li>
                    {jsonlFile.name} - {getSizeUnit(fileSize).decimal}
                    {getSizeUnit(fileSize).unit}
                  </li>
                </ul>
              )}

              <div className="flex text-sm text-gray-300 text-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>
                    {jsonlFile === null
                      ? "Upload your dataset"
                      : "Upload a different dataset"}
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".jsonl"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files !== null) {
                        if (files.length === 1) {
                          const file = files.item(0);
                          if (file!.size > MAX_FILE_SIZE) {
                            alert("File size too large! Contact us for help");
                          } else {
                            setJsonlFile(file);
                          }
                        } else {
                          alert("Please upload only a single file.");
                        }
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">JSON-L file up to 5GB</p>
            </div>
          </div>
        </div>
      </div>
      {jsonlFile && !isUploaded ? "Uploading... " : null}
    </div>
  );
}
