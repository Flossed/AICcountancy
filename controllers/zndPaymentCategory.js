/* File             : zndPaymentCategory.js
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
const paymentCatagories                 = require('../models/paymentCatagories')
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
    {   var  items,ideez;

        logger.trace(applicationName + ':zndPaymentCategory:main:Started.');

        if (req.params.id != null)
        {   req.params.newform =false
			      items                       = await paymentCatagories.findById(req.params.id)
			      ideez                       = await paymentCatagories.find().sort({invoiceDate :1}).distinct('_id')
			      logger.trace(applicationName + ':zndPaymentCategory:main:Done.');
			      res.render('zndPaymentCatagory',{ items:items, ideez:ideez });
		    }
		    else
		    {   req.params.newform =true
		        logger.trace(applicationName + ':zndPaymentCategory:main:Done');
		    	  res.render('zndPaymentCatagory');
		    }
	  }
	  catch(ex)
	  {   logger.trace(applicationName + 'zndPaymentCategory:main:An exception occurred:[' + ex + ']')
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