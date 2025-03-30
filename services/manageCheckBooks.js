/* File             : manageBookkeepingYears.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      : Library to manage the Bookkeeping Years
   Notes            :
*/


const {logger,applicationName}         = require( '../services/generic' );
const manageData                        = require( './manageDataModel' );


async function manageCheckBooks ( dataRecord,recordID )
{   try
    {   logger.trace( applicationName + ':manageCheckBooks:():Started' );
        const dataModel                =  'checkBook';

        switch ( dataRecord.action )
        {  case 'getData'               :  {   const allRecords  =  await manageData.getRecords( dataModel );
                                               return allRecords;
                                           }
           case 'getRecordData'         :  {   const recordData = await manageData.getRecord( dataModel,recordID );
                                               logger.trace( applicationName + ':manageCheckBooks:():Done' );
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
           default                      :  logger.error( applicationName + ':manageCheckBooks:Unknown action : [' + dataRecord.action + '];' ) ;
                                           break;
        }
        logger.trace( applicationName + ':manageCheckBooks:():Done' );
        return ;
    }
    catch ( ex )
    {   logger.exception( applicationName + ':manageCheckBooks:():An exception occurred :[' + ex + '].' );
    }

}


module.exports.manageCheckBooks        = manageCheckBooks;