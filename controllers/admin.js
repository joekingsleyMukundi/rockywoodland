// jshint esversion:9
const Job = require("../models/jobs");
const User = require("../models/writter");
exports.adminDashboard = async (req,res,next)=>{
  const user=req.session.user;
  if(user.role != "admin"){
    return res.redirect('/');
  }
  var totaljobs;
  var pendingjobs;
  const unverifiedWriters = await User.find({role:"writer",verified:false});
  const jobs = await Job.find();
  const writers = await User.find({role:"writer"});
  if (jobs.length == 0){
    totaljobs = 0;
    pendingjobs = 0;
  }else{
    totaljobs = jobs.length;
    pendingjobsarray = await Job.find({status:'pending'});
    pendingjobs=pendingjobsarray.length;
  }
  context = {
    user:user,
    totalWriters:writers.length,
    unverified:unverifiedWriters.length,
    pendingjobs:pendingjobs,
    totaljobs:totaljobs,
    jobs:jobs, errormessage:req.flash('error'),
    successmessage:req.flash('success')
  };
  res.render('admindashboard',context);
};

exports.writters = async (req,res,next)=>{
  const user=req.session.user;
  if(user.role != "admin"){
    return res.redirect('/');
  }
  const writers = await User.find({role:"writer"});
  context = {
    user:user,
    writters:writers, errormessage:req.flash('error'),
    successmessage:req.flash('success')
  };
  res.render('adminusers',context);
};

exports.activateAccount=async(req,res,next)=>{
  const id = req.params.id;
  const writer = await User.findById(id);
  writer.verified = true;
  await writer.save();
  res.redirect('/writers');
};
exports.pay=async(req,res,next)=>{
  const id = req.params.id;
  const job = await Job.findById(id);
  job.verified = true;
  job.status = "paid";
  job.save();
  User.findOne({email:job.writeremail})
  .then(user=>{
    const prev = user.pendingRevenue;
    const newprev = prev-job.amount;
    user.pendingRevenue = newprev;
    const rev = user.totalRevenue;
    const newrev = rev+job.amount;
    user.totalRevenue = newrev;
    user.save();
    req.flash('success', 'Successfully approved and confirmed payment for the job');
    return res.redirect('/admindashboard');
  })
  .catch(error=>{
    console.log(error);
    req.flash('error', 'an erroroccored')
    return res.redirect('/admindashboard')
  })
};
exports.approveJob=async(req,res,next)=>{
  const id = req.params.id;
  const job = await Job.findById(id);
  job.verified = true;
  job.status = "pending payment";
  job.save();
  User.findOne({email:job.writeremail})
  .then(user=>{
    const prev = user.pendingRevenue;
    const newprev = prev+job.amount;
    user.pendingRevenue = newprev;
    user.save();
    req.flash('success', 'Successfully approved and confirmed payment for the job');
    return res.redirect('/admindashboard');
  })
  .catch(error=>{
    console.log(error);
    req.flash('error', 'an erroroccored')
    return res.redirect('/admindashboard')
  })
};
exports.declineJob=async(req,res,next)=>{
  const id = req.params.id;
  const job = await Job.findById(id);
  job.status = 'rejected';
  await job.save();
  req.flash('success', 'Successfully rejected the job');
  res.redirect('/admindashboard');
};
exports.deleteUser = async (req,res,next)=>{
  const id = req.params.id;
  const writer = await User.findById(id);
  writer.delete()
  .then(results=>{
    console.log('success');
    req.flash('success', 'Successfully rejected the user')
 
    return res.redirect('/adminDashboard');
  })
  .catch(error=>{
    console.log(error);
    req.flash('error', 'an erroroccored')
    return res.redirect('/admindashboard');
  });
};