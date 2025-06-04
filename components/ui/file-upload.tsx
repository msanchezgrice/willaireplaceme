import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  accept = ".pdf,.doc,.docx", 
  maxSize = 10 * 1024 * 1024,
  className 
}: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const removeFile = () => {
    setUploadedFile(null);
    onFileSelect(null);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize,
    multiple: false
  });

  return (
    <div className={cn("space-y-4", className)}>
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary",
            fileRejections.length > 0 && "border-red-300 bg-red-50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-2">
            {isDragActive ? "Drop your resume here" : "Drop your resume here or click to browse"}
          </p>
          <p className="text-sm text-slate-500">
            Supports PDF, DOC, DOCX (Max {Math.round(maxSize / (1024 * 1024))}MB)
          </p>
        </div>
      ) : (
        <div className="border border-slate-300 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <File className="w-5 h-5 text-slate-500 mr-3" />
            <div>
              <p className="font-medium text-slate-900">{uploadedFile.name}</p>
              <p className="text-sm text-slate-500">
                {Math.round(uploadedFile.size / 1024)} KB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={removeFile}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="text-sm text-red-600">
          {fileRejections[0].errors[0].message}
        </div>
      )}
    </div>
  );
}
