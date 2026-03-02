// ── Create Company ─────────────────────────────────────────────────────────────
export interface ICreateCompanyPayload {
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  location?: string;
  industry?: string;
  size?: string;
  foundedYear?: number;
}

// ── Update Company ─────────────────────────────────────────────────────────────
export interface IUpdateCompanyPayload {
  name?: string;
  description?: string;
  website?: string;
  logo?: string;
  location?: string;
  industry?: string;
  size?: string;
  foundedYear?: number;
}

// ── Filter Options ─────────────────────────────────────────────────────────────
export interface ICompanyFilterOptions {
  search?: string;
  location?: string;
  industry?: string;
}

// ── Company Response Interfaces ───────────────────────────────────────────────────
export interface ICompanyJobCount {
  jobs: number;
}

export interface ICompany {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size?: string;
  location?: string;
  foundedYear?: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  _count?: ICompanyJobCount;
}

export interface ICompanyWithDetails extends ICompany {
  _count: ICompanyJobCount;
}
