/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zanddCompagniesHistSchema = new Schema({
	docScan: String, 
  docPath: String, 
  companyName: String,
	companyStreetname: String,
	companyHouseNumber: String,
	companyPostcode: String,
	companyExtraAdressDetails: String,
	companyState: String,
	companyCountry: String,
	companyWebaddress: String,
	companyEmail: String,
	companyTelefoneNumber: String,
	companyBankAccountNumber: String,
	companyRegistrationNumber: String,
	companyVATNumber: String,
	companyCountry: String,
	companyNotes: String,
	editState:String, 
  actie:String,
  originalRecordID:String, 
  recordTime:Number,
  recordStatus:String,
  storedVersion :Number,	
});

const zanddcompagniesHist = mongoose.model('zanddcompagniesHist',zanddCompagniesHistSchema);
module.exports = zanddcompagniesHist

