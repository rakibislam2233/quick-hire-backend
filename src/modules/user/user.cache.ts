export const USER_CACHE_KEY = {
  PROFILE: (userId: string) => `user-profile:${userId}`,
  LIST: 'user-list:*',
};

export const USER_CACHE_TTL = {
  PROFILE: 1 * 60 * 60, // 1 hour
};
