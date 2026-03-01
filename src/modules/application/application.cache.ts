export const APPLICATION_CACHE_KEY = {
  USER_LIST: (userId: string) => `application-user-list:${userId}:*`,
  JOB_LIST: (jobId: string) => `application-job-list:${jobId}:*`,
};

export const APPLICATION_CACHE_TTL = {
  LIST: 30 * 60, // 30 minutes
};
