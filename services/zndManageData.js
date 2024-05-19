/* File             : zndManageData.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

/* ------------------     External Application Libraries      ----------------*/
const winston                           = require( 'winston' );
/* ------------------ End External Application Libraries      ----------------*/

/* --------------- External Application Libraries Initialization -------------*/
/* ----------- End External Application Libraries Initialization -------------*/

/* ------------------     Internal Application Libraries      ----------------*/
const config                            = require( '../services/configuration' );
/* ------------------ End Internal Application Libraries      ----------------*/

/* ------------------------------------- Controllers -------------------------*/
const zndManageStatements               = require( '../controllers/zndManageStatements' );
/* -------------------------------- End Controllers --------------------------*/

/* ------------------------------------- Services ----------------------------*/
const Logger                            = require( '../services/zndLoggerClass' );
/* -------------------------------- End Services -----------------------------*/

/* ------------------------------------- Models ------------------------------*/
const zanddLedger                       = require( '../models/zanddLedger.js' );
const zanddLedgerHist                   = require( '../models/zanddLedgerHist.js' );
/* -------------------------------- End Models -------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get( 'application:logFileName' );
const applicationName                   = config.get( 'application:applicationName' );
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization  -------------*/
const logger                            = new Logger( logFileName );
/* ----------- End Internal Application Libraries Initialization  -------------*/

/* ------------------------------------- Application Variables ----------------*/

/* ---------------------------------End Application Variables  ----------------*/

/* ------------------------------------- Functions   --------------------------*/
let dataSet, dataSetHist;

async function filloutPendingActions ()
{   try
    {   let i, retVal;

        logger.trace( applicationName + ':zndManageData:filloutPendingActions:Started' );

        resultSet                       =  dataSet;

        for ( i = 0; i < resultSet.length; i++ )
        {   if ( typeof resultSet[i].pendingActions === 'undefined' )
            {   resultSet[i].undefined  = '';
                retVal                  = await zanddLedger.findByIdAndUpdate( resultSet[i]._id,{ ...resultSet[i]} ,{useFindAndModify:false} );
            }
        }

        logger.trace( applicationName + ':zndManageData:filloutPendingActions:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:filloutPendingActions:An exception occured:[' + ex + '].' );
    }
}



async function copyBankandInvoiceDate ()
{   try
    {   let i, retVal, dateStr, resultDate;

        logger.trace( applicationName + ':zndManageData:copyBankandInvoiceDate:Started' );

        resultSet                                 = dataSet;

        for ( i = 0; i < resultSet.length; i++ )
        {   if ( !( typeof resultSet[i].invoiceDate === 'undefined' || typeof resultSet[i].bankDate === 'undefined' ) )
            {   dateStr                           = resultSet[i].invoiceDate;
                resultDate                        = new Date( Number( dateStr.substring( 6,10 ) ),Number( dateStr.substring( 3,5 ) ) - 1,Number( dateStr.substring( 0,2 ) ) );
                resultSet[i].invoiceDateEpoch     = resultDate.getTime();
                dateStr                           = resultSet[i].bankDate;
                resultDate                        = new Date( Number( dateStr.substring( 6,10 ) ),Number( dateStr.substring( 3,5 ) ) - 1,Number( dateStr.substring( 0,2 ) ) );
                resultSet[i].bankDateEpoch        = resultDate.getTime();
                retVal                            = await zanddLedger.findByIdAndUpdate( resultSet[i]._id,{ ...resultSet[i]} ,{useFindAndModify:false} );
            }
        }
        logger.trace( applicationName + ':zndManageData:copyBankandInvoiceDate:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:copyBankandInvoiceDate:An exception occured:[' + ex + '].' );
    }
}


async function numericifyFiat ()
{   try
    {   let   rs,i, updated = false, us, retVal;

        logger.trace( applicationName + ':zndManageData:numericifyFiat:Started' );

        rs                                 = dataSet;


        for ( i = 0; i < rs.length; i++ )
        {
            if ( typeof rs[i].grossAmountNR === 'undefined' )
            {
               rs[i].grossAmountNR = Number( rs[i].grossAmount.replace( ',','.' ) );
               retVal                            = await zanddLedger.findByIdAndUpdate( rs[i]._id,{ ...rs[i]} ,{useFindAndModify:false} );
            }

            if ( typeof rs[i].VATNR === 'undefined' )
            {
               rs[i].VATNR = Number( rs[i].VAT.replace( ',','.' ) );
               //retVal                            = await zanddLedger.findByIdAndUpdate(rs[i]._id,{ ...rs[i]} ,{useFindAndModify:false})
               //retVal                            = await zndManageStatements.createRecord(rs[i]);


               retVal                              = await zndManageStatements.updateRecord( rs[i] );

            }
        }
        logger.trace( applicationName + ':zndManageData:numericifyFiat:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:numericifyFiat:An exception occured:[' + ex + '].' );
    }
}

async function killNozems ()
{   try
    {   let i, retVal,  rs, response;

        logger.trace( applicationName + ':zndManageData:killNozems:Started' );

        rs                       = dataSet;

        for ( i = 0; i < rs.length; i++ )
        {  const keys  =    Object.keys( rs[i]._doc );
           if ( keys.length == 2 )
           {
             response                        = await zanddLedger.findByIdAndDelete( rs[i]._id );
           }
        }

        rs                       = dataSetHist;

        for ( i = 0; i < rs.length; i++ )
        {  const keys  =    Object.keys( rs[i]._doc );
           if ( keys.length < 7 )
           {
             response                        = await zanddLedgerHist.findByIdAndDelete( rs[i]._id );
           }
        }


        logger.trace( applicationName + ':zndManageData:killNozems:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:killNozems:An exception occured:[' + ex + '].' );
    }
}

async function cleanNotes ()
{   try
    {   let i, retVal;

        logger.trace( applicationName + ':zndManageData:cleanNotes:Started' );

        resultSet                       = dataSet;

        for ( i = 0; i < resultSet.length; i++ )
        {   if ( typeof resultSet[i].notes !== 'undefined' && resultSet[i].notes.includes( '--------' ) )
            {   resultSet[i].notes      = '';
                retVal                  = await zanddLedger.findByIdAndUpdate( resultSet[i]._id,{ ...resultSet[i]} ,{useFindAndModify:false} );

            }
        }
        logger.trace( applicationName + ':zndManageData:cleanNotes:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:cleanNotes:An exception occured:[' + ex + '].' );
    }
}



async function updateMovementOfBankToInvoice ()
{   try
    {   let i, retVal, rs, count;

        logger.trace( applicationName + ':zndManageData:updateMovementOfBankToInvoice:Started' );

        rs                              = dataSet;
        count                           = 0;


        for ( i = 0; i < rs.length; i++ )
        {   if ( typeof rs[i].movementSign === 'undefined' || rs[i].movementSign.length == 0 )
            {   count++;
                record                  = rs[i]._doc.bankRecord;
                const someObject          = JSON.parse( record );
                rs[i]._doc.movementSign =  String( someObject[0].movementSign );
                retVal                  = await zanddLedger.findByIdAndUpdate( rs[i]._id,{ ...rs[i]._doc} ,{useFindAndModify:false} );
            }
        }



        logger.trace( applicationName + ':zndManageData:updateMovementOfBankToInvoice:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:updateMovementOfBankToInvoice:An exception occured:[' + ex + '].' );
    }
}

async function checkMovementOfBankToInvoice ()
{   try
    {   let i, retVal, rs, count;

        logger.trace( applicationName + ':zndManageData:checkMovementOfBankToInvoice:Started' );

        rs                              = dataSet;
        count                           = 0;


        for ( i = 0; i < rs.length; i++ )
        {   if ( ( typeof  rs[i]._doc.bankRecord !== 'undefined' && rs[i]._doc.bankRecord.length > 0 ) && ( typeof rs[i].movementSign !== 'undefined' || rs[i].movementSign.length !== 0 ) )
            {   record                  = rs[i]._doc.bankRecord;
                const someObject          = JSON.parse( record );

                for ( let j = 0;j < someObject.length ; j++ )
                {  if ( typeof someObject[j].movementSign !== 'undefined' )
                   {
                       if ( Number( rs[i]._doc.movementSign ) !== Number( someObject[j].movementSign ) )
                       {   count++;
                       }
                       break;
                   }
                }

            }
        }
        logger.trace( applicationName + ':zndManageData:checkMovementOfBankToInvoice:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:checkMovementOfBankToInvoice:An exception occured:[' + ex + '].' );
    }
}


async function updateFileStatus ()
{   try
    {   let i, retVal, rs, count;

        logger.trace( applicationName + ':zndManageData:updateFileStatus:Started' );

        rs                              = dataSet;

        for ( i = 0; i < rs.length; i++ )
        {   zndManageStatements.setRecord( rs[i] );
            zndManageStatements.findRecord();
        }
        logger.trace( applicationName + ':zndManageData:updateFileStatus:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:updateFileStatus:An exception occured:[' + ex + '].' );
    }
}



async function updateDeclarationStatements ()
{   try
    {   let i, retVal, rs, count;

        logger.trace( applicationName + ':zndManageData:updateDeclarationStatements:Started' );

        rs                              = dataSet;

        for ( i = 0; i < rs.length; i++ )
        {   if ( typeof resultSet[i].declarationStatement === 'undefined' )
            {   resultSet[i].declarationStatement      = '---';
                retVal                  = await zanddLedger.findByIdAndUpdate( resultSet[i]._id,{ ...resultSet[i]} ,{useFindAndModify:false} );

            }


        }

        logger.trace( applicationName + ':zndManageData:updateDeclarationStatements:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:updateDeclarationStatements:An exception occured:[' + ex + '].' );
    }
}

/*
if record doesn't have a creattion date, add it from the historical tables
else skip.
Adding creation date from the historical tables is a one time operation.
based on the ID off the record, all the historical records are retrieved and ordered in time by record date, the first record record date of
the first date is takeen and updated as the creation date, after which the record is updated.

*/

async function getCreationDateFromHistoricaRecords ( recordID )
{   const histRecord                     =   await zanddLedgerHist.find( {originalRecordID:recordID} ).distinct( 'recordTime' );
    histRecord.sort( ( a,b ) => a - b );

    return histRecord[0];
}


async function updateCreationDate ()
{   try
    {   logger.trace( applicationName + ':zndManageData:updateCreationDate:Started' );
        dataSet.forEach( async element => {   if ( typeof element.creationDate === 'undefined' )
                                              {   element.creationDate  = await getCreationDateFromHistoricaRecords( element._id );
                                                  //console.log( element);
                                                  let retVal            = await zanddLedger.findByIdAndUpdate(element._id,{ ...element} ,{useFindAndModify:false});
                                             }
                                           } );

        dataSet                        =   await zanddLedger.find();
        logger.trace( applicationName + ':zndManageData:updateCreationDate:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:updateCreationDate:An exception occured:[' + ex + '].' );
    }
}


async function deleteCreationDate ()
{   try
    {   logger.trace( applicationName + ':zndManageData:deleteCreationDate:Started' );
        dataSet.forEach( async element => {
                                              if ( typeof element.creationDate !== 'undefined' )
                                              {   console.log( 'deleting :', element.creationDate );
                                                  const retVal            = await zanddLedger.findByIdAndUpdate( element._id,{$unset: {creationDate:''}}  ,{useFindAndModify:false} );

                                                  console.log( 'deleting :', retVal );
                                             }
                                           } );
        dataSet                        =   await zanddLedger.find();

        logger.trace( applicationName + ':zndManageData:deleteCreationDate:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:deleteCreationDate:An exception occured:[' + ex + '].' );
    }
}



async function removeLock ( recordID )
{   try
    {   let rs;

        logger.trace( applicationName + ':zndManageData:removeLock:Started' );

        rs                              = await zanddLedger.updateOne( { _id: recordID }, { $unset: { locked: 1 } } );

        logger.trace( applicationName + ':zndManageData:removeLock:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:removeLock:An exception occured:[' + ex + '].' );
    }
}



async function runDataAugmentation ()
{   try
    {    let results;

         logger.trace( applicationName + ':zndManageData:runDataAugmentation:Started' );

         results                        = await copyBankandInvoiceDate();
         results                        = await cleanNotes();
         results                        = await filloutPendingActions();
         results                        = await killNozems();
         //results                        = await checkMovementOfBankToInvoice();
         //results                        = await updateMovementOfBankToInvoice();
         results                        = await numericifyFiat();
         //results                        = await updateFileStatus();
         results                        = await updateDeclarationStatements();


         logger.trace( applicationName + ':zndManageData:runDataAugmentation:Done' );

    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:runDataAugmentation:An exception occured:[' + ex + '].' );
    }
}


async function init ()
{   try
    {   logger.trace( applicationName + ':zndManageData:init:Started' );
        dataSet                        =   await zanddLedger.find();
        dataSetHist                    =   await zanddLedgerHist.find();

        runDataAugmentation();
        logger.trace( applicationName + ':zndManageData:init:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndManageData:init:An exception occured:[' + ex + '].' );
    }
}
/* --------------------------------- End Functions   -------------------------*/

/* ----------------------------------External functions ----------------------*/
module.exports.init                     = init;
module.exports.runDataAugmentation      = runDataAugmentation;
module.exports.removeLock               = removeLock;
module.exports.updateCreationDate       = updateCreationDate;
module.exports.deleteCreationDate       = deleteCreationDate;

/* ----------------------------------End External functions ------------------*/

/* LOG:
*/
