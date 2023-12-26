/* 
https://stackoverflow.com/questions/37929429/sharing-event-across-modules
*/

var util = require('util')
var eventEmitter = require('events').EventEmitter



util.inherits(Event, eventEmitter)

function Event () {
    eventEmitter.call(this)
}

Event.prototype.sendEvent = function(type, data) {
    this.emit(type, data)
}

var eventBus = new Event();



module.exports = {
 emitter : Event,
 eventBus : eventBus
};












