import { Router } from 'express';

const router = Router();

router.get('/', /*categoriesController.getAll*/ (req, res) => {
  res.status(200).json({ 'status': 'fetch all categories' });
});

export default router;