import httpStatus from 'http-status-codes';
import { database } from '../../config/database.config';
import ApiError from '../../utils/ApiError';
import {
  createPaginationQuery,
  createPaginationResult,
  parsePaginationOptions,
} from '../../utils/pagination.utils';

// ── Apply to a Job ────────────────────────────────────────────────────────────
const applyToJob = async (userId: string, jobId: string, data: any) => {
  // Check job exists and is approved
  const job = await database.job.findUnique({
    where: { id: jobId, status: 'APPROVED', isDeleted: false },
  });
  if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found or not accepting applications');

  // Prevent duplicate applications
  const existing = await database.application.findFirst({ where: { jobId, userId } });
  if (existing) throw new ApiError(httpStatus.CONFLICT, 'You have already applied to this job');

  return database.application.create({
    data: { jobId, userId, ...data, status: 'PENDING' },
    include: { job: { select: { id: true, title: true } } },
  });
};

// ── Get My Applications (Job Seeker) ──────────────────────────────────────────
const getMyApplications = async (userId: string, options: any) => {
  const paginationOptions = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(paginationOptions);

  const [data, total] = await Promise.all([
    database.application.findMany({
      where: { userId, isDeleted: false },
      skip,
      take,
      orderBy,
      include: { job: { include: { company: { select: { id: true, name: true, logo: true } } } } },
    }),
    database.application.count({ where: { userId, isDeleted: false } }),
  ]);

  return createPaginationResult(data, total, paginationOptions);
};

// ── Get Applications for a Job (Company) ─────────────────────────────────────
const getApplicationsByJob = async (jobId: string, companyUserId: string, options: any) => {
  // Verify requester owns the job's company
  const job = await database.job.findUnique({ where: { id: jobId } });
  if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  if (job.creatorId !== companyUserId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to view these applications');
  }

  const paginationOptions = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(paginationOptions);

  const [data, total] = await Promise.all([
    database.application.findMany({
      where: { jobId, isDeleted: false },
      skip,
      take,
      orderBy,
      include: { user: { select: { id: true, fullName: true, email: true, profileImage: true } } },
    }),
    database.application.count({ where: { jobId, isDeleted: false } }),
  ]);

  return createPaginationResult(data, total, paginationOptions);
};

// ── Update Application Status (Company) ──────────────────────────────────────
const updateApplicationStatus = async (id: string, companyUserId: string, status: string) => {
  const application = await database.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!application) throw new ApiError(httpStatus.NOT_FOUND, 'Application not found');

  if (application.job.creatorId !== companyUserId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this application');
  }

  return database.application.update({ where: { id }, data: { status: status as any } });
};

export const ApplicationService = {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
};
