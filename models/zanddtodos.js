/*
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const zanddTodosSchema = new Schema({
	todoDate: String,
	todoDescription: String,
  todoState: String,
  todoDoneDate : String  
});

const zanddtodos = mongoose.model('zanddTodos',zanddTodosSchema);
module.exports = zanddtodos

