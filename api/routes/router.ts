import app from '../app';
const express = require('express');
const router = express.Router();
const {catchErrors} = require('../handlers/errorHandlers');
const controllers = require('../controllers/controllers');

router.get('/', catchErrors(controllers.root));

export default router;