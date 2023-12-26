/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const codaRecordSchema = new Schema({
	recordHash: String,
	statementID: String,
	transactionID: String,
	recordID: String,
	articleCode: String,
	codaRecordJSON: String,
	ID:String 	
});

const codarecord = mongoose.model('codaRecords',codaRecordSchema);
module.exports = codarecord