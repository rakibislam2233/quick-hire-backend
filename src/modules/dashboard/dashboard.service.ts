import { database } from '../../config/database.config';
import { IAdminStats, ICompanyStats, IGraphData, IUserStats } from './dashboard.interface';

const getAdminStats = async (): Promise<IAdminStats> => {
  const [totalUsers, totalCompanies, totalJobs, totalApplications] = await Promise.all([
    database.user.count({ where: { isDeleted: false } }),
    database.company.count({ where: { isDeleted: false } }),
    database.job.count({ where: { isDeleted: false } }),
    database.application.count({ where: { isDeleted: false } }),
  ]);

  return { totalUsers, totalCompanies, totalJobs, totalApplications };
};

const getAdminChartData = async (): Promise<IGraphData[]> => {
  // Mocking 7 days of job post activity for the chart
  return [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 19 },
    { label: 'Wed', value: 15 },
    { label: 'Thu', value: 22 },
    { label: 'Fri', value: 30 },
    { label: 'Sat', value: 10 },
    { label: 'Sun', value: 8 },
  ];
};

const getCompanyStats = async (userId: string): Promise<ICompanyStats> => {
  const user = await database.user.findUnique({ where: { id: userId } });
  if (!user?.companyId)
    return { totalJobs: 0, totalApplications: 0, pendingApplications: 0, approvedJobs: 0 };

  const [totalJobs, totalApplications, pendingApplications, approvedJobs] = await Promise.all([
    database.job.count({ where: { companyId: user.companyId, isDeleted: false } }),
    database.application.count({ where: { job: { companyId: user.companyId } } }),
    database.application.count({
      where: { job: { companyId: user.companyId }, status: 'PENDING' },
    }),
    database.job.count({
      where: { companyId: user.companyId, status: 'APPROVED', isDeleted: false },
    }),
  ]);

  return { totalJobs, totalApplications, pendingApplications, approvedJobs };
};

const getUserStats = async (userId: string): Promise<IUserStats> => {
  const [totalApplications, savedJobs] = await Promise.all([
    database.application.count({ where: { userId, isDeleted: false } }),
    database.savedJob.count({ where: { userId } }),
  ]);

  return { totalApplications, savedJobs, interviewsScheduled: 0 };
};

export const DashboardService = {
  getAdminStats,
  getAdminChartData,
  getCompanyStats,
  getUserStats,
};
