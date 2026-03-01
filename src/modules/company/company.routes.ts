import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validation.middleware';
import upload from '../../utils/fileUpload.utils';
import { CompanyController } from './company.controller';
import { CompanyValidation } from './company.validation';

const router = Router();

// Public routes
router.get('/', CompanyController.getAllCompanies);
router.get('/:id', CompanyController.getCompanyById);

// Any authenticated user can create a company profile
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  upload.single('logo'),
  validateRequest(CompanyValidation.createCompany),
  CompanyController.createCompany
);

// Company owner or Admin can update
router.patch(
  '/:id',
  auth(UserRole.COMPANY, UserRole.ADMIN),
  upload.single('logo'),
  validateRequest(CompanyValidation.updateCompany),
  CompanyController.updateCompany
);

// Admin only can delete
router.delete('/:id', auth(UserRole.ADMIN), CompanyController.deleteCompany);

export const CompanyRoutes = router;
