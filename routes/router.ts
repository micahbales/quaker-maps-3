import {catchErrors} from '../utils/utils';
import express = require('express');
import {Router} from 'express';
import {getAllMeetings} from '../controllers/meetings';
import {getYearlyMeetings} from '../controllers/meetings';
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
router.get('/api/v1/meetings', catchErrors(getAllMeetings));
router.get('/api/v1/yearlymeetings', catchErrors(getYearlyMeetings));
router.get('/api/v1/meetings/:id', catchErrors(getMeetingById));
router.post('/api/v1/meetings', catchErrors(createMeeting));
router.put('/api/v1/meetings/:id', catchErrors(updateMeeting));
router.delete('/api/v1/meetings/:id', catchErrors(deleteMeeting));

// Quakers
router.get('/api/v1/quakers', catchErrors(getAllQuakers));
router.get('/api/v1/quakers/:id', catchErrors(getQuakerById));
router.post('/api/v1/quakers/', catchErrors(createQuaker));
router.put('/api/v1/quakers/:id', catchErrors(updateQuaker));
router.delete('/api/v1/quakers/:id', catchErrors(deleteQuaker));

export default router;
