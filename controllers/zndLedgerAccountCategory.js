/* File             : zndLedgerAccountCategory.js
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
const ledgerAccount                     = require('../models/ledgerAccountCategoryName')
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

			  logger.trace(applicationName + ':zndLedgerAccountCategory:main:Started');

		    emailaddresses                  = await emailAdresses.find()
		    if (req.params.id != null)
		    {   req.params.newform          = false
			      items                       = await ledgerAccount.findById(req.params.id).sort({ 'ledgerAccountNameID':1})
			      ideez                       = await ledgerAccount.find().distinct('_id');
			      logger.trace(applicationName + ':zndLedgerAccountCategory:main:Done');
			      res.render('zndLedgerAccountCategory',{ items:items, ideez:ideez, emailaddresses:emailaddresses });
		    }
		    else
		    {   req.params.newform          = true;
		        logger.trace(applicationName + ':zndLedgerAccountCategory:main:Done');
		    	  res.render('zndLedgerAccountCategory', { emailaddresses:emailaddresses });
		    }
	  }
	  catch(ex)
	  {   logger.trace(applicationName + 'zndLedgerAccountCategory:main:An exception occurred:[' + ex + ']')
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