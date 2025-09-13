import { useState, useRef } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accepted?: string;
  maxSizeMB?: number;
  className?: string;
  children?: React.ReactNode;
}

export function FileUpload({ 
  onUpload, 
  accepted = '.pdf,.jpg,.jpeg,.png', 
  maxSizeMB = 10,
  className,
  children 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setUploadedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onUpload(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  if (uploadedFile) {
    return (
      <div className={cn("border-2 border-border-light rounded-lg p-4 bg-background", className)}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground">Uploaded File</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFile}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-start space-x-4">
          {preview ? (
            <img 
              src={preview} 
              alt="Certificate preview"
              className="w-24 h-24 object-cover rounded border"
            />
          ) : (
            <div className="w-24 h-24 bg-muted rounded border flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {uploadedFile.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            {uploadedFile.type.includes('pdf') && (
              <p className="text-xs text-muted-foreground mt-1">
                PDF Document
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accepted}
        onChange={handleChange}
        className="hidden"
        aria-label="Upload file"
      />
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          dragActive 
            ? "border-primary bg-primary/5" 
            : "border-border-light hover:border-primary/50 hover:bg-accent/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onButtonClick();
          }
        }}
        aria-label="Upload file area"
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        
        {children || (
          <>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload Certificate
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your certificate here, or click to browse
            </p>
            <Button variant="outline" type="button">
              Choose File
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Supports PDF, JPG, PNG (max {maxSizeMB}MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
}