import httpStatus from 'http-status-codes';
import { Company, Prisma } from '../../prisma/generated/client';
import ApiError from '../../utils/ApiError';
import { paginationHelper } from '../../utils/paginationHelper';

const createCompany = async (userId: string, data: Prisma.CompanyCreateInput): Promise<Company> => {
  const result = await prisma.company.create({
    data,
  });

  // Link the creator to the company
  await prisma.user.update({
    where: { id: userId },
    data: { companyId: result.id, role: 'COMPANY' },
  });

  return result;
};

const getAllCompanies = async (filters: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

  const { search, ...filterData } = filters;

  const andConditions = [];

  if (search) {
    andConditions.push({
      OR: ['name', 'location', 'industry'].map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.CompanyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.company.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: {
        select: {
          jobs: true,
        },
      },
    },
  });

  const total = await prisma.company.count({
    where: whereConditions,
  });

  return {
    pagination: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getCompanyById = async (id: string): Promise<Company | null> => {
  const result = await prisma.company.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          jobs: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }

  return result;
};

const updateCompany = async (id: string, data: Prisma.CompanyUpdateInput): Promise<Company> => {
  const isExist = await prisma.company.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }

  const result = await prisma.company.update({
    where: { id },
    data,
  });

  return result;
};

const deleteCompany = async (id: string): Promise<Company> => {
  const isExist = await prisma.company.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }

  const result = await prisma.company.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

export const CompanyService = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
