export const apiCallWithRetry = async <T,>(
  apiFunction: () => Promise<T>,
  retryCount = 3
): Promise<T> => {
  try {
    return await apiFunction();
  } catch (error) {
    if ((error as any)?.response?.status === 429 && retryCount > 0) {
      // Wait for a certain time before retrying (e.g., 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Retry the API call with a decremented retry count
      return apiCallWithRetry(apiFunction, retryCount - 1);
    } else {
      // Throw the error if it's not a 429 error or if the retry count is exhausted
      throw error;
    }
  }
};
