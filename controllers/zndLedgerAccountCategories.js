/* File             : zndLedgerAccountCatagories.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}         = require( '../services/generic' );


const ledgerAccountCategory                 = require('../models/ledgerAccountCategoryName')


async function main(req, res)
{   try
    {   var  items;    

			  logger.trace(applicationName + ':zndLedgerAccountCatagories:main:Started');
			  items                           = await ledgerAccountCategory.find().sort({ 'ledgerAccountNameID':1})			
			  res.render('zndLedgerAccountCategories',{ items:items })         
		    logger.trace(applicationName + ':zndLedgerAccountCatagories:main:Done');
	  }
	  catch(ex)
	  {   logger.trace(applicationName + 'zndLedgerAccountCatagories:main:An exception occurred:[' + ex + ']')
 	  }
}


module.exports.main                     = main