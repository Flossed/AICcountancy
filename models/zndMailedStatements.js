/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zndMailedStatementsSchema = new Schema({  mailID  : Number,
                                                from    : String, 
                                                to      : String, 
                                                subject : String, 
                                                date    : String, 
                                                headerstring :String
                                              });

const zndMailedStatements = mongoose.model('zndMailedStatements',zndMailedStatementsSchema);
module.exports = zndMailedStatements