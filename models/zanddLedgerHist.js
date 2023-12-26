/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zanddLedgerHistSchema = new Schema({
  actie:String,
  accntchk:String,
  acountantReference:String,
  bankAccountNumber: String,
  bankDate: String,
  bankDateEpoch: Number, 
  bankRecord: String,   
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
  originalRecordID:String, 
  PaymentID:String,
  paymentTypes: String,
  pendingActions: String,
  proofType: String,
  recordStatus:String,
  recordTime:Number,
  storedVersion :Number, 
  transferredAccountant:String, 
  lastTransferredAccountantTime:String, 
  transferredAccountantCount:String, 
  VAT : String,
  VATNumber: String,
  zndAccountNumber: String,
  grossAmountNR: Number,
  VATNR : Number,
  ID: String
});


const zanddLedgerHist = mongoose.model('zanddLedgerHist',zanddLedgerHistSchema);

module.exports = zanddLedgerHist


