/* File             : checkBooks.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      : Definition for the checking of the books.
                      This is the table that contains the defintions of codes that are used to checked the balans.
   Notes            :
*/
const mongoose                         = require( 'mongoose' );
const Schema                           = mongoose.Schema;

const checkBooksSchema                 = new Schema( {   action               :   String,  
                                                         bookingID            :   String,
                                                         bookingCode          :   String,
                                                         bookingType          :   String,
                                                         bookingDescription   :   String
                                                    } );

const checkBook                        = mongoose.model( 'checkBook',checkBooksSchema );
module.exports                         = checkBook;
/* LOG:
*/
