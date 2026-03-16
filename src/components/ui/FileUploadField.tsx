import { useRef } from "react";
import { Button } from "./Button";
import type { MedicalDocument } from "../../types/medicalDocument";
import { v4 as uuidv4 } from "uuid";
import { viewPdf } from "../../utils/documentActions";

interface FileUploadFieldProps {
  label: string;
  value: MedicalDocument[];
  onChange: (files: MedicalDocument[]) => void;
}

export function FileUploadField({
  label,
  value,
  onChange,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    const newDocuments = await Promise.all(
      fileArray.map(
        (file) =>
          new Promise<MedicalDocument>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () =>
              resolve({
                id: uuidv4(),
                name: file.name,
                file: reader.result as string,
                uploadedAt: new Date().toISOString(),
              });
          }),
      ),
    );

    onChange([...(value ?? []), ...newDocuments]);
  };

  const removeFile = (id: string) => {
    const updated = value.filter((doc) => doc.id !== id);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-text-primary dark:text-text-darkPrimary">
        {label}
      </span>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Upload button */}
      <Button variant="secondary" onClick={() => inputRef.current?.click()}>
        Upload PDF
      </Button>

      {/* Documents list */}
      {value?.length > 0 && (
        <div className="flex flex-col gap-2 text-sm">
          {value.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col gap-3 bg-soft-light dark:bg-soft-dark border border-border-light dark:border-border-dark p-3 rounded-lg shadow-md transition-colors duration-200"
            >
              {/* Left side */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary dark:text-text-darkPrimary truncate">
                  {doc.name}
                </p>
                <p className="text-xs text-text-muted dark:text-text-darkMuted">
                  Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Right side */}
              <div className="flex flex-wrap gap-2">
                {/* View */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => viewPdf(doc.file)}
                >
                  View
                </Button>

                {/* Remove */}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => removeFile(doc.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
