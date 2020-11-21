import { Router } from 'express';

const router = Router();

router.post('/signin', [/* signinValidation */], /* signinController */ (req, res) => {
  res.status(202).json({ status: 'signin controller reached' });
}); // validations & controllers TODO
router.post('/signup', [/* signupValidation */], /* signupController */ (req, res) => {
  res.status(201).json({ status: 'signup controller reached' });
}); // validations & controllers TODO
router.post('/forgot-password', [/* forgotpasswordValidation */], /* forgotpasswordController */ (req, res) => {
  res.status(200).json({ status: 'forgot password controller reached' });
}); // validations & controllers TODO

export default router;
