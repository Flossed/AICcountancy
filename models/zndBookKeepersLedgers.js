/* File             : zndBookKeepersLedgers.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zndBookKeepersLedgerSchema        = new Schema({   bkLedgerLabel           :   String, 
                                                         bkLedgerID              :   String,
                                                         bkLedgerName            :   String,
                                                     	   bkLedgerDescription     :   String,
                                                     	   bkLedgerdstAccount      :   String,
                                                     	   bkLedgerEditState       :   String, 
                                                     	   bkLedgerActie           :   String	
                                                     });

const zndBookKeepersLedger              = mongoose.model('zndBookKeepersLedger',zndBookKeepersLedgerSchema);
module.exports                          = zndBookKeepersLedger



/* LOG:

*/