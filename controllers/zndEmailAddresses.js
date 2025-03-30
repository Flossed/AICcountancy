/* File             : zndEmailAddresses.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}         = require( '../services/generic' );


const emailAdresses                     = require('../models/emailAdresses')

async function main(req, res)
{   try
    {   var  items;

        logger.trace(applicationName + ':zndPaymentCategories:main:Started.');

        items                           = await emailAdresses.find();

        logger.trace(applicationName + ':zndPaymentCategories:main:Started.');

		     res.render('zndEmailAddresses',{ items:items });
	  }
	  catch(ex)
	  {   logger.trace(applicationName + 'zndPaymentCategories:main:An exception occurred:[' + ex + ']')
 	  }
}

module.exports.main                     = main
