import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';
import Badge from '@/components/atoms/Badge';
import FileTypeIcon from './FileTypeIcon';
import { fileUploadService } from '@/services/api/fileUploadService';

const FileCard = ({ file, onUpdate, onRemove }) => {
  const formatFileSize = (bytes) => fileUploadService.formatFileSize(bytes);
  const formatUploadSpeed = (speed) => fileUploadService.formatUploadSpeed(speed);
  const formatTimeRemaining = (time) => fileUploadService.formatTimeRemaining(time);

  const handleCopyLink = async () => {
    if (file.url) {
      try {
        await navigator.clipboard.writeText(file.url);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(file.Id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'uploading': return 'primary';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'uploading': return 'Uploading';
      case 'error': return 'Error';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass rounded-xl p-4 hover:bg-glass/80 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* File Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-surface-light rounded-lg flex items-center justify-center">
          <FileTypeIcon type={file.type} size={24} />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-white truncate" title={file.name}>
                {file.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-400">
                  {formatFileSize(file.size)}
                </span>
                <Badge variant={getStatusColor(file.status)} size="xs">
                  {getStatusText(file.status)}
                </Badge>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {file.status === 'completed' && file.url && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Copy"
                  onClick={handleCopyLink}
                  className="p-2"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={handleRemove}
                className="p-2 hover:text-error"
              />
            </div>
          </div>

          {/* Progress Bar for uploading files */}
          {file.status === 'uploading' && (
            <div className="space-y-2">
              <ProgressBar 
                value={file.progress} 
                max={100}
                animated={true}
                color="primary"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>
                  {formatUploadSpeed(file.uploadSpeed)}
                </span>
                <span>
                  {formatTimeRemaining(file.timeRemaining)} remaining
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {file.status === 'error' && file.error && (
            <div className="mt-2 text-sm text-error flex items-center gap-2">
              <ApperIcon name="AlertCircle" size={16} />
              {file.error}
            </div>
          )}

          {/* Completed File URL */}
          {file.status === 'completed' && file.url && (
            <div className="mt-2 text-xs text-gray-400 truncate" title={file.url}>
              {file.url}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;