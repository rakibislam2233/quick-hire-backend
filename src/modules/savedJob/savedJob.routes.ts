import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import { SavedJobController } from './savedJob.controller';

const router = Router();

// All routes require authenticated USER role

// Toggle save/unsave a job
router.post('/:jobId', auth(UserRole.USER), SavedJobController.toggleSaveJob);

// Get all saved jobs for the logged-in user
router.get('/', auth(UserRole.USER), SavedJobController.getSavedJobs);

export const SavedJobRoutes = router;
