/* File             : zndBookkeepingYearHist.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Notes            :
   Description      :
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zndBookkeepingYearHistSchema     = new Schema({   action                       :   String, 
                                                        editState                    :   String,
                                                        bookkeepingYearLabel         :   String,
                                                        bookkeepingYearID            :   String,
                                                        bookkeepingYear              :   String,
                                                        bookkeepingYearDescription   :   String,
                                                        originalRecordID             :   String, 
                                                        recordTime                   :   Number,
                                                        recordStatus                 :   String,
                                                        storedVersion                :   Number	
                                                     });

const zndBookkeepingYearHist           = mongoose.model('zndBookkeepingYearHist',zndBookkeepingYearHistSchema);
module.exports                         = zndBookkeepingYearHist

/* LOG:
*/