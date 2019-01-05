import express = require('express');
import {Router} from 'express';
import {getAllMeetings, getYearlyMeetings, getBranches, getWorshipStyles, getAccessibilities,
    getMeetingById, createMeeting, updateMeeting, deleteMeeting} from '../controllers/meetings';
import { getAllQuakers, getQuakerById, createQuaker, updateQuaker, deleteQuaker} from '../controllers/quakers';
const router: Router = express.Router();

// Meetings
router.get('/api/v1/meetings', getAllMeetings);
router.get('/api/v1/meetings/yearlymeetings', getYearlyMeetings);
router.get('/api/v1/meetings/branches', getBranches);
router.get('/api/v1/meetings/worshipstyles', getWorshipStyles);
router.get('/api/v1/meetings/accessibilities', getAccessibilities);
router.get('/api/v1/meetings/:id', getMeetingById);
router.post('/api/v1/meetings', createMeeting);
router.put('/api/v1/meetings/:id', updateMeeting);
router.delete('/api/v1/meetings/:id', deleteMeeting);

// Quakers
router.get('/api/v1/quakers', getAllQuakers);
router.get('/api/v1/quakers/:id', getQuakerById);
router.post('/api/v1/quakers/', createQuaker);
router.put('/api/v1/quakers/:id', updateQuaker);
router.delete('/api/v1/quakers/:id', deleteQuaker);

export default router;
