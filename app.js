// jshint esversion:9
const express = require('express');
const bodyParser = require('body-parser');
const session =require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const app = express();

const writersUrls = require('./routes/writters');
const adminurls = require('./routes/admin');
//middelwares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static("public/"));//start of force https
// app.enable('trust proxy');

// // Add a handler to inspect the req.secure flag (see 
// // http://expressjs.com/api#req.secure). This allows us 
// // to know whether the request was via http or https.
// app.use (function (req, res, next) {
//         if (req.secure) {
//                 // request was via https, so do no special handling
//                 next();
//         } else {
//                 // request was via http, so redirect to https
//                 res.redirect('https://' + req.headers.host + req.url);
//         }
// });
//end of force https

app.use(session({
  secret:'this is our litle secret',
  resave:true,
  saveUninitialized: false
})
);
app.use(flash());

// routes
app.use(writersUrls);
app.use(adminurls);

const port = process.env.PORT || 3000;

const mongoUrl = 'mongodb+srv://admin-joe:Mukundijoe254@cluster0.czws1.mongodb.net/iwrite';
const dbConn = async()=>{
  try {
    await mongoose.connect(mongoUrl,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(port,()=>{
      console.log(`server live at port ${port}`);
    });
    console.log('db active');
  } catch (error) {
    console.error(error);
  }
};
dbConn();