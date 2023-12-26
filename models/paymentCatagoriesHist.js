/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const paymentCatagoriesHistSchema = new Schema({
	paymentCatagoryName: String, 
   paymentCatagoryDescription: String, 
	editState:String, 
   actie:String,
   originalRecordID:String, 
   recordTime:Number,
   recordStatus:String,
   storedVersion :Number,	
});

const paymentCatagoriesHist = mongoose.model('paymentcatagorieshist',paymentCatagoriesHistSchema);
module.exports = paymentCatagoriesHist

