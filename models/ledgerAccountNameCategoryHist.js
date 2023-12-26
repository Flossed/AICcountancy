/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ledgerAccountNameHistSchema = new Schema({	
  ledgerLabel:String, 
  ledgerAccountNameID: String,
  ledgerAccountName: String,
	ledgerAccountNameDescription: String,
	destinationAccount: String,
	editState:String,
	actie:String,
  originalRecordID:String, 
  recordTime:Number,
  recordStatus:String,
  storedVersion :Number
});

const ledgeraccountnamehist = mongoose.model('ledgeraccountnameshist',ledgerAccountNameHistSchema);
module.exports = ledgeraccountnamehist

  