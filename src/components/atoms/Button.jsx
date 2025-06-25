import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl disabled:opacity-50',
    secondary: 'bg-surface text-white border border-glass hover:bg-surface-light disabled:opacity-50',
    ghost: 'text-gray-300 hover:text-white hover:bg-glass disabled:opacity-50',
    danger: 'bg-error text-white hover:bg-red-600 disabled:opacity-50'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  const hoverAnimation = {
    scale: disabled ? 1 : 1.02,
    filter: disabled ? 'none' : 'brightness(1.1)'
  };

  const tapAnimation = {
    scale: disabled ? 1 : 0.98
  };

  return (
    <motion.button
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && iconPosition === 'left' && (
          <ApperIcon name={icon} size={iconSizes[size]} />
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <ApperIcon name={icon} size={iconSizes[size]} />
        )}
      </div>
    </motion.button>
  );
};

export default Button;