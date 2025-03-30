/* File             : manageReferenceData.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      : Library to manage the reference data for the Bookkeeping Application
   Notes            : reference data are the following data: 
                      bookyears, verificationStatus, bookkkeeping ledgers.   
*/


const {logger,applicationName}         = require( '../services/generic' );
const manageData                        = require( './manageDataModel' );
const manageBookkeepingYears            = require( './manageBookkeepingYears' );
const manageCheckBooks                  = require( './manageCheckBooks' );


async function manageReferenceData ( dataRecord,recordID )
{   try
    {   logger.trace( applicationName + ':manageReferenceData:():Started' );
        

        switch ( dataRecord.action )
        {  case 'getRefenceData'        :  {   const record             = {'action':'getData'};
                                               const bookkeepingYears   = await manageBookkeepingYears.manageBookkeepingYears( record,'' );
                                               const verification       = await manageCheckBooks.manageCheckBooks( record,'' );
                                               return allRecords;
                                           }
           default                      :  logger.error( applicationName + ':manageReferenceData:Unknown action : [' + dataRecord.action + '];' ) ;
                                           break;
        }
        logger.trace( applicationName + ':manageReferenceData:():Done' );
        return ;
    }
    catch ( ex )
    {   logger.exception( applicationName + ':manageReferenceData:():An exception occurred :[' + ex + '].' );
    }

}


module.exports.manageReferenceData     = manageReferenceData;

