import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick.utils';
import sendResponse from '../../utils/sendResponse';
import { JobService } from './job.service';

// ── Create Job ────────────────────────────────────────────────────────────────
const createJob = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await JobService.createJob(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job posted successfully and is pending admin approval',
    data: result,
  });
});

// ── Get All Approved Jobs (Public) ────────────────────────────────────────────
const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['search', 'type', 'location']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await JobService.getAllJobs(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs fetched successfully',
    meta: result.pagination,
    data: result.data,
  });
});

// ── Get All Jobs for Admin ────────────────────────────────────────────────────
const getAllJobsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['search', 'status']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await JobService.getAllJobsForAdmin(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin jobs fetched successfully',
    meta: result.pagination,
    data: result.data,
  });
});

// ── Get Job By ID ─────────────────────────────────────────────────────────────
const getJobById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await JobService.getJobById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job fetched successfully',
    data: result,
  });
});

// ── Update Job ────────────────────────────────────────────────────────────────
const updateJob = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { userId } = req.user;
  const result = await JobService.updateJob(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job updated successfully',
    data: result,
  });
});

// ── Update Job Status (Admin) ─────────────────────────────────────────────────
const updateJobStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const result = await JobService.updateJobStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Job status updated to ${status}`,
    data: result,
  });
});

// ── Delete Job ────────────────────────────────────────────────────────────────
const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { userId, role } = req.user;
  await JobService.deleteJob(id, userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job deleted successfully',
  });
});

export const JobController = {
  createJob,
  getAllJobs,
  getAllJobsForAdmin,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob,
};
