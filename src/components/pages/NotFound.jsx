import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <ApperIcon name="FileX" size={40} className="text-error" />
        </motion.div>
        
        <h1 className="text-6xl font-display font-bold text-white mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <Button
          variant="primary"
          icon="Home"
          onClick={() => navigate('/')}
          className="mx-auto"
        >
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;