/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zanddImprovementSchema = new Schema({
	improvementDate: String,
	improvementDescription: String,
  improvementState: String,
  improvementDoneDate : String  
});

const zanddimprovements = mongoose.model('zanddImprovements',zanddImprovementSchema);
module.exports = zanddimprovements