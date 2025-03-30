/* File             : zndDashboard.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}         = require( '../services/generic' );

const zndManageData                     = require( '../services/zndManageData' );
const zanddLedger                       = require( '../models/zanddLedger' );

async function main ( req, res )
{   try
    {   let items,queryObj, filter;

        logger.trace( applicationName + ':zndDashboard:main():Started ' );

        items                           = {};
        queryObj                        = {};
        queryString                     = '';
        queryObj                        = req.query;

        if (  typeof queryObj.augment !== 'undefined' )
        {
            await zndManageData.runDataAugmentation();
        }
        filter                      = { paymentTypes : 'KAS' };
        items                       = await zanddLedger.find( filter ).sort( {BankdateEpoch : 1} );

        res.render( 'zndExpensesNext',{ items:items, queryObj:queryObj } );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndDashboard:main():An exception occurred: [' + ex + '].' );
    }
}



module.exports.main                     = main;
