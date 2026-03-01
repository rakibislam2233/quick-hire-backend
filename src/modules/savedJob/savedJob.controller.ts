import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick.utils';
import sendResponse from '../../utils/sendResponse';
import { SavedJobService } from './savedJob.service';

// ── Toggle Save/Unsave ────────────────────────────────────────────────────────
const toggleSaveJob = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const jobId = req.params.jobId as string;

  const result = await SavedJobService.toggleSaveJob(userId, jobId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.saved ? 'Job saved successfully' : 'Job unsaved successfully',
    data: result,
  });
});

// ── Get Saved Jobs ────────────────────────────────────────────────────────────
const getSavedJobs = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await SavedJobService.getSavedJobs(userId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Saved jobs fetched successfully',
    meta: result.pagination,
    data: result.data,
  });
});

export const SavedJobController = {
  toggleSaveJob,
  getSavedJobs,
};
