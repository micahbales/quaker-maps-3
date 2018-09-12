import {catchErrors} from '../utils/utils';
import express = require('express');
import {Router} from 'express';
import {allMeetings} from '../controllers/meetings';
import {meetingById} from '../controllers/meetings';
const router: Router = express.Router();

router.get('/meetings', catchErrors(allMeetings));
router.get('/meetings/:id', catchErrors(meetingById));

export default router;
