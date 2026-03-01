import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validation.middleware';
import { ApplicationController } from './application.controller';
import { ApplicationValidation } from './application.validation';

const router = Router();

// User: apply to a job
router.post(
  '/job/:jobId',
  auth(UserRole.USER),
  validateRequest(ApplicationValidation.applyJob),
  ApplicationController.applyToJob
);

// User: view own applications
router.get('/my', auth(UserRole.USER), ApplicationController.getMyApplications);

// Company: view applications for their job
router.get('/job/:jobId', auth(UserRole.COMPANY), ApplicationController.getApplicationsByJob);

// Company: update application status (shortlist, accept, reject)
router.patch(
  '/:id/status',
  auth(UserRole.COMPANY),
  validateRequest(ApplicationValidation.updateApplicationStatus),
  ApplicationController.updateApplicationStatus
);

export const ApplicationRoutes = router;
