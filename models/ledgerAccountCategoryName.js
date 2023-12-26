/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ledgerAccountNameSchema = new Schema({	
  ledgerLabel:String, 
  ledgerAccountNameID: String,
  ledgerAccountName: String,
	ledgerAccountNameDescription: String,
	destinationAccount: String,
	editState:String, 
	actie :String	
});

const ledgeraccountname = mongoose.model('ledgeraccountname',ledgerAccountNameSchema);
module.exports = ledgeraccountname

