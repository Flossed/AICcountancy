/* File             : manageDataModel.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2023-2025
   Description      : generic library for handling actions on storing data in
                      database. Containing CRUD functions for the data.
                      using the library consistently allows for management of
                      changes of data in the database in a consistent way, and
                      allows for building up a historical record on any changes
                      done on a record in a database. Offered fucntions are:
                      createRecord, createHistoricalRecord, deleteRecord,
                      duplicateRecord, getRecord, getRecords, init, updateRecord,
                      validateRecord.
   Notes            : Consistent error handling needs to be added. //23020508
*/


const errorCatalog                      = require( '../services/errorCatalog' );
const {logger,applicationName}         = require( '../services/generic' );


const zndBookkeepingYears                   = require( '../models/zndBookkeepingYears' );
const zndBookkeepingYearsHist               = require( '../models/zndBookkeepingYearHist' );
const zndLedger                             = require( '../models/zanddLedger' );
const zndLedgerHist                         = require( '../models/zanddLedgerHist' );
const checkBooks                            = require( '../models/checkBooks' );
const checkBooksHist                        = require( '../models/checkBooksHist' );
const zndBookKeepersLedgers                 = require( '../models/zndBookKeepersLedgers' );
const zndBookKeepersLedgersHist             = require( '../models/zndBookKeepersLedgersHist' ); 


function getModel ( model )
{   try
    {   logger.trace( applicationName + ':manageDataModel:getModel:Started ' );
        let result                      = { ...errorCatalog.noError };
        switch ( model )
        {   case 'bookkeepingYear'      : result.body          = { zndBookkeepingYears, zndBookkeepingYearsHist };
                                          return result;
            case 'bookKeepersLedgers'   : result.body          = { zndBookKeepersLedgers, zndBookKeepersLedgersHist };
                                          return result;
            case 'zanddLedger'          : result.body          = { zndLedger, zndLedgerHist };
                                          return result;
            case 'checkBook'            : result.body          = { checkBooks, checkBooksHist };
                                          return result;
            default                     : result               = { ...errorCatalog.badResult };
                                          result.body.extendedMessage = applicationName + ':manageDataModel:getModel:Unknown Model requested:[' + model + ']';
                                          logger.error( result.body.extendedMessage );
                                          return result;
        }
    }
    catch ( ex )
    {   const result                      = { ...errorCatalog.exception };
        result.body.extendedMessage = applicationName + ':manageDataModel:getModel:An exception occurred: [' + ex + '].';
        logger.exception( result.body.extendedMessage );
        return result;
    }
}




async function createRecord ( model,dbRecord )
{   try
    {   const  responseRecord           = {};

        logger.trace( applicationName + ':manageDataModel:createRecord:Started ' );

        const result                   = { ...errorCatalog.noError };
        const response                  = await getModel( model );

        if ( response.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:createRecord:Technical error:' + response.returnMsg );
             logger.error( applicationName + ':manageDataModel:createRecord:Technical error:Extended Message:' + response.body.extendedMessage );
            logger.trace( applicationName + ':manageDataModel:createRecord:Done!' );
            return response;
        }

        const dbModel                   = response.body;

        const  record                   =  new dbModel[Object.keys( dbModel )[0]]( { ...dbRecord } )  ;

        delete record._id;
        logger.debug( applicationName + ':manageDataModel:createRecord:Creating record.', record._doc );

        const retVal                  = await dbModel[Object.keys( dbModel )[0]].create( { ...record._doc } );
        responseRecord.createRec        = retVal._doc;
        const hist                      = { ...retVal._doc };
        const histResponse              = await createHistoricalRecord( dbModel[Object.keys( dbModel )[1]], hist );

        if ( histResponse.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:createRecord:Technical error:' + histResponse.returnMsg );
            logger.trace( applicationName + ':manageDataModel:createRecord:Done!' );
            return histResponse;
        }

        responseRecord.histRec          = histResponse.body;
        result.body                     = responseRecord;
        logger.trace( applicationName + ':manageDataModel:createRecord:Done!' );
        return result;
    }
    catch ( ex )
    {   const result                      = { ...errorCatalog.exception };
        result.body.extendedMessage = applicationName + ':manageDataModel:createRecord:An exception occurred: [' + ex + '].';
        logger.exception( result.body.extendedMessage );
        logger.trace( applicationName + ':manageDataModel:createRecord:Done!' );
        return result;
    }
}


async function createHistoricalRecord ( model, record )
{   try
    {   logger.trace( applicationName + ':manageDataModel:createHistoricalRecord:Started.' );
        logger.debug( applicationName + ':manageDataModel:createHistoricalRecord:recording historical record with ID:[' + record._id + '].' );
        const hist                      = { ...record };

        hist.storedVersion              = parseInt( record.__v );
        const now                       = new Date();
        hist.recordTime                 = now.getTime();
        hist.originalRecordID           = record._id;
        if ( typeof hist.recordStatus === 'undefined' )
        {   hist.recordStatus           = 'Active';
        }
        delete hist._id;
        const dbcreateReponse           = await model.create( { ...hist } );
        const result                      = { ...errorCatalog.noError };
        result.body                     = dbcreateReponse;
        logger.trace( applicationName + ':manageDataModel:createHistoricalRecord:Done.' );
        return result;
   }
   catch ( ex )
   {   const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:createHistoricalRecord:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:createHistoricalRecord:Done!' );
       return result;
   }
}


async function deleteRecord ( model, record )
{   try
    {   logger.trace( applicationName + ':manageDataModel:deleteRecord:Started.' );

        const result                      = { ...errorCatalog.noError };
        const dbModel                   = getModel( model );

        if ( dbModel.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:deleteRecord:Technical error: Model not found.' );
            return dbModel;
        }

        logger.debug( applicationName + ':manageDataModel:deleteRecord:deleting record with ID:[' + record._id + '].' );

        record.recordStatus             = 'Deleted';
        const histRecResponse           = await createHistoricalRecord( dbModel.body[Object.keys( dbModel.body )[1]], record );

        if ( histRecResponse.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:deleteRecord:Technical error:' + histRecResponse.returnMsg );
            logger.trace( applicationName + ':manageDataModel:deleteRecord:Done.' );
            return histRecResponse;
        }

        const response                  = await dbModel.body[Object.keys( dbModel.body )[0]].findByIdAndDelete( record._id );
        result.body                     = response;
        logger.debug( applicationName + ':manageDataModel:deleteRecord:Result:', response );
        logger.trace( applicationName + ':manageDataModel:deleteRecord:Done.' );
        return result;
    }
    catch ( ex )
    {  const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:deleteRecord:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:deleteRecord:Done!' );
       return result;
    }
}


async function duplicateRecord (  model, record )
{   try
    {   let localRec;

        logger.trace( applicationName + ':manageDataModel:duplicateRecord:Started.' );

        logger.debug( applicationName + ':manageDataModel:duplicateRecord:Duplicating record with ID:[' + record._id + '].' );
        localRec                        = {};
        localRec                        = { ...record };
        delete localRec._id;
        const result                    = await createRecord( model, localRec );
        logger.debug( applicationName + ':manageDataModel:duplicateRecord:Result:', result );
        logger.trace( applicationName + ':manageDataModel:duplicateRecord:Done.' );
        return result;
   }
   catch ( ex )
   {   const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:duplicateRecord:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:duplicateRecord:Done!' );
       return result;
   }
}


async function getRecord ( model, recordID )
{   try
    {   logger.trace( applicationName + ':manageDataModel:getRecord:Started ' );

        const dbModel                   = getModel( model );
        let result                      = { ...errorCatalog.noError };

        if ( dbModel.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:getRecord:Technical error: Model not found.' );
            return dbModel;
        }

        const response                  = await dbModel.body[Object.keys( dbModel.body )[0]].find( { _id: recordID } );

        if ( response.length ===  0 )
        {   result                      = { ...errorCatalog.badResult };
            result.body.extendedMessage = applicationName + ':manageDataModel:getModel:no data found for recordID:[' + recordID + ']';
            logger.error( result.body.extendedMessage );
            return result;
        }
        result.body                     = response[0];
        logger.trace( applicationName + ':manageDataModel:getRecord:Done.' );
        return result;
   }
   catch ( ex )
   {   const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:getRecord:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:getRecord:Done!' );
       return result;
   }
}

async function getHistoricalRecord ( model, recordID )
{   try
    {   logger.trace( applicationName + ':manageDataModel:getHistoricalRecord:Started ' );

        const dbModel                   = getModel( model );
        let result                      = { ...errorCatalog.noError };

        if ( dbModel.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:getHistoricalRecord:Technical error: Model not found.' );
            return dbModel;
        }

        const response                  = await dbModel.body[Object.keys( dbModel.body )[1]].find( { _id: recordID } );

        if ( response.length ===  0 )
        {   result                      = { ...errorCatalog.badResult };
            result.body.extendedMessage = applicationName + ':manageDataModel:getHistoricalRecord:no data found for recordID:[' + recordID + ']';
            logger.error( result.body.extendedMessage );
            return result;
        }
        result.body                     = response[0];
        logger.trace( applicationName + ':manageDataModel:getHistoricalRecord:Done.' );
        return result;
   }
   catch ( ex )
   {   const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:getHistoricalRecord:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:getHistoricalRecord:Done!' );
       return result;
   }
}
/*  restore Record
    This function restores a record from the historical record.
    The function takes the model and the historical record ID as input.
    The function will find the historical record and create a new record in the active records zanddLedger collection.
    The function will then update the historical record to reflect the restore action. Abd change the state of the historical record to 'RESTORED'
    and add the new record ID to the historical record. which will then be obsolete. as the new historical record will be created with a new ID.
    The function will return the new record created in the active records zanddLedger collection.
    ---------------------
    Errors:
    ---------------------
    The function will return an error if the model is not found.
    The function will return an error if the  historical record ID is not provided.
    The function will return an error if the historical record is not found.
    The function will return an error if the new record cannot be created.
    The function will return an error if the historical record cannot be updated.
    The function will return an error if the new historical record cannot be created.
*/
async function restoreRecord ( model, histRecordID )
{   try
    {   logger.trace( applicationName + ':manageDataModel:restoreRecord:Started.' );

        const result                      = { ...errorCatalog.noError };
        const dbModel                   = getModel( model );

        if ( dbModel.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:restoreRecord:Technical error: Model not found.' );
            return dbModel;
        }
        if ( typeof histRecordID === 'undefined' || histRecordID.length === 0 )
        {   const errorResult               = { ...errorCatalog.badRequest };
            errorResult.body.extendedMessage = applicationName + ':manageDataModel:restoreRecord:No historical record ID provided.';
            logger.error( applicationName + errorResult.body.extendedMessage );
             return errorResult;
        }

        const histRecord                  = await dbModel.body[Object.keys( dbModel.body )[1]].findById( histRecordID );

        if ( histRecord == null )
        {   const errorResult               = { ...errorCatalog.badRequest };
            errorResult.body.extendedMessage = applicationName + ':manageDataModel:restoreRecord:No historical record ID found!.';
            logger.error( applicationName + errorResult.body.extendedMessage );
            return errorResult;
        }

        const dataRecord                  = { ... histRecord._doc };
        delete dataRecord._id;
        delete dataRecord.__v;
        delete dataRecord.recordTime;
        delete dataRecord.storedVersion;
        delete dataRecord.originalRecordID;
        delete dataRecord.recordStatus;

        const newRecord                   = await createRecord( model, dataRecord );
        if ( newRecord.returnCode !== 0 )
        {   const errorResult               = { ...errorCatalog.badRequest };
            errorResult.body.extendedMessage = applicationName + ':manageDataModel:restoreRecord:Could not create a new Record.';
            logger.error( applicationName + errorResult.body.extendedMessage );
            return errorResult;
         }

        const tempRec                  = { ... histRecord._doc };
        tempRec.__v                    = parseInt( tempRec.__v ) + 1;
        const now                      = new Date();
        tempRec.recordTime             = now.getTime();
        tempRec.restoredRecordID       = newRecord.body.createRec._id;
        tempRec.recordStatus           = 'RESTORED';

        const histRec                     = await dbModel.body[Object.keys( dbModel.body )[1]].findByIdAndUpdate( histRecordID, { ...tempRec }, { useFindAndModify: false, new: true } );

        result.body                     = newRecord.body;
        return result;
    }
    catch ( ex )
    {  const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:restoreRecord:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:restoreRecord:Done!' );
       return result;
    }

}
async function checkRecord ( model, criterea )
{   try
    {   logger.trace( applicationName + ':manageDataModel:checkRecord:Started ' );

        const dbModel                   = getModel( model );


        if ( dbModel.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:checkRecord:Technical error: Model not found.' );
            return dbModel;
        }

        const response                  = await dbModel.body[Object.keys( dbModel.body )[0]].find( criterea );

        if ( response.length ===  0 )
        {   //logger.debug( applicationName + ':manageDataModel:checkRecord:No record found matcing Criterea', criterea );
            return false;
        }
        //logger.debug( applicationName + ':manageDataModel:checkRecord: Record found matcing Criterea', criterea );
        logger.trace( applicationName + ':manageDataModel:checkRecord:Done.' );
        return true;
   }
   catch ( ex )
   {   const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:checkRecord:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:checkRecord:Done!' );
       return result;
   }
}

async function getRecords ( model )
{   try
    {   let response;

        logger.trace( applicationName + ':manageDataModel:getRecords:Started ' );
        const result                      = { ...errorCatalog.noError };

        const dbModel                   = getModel( model );
        if ( dbModel.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:getRecords:Technical error: Model not found.' );
            return dbModel;
        }

        //console.log( dbModel.body[Object.keys( dbModel.body )[0]] );

        response                        = [];
        response                        = await dbModel.body[Object.keys( dbModel.body )[0]].find();
        //console.log( response );
        result.body                     = response;
        logger.trace( applicationName + ':manageDataModel:getRecords:Done.' );
        return result;
   }
   catch ( ex )
   {   const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:getRecords:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:getRecords:Done!' );
       return result;
   }
}

async function getHistoricalRecords ( model, criterea )
{   try
    {   let response;

        logger.trace( applicationName + ':manageDataModel:getHistoricalRecords:Started ' );
        const result                      = { ...errorCatalog.noError };

        const dbModel                   = getModel( model );

        if ( dbModel.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:getHistoricalRecords:Technical error: Model not found.' );
            return dbModel;
        }



        response                        = [];
        console.log( dbModel.body[Object.keys( dbModel.body )[1]] );
        console.log( 'Whooop Whoop: ',criterea );
        response                        = await dbModel.body[Object.keys( dbModel.body )[1]].find( criterea );

        result.body                     = response;
        logger.trace( applicationName + ':manageDataModel:getHistoricalRecords:Done.' );
        return result;
   }
   catch ( ex )
   {   const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:getHistoricalRecords:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:getHistoricalRecords:Done!' );
       return result;
   }
}

async function init ()
{   try
    {   const result                      = { ...errorCatalog.noError };
        logger.trace( applicationName + ':manageDataModel:init:Starting' );
        logger.trace( applicationName + ':manageDataModel:init:Done' );
        return result;
    }
    catch ( ex )
    {  const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':init:getRecords:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:init:Done!' );
       return result;
    }
}


async function  updateRecord ( model, record )
{   try
    {   let response;

        logger.trace( applicationName + ':manageDataModel:updateRecord:Started.' );

        const result                      = { ...errorCatalog.noError };

        const dbModel                     = getModel( model );
        if ( dbModel.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:updateRecord:Technical error: Model not found.' );
            return dbModel;
        }

        logger.debug( applicationName + ':manageDataModel:updateRecord:updateRecord record with ID:[' + record._id + '].' );

        response                          = {};
        const responseRecord              = {};
        const tempRec                     = { ...record };
        tempRec.__v                       = parseInt( record.__v ) + 1;
        response                          = await dbModel.body[Object.keys( dbModel.body )[0]].findByIdAndUpdate( record._id, { ...tempRec }, { useFindAndModify: false, new: true } );
        responseRecord.createRec          = response._doc;

        const histRec                     = await createHistoricalRecord( dbModel.body[Object.keys( dbModel.body )[1]], { ...response._doc } );

        if ( histRec.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:updateRecord:Technical error:' + histRec.returnMsg );
            logger.trace( applicationName + ':manageDataModel:updateRecord:Done!' );
            return histRec;
        }

        logger.trace( applicationName + ':manageDataModel:updateRecord:Done.' );
        responseRecord.histRec            = histRec._doc;
        result.body                       = responseRecord;
        return result;
    }
    catch ( ex )
    {  const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:updateRecord:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:updateRecord:Done!' );
       return result;
    }
}


async function validateRecord ( model, dbRecord )
{   try
    {   logger.trace( applicationName + ':manageDataModel:validateRecord:Started ' );
        let result                      = { ...errorCatalog.noError };

        const dbModel                     = getModel( model );
        if ( dbModel.returnCode !== errorCatalog.NO_ERROR )
        {   logger.error( applicationName + ':manageDataModel:validateRecord:Technical error: Model not found.' );
            return dbModel;
        }

        const  record                   =  new dbModel.body[Object.keys( dbModel.body )[0]]( { ...dbRecord } )  ;

        logger.debug( applicationName + ':manageDataModel:validateRecord:Validating record.' );
        const errors                      = record.validateSync();
        const errorList = [];
        if ( errors !== undefined )
        {   result                      = { ...errorCatalog.badResult };
            Object.values( errors.errors ).forEach( ( error ) => { errorList.push( error.properties ); } ) ;
            logger.error( applicationName + ':manageDataModel:validateRecord:Validation errors occurred',errorList );
        }
        result.body                     = errorList;
        logger.trace( applicationName + ':manageDataModel:validateRecord:Done!' );
        return                           result;
   }
   catch ( ex )
   {   const result                      = { ...errorCatalog.exception };
       result.body.extendedMessage = applicationName + ':manageDataModel:validateRecord:An exception occurred: [' + ex + '].';
       logger.exception( result.body.extendedMessage );
       logger.trace( applicationName + ':manageDataModel:validateRecord:Done!' );
       return result;
   }
}


module.exports.createRecord             = createRecord;
module.exports.createHistoricalRecord   = createHistoricalRecord;
module.exports.deleteRecord             = deleteRecord;
module.exports.duplicateRecord          = duplicateRecord;
module.exports.getRecord                = getRecord;
module.exports.getRecords               = getRecords;
module.exports.init                     = init;
module.exports.updateRecord             = updateRecord;
module.exports.validateRecord           = validateRecord;
module.exports.checkRecord              = checkRecord;
module.exports.getHistoricalRecords     = getHistoricalRecords;
module.exports.getHistoricalRecord      = getHistoricalRecord;
module.exports.restoreRecord            = restoreRecord;
