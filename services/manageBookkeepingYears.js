/* File             : manageBookkeepingYears.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      : Library to manage the Bookkeeping Years
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



async function manageBookkeepingYears ( dataRecord,recordID )
{   try
    {   logger.trace( applicationName + ':manageBookkeepingYears:():Started' );
        const dataModel                =  'bookkeepingYear';

        switch ( dataRecord.action )
        {  case 'getData'               :  {   const allRecords  =  await manageData.getRecords( dataModel );
                                               return allRecords;
                                           }
           case 'getRecordData'         :  {   const recordData = await manageData.getRecord( dataModel,recordID );
                                               logger.trace( applicationName + ':manageBookkeepingYears:():Done' );
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
           default                      :  logger.error( applicationName + ':manageBookkeepingYears:Unknown action : [' + dataRecord.action + '];' ) ;
                                           break;
        }
        logger.trace( applicationName + ':manageBookkeepingYears:():Done' );
        return ;
    }
    catch ( ex )
    {   logger.exception( applicationName + ':manageBookkeepingYears:():An exception occurred :[' + ex + '].' );
    }

}
/* ----------------------------------External functions ------------------------*/
module.exports.manageBookkeepingYears  = manageBookkeepingYears;
/* ----------------------------------End External functions --------------------*/

/* LOG:
*/
