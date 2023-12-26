/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zanddemployeeSchema = new Schema({
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
  editState : String 
});

const zanddEmployees = mongoose.model('zanddemployee',zanddemployeeSchema);
module.exports = zanddEmployees