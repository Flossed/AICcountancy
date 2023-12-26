/* File             : zndEmployees.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

/* ------------------     External Application Libraries      ----------------*/
const winston                           = require('winston')
/* ------------------ End External Application Libraries      ----------------*/



/* --------------- External Application Libraries Initialization -------------*/
/* ----------- End External Application Libraries Initialization -------------*/



/* ------------------     Internal Application Libraries      ----------------*/
const config                            = require('../services/configuration')
/* ------------------ End Internal Application Libraries      ----------------*/



/* ------------------------------------- Controllers -------------------------*/
/* -------------------------------- End Controllers --------------------------*/



/* ------------------------------------- Services ----------------------------*/
const Logger                            = require('../services/zndLoggerClass')
/* -------------------------------- End Services -----------------------------*/



/* ------------------------------------- Models ------------------------------*/
const zanddEmployees                = require('../models/zanddEmployees')
/* -------------------------------- End Models -------------------------------*/



/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
const logger                            = new Logger(logFileName)
/* ----------- End Internal Application Libraries Initialization -------------*/



/* ------------------------------------- Functions   -------------------------*/
async function main(req, res)
{   try
	  {   logger.trace(applicationName + ':zndEmployees:main:Started');
	      if (req.params.id != null)
	  	  {   req.params.newform          = false
	  	  	  const employees            = await zanddEmployees.findById(req.params.id)
	  	  	  const ideez                 = await zanddEmployees.find().distinct('_id')
	  	  	  logger.trace(applicationName + ':zndEmployees:main:Done');
	  	  	  res.render('zndEmployees',{ employees:employees, ideez:ideez });
	  	  }
	  	  else
	  	  {   req.params.newform          = true
	  	      logger.trace(applicationName + ':zndEmployees:main:Done');
	  	  	  res.render('zndEmployees');
	  	  }
	  }
	  catch(ex)
	  {   logger.exception(applicationName + ':zndEmployees:main:An exception occured:[' + ex + '].')
	  }
}
/* --------------------------------- End Functions   -------------------------*/

/* ----------------------------------Module Initialization -------------------*/
/* ----------------------------------End Module Initialization ---------------*/

/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main
/* ----------------------------------End External functions ------------------*/


/* LOG:
*/