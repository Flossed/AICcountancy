/* File             : manageReferenceData.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      : Library to manage the reference data for the Bookkeeping Application
   Notes            : reference data are the following data: 
                      bookyears, verificationStatus, bookkkeeping ledgers.   
*/

/* ------------------     External Application Libraries      -----------------*/
/* ------------------ End External Application Libraries      -----------------*/

/* --------------- External Application Libraries Initialization --------------*/
/* ----------- End External Application Libraries Initialization --------------*/

/* ------------------------------------- Controllers --------------------------*/
/* -------------------------------- End Controllers ---------------------------*/

/* ------------------------------------- Services -----------------------------*/
const {logger,applicationName}          = require( './generic' );
const manageData                        = require( './manageDataModel' );
const manageBookkeepingYears            = require( './manageBookkeepingYears' );
const manageCheckBooks                  = require( './manageCheckBooks' );

/* -------------------------------- End Services ------------------------------*/

/* ------------------------------------- Models -------------------------------*/
/* -------------------------------- End Models --------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization --------------*/
/* ----------- End Internal Application Libraries Initialization --------------*/

/* ----------------------------- Private Functions   --------------------------*/
/* -------------------------- End Private Functions   ------------------------*/

/* --------------------------- Public Functions   ----------------------------*/
/* ----------------------------- End Public Functions   ------------------------*/

/*
bookkeepingLedgerNames       = await zndBookKeepersLedgers.find();
		        const record = {'action':'getData'};
		        const bookkeepingYears       = await manageBookkeepingYears.manageBookkeepingYears( record,'' );
            const verification           = await manageCheckBooks.manageCheckBooks( record,'' );

*/

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
/* ----------------------------------External functions ------------------------*/
module.exports.manageReferenceData     = manageReferenceData;
/* ----------------------------------End External functions --------------------*/

/* LOG:
*/
