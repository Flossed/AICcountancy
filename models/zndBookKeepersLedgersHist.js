/* File             : zndBookKeepersLedgerHistsHist.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zndBookKeepersLedgerHistSchema    = new Schema({   bkLedgerLabel           :   String, 
                                                         bkLedgerID              :   String,
                                                         bkLedgerName            :   String,
                                                     	   bkLedgerDescription     :   String,
                                                     	   bkLedgerdstAccount      :   String,
                                                     	   bkLedgerEditState       :   String, 
                                                     	   bkLedgerActie           :   String,                       
                                                         originalRecordID        :   String, 
                                                         recordTime              :   Number,
                                                         recordStatus            :   String,
                                                         storedVersion           :   Number	
                                                     });

const zndBookKeepersLedgerHist          = mongoose.model('zndBookKeepersLedgerHist',zndBookKeepersLedgerHistSchema);
module.exports                          = zndBookKeepersLedgerHist



/* LOG:

*/