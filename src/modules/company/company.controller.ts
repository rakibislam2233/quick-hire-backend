import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick.utils';
import sendResponse from '../../utils/sendResponse';
import { CompanyService } from './company.service';

// ── Create Company ────────────────────────────────────────────────────────────
const createCompany = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await CompanyService.createCompany(userId, req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Company created successfully',
    data: result,
  });
});

// ── Get All Companies ─────────────────────────────────────────────────────────
const getAllCompanies = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['search', 'location', 'industry', 'isVerified']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await CompanyService.getAllCompanies(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Companies fetched successfully',
    meta: result.pagination,
    data: result.data,
  });
});

// ── Get Company By ID ─────────────────────────────────────────────────────────
const getCompanyById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CompanyService.getCompanyById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company fetched successfully',
    data: result,
  });
});

// ── Update Company ────────────────────────────────────────────────────────────
const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CompanyService.updateCompany(id, req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company updated successfully',
    data: result,
  });
});

// ── Delete Company ────────────────────────────────────────────────────────────
const deleteCompany = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await CompanyService.deleteCompany(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company deleted successfully',
  });
});

export const CompanyController = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
