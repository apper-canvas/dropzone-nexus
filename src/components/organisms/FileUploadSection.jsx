import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import DropZone from "@/components/molecules/DropZone";
import FileCard from "@/components/molecules/FileCard";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import { fileUploadService } from "@/services/api/fileUploadService";
import { uploadConfigService } from "@/services/api/uploadConfigService";

const FileUploadSection = () => {
  const [files, setFiles] = useState([]);
  const [uploadConfig, setUploadConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeUploads, setActiveUploads] = useState(new Set());

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [existingFiles, config] = await Promise.all([
          fileUploadService.getAll(),
          uploadConfigService.getConfig()
        ]);
        setFiles(existingFiles);
        setUploadConfig(config);
      } catch (error) {
        toast.error('Failed to load upload settings');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilesSelected = async (selectedFiles) => {
    if (!uploadConfig) {
      toast.error('Upload configuration not loaded');
      return;
    }

    // Validate files
    const validFiles = [];
    const invalidFiles = [];

    selectedFiles.forEach(file => {
      const errors = fileUploadService.validateFile(file, uploadConfig);
      if (errors.length > 0) {
        invalidFiles.push({ file, errors });
      } else {
        validFiles.push(file);
      }
    });

    // Show validation errors
    invalidFiles.forEach(({ file, errors }) => {
      toast.error(`${file.name}: ${errors.join(', ')}`);
    });

    // Check concurrent upload limit
    if (activeUploads.size + validFiles.length > uploadConfig.maxConcurrentUploads) {
      toast.warning(`Maximum ${uploadConfig.maxConcurrentUploads} concurrent uploads allowed`);
      return;
    }

    // Start uploads for valid files
    validFiles.forEach(file => {
      startFileUpload(file);
    });
  };

  const startFileUpload = async (file) => {
    const uploadId = Date.now() + Math.random();
    setActiveUploads(prev => new Set([...prev, uploadId]));

    try {
      await fileUploadService.uploadFile(file, (updatedFile) => {
        setFiles(prevFiles => {
          const existingIndex = prevFiles.findIndex(f => f.Id === updatedFile.Id);
          if (existingIndex >= 0) {
            const newFiles = [...prevFiles];
            newFiles[existingIndex] = updatedFile;
            return newFiles;
          } else {
            return [...prevFiles, updatedFile];
          }
        });
      });

      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
      
      // Update file status to error
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.name === file.name && f.size === file.size
            ? { ...f, status: 'error', error: error.message }
            : f
        )
      );
    } finally {
      setActiveUploads(prev => {
        const newSet = new Set(prev);
        newSet.delete(uploadId);
        return newSet;
      });
    }
  };

  const handleRemoveFile = async (fileId) => {
    try {
      await fileUploadService.delete(fileId);
      setFiles(prevFiles => prevFiles.filter(f => f.Id !== fileId));
      toast.success('File removed successfully');
    } catch (error) {
      toast.error('Failed to remove file');
    }
  };

  const handleClearAll = async () => {
    if (files.length === 0) return;

    try {
      await Promise.all(files.map(file => fileUploadService.delete(file.Id)));
      setFiles([]);
      toast.success('All files cleared');
    } catch (error) {
      toast.error('Failed to clear files');
    }
  };

  const getUploadStats = () => {
    const completed = files.filter(f => f.status === 'completed').length;
    const uploading = files.filter(f => f.status === 'uploading').length;
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    
    return { completed, uploading, totalSize };
  };

  const stats = getUploadStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading upload settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-glass bg-surface/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">
                DropZone
              </h1>
              <p className="text-gray-400 mt-1">
                Upload and manage your files efficiently
              </p>
            </div>
            
            {files.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    {stats.completed} completed • {stats.uploading} uploading
                  </div>
                  <div className="text-xs text-gray-500">
                    {fileUploadService.formatFileSize(stats.totalSize)} total
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={handleClearAll}
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Drop Zone */}
          <DropZone
            onFilesSelected={handleFilesSelected}
            disabled={activeUploads.size >= (uploadConfig?.maxConcurrentUploads || 5)}
            className="max-w-2xl mx-auto"
          />

          {/* Upload Settings Info */}
          {uploadConfig && (
            <div className="max-w-2xl mx-auto">
              <div className="glass rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Upload Limits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
                  <div>
                    <span className="text-gray-500">Max file size:</span> {' '}
                    {fileUploadService.formatFileSize(uploadConfig.maxFileSize)}
                  </div>
                  <div>
                    <span className="text-gray-500">Concurrent uploads:</span> {' '}
                    {uploadConfig.maxConcurrentUploads}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-display font-semibold text-white">
                Your Files
              </h2>
              
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {files.map((file) => (
                    <FileCard
                      key={file.Id}
                      file={file}
                      onRemove={handleRemoveFile}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Empty State */}
          {files.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
<motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon name="Upload" size={32} className="text-gray-400" />
                </motion.div>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No files uploaded yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Drag and drop your files above or click to browse and start uploading
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadSection;