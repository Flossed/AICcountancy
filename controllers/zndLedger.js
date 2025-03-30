/* File             : zndLedger.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

const {logger,applicationName}         = require( '../services/generic' );


const zanddLedger                       = require('../models/zanddLedger')


async function main(req, res)
{   try
    {   var items,queryObj, filter;

        logger.trace(applicationName + ':zndLedger:main():Started ');

        items                           = {};
        queryObj                        = {};
        queryString                     = ""
        
           /*1640951999000
             1644102000000
           */
        queryObj=req.query
        
        if (typeof queryObj.filterCrit != 'undefined')
        {    filter = {};
           
             if ( queryObj.filterCrit.includes('NEW'))
             {   filter = { bankDateEpoch: {$gte : 1640951999000 } , editState: {$not :{$eq: 'on' } },  accntchk: {$not :{$eq: 'on' } }, locked : {$not :{$eq: 'on' } }, transferredAccountant : {$not :{$eq: 'on'  }}}           
             } 
             
        }
        
        if(typeof queryObj.sortCrit != 'undefined')
        {   if (queryObj.sortCrit.includes('DONE'))
            {   items                   = await zanddLedger.find({filter}).sort({locked :1})
            }
            if (queryObj.sortCrit.includes('UPL'))
            {   items                   = await zanddLedger.find({filter}).sort({transferredAccountant :1})
            }
            if (queryObj.sortCrit.includes('Bankdate'))
            {   items                   = await zanddLedger.find({filter}).sort({BankdateEpoch :1})
            }
            if (queryObj.sortCrit.includes('Invoicedate'))
            {   items                   = await zanddLedger.find({filter}).sort({invoiceDateEpoch :1})
            }
            if (queryObj.sortCrit.includes('TRN-REF'))
            {   items                   = await zanddLedger.find({filter}).sort({bankstatementID :1})
            }
        }
        else
        {   items                       = await zanddLedger.find(filter).sort({BankdateEpoch : 1})            
        }
        res.render('zndLedger.ejs',{ items:items, queryObj:queryObj });
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndLedger:main():An exception occurred: ['+ ex +'].')
    }
}


module.exports.main                     = main