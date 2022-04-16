// jshint esversion:6
const express = require('express');
const  router = express.Router();
const controllers = require('../controllers/admin');
const RequireAuth = require('../middlewares/authrequired');


router.get('/admindashboard',RequireAuth,controllers.adminDashboard);
router.get('/writers',RequireAuth,controllers.writters);
router.get('/jobs/:id',RequireAuth,controllers.jobs)
router.get('/writer/:id',RequireAuth,controllers.activateAccount);
router.get('/approvejob/:id',RequireAuth,controllers.approveJob);
router.get('/payjob/:id',RequireAuth,controllers.pay);
router.get('/declinejob/:id',RequireAuth,controllers.declineJob);
router.get('/deleteuser/:id',RequireAuth,controllers.deleteUser);
router.get('/revert/:id',RequireAuth,controllers.revertjob);
router.get('/revertdel/:id',RequireAuth,controllers.revertdecline);
module.exports=router;