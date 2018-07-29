import {root} from '../controllers/controllers';
import {catchErrors} from '../handlers/errorHandlers';
import express = require('express');
import {Router} from 'express';
const router: Router = express.Router();

router.get('/', catchErrors(root));

export default router;
