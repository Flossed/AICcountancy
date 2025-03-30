/* File             : zndPaymentCategories.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

const {logger,applicationName}         = require( '../services/generic' );

const paymentCatagories                 = require('../models/paymentCatagories')


async function main(req, res)
{   try
    {   var  items;

        logger.trace(applicationName + ':zndPaymentCategories:main:Started.');

        items                           = await paymentCatagories.find().sort({companyName :1})

        logger.trace(applicationName + ':zndPaymentCategories:main:Started.');

		     res.render('zndPaymentCategories',{ items:items });
	  }
	  catch(ex)
	  {   logger.trace(applicationName + 'zndPaymentCategories:main:An exception occurred:[' + ex + ']')
 	  }
}


module.exports.main                     = main

