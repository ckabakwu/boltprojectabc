import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, File, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: string[];
  uploadedFiles?: {
    name: string;
    url: string;
    type: string;
  }[];
  onRemove?: (index: number) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  maxFiles = 1,
  maxSize = 5242880, // 5MB
  accept = ['image/jpeg', 'image/png', 'image/gif'],
  uploadedFiles = [],
  onRemove,
  className = ''
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-600">
            {isDragActive ? (
              'Drop files here...'
            ) : (
              <>
                Drag & drop files here, or <span className="text-blue-600">browse</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Max {maxFiles} file{maxFiles > 1 ? 's' : ''} up to {maxSize / 1024 / 1024}MB each
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file, index) => (
            <motion.div
              key={file.url}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center">
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="h-5 w-5 text-blue-500 mr-2" />
                ) : (
                  <File className="h-5 w-5 text-blue-500 mr-2" />
                )}
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {file.name}
                </span>
                <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;