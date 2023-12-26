/* File             : emailAdresses.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Description      : Schema for email addresses
   Notes            :
*/

const mongoose                          = require('mongoose');
const Schema                            = mongoose.Schema;
var   emailAddress;

const emailaddressSchema                = new Schema({   actie              :   String,
                                                         emailDescription   :   String,
                                                         emailCategory      :   String,
                                                         emailaddress       :   String,
                                                         editState          :   String
                                                     });

emailAddress                            = mongoose.model('emailaddress',emailaddressSchema);
module.exports                          = emailAddress;

/* LOG:

*/