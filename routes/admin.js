// jshint esversion:6
const express = require('express');
const  router = express.Router();
const controllers = require('../controllers/admin');
const RequireAuth = require('../middlewares/authrequired');


router.get('/admindashboard',RequireAuth,controllers.adminDashboard);
router.get('/writers',RequireAuth,controllers.writters);
router.get('/writer/:id',RequireAuth,controllers.activateAccount);
router.get('/approvejob/:id',RequireAuth,controllers.approveJob);
router.get('/payjob/:id',RequireAuth,controllers.pay);
router.get('/declinejob/:id',RequireAuth,controllers.declineJob);
router.get('/deleteuser/:id',RequireAuth,controllers.deleteUser);
module.exports=router;