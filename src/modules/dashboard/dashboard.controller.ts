import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

const getAdminDashboard = catchAsync(async (req: Request, res: Response) => {
  const [stats, chartData] = await Promise.all([
    DashboardService.getAdminStats(),
    DashboardService.getAdminChartData(),
  ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin dashboard data fetched successfully',
    data: { stats, chartData },
  });
});

const getCompanyDashboard = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const stats = await DashboardService.getCompanyStats(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company dashboard data fetched successfully',
    data: { stats },
  });
});

const getUserDashboard = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const stats = await DashboardService.getUserStats(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User dashboard data fetched successfully',
    data: { stats },
  });
});

export const DashboardController = {
  getAdminDashboard,
  getCompanyDashboard,
  getUserDashboard,
};
