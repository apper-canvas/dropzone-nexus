import React from "react";
import * as LucideIcons from "lucide-react";

const Icon = ({ 
  name, 
  size = 24, 
  className = '', 
  color,
  strokeWidth = 2,
  ...props 
}) => {
  // Get the icon component from lucide-react
  const IconComponent = LucideIcons[name];
  
  // Fallback to a default icon if the requested icon doesn't exist
  const FallbackIcon = LucideIcons.AlertCircle;
  
  // Use the requested icon or fallback
  const SelectedIcon = IconComponent || FallbackIcon;
// If using fallback, log a warning in development
  if (!IconComponent && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    console.warn(`Icon "${name}" not found in lucide-react. Using AlertCircle as fallback.`);
  }
  
  return (
    <SelectedIcon
      size={size}
      className={className}
      color={color}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
};

export default Icon;