import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import { DashboardController } from './dashboard.controller';

const router = Router();

router.get('/admin', auth(UserRole.ADMIN), DashboardController.getAdminDashboard);

router.get('/company', auth(UserRole.COMPANY), DashboardController.getCompanyDashboard);

router.get('/user', auth(UserRole.USER), DashboardController.getUserDashboard);

export const DashboardRoutes = router;
