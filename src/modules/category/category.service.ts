import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import { CategoryRepository } from './category.repository';

const createCategory = async (data: any) => {
  return CategoryRepository.create(data);
};

const getAllCategories = async () => {
  const categories = await CategoryRepository.getAll();
  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    jobCount: (cat as any)._count.jobs,
  }));
};

const getCategoryById = async (id: string) => {
  const category = await CategoryRepository.getById(id);
  if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  return category;
};

const updateCategory = async (id: string, data: any) => {
  const isExist = await CategoryRepository.getById(id);
  if (!isExist) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  return CategoryRepository.update(id, data);
};

const deleteCategory = async (id: string) => {
  const isExist = await CategoryRepository.getById(id);
  if (!isExist) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  return CategoryRepository.deleteById(id);
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
