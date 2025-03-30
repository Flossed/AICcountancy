/* File             : zndBookKeepersLedgers.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}         = require( '../services/generic' );
const zndBookKeepersLedgers             = require('../models/zndBookKeepersLedgers')


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

module.exports.main                     = main



/* LOG:

*/