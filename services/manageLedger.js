/* File             : manageLedger.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      : Library to manage the Ledger
   Notes            :
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



async function manageLedger ( dataRecord,recordID )
{   try
    {   logger.trace( applicationName + ':manageLedger:():Started' );
        const dataModel                =  'zanddLedger';

        switch ( dataRecord.action )
        {  case 'getData'               :  {   const allRecords  =  await manageData.getRecords( dataModel );
                                               return allRecords;
                                           }
           case 'getRecordData'         :  {   const recordData = await manageData.getRecord( dataModel,recordID );
                                               logger.trace( applicationName + ':manageLedger:():Done' );
                                               return recordData;
                                           }

           case 'updateData'            :  {   const updateResp =  await manageData.updateRecord( dataModel,dataRecord );
                                               return updateResp;
                                           }
           case 'createData'            :  {   const resp = await manageData.createRecord( dataModel,dataRecord );
                                               return resp;
                                           }
           case 'deleteData'            :  {   const deleteResp = await manageData.deleteRecord( dataModel,dataRecord );
                                               return deleteResp;
                                           } 
           default                      :  logger.error( applicationName + ':manageLedger:Unknown action : [' + dataRecord.action + '];' ) ;
                                           break;
        }
        logger.trace( applicationName + ':manageLedger:():Done' );
        return ;
    }
    catch ( ex )
    {   logger.exception( applicationName + ':manageLedger:():An exception occurred :[' + ex + '].' );
    }

}
/* ----------------------------------External functions ------------------------*/
module.exports.manageLedger            = manageLedger;
/* ----------------------------------End External functions --------------------*/

/* LOG:
*/
