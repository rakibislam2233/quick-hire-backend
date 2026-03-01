import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick.utils';
import sendResponse from '../../utils/sendResponse';
import { ApplicationService } from './application.service';

// ── Apply to Job ──────────────────────────────────────────────────────────────
const applyToJob = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const jobId = req.params.jobId as string;
  const result = await ApplicationService.applyToJob(userId, jobId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Applied to job successfully',
    data: result,
  });
});

// ── Get My Applications ───────────────────────────────────────────────────────
const getMyApplications = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await ApplicationService.getMyApplications(userId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Applications fetched successfully',
    meta: result.pagination,
    data: result.data,
  });
});

// ── Get Applications for a Job (Company) ─────────────────────────────────────
const getApplicationsByJob = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const jobId = req.params.jobId as string;
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await ApplicationService.getApplicationsByJob(jobId, userId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Applications fetched successfully',
    meta: result.pagination,
    data: result.data,
  });
});

// ── Update Application Status ─────────────────────────────────────────────────
const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const id = req.params.id as string;
  const { status } = req.body;
  const result = await ApplicationService.updateApplicationStatus(id, userId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Application status updated',
    data: result,
  });
});

export const ApplicationController = {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
};
