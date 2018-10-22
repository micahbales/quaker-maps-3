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
router.get('/meetings', catchErrors(getAllMeetings));
router.get('/yearlymeetings', catchErrors(getYearlyMeetings));
router.get('/meetings/:id', catchErrors(getMeetingById));
router.post('/meetings', catchErrors(createMeeting));
router.put('/meetings/:id', catchErrors(updateMeeting));
router.delete('/meetings/:id', catchErrors(deleteMeeting));

// Quakers
router.get('/quakers', catchErrors(getAllQuakers));
router.get('/quakers/:id', catchErrors(getQuakerById));
router.post('/quakers/', catchErrors(createQuaker));
router.put('/quakers/:id', catchErrors(updateQuaker));
router.delete('/quakers/:id', catchErrors(deleteQuaker));

export default router;
