import httpStatus from 'http-status-codes';
import { database } from '../../config/database.config';
import ApiError from '../../utils/ApiError';
import {
  createPaginationQuery,
  createPaginationResult,
  parsePaginationOptions,
} from '../../utils/pagination.utils';
import { IToggleSaveJobResult } from './savedJob.interface';

// ── Toggle Save / Unsave a Job ────────────────────────────────────────────────
const toggleSaveJob = async (userId: string, jobId: string): Promise<IToggleSaveJobResult> => {
  const job = await database.job.findUnique({ where: { id: jobId, isDeleted: false } });
  if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');

  const existing = await database.savedJob.findUnique({
    where: { jobId_userId: { jobId, userId } },
  });

  if (existing) {
    // Already saved → unsave
    await database.savedJob.delete({ where: { jobId_userId: { jobId, userId } } });
    await RedisUtils.deleteCachePattern(SAVED_JOB_CACHE_KEY.USER_LIST(userId));
    return { saved: false };
  } else {
    // Not saved → save
    await database.savedJob.create({ data: { jobId, userId } });
    await RedisUtils.deleteCachePattern(SAVED_JOB_CACHE_KEY.USER_LIST(userId));
    return { saved: true };
  }
};

// ── Get My Saved Jobs ─────────────────────────────────────────────────────────
const getSavedJobs = async (userId: string, options: Record<string, unknown>) => {
  const paginationOptions = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(paginationOptions);

  const [data, total] = await Promise.all([
    database.savedJob.findMany({
      where: { userId },
      skip,
      take,
      orderBy,
      include: {
        job: {
          include: { company: { select: { id: true, name: true, logo: true } } },
        },
      },
    }),
    database.savedJob.count({ where: { userId } }),
  ]);

  return createPaginationResult(data, total, paginationOptions);
};

export const SavedJobService = {
  toggleSaveJob,
  getSavedJobs,
};
