import {catchErrors} from '../utils/utils';
import express = require('express');
import {Router} from 'express';
import {getAllMeetings} from '../controllers/meetings';
import {getYearlyMeetings} from '../controllers/meetings';
import {getMeetingById} from '../controllers/meetings';
import {createMeeting} from '../controllers/meetings';
import {updateMeeting} from '../controllers/meetings';
const router: Router = express.Router();

// Meetings
router.get('/meetings', catchErrors(getAllMeetings));
router.get('/yearlymeetings', catchErrors(getYearlyMeetings));
router.get('/meetings/:id', catchErrors(getMeetingById));
router.post('/meetings', catchErrors(createMeeting));
router.put('/meetings/:id', catchErrors(updateMeeting));

export default router;
