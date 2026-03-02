// ── Create Category ─────────────────────────────────────────────────────────────
export interface ICreateCategoryPayload {
  name: string;
  description?: string;
  icon?: string;
}

// ── Update Category ─────────────────────────────────────────────────────────────
export interface IUpdateCategoryPayload {
  name?: string;
  description?: string;
  icon?: string;
}

// ── Category Response ───────────────────────────────────────────────────────────
export interface ICategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

// ── Category with Job Count ─────────────────────────────────────────────────────
export interface ICategoryWithJobCount extends ICategory {
  jobCount: number;
}
