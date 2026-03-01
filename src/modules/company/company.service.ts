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
  ICompanyFilterOptions,
  ICreateCompanyPayload,
  IUpdateCompanyPayload,
} from './company.interface';

// ── Create Company ────────────────────────────────────────────────────────────
const createCompany = async (userId: string, data: ICreateCompanyPayload) => {
  // Create the company record
  const company = await database.company.create({ data });

  // Link the creating user to this company and upgrade role to COMPANY
  await database.user.update({
    where: { id: userId },
    data: { companyId: company.id, role: 'COMPANY' },
  });

  // Invalidate user cache and company list
  await RedisUtils.deleteCache(USER_CACHE_KEY.PROFILE(userId));
  await RedisUtils.deleteCachePattern(COMPANY_CACHE_KEY.LIST);

  return company;
};

// ── Get All Companies ─────────────────────────────────────────────────────────
const getAllCompanies = async (
  filters: ICompanyFilterOptions,
  options: Record<string, unknown>
) => {
  const paginationOptions = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(paginationOptions);

  const { search, ...filterData } = filters;

  const andConditions: Prisma.CompanyWhereInput[] = [{ isDeleted: false }];

  // Full-text search across name, location, industry
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  // Exact match filters (e.g. isVerified)
  if (Object.keys(filterData).length > 0) {
    andConditions.push(
      ...Object.keys(filterData).map(key => ({
        [key]: { equals: (filterData as Record<string, unknown>)[key] },
      }))
    );
  }

  const whereConditions: Prisma.CompanyWhereInput = { AND: andConditions };

  const [data, total] = await Promise.all([
    database.company.findMany({
      where: whereConditions,
      skip,
      take,
      orderBy,
      include: { _count: { select: { jobs: true } } },
    }),
    database.company.count({ where: whereConditions }),
  ]);

  return createPaginationResult(data, total, paginationOptions);
};

// ── Get Company By ID ─────────────────────────────────────────────────────────
const getCompanyById = async (id: string) => {
  const cacheKey = COMPANY_CACHE_KEY.DETAIL(id);
  const cachedCompany = await RedisUtils.getCache<any>(cacheKey);
  if (cachedCompany) return cachedCompany;

  const company = await database.company.findUnique({
    where: { id, isDeleted: false },
    include: { _count: { select: { jobs: true } } },
  });

  if (!company) throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');

  await RedisUtils.setCache(cacheKey, company, COMPANY_CACHE_TTL.DETAIL);

  return company;
};

// ── Update Company ────────────────────────────────────────────────────────────
const updateCompany = async (id: string, data: IUpdateCompanyPayload) => {
  const isExist = await database.company.findUnique({ where: { id, isDeleted: false } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');

  const updated = await database.company.update({ where: { id }, data });
  await RedisUtils.deleteCache(COMPANY_CACHE_KEY.DETAIL(id));
  await RedisUtils.deleteCachePattern(COMPANY_CACHE_KEY.LIST);
  return updated;
};

// ── Soft Delete Company ───────────────────────────────────────────────────────
const deleteCompany = async (id: string) => {
  const isExist = await database.company.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');

  const result = await database.company.update({ where: { id }, data: { isDeleted: true } });
  await RedisUtils.deleteCache(COMPANY_CACHE_KEY.DETAIL(id));
  await RedisUtils.deleteCachePattern(COMPANY_CACHE_KEY.LIST);
  return result;
};

export const CompanyService = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
