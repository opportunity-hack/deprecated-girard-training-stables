import { Router } from 'express';

const router = Router();

router.get('/all',/*timelineController.getTimelines*/ (req, res) => {
  res.status(200).json({ 'status': 'fetch all timelines' });
});
router.get('/:timelineId', [/*verifyTimelineId*/], /*timelineController.getTimeline*/ (req, res) => {
  res.status(200).json({ 'status': 'fetch single timeline' });
});

export default router;
