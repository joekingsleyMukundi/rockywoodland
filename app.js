// jshint esversion:9
const express = require('express');
const bodyParser = require('body-parser');
const session =require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const app = express();

const writersUrls = require('./routes/writters');

//middelwares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static("public/"));
app.use(session({
  secret:'this is our litle secret',
  resave:false,
  saveUninitialized: false
})
);
app.use(flash());

// routes
app.use(writersUrls);

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