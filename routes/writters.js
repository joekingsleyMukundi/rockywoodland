// jshint esversion:6
const express = require('express');
const  router = express.Router();
const controllers = require('../controllers/writers');
const RequireAuth = require('../middlewares/authrequired');

router.get('/login',controllers.loginuser);
router.get('/register',controllers.registeruser);
router.get('/',RequireAuth,controllers.dashboard);
router.get('/jobs',RequireAuth,controllers.jobs);
router.post('/login',controllers.loginuser);
router.post('/register',controllers.registeruser);
router.post('/jobs',RequireAuth,controllers.jobs);
router.get('/logout',RequireAuth,controllers.logout)
router.get('/edit/:id', RequireAuth,controllers.editJob)
router.post('/edit/:id', RequireAuth,controllers.editJob)
router.get('/forgotpassword',controllers.forgotpass);
router.post('/forgotpassword',controllers.forgotpass);
router.get('/resetpassword/:resettoken',controllers.resetPassword);
router.post('/resetpassword/:resettoken',controllers.resetPassword);
module.exports=router;