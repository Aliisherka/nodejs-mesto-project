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

router.get('/:userId', getUser);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

export default router;
