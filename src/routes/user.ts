import { Router } from 'express';
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

router.get('/:userId', getUser);

export default router;
