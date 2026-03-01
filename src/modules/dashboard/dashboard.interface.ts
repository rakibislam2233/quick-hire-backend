export interface IAdminStats {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
}

export interface ICompanyStats {
  totalJobs: number;
  totalApplications: number;
  pendingApplications: number;
  approvedJobs: number;
}

export interface IUserStats {
  totalApplications: number;
  savedJobs: number;
  interviewsScheduled: number;
}

export interface IGraphData {
  label: string;
  value: number;
}

export interface IDashboardData {
  stats: IAdminStats | ICompanyStats | IUserStats;
  chartData: IGraphData[];
}
