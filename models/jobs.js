// jshint esversion:8
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  jobTitle:{
    type: String,
    required: true,
  },
  platform:{
    type:String,
    required: true
  },
  writerid:{
    type:String,
    required:true
  },
  writerUsername:{
    type:String,
    required:true
  },
  writeremail:{
    type:String,
    required:true
  },
  writerphone:{
    type:String,
    required:true
  },
  status:{
    type: String,
    default:"pending"
  },
  amount:{
    type:Number,
    required:true,
  },
  verified:{
    type:Boolean,
    default:false
  },
},
{ timestamps: true });
const Job = new mongoose.model('Job',jobSchema);
module.exports= Job;
