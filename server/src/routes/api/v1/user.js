import { Router } from 'express';

const router = Router();

router.get('/:userId', [/*validateUserId*/], /*userController.getUser*/ (req, res) => {
  res.status(200).json({ 'status': 'user profile returned' });
});

router.put('/:userId', [/*validateUserId*/], /*userController.updateUser*/ (req, res) => {
  res.status(201).json({ 'status': 'user profile updated' });
});

router.delete('/:userId', [/*vaildateUserId*/], /*userController.deleteUser*/ (req, res) => {
  res.status(200).json({ 'status': 'user profile deleted' });
});

export default router;
