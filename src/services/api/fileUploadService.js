import mockData from '@/services/mockData/fileUploads.json';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for uploaded files
let uploadedFiles = [...mockData];

export const fileUploadService = {
  async getAll() {
    await delay(300);
    return [...uploadedFiles];
  },

  async getById(id) {
    await delay(200);
    const file = uploadedFiles.find(f => f.Id === parseInt(id, 10));
    if (!file) {
      throw new Error('File not found');
    }
    return { ...file };
  },

  async create(fileData) {
    await delay(500);
    const newFile = {
      ...fileData,
      Id: Math.max(...uploadedFiles.map(f => f.Id), 0) + 1,
      status: 'pending',
      progress: 0,
      uploadSpeed: 0,
      timeRemaining: 0,
      url: '',
      error: null
    };
    uploadedFiles.push(newFile);
    return { ...newFile };
  },

  async update(id, updateData) {
    await delay(200);
    const index = uploadedFiles.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('File not found');
    }
    
    // Don't allow Id modification
    const { Id, ...dataWithoutId } = updateData;
    uploadedFiles[index] = { ...uploadedFiles[index], ...dataWithoutId };
    return { ...uploadedFiles[index] };
  },

  async delete(id) {
    await delay(300);
    const index = uploadedFiles.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('File not found');
    }
    
    const deletedFile = uploadedFiles[index];
    uploadedFiles.splice(index, 1);
    return { ...deletedFile };
  },

  // Simulate file upload with progress
  async uploadFile(file, onProgress) {
    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      uploadSpeed: 0,
      timeRemaining: 0,
      url: '',
      error: null
    };

    const createdFile = await this.create(fileData);
    
    // Simulate upload progress
    const totalChunks = 100;
    const baseSpeed = 500000 + Math.random() * 1000000; // 0.5-1.5 MB/s
    
    for (let chunk = 1; chunk <= totalChunks; chunk++) {
      await delay(50 + Math.random() * 100); // Variable delay
      
      const progress = (chunk / totalChunks) * 100;
      const uploadSpeed = baseSpeed + (Math.random() - 0.5) * 200000;
      const remainingBytes = file.size * (1 - progress / 100);
      const timeRemaining = remainingBytes / uploadSpeed;
      
      const updatedFile = await this.update(createdFile.Id, {
        progress: Math.round(progress),
        uploadSpeed,
        timeRemaining,
        status: progress >= 100 ? 'completed' : 'uploading'
      });
      
      if (onProgress) {
        onProgress(updatedFile);
      }
      
      if (progress >= 100) {
        // Generate a mock URL
        const mockUrl = `https://cdn.dropzone.com/files/${createdFile.Id}/${encodeURIComponent(file.name)}`;
        await this.update(createdFile.Id, {
          url: mockUrl,
          status: 'completed'
        });
        break;
      }
    }
    
    return this.getById(createdFile.Id);
  },

  // Validate file before upload
  validateFile(file, config) {
    const errors = [];
    
    if (file.size > config.maxFileSize) {
      errors.push(`File size exceeds ${this.formatFileSize(config.maxFileSize)} limit`);
    }
    
    if (config.allowedTypes.length > 0 && !config.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }
    
    return errors;
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  formatUploadSpeed(bytesPerSecond) {
    return this.formatFileSize(bytesPerSecond) + '/s';
  },

  formatTimeRemaining(seconds) {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}m`;
    } else {
      return `${Math.round(seconds / 3600)}h`;
    }
  }
};