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

const scheduleInterview = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const id = req.params.id as string;
  const result = await ApplicationService.scheduleInterview(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Interview scheduled successfully',
    data: result,
  });
});

const getInterviews = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = req.user;
  const result = await ApplicationService.getInterviews(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Interviews fetched successfully',
    data: result,
  });
});

export const ApplicationController = {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
  scheduleInterview,
  getInterviews,
};
