// ── Toggle Saved Job Result ────────────────────────────────────────────────────
export interface IToggleSaveJobResult {
  saved: boolean;
}

// ── Saved Job Response Interfaces ───────────────────────────────────────────────────
export interface ISavedJobJob {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salary?: string;
  location: string;
  type: string;
  status: string;
  deadline: Date;
  companyId: string;
  categoryId: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  company?: ISavedJobCompany;
}

export interface ISavedJobCompany {
  id: string;
  name: string;
  logo?: string;
}

export interface ISavedJob {
  id: string;
  jobId: string;
  userId: string;
  createdAt: Date;
  job?: ISavedJobJob;
}

export interface ISavedJobWithDetails extends ISavedJob {
  job: ISavedJobJob;
}
