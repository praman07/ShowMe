export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API health check error:', error);
    return { status: 'error', message: error.message };
  }
};
