import httpStatus from 'http-status-codes';
import { Prisma } from '../../../prisma/generated/client';
import { database } from '../../config/database.config';
import ApiError from '../../utils/ApiError';
import {
  createPaginationQuery,
  createPaginationResult,
  parsePaginationOptions,
} from '../../utils/pagination.utils';
import {
  ICreateJobPayload,
  IJobAdminFilterOptions,
  IJobFilterOptions,
  IUpdateJobPayload,
} from './job.interface';

// ── Create/Post a Job ─────────────────────────────────────────────────────────
const createJob = async (creatorId: string, data: ICreateJobPayload) => {
  // Verify creator belongs to the company
  const user = await database.user.findUnique({ where: { id: creatorId } });
  if (!user?.companyId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You must have a company profile to post a job');
  }

  return database.job.create({
    data: {
      ...data,
      creatorId,
      companyId: user.companyId!,
      status: 'PENDING',
    },
    include: { company: true },
  });
};

// ── Get All Approved Jobs (Public) ────────────────────────────────────────────
const getAllJobs = async (filters: IJobFilterOptions, options: Record<string, unknown>) => {
  const paginationOptions = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(paginationOptions);

  const { search, type, location, ...filterData } = filters;

  const andConditions: Prisma.JobWhereInput[] = [
    { isDeleted: false },
    { status: 'APPROVED' }, // Only show admin-approved jobs publicly
  ];

  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { name: { contains: search, mode: 'insensitive' } } },
      ],
    });
  }

  if (type) andConditions.push({ type: type as any });
  if (location) andConditions.push({ location: { contains: location, mode: 'insensitive' } });

  const whereConditions: Prisma.JobWhereInput = { AND: andConditions };

  const [data, total] = await Promise.all([
    database.job.findMany({
      where: whereConditions,
      skip,
      take,
      orderBy,
      include: {
        company: { select: { id: true, name: true, logo: true, location: true } },
        _count: { select: { applications: true } },
      },
    }),
    database.job.count({ where: whereConditions }),
  ]);

  return createPaginationResult(data, total, paginationOptions);
};

// ── Get All Jobs for Admin (includes PENDING) ─────────────────────────────────
const getAllJobsForAdmin = async (
  filters: IJobAdminFilterOptions,
  options: Record<string, unknown>
) => {
  const paginationOptions = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(paginationOptions);

  const { search, status } = filters;

  const andConditions: Prisma.JobWhereInput[] = [{ isDeleted: false }];

  if (search) {
    andConditions.push({ title: { contains: search, mode: 'insensitive' } });
  }
  if (status) andConditions.push({ status: status as any });

  const whereConditions: Prisma.JobWhereInput = { AND: andConditions };

  const [data, total] = await Promise.all([
    database.job.findMany({
      where: whereConditions,
      skip,
      take,
      orderBy,
      include: { company: { select: { id: true, name: true, logo: true } } },
    }),
    database.job.count({ where: whereConditions }),
  ]);

  return createPaginationResult(data, total, paginationOptions);
};

// ── Get Job By ID ─────────────────────────────────────────────────────────────
const getJobById = async (id: string) => {
  const job = await database.job.findUnique({
    where: { id, isDeleted: false },
    include: {
      company: true,
      _count: { select: { applications: true } },
    },
  });

  if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');

  return job;
};

// ── Update Job ────────────────────────────────────────────────────────────────
const updateJob = async (id: string, creatorId: string, data: IUpdateJobPayload) => {
  const job = await database.job.findUnique({ where: { id, isDeleted: false } });
  if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');

  if (job.creatorId !== creatorId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this job');
  }

  return database.job.update({ where: { id }, data });
};

// ── Update Job Status (Admin only) ────────────────────────────────────────────
const updateJobStatus = async (id: string, status: string) => {
  const job = await database.job.findUnique({ where: { id } });
  if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');

  return database.job.update({ where: { id }, data: { status: status as any } });
};

// ── Soft Delete Job ───────────────────────────────────────────────────────────
const deleteJob = async (id: string, userId: string, role: string) => {
  const job = await database.job.findUnique({ where: { id } });
  if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');

  // Admin can delete any job, company can only delete their own
  if (role !== 'ADMIN' && job.creatorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this job');
  }

  return database.job.update({ where: { id }, data: { isDeleted: true } });
};

export const JobService = {
  createJob,
  getAllJobs,
  getAllJobsForAdmin,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob,
};
