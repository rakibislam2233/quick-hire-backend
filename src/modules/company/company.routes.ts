import { Router } from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { CompanyController } from './company.controller';
import { CompanyValidation } from './company.validation';

const router = Router();

router.get('/', CompanyController.getAllCompanies);
router.get('/:id', CompanyController.getCompanyById);

router.post(
  '/',
  auth('USER'),
  validateRequest(CompanyValidation.createCompany),
  CompanyController.createCompany
);

router.patch(
  '/:id',
  auth('ADMIN', 'COMPANY'),
  validateRequest(CompanyValidation.updateCompany),
  CompanyController.updateCompany
);

router.delete('/:id', auth('ADMIN'), CompanyController.deleteCompany);

export const CompanyRoutes = router;
