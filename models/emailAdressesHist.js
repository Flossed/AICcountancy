/* File             : emailAdressesHist.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Description      : Schema for email addresses history.
   Notes            :
*/

const mongoose                          = require('mongoose');
const Schema                            = mongoose.Schema;
var   emailAddressHist;

const emailaddressSchemaHist            = new Schema({   emailDescription   : String,
                                                         emailCategory      : String,
                                                         emailaddress       : String,
                                                         editState          : String,
                                                         actie              : String,
                                                         originalRecordID   : String,
                                                         recordTime         : Number,
                                                         recordStatus       : String,
                                                         storedVersion      : Number,
                                                     }); 

emailAddressHist                        = mongoose.model('emailaddressHist',emailaddressSchemaHist);
module.exports                          = emailAddressHist;
/* LOG:
*/

