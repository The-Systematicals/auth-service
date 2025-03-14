import { Router } from 'express';

import authentications from './authentications.route';
import users from './users.route';

const router = Router();

router.use('/authentications', authentications);
router.use('/users', users);

export default router;
