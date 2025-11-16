import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  Camera,
  FileImage,
  FileType,
  FileVideo
} from 'lucide-react';

const FileUpload = ({ 
  onUpload, 
  acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  multiple = true,
  className = ""
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileType className="h-5 w-5 text-red-500" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-5 w-5 text-purple-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const errors = [];
    
    // Check file size
    if (file.size > maxSize) {
      errors.push(`${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}.`);
    }
    
    // Check file type
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
    
    if (!isAccepted) {
      errors.push(`${file.name} is not an accepted file type.`);
    }
    
    return errors;
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    const validFiles = [];
    const newErrors = [];
    
    // Check if adding these files would exceed maxFiles
    if (files.length + fileArray.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed.`);
      setErrors(newErrors);
      return;
    }
    
    fileArray.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push({
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          status: 'pending'
        });
      } else {
        newErrors.push(...fileErrors);
      }
    });
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      setErrors([]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
    e.target.value = ''; // Reset input
  };

  const removeFile = (fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove && fileToRemove.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const uploadFile = async (fileData) => {
    setUploadProgress(prev => ({ ...prev, [fileData.id]: 0 }));
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(prev => ({ ...prev, [fileData.id]: progress }));
    }
    
    // Update file status
    setFiles(prev => prev.map(f => 
      f.id === fileData.id ? { ...f, status: 'uploaded' } : f
    ));
    
    // Call onUpload callback
    if (onUpload) {
      onUpload(fileData.file);
    }
  };

  const uploadAllFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (const fileData of pendingFiles) {
      await uploadFile(fileData);
    }
  };

  const clearAllFiles = () => {
    files.forEach(fileData => {
      if (fileData.url) {
        URL.revokeObjectURL(fileData.url);
      }
    });
    setFiles([]);
    setUploadProgress({});
    setErrors([]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload Files
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-sm text-muted-foreground">
              Accepted types: Images, PDFs, Documents • Max size: {formatFileSize(maxSize)} • Max files: {maxFiles}
            </p>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Choose Files
          </button>
        </div>
      </div>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {errors.map((error, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground">
              Selected Files ({files.length})
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={uploadAllFiles}
                disabled={files.every(f => f.status === 'uploaded')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload All
              </button>
              <button
                onClick={clearAllFiles}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {files.map((fileData) => (
              <motion.div
                key={fileData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg"
              >
                {getFileIcon(fileData)}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {fileData.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(fileData.size)}
                  </p>
                  
                  {/* Upload Progress */}
                  {fileData.status === 'pending' && uploadProgress[fileData.id] !== undefined && (
                    <div className="mt-2">
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress[fileData.id]}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {uploadProgress[fileData.id]}% uploaded
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {fileData.status === 'uploaded' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  
                  {fileData.type.startsWith('image/') && (
                    <button
                      onClick={() => window.open(fileData.url, '_blank')}
                      className="p-1 rounded hover:bg-accent transition-colors"
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeFile(fileData.id)}
                    className="p-1 rounded hover:bg-accent transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;