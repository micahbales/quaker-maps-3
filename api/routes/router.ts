import {allMeetings} from '../controllers/meetings';
import {catchErrors} from '../utils/utils';
import express = require('express');
import {Router} from 'express';
const router: Router = express.Router();

router.get('/all-meetings', catchErrors(allMeetings));

export default router;
