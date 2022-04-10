// jshint esversion:8
const crypto = require('crypto');
const User = require('../models/writter');
const { sendMail } = require('../utils/sendemail.js');
const Password = require('../utils/password');
const Job = require('../models/jobs');

// @desc          register user
// @route         Get /api/v1/auth/register
// @access         public

exports.registeruser = async(req,res,next)=>{
  if(req.session.user){
    res.redirect('/dashboard')
  }
  if(req.method == 'POST'){
    const{username,email,phone,password,repassword} = req.body;
    if(password != repassword){
      req.flash('error', 'Password should match');
      return res.redirect('/register');
    }
    User.findOne({email:email})
    .then(userDocs=>{
      if(userDocs){
        req.flash('error', 'User already exists');
        return res.redirect('/login');
      }
      const user = new User({username:username,email:email,password:password,phone:phone,});
      return user.save()
      .then(newuser=>{
        req.flash('success', 'Registration successful. Please login');
        return res.redirect('/login');
      });
    })
    .catch(error=>{
      console.log(error);
      req.flash('error', 'Error occured plese contact admin');
      return res.redirect('/register');
    });
  }else{
    res.render('signup')
  }
};

// exports.activateAccount=async(req,res,next)=>{
//   const id = req.params.uid;
//   const writer = await User.findById(id);
//   user.isActive = true;
//   await user.save();
//   res.redirect('/userslist');
// };

exports.loginuser = async(req,res,next)=>{
  if(req.session.user){
    console.log(req.session.user);
    res.redirect('/')
  }
  if(req.method == 'POST'){
    const{email, password} = req.body;
    const existinguser = await User.findOne({email});
    if(!existinguser){
      req.flash('error', 'User does not exist');
      return res.redirect('/register')
    }
    const matchpassword = await  Password.compare(existinguser.password, password);
    if(!matchpassword){
      req.flash('error', 'Wrong password');
      return res.redirect('/login')
    }
      req.session.user = existinguser;
      req.session.is_loggedin=true;
      return res.redirect('/')
  }
  console.log(req.flash());
  res.render('login',)
};

exports.logout=(req,res,next)=>{
  req.session.destroy(function(err) {
    // cannot access session here
    console.log(error);
    res.redirect('/login');
  })
    
};

// exports.forgotpass = async (req,res,next)=>{
//   if(req.session.user){
//     res.redirect('/dashboard')
//   }
//   if(req.method == 'POST'){
//     const user = await User.findOne({email:req.body.email});
//     if(!user){
//       req.flash('error', 'User does not exist');
//       return res.redirect('/register');
//     }

//     const resetToken = user.getResetPasswordToken();
//     console.log(resetToken);
//     const reseturl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
//     const message  = `You are receiving this email because you (or someone else) has requested a reset of password. Please click this link ${reseturl}`;
//     const subj = "Password Renewal";
//     try {
//       await sendMail(user.firstname,user.email,subj,message);
//       res.redirect('/forgotpassword')
//     } catch (error) {
//       console.log(error);
//       user.resetPasswordToken = undefined;
//       user.resetPassworExpire = undefined;
//       await user.save({validateBeforeSave: false});
//       res.redirect('/forgotpassword')
//     }
//     await user.save(
//       {
//         validateBeforeSave: false
//       }
//     );
//   }
//   res.render('forgotpassword')
// };

// exports.resetPassword = async (req,res,next)=>{
//   // get hashed token
//   const resetpassToken  = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
//   const user = await User.findOne({
//     resetPasswordToken : resetpassToken,
//     resetPassworExpire :{$gt : Date.now()}
//   });

//   if(!user){
//     req.flash('error', 'User does not exist');
//     res.redirect('/login')
//   }
//   res.render('')
//   if(req.method == 'POST'){
//     // set new pass
//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPassworExpire= undefined;
//     await user.save();
//     req.session.user = user;
//     req.session.is_loggedin = true
//     res.redirect('/dashboard')
//   }
// };

exports.dashboard=async (req,res,next)=>{
  const user=req.session.user;
  var jobsno;
  var pendingjobs;
  const totalJobs = await Job.find({writerid:user._id})
  if(!totalJobs){
    jobsno = 0;
    pendingjobs=0;
  }else{
    jobsno= totalJobs.length;
    pendingjobs = await Job.find({writerid:user._id,status:'pending'})
  }
  context={
    user:user,
    totaljobs:jobsno,
    pendingjobs:pendingjobs.length,
    jobs:totalJobs
  }
  res.render('dashboard',context)
}

exports.jobs= async(req,res,next)=>{
  const user=req.session.user;
  const totalJobs = await Job.find({writerid:user.__id})
  context={
    user:user,
    jobs:totalJobs
  }
  if(req.method == 'POST'){
    const title = req.body.title;
    const amount =Number(req.body.amount);
    const job = new Job({jobTitle:title,writerid:user._id,amount:amount})
    job.save()
    .then(results=>{
      req.flash('success', 'Job upload successful. Please wait for validation');
      return res.redirect('/');
    })
    .catch(error=>{
      console.log(error);
      req.flash('Error', 'Job upload successful. Please wait for validation');
      return res.redirect('/');
    })
  }else{
    res.redirect('/')
  }
  
}

exports.logout=(req,res,next)=>{
  req.session = null;
  res.redirect('/login')
}
