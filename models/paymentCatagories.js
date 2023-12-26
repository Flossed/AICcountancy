/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const paymentCatagoriesSchema = new Schema({
	 actie                        : String, 
	 paymentCatagoryName          : String, 
   paymentCatagoryDescription   : String,
	 editState                    : String	
});

const paymentCatagories = mongoose.model('paymentcatagories',paymentCatagoriesSchema);
module.exports = paymentCatagories

