import mockData from '@/services/mockData/uploadConfig.json';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadConfigService = {
  async getConfig() {
    await delay(100);
    return { ...mockData };
  },

  async updateConfig(newConfig) {
    await delay(200);
    return { ...mockData, ...newConfig };
  }
};