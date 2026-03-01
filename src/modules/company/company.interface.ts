// ── Create Company ─────────────────────────────────────────────────────────────
export interface ICreateCompanyPayload {
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  location?: string;
  industry?: string;
  contactEmail?: string;
  contactPhone?: string;
  founded?: string;
  employeeSize?: string;
}

// ── Update Company ─────────────────────────────────────────────────────────────
export interface IUpdateCompanyPayload {
  name?: string;
  description?: string;
  website?: string;
  logo?: string;
  location?: string;
  industry?: string;
  contactEmail?: string;
  contactPhone?: string;
  isVerified?: boolean;
  founded?: string;
  employeeSize?: string;
}

// ── Filter Options ─────────────────────────────────────────────────────────────
export interface ICompanyFilterOptions {
  search?: string;
  location?: string;
  industry?: string;
  isVerified?: boolean;
}
