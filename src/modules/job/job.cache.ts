export const JOB_CACHE_KEY = {
  DETAIL: (id: string) => `job-detail:${id}`,
  LIST: 'job-list:*',
  ADMIN_LIST: 'job-admin-list:*',
};

export const JOB_CACHE_TTL = {
  DETAIL: 1 * 60 * 60, // 1 hour
  LIST: 30 * 60, // 30 minutes
};
