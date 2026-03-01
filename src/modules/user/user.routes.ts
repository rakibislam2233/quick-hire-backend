import { Router } from 'express';
import { UserRole } from '../../../prisma/generated/enums';
import { auth } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validation.middleware';
import upload from '../../utils/fileUpload.utils';
import { UserController } from './user.controller';
import { UserValidations } from './user.validation';

const router = Router();

// Get own profile
router
  .route('/profile/me')
  .get(auth(UserRole.ADMIN, UserRole.COMPANY, UserRole.USER), UserController.getUserProfile)
  .patch(
    auth(UserRole.ADMIN, UserRole.COMPANY, UserRole.USER),
    upload.single('profileImage'),
    validateRequest(UserValidations.updateMyProfile),
    UserController.updateMyProfile
  )
  .delete(auth(UserRole.ADMIN, UserRole.COMPANY, UserRole.USER), UserController.deleteMyProfile);

// Admin: get all users
router.get('/', auth(UserRole.ADMIN), UserController.getAllUsers);

// Admin: get / update / delete user by ID
router
  .route('/:id')
  .get(auth(UserRole.ADMIN), UserController.getUserById)
  .patch(auth(UserRole.ADMIN), UserController.updateUser)
  .delete(auth(UserRole.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
