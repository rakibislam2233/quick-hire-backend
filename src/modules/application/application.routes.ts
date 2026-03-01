import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validation.middleware';
import upload from '../../utils/fileUpload.utils';
import { ApplicationController } from './application.controller';
import { ApplicationValidation } from './application.validation';

const router = Router();

// User: apply to a job
router.post(
  '/job/:jobId',
  auth(UserRole.USER),
  upload.single('resume'),
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

// Company: schedule interview
router.patch(
  '/schedule/:id',
  auth(UserRole.COMPANY),
  validateRequest(ApplicationValidation.scheduleInterview),
  ApplicationController.scheduleInterview
);

// Common: Get upcoming interviews
router.get(
  '/interviews',
  auth(UserRole.USER, UserRole.COMPANY),
  ApplicationController.getInterviews
);

export const ApplicationRoutes = router;
