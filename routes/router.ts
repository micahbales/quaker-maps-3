import express = require('express');
import {Router} from 'express';
import {getAllMeetings} from '../controllers/meetings';
import {getYearlyMeetings} from '../controllers/meetings';
import {getBranches} from '../controllers/meetings';
import {getMeetingById} from '../controllers/meetings';
import {createMeeting} from '../controllers/meetings';
import {updateMeeting} from '../controllers/meetings';
import {deleteMeeting} from '../controllers/meetings';
import {getAllQuakers} from '../controllers/quakers';
import {getQuakerById} from '../controllers/quakers';
import {createQuaker} from '../controllers/quakers';
import {updateQuaker} from '../controllers/quakers';
import {deleteQuaker} from '../controllers/quakers';
const router: Router = express.Router();

// Meetings
router.get('/api/v1/meetings', getAllMeetings);
router.get('/api/v1/meetings/yearlymeetings', getYearlyMeetings);
router.get('/api/v1/meetings/branches', getBranches);
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
