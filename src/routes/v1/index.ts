import { Router } from 'express';
import { AuthRoutes } from '../../modules/auth/auth.routes';
import { UserRoutes } from '../../modules/user/user.routes';
const router = Router();

// Module routes
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
