/* File             : zndExpenses.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2021
   Notes            :
   Description      :
*/

const {logger,applicationName}         = require( '../services/generic' );



const zanddLedger                       = require( '../models/zanddLedger' );
const zndCompanies                      = require( '../models/zndCompanies' );


async function main ( req, res )
{   try
    {   let items,resultSet;

        logger.trace( applicationName + ':zndExpenses::main:Starting' );

        items                           = {};
        resultSet                       = {};

        items                           = await zanddLedger.find( { paymentTypes : 'KAS'} ).sort( {bankDateEpoch :1} );
        for ( let i = 0;i < items.length; i++ )
        {  resultSet                    = {};
           resultSet                    = await zndCompanies.find( { companyName : items[i].compagnyID}, {companyName : 1} );
           //items[i].compagnyName        = "DUCKKY"

          if ( ( typeof resultSet[0] !== 'undefined' ) && ( typeof resultSet[0].companyName !== 'undefined' ) )
          {  items[i].compagnyName      = resultSet[0].companyName;
          }
          else
          {  items[i].compagnyName      = '---';
          }
        }
        logger.trace( applicationName + ':zndExpenses::main:Done' );
        res.render( 'zndExpenses',{ items:items} );
    }
	  catch ( ex )
	  {   logger.exception( applicationName + ':zndExpenses:main:An exception occured:[' + ex + '].' );
	  }
}

module.exports.main                     = main;
