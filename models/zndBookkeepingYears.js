/* File             : zndBookkeepingYears.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Notes            :
   Description      :
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zndBookkeepingYearsSchema        = new Schema({   action                       :   String, 
                                                        editState                    :   String,
                                                        bookkeepingYearLabel         :   String,
                                                        bookkeepingYearID            :   String,
                                                        bookkeepingYear              :   String,
                                                        bookkeepingYearDescription   :   String
                                                     });

const zndBookkeepingYears              = mongoose.model('zndBookkeepingYears',zndBookkeepingYearsSchema);
module.exports                         = zndBookkeepingYears

/* LOG:
*/