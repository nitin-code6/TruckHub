import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../controllers/auth.controller.js';
import { profileUpload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

import { getUserProfile } from '../controllers/user.controller.js';

const router = Router();





router.route('/register').post(
    profileUpload.single('profilePhoto'),
    registerUser
);

router.route('/login').post(loginUser);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/profile').get(verifyJWT, getUserProfile);

router.route('/me').get(verifyJWT, getUserProfile);



export default router