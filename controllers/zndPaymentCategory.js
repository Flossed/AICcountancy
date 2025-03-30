/* File             : zndPaymentCategory.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

const {logger,applicationName}         = require( '../services/generic' );

const paymentCatagories                 = require('../models/paymentCatagories')


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


module.exports.main                     = main