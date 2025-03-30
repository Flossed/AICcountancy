/* File             : manageLedger.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      : Library to manage the Ledger
   Notes            :
*/



const {logger,applicationName}         = require( '../services/generic' );
const manageData                        = require( './manageDataModel' );


async function manageLedger ( dataRecord,recordID , criterea )
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
           case 'restore'               :  {   const restoreResp = await manageData.restoreRecord( dataModel,recordID );                                               
                                               logger.trace( applicationName + ':manageLedger:():Done' );
                                               return restoreResp;
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
           case 'getHistoricalRecord'   :  {   const histRec = await manageData.getHistoricalRecord( dataModel,recordID );
                                                     return histRec;
                                           }
          case 'getHistoricalRecords'   :  {   const histRecs = await manageData.getHistoricalRecords( dataModel, criterea );
                                               return histRecs;
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


module.exports.manageLedger            = manageLedger;