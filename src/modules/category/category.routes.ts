import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validation.middleware';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

router.post(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(CategoryValidation.createCategory),
  CategoryController.createCategory
);

router.patch(
  '/:id',
  auth(UserRole.ADMIN),
  validateRequest(CategoryValidation.updateCategory),
  CategoryController.updateCategory
);

router.delete('/:id', auth(UserRole.ADMIN), CategoryController.deleteCategory);

export const CategoryRoutes = router;
