/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zanddCompagniesSchema = new Schema({
	actie:String,
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
	companyNotes: String,	
	editState:String	
});

const zanddcompagnies = mongoose.model('zanddcompagnies',zanddCompagniesSchema);
module.exports = zanddcompagnies

