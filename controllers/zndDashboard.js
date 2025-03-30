/* File             : zndDashboard.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}         = require( '../services/generic' );

const zndManageData                     = require( '../services/zndManageData' );


const zanddLedger                       = require( '../models/zanddLedger' );
const zndBookKeepersLedgers             = require( '../models/zndBookKeepersLedgers' );
const manageBookkeepingYears           = require( '../services/manageBookkeepingYears' );
const manageCheckBooks                 = require( '../services/manageCheckBooks' );

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
        items                       = await zanddLedger.find( filter ).sort( {BankdateEpoch : 1} );
        const bookkeepingLedgerNames  = await zndBookKeepersLedgers.find();
        const record                = {};
        record.action               = 'getData';
        const bookkeepingYears      = await manageBookkeepingYears.manageBookkeepingYears( record,'' );
        const verification           = await manageCheckBooks.manageCheckBooks( record,'' );

        res.render( 'zndDashboard',{ items:items, queryObj:queryObj, bookkeepingLedgerNames:bookkeepingLedgerNames, bookkeepingYears:bookkeepingYears.body, verification:verification.body } );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndDashboard:main():An exception occurred: [' + ex + '].' );
    }
}


module.exports.main                     = main;



/* LOG:

*/
