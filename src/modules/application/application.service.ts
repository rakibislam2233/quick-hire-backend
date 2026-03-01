import httpStatus from 'http-status-codes';
import { database } from '../../config/database.config';
import ApiError from '../../utils/ApiError';
import {
  createPaginationQuery,
  createPaginationResult,
  parsePaginationOptions,
} from '../../utils/pagination.utils';
import { RedisUtils } from '../../utils/redis.utils';
import { uploadFile } from '../../utils/storage.utils';
import { APPLICATION_CACHE_KEY } from './application.cache';
import { IApplyJobPayload } from './application.interface';

// ── Apply to a Job ────────────────────────────────────────────────────────────
const applyToJob = async (
  userId: string,
  jobId: string,
  data: IApplyJobPayload,
  file?: Express.Multer.File
) => {
  // Check job exists and is approved
  const job = await database.job.findUnique({
    where: { id: jobId, status: 'APPROVED', isDeleted: false },
  });
  if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found or not accepting applications');

  // Prevent duplicate applications
  const existing = await database.application.findFirst({ where: { jobId, userId } });
  if (existing) throw new ApiError(httpStatus.CONFLICT, 'You have already applied to this job');

  let resumeUrl: string | undefined;
  if (file) {
    const uploadResult = await uploadFile(
      file.buffer,
      'quick-hire/resumes',
      `resume_${userId}_${jobId}_${Date.now()}`,
      'raw',
      file.mimetype
    );
    resumeUrl = uploadResult.secure_url;
  }

  const result = await database.application.create({
    data: { jobId, userId, ...data, resumeUrl: resumeUrl || data.resumeUrl, status: 'PENDING' },
    include: { job: { select: { id: true, title: true } } },
  });

  // Invalidate application lists
  await RedisUtils.deleteCachePattern(APPLICATION_CACHE_KEY.USER_LIST(userId));
  await RedisUtils.deleteCachePattern(APPLICATION_CACHE_KEY.JOB_LIST(jobId));

  return result;
};

// ── Get My Applications (Job Seeker) ──────────────────────────────────────────
const getMyApplications = async (userId: string, options: Record<string, unknown>) => {
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

const getApplicationsByJob = async (
  jobId: string,
  companyUserId: string,
  options: Record<string, unknown>
) => {
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

  const result = await database.application.update({
    where: { id },
    data: { status: status as any },
  });

  // Invalidate application lists
  await RedisUtils.deleteCachePattern(APPLICATION_CACHE_KEY.USER_LIST(application.userId));
  await RedisUtils.deleteCachePattern(APPLICATION_CACHE_KEY.JOB_LIST(application.jobId));

  return result;
};

// ── Schedule Interview (Company) ──────────────────────────────────────────────
const scheduleInterview = async (
  id: string,
  companyUserId: string,
  data: { interviewDate: string; interviewLink?: string }
) => {
  const application = await database.application.findUnique({
    where: { id },
    include: { job: true },
  });

  if (!application) throw new ApiError(httpStatus.NOT_FOUND, 'Application not found');
  if (application.job.creatorId !== companyUserId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to schedule this interview');
  }

  const result = await database.application.update({
    where: { id },
    data: {
      interviewDate: new Date(data.interviewDate),
      interviewLink: data.interviewLink,
      status: 'SCHEDULED',
    },
  });

  // Invalidate cache
  await RedisUtils.deleteCachePattern(APPLICATION_CACHE_KEY.USER_LIST(application.userId));
  await RedisUtils.deleteCachePattern(APPLICATION_CACHE_KEY.JOB_LIST(application.jobId));

  return result;
};

// ── Get Interviews (Common) ───────────────────────────────────────────────────
const getInterviews = async (userId: string, role: string) => {
  const where: any = { status: 'SCHEDULED', isDeleted: false };

  if (role === 'USER') {
    where.userId = userId;
  } else if (role === 'COMPANY') {
    where.job = { creatorId: userId };
  }

  return database.application.findMany({
    where,
    include: {
      job: { select: { title: true, company: { select: { name: true, logo: true } } } },
      user: { select: { fullName: true, email: true, profileImage: true } },
    },
    orderBy: { interviewDate: 'asc' },
  });
};

export const ApplicationService = {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
  scheduleInterview,
  getInterviews,
};
