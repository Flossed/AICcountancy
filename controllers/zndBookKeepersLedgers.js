/* File             : zndBookKeepersLedgers.js
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
const zndBookKeepersLedgers             = require('../models/zndBookKeepersLedgers')
/* -------------------------------- End Models -------------------------------*/



/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
const logger                            = new Logger(logFileName)
/* ----------- End Internal Application Libraries Initialization -------------*/



/* ------------------------------------- Functions   -------------------------*/
/* --------------------------------- End Functions   -------------------------*/

/* ----------------------------------Module Initialization -------------------*/
async function main(req, res)
{   try
    {   var  items;    

			  logger.trace(applicationName + ':zndBookKeepersLedgers:main:Started');
			  items                           = await zndBookKeepersLedgers.find().sort({ 'bkLedgerID':1})			
			  res.render('zndBookKeepersLedgers',{ items:items })         
		    logger.trace(applicationName + ':zndBookKeepersLedgers:main:Done');
	  }
	  catch(ex)
	  {   logger.trace(applicationName + 'zndLedgerAccountCatagories:main:An exception occurred:[' + ex + ']')
 	  }
}
/* ----------------------------------End Module Initialization ---------------*/



/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main
/* ----------------------------------End External functions ------------------*/


/* LOG:

*/