/* File             : manageLedger.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      : Library to manage the Ledger
   Notes            :
*/

const {logger,applicationName}         = require( '../services/generic' );
const manageData                        = require( './manageDataModel' );



async function manageLedgerHist ( dataRecord,recordID )
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
           case 'getHistoricalRecords'  :  {   const histRecs = await manageData.getHistoricalRecords( dataModel,dataRecord );
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

module.exports.manageLedgerHist            = manageLedgerHist;

