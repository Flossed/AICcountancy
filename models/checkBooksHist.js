/* File             : checkBooksHist.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      : Definition of the historytable for the checking of the books.
                      This is a snapshot of the checkBooks table at a given time.
   Notes            :
*/
const mongoose                         = require( 'mongoose' );
const Schema                           = mongoose.Schema;

const checkBooksHistSchema             = new Schema( {   action               :   String,
                                                         bookingID            :   String,
                                                         bookingCode          :   String,
                                                         bookingType          :   String,
                                                         bookingDescription   :   String,
                                                         originalRecordID     :   String,
                                                         recordTime           :   Number,
                                                         recordStatus         :   String,
                                                         storedVersion        :   Number
                                                    } );

const checkBookHist                    = mongoose.model( 'checkBookHist',checkBooksHistSchema );
module.exports = checkBookHist;
/* LOG:
*/
