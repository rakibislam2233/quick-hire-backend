import { Category, Prisma } from '../../../prisma/generated/client';
import { database } from '../../config/database.config';

const create = async (data: Prisma.CategoryCreateInput): Promise<Category> => {
  return database.category.create({ data });
};

const getAll = async () => {
  return database.category.findMany({
    where: { isDeleted: false },
    include: {
      _count: {
        select: { jobs: { where: { status: 'APPROVED', isDeleted: false } } },
      },
    },
  });
};

const getById = async (id: string): Promise<Category | null> => {
  return database.category.findUnique({
    where: { id, isDeleted: false },
  });
};

const update = async (id: string, data: Prisma.CategoryUpdateInput): Promise<Category> => {
  return database.category.update({
    where: { id },
    data,
  });
};

const deleteById = async (id: string): Promise<Category> => {
  return database.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const CategoryRepository = {
  create,
  getAll,
  getById,
  update,
  deleteById,
};
