import { API_BASE_URL } from '@/shared/utils/api';

export const analyzeDataset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData, // Do not set Content-Type header; allow browser to create boundary
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || `Server responded with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API analyzeDataset error:', error);
    throw error;
  }
};
