export const COMPANY_CACHE_KEY = {
  DETAIL: (id: string) => `company-detail:${id}`,
  LIST: 'company-list:*',
};

export const COMPANY_CACHE_TTL = {
  DETAIL: 1 * 60 * 60, // 1 hour
  LIST: 30 * 60, // 30 minutes
};
