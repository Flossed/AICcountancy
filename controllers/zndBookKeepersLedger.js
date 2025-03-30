/* File             : zndBookKeepersLedger.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

const {logger,applicationName}         = require( '../services/generic' );


const zndBookKeepersLedgers             = require('../models/zndBookKeepersLedgers')
const emailAdresses                     = require('../models/emailAdresses')



 
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

module.exports.main                     = main



/* LOG:
*/