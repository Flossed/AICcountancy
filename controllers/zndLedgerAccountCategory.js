/* File             : zndLedgerAccountCategory.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

const {logger,applicationName}         = require( '../services/generic' );

const ledgerAccount                     = require('../models/ledgerAccountCategoryName')
const emailAdresses                     = require('../models/emailAdresses')

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


module.exports.main                     = main