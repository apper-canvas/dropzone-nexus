import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const DropZone = ({ onFilesSelected, disabled = false, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set dragging to false if we're leaving the drop zone itself
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files);
    }
  }, [disabled, onFilesSelected]);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-out
          ${isDragging 
            ? 'border-accent bg-accent/10 scale-105' 
            : 'border-gray-600 hover:border-primary/50 hover:bg-primary/5'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
      >
        {/* Animated Background Gradient */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-pulse"
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            animate={{
              y: isDragging ? -10 : 0,
              scale: isDragging ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <div className={`
              w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4
              ${isDragging 
                ? 'bg-accent/20 text-accent' 
                : 'bg-surface text-gray-400 group-hover:text-primary'
              }
              transition-colors duration-300
            `}>
              <ApperIcon 
                name={isDragging ? "Download" : "Upload"} 
                size={40}
                className="transition-transform duration-300"
              />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h3 className={`
              text-xl font-display font-semibold transition-colors duration-300
              ${isDragging ? 'text-accent' : 'text-white'}
            `}>
              {isDragging ? 'Drop files here' : 'Drop files to upload'}
            </h3>
            
            <p className="text-gray-400 text-sm">
              or click to browse from your device
            </p>
            
            <div className="pt-4">
              <Button
                variant="secondary"
                size="sm"
                className="pointer-events-none"
              >
                Browse Files
              </Button>
            </div>
          </div>
        </div>

        {/* Glowing Border Effect */}
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl border-2 border-accent animate-pulse-glow" />
        )}
      </motion.div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
      />
    </div>
  );
};

export default DropZone;