/* File             : zndBookKeepersLedger.js
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
const emailAdresses                     = require('../models/emailAdresses')
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
    {   var emailaddresses,items,ideez;

			  logger.trace(applicationName + ':zndBookKeepersLedger:main:Started');

		    emailaddresses                  = await emailAdresses.find()
		    //logger.debug(applicationName + ':zndBookKeepersLedger:main:emailAdresses', emailaddresses);
		    if (req.params.id != null)
		    {   req.params.newform          = false
			      items                       = await zndBookKeepersLedgers.findById(req.params.id).sort({ 'ledgerAccountNameID':1})
			      ideez                       = await zndBookKeepersLedgers.find().distinct('_id');
			      //logger.debug(applicationName + ':zndBookKeepersLedger:main:items', items);
			      //logger.debug(applicationName + ':zndBookKeepersLedger:main:ideez', ideez);
			      logger.trace(applicationName + ':zndBookKeepersLedger:main:Done with IDS');
			      res.render('zndBookKeepersLedger',{ items:items, ideez:ideez, emailaddresses:emailaddresses });
		    }
		    else
		    {   req.params.newform          = true;
		        logger.trace(applicationName + ':zndBookKeepersLedger:main:Done');
		    	  res.render('zndBookKeepersLedger', { emailaddresses:emailaddresses });
		    }
	  }
	  catch(ex)
	  {   logger.trace(applicationName + 'zndBookKeepersLedger:main:An exception occurred:[' + ex + ']')
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