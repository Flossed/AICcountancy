/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zanddEmployeesHistSchema = new Schema({
	actie:String, 
	docScan: String, 
  docPath: String, 
  employeeID: String,
	employeefirstName: String,
	employeeInitials: String,
	employeelastName: String,
	employeedateOfBirth: String,
	employeePhoneNumber: String,
	employeeEmail: String,
	employeeStartDate: String,
  employeeEndDate: String,
  employeeStatus : String ,
  editState : String ,   
  originalRecordID:String, 
  recordTime:Number,
  recordStatus:String,
  storedVersion :Number 
  
});

const zanddEmployeesHist = mongoose.model('zanddEmployeesHist',zanddEmployeesHistSchema);
module.exports = zanddEmployeesHist