/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zanddLedgerSchema = new Schema({
	bankDate: String,
  accntchk:String,
  acountantReference:String,
  actie:String,
  bankAccountNumber: String,
  bankDateEpoch: Number, 
  bankRecord: String, // field containing all the records making up the bankstatementID
  bankstatementID: String, 
  beneficiary: String,
  billDescription: String,
  billSpecification: String,
  bookedVAT: String,
  bookingPeriod: String,
  compagnyID: String,
  customerReference:String, 
  docPath: String, 
  docScan: String, 
  editState:String, 
  fiatSign:String, 
  grossAmount: String,
  invoiceDate: String,
  invoiceDateEpoch: Number, 
  invoiceNumber: String,
  ledgerAccount: String,
  bkLedgerAccount: String,
  declarationStatement: String,
  locked:String, 
  movementSign:String, 
  notes: String,
  PaymentID:String, 
  paymentTypes: String,
  pendingActions: String, 
  proofType: String,
  transferredAccountant:String, 
  lastTransferredAccountantTime:String, 
  transferredAccountantCount:String, 
  valuta:String, 
  VAT : String,
  VATNumber: String,
  zndAccountNumber: String,
  grossAmountNR: Number,
  VATNR : Number,
  ID: String
});



const zanddLedger = mongoose.model('zanddLedger',zanddLedgerSchema);

module.exports = zanddLedger


