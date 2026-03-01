import { Router } from 'express';
import { ApplicationRoutes } from '../../modules/application/application.routes';
import { AuthRoutes } from '../../modules/auth/auth.routes';
import { CategoryRoutes } from '../../modules/category/category.routes';
import { CompanyRoutes } from '../../modules/company/company.routes';
import { DashboardRoutes } from '../../modules/dashboard/dashboard.routes';
import { JobRoutes } from '../../modules/job/job.routes';
import { SavedJobRoutes } from '../../modules/savedJob/savedJob.routes';
import { UserRoutes } from '../../modules/user/user.routes';

const router = Router();

// Module routes
const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/companies', route: CompanyRoutes },
  { path: '/jobs', route: JobRoutes },
  { path: '/applications', route: ApplicationRoutes },
  { path: '/saved-jobs', route: SavedJobRoutes },
  { path: '/dashboard', route: DashboardRoutes },
  { path: '/categories', route: CategoryRoutes },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
