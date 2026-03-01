import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick.utils';
import sendResponse from '../../utils/sendResponse';
import { CompanyService } from './company.service';

const createCompany = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await CompanyService.createCompany(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Company created successfully',
    data: result,
  });
});

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

const getCompanyById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CompanyService.getCompanyById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company fetched successfully',
    data: result,
  });
});

const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CompanyService.updateCompany(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company updated successfully',
    data: result,
  });
});

const deleteCompany = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
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
