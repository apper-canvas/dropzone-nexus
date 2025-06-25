import ApperIcon from '@/components/ApperIcon';

const FileTypeIcon = ({ type, size = 24, className = '' }) => {
  const getIconAndColor = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return { icon: 'Image', color: 'text-green-400' };
    }
    if (mimeType.startsWith('video/')) {
      return { icon: 'Video', color: 'text-red-400' };
    }
    if (mimeType.startsWith('audio/')) {
      return { icon: 'Music', color: 'text-purple-400' };
    }
    if (mimeType.includes('pdf')) {
      return { icon: 'FileText', color: 'text-red-500' };
    }
    if (mimeType.includes('zip') || mimeType.includes('compressed')) {
      return { icon: 'Archive', color: 'text-yellow-400' };
    }
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return { icon: 'FileText', color: 'text-blue-400' };
    }
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return { icon: 'Table', color: 'text-green-500' };
    }
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
      return { icon: 'Presentation', color: 'text-orange-400' };
    }
    if (mimeType.includes('text/')) {
      return { icon: 'FileText', color: 'text-gray-400' };
    }
    return { icon: 'File', color: 'text-gray-400' };
  };

  const { icon, color } = getIconAndColor(type);

  return (
    <ApperIcon 
      name={icon} 
      size={size} 
      className={`${color} ${className}`} 
    />
  );
};

export default FileTypeIcon;