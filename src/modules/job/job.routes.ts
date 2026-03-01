import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validation.middleware';
import { JobController } from './job.controller';
import { JobValidation } from './job.validation';

const router = Router();

// Public: view all approved jobs
router.get('/', JobController.getAllJobs);
router.get('/:id', JobController.getJobById);

// Admin: view all jobs including pending ones
router.get('/admin/all', auth(UserRole.ADMIN), JobController.getAllJobsForAdmin);

// Admin: approve / reject a job
router.patch(
  '/admin/:id/status',
  auth(UserRole.ADMIN),
  validateRequest(JobValidation.updateJobStatus),
  JobController.updateJobStatus
);

// Company: post a job
router.post(
  '/',
  auth(UserRole.COMPANY),
  validateRequest(JobValidation.createJob),
  JobController.createJob
);

// Company: update their own job
router.patch(
  '/:id',
  auth(UserRole.COMPANY, UserRole.ADMIN),
  validateRequest(JobValidation.updateJob),
  JobController.updateJob
);

// Company / Admin: delete a job
router.delete('/:id', auth(UserRole.COMPANY, UserRole.ADMIN), JobController.deleteJob);

export const JobRoutes = router;
