/* File             : zndMngledgerAccountCategory.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}         = require( '../services/generic' );
const { headless	}                     = require( '../services/generic' );
const zndBookKeepersLedgers             = require( '../models/zndBookKeepersLedgers' );
const zndBookKeepersLedgersHist         = require( '../models/zndBookKeepersLedgersHist' );



async function duplicateRecord ( record )
{   try
	  {   let response, result, localRec;


	      logger.trace( applicationName + ':zndMngBookKeepersLedger:duplicateRecord:Started.' );
	      logger.debug( applicationName + ':zndMngBookKeepersLedger:duplicateRecord:Duplicating record with ID:[' + record._id + '].' );

	      result                          = {};
	      response                        = await zndBookKeepersLedgers.findById( record._id );
	      delete response._doc._id;
	      delete response._doc.transferredAccountant;
        response._doc.editState         = 'on';
        response.action                 = 'create';
        result                          = await createRecord( response._doc ) ;

	      logger.debug( applicationName + ':zndMngBookKeepersLedger:duplicateRecord:Result:', result );
	      logger.trace( applicationName + ':zndMngBookKeepersLedger:duplicateRecord:Done.' );

	      return                           result;
	  }
    catch ( ex )
    {   logger.exception( applicationName + ':zndMngBookKeepersLedger:duplicateRecord:An Exception occurred [' + ex + '].' );
    }
}


async function deleteRecord ( record )
{   try
	  {   let response, result;

	      logger.trace( applicationName + ':zndMngBookKeepersLedger:deleteRecord:Started.' );
	      logger.debug( applicationName + ':zndMngBookKeepersLedger:deleteRecord:deleting record with ID:[' + record._id + '].' );

	      record.recordStatus             = 'Deleted';
	      result                          = await createHistoricalRecord( record );
	      response                        = await zndBookKeepersLedgers.findByIdAndDelete( record._id );
	      logger.debug( applicationName + ':zndMngBookKeepersLedger:deleteRecord:Result:', response );
	      logger.trace( applicationName + ':zndMngBookKeepersLedger:deleteRecord:Done.' );
	      return result;
	  }
    catch ( ex )
    {   logger.exception( applicationName + ':zndMngBookKeepersLedger:deleteRecord:An Exception occurred [' + ex + '].' );
    }
}

async function  updateRecord ( record )
{   try
	  {   let response, result, responseRecord, tempRec;

	      logger.trace( applicationName + ':zndMngBookKeepersLedger:updateRecord:Started.' );
	      logger.debug( applicationName + ':zndMngBookKeepersLedger:updateRecord:updating record with ID:[' + record._id + '].' );

        responseRecord                  = {};
        result                          = {};
        response                        = {};
        tempRec                         = {};

        tempRec                         = {...record};

			  tempRec.__v                     = Number( record.__v ) + 1;


			  response                        = await zndBookKeepersLedgers.findByIdAndUpdate( record._id,{ ...tempRec} , {useFindAndModify:false, new: true} );

			  responseRecord.createRec        = response._doc;

			  result                          = await createHistoricalRecord( { ...response._doc} );

			  responseRecord.histRec          = result._doc;

	      logger.trace( applicationName + ':zndMngBookKeepersLedger:updateRecord:Done.' );

	      return responseRecord;
	  }
    catch ( ex )
    {   logger.exception( applicationName + ':zndMngBookKeepersLedger:updateRecord:An Exception occurred [' + ex + '].' );
    }
}

async function createHistoricalRecord ( record )
{   try
	  {   let hist, now, result ;

	      logger.trace( applicationName + ':zndMngBookKeepersLedger:createHistoricalRecord:Started.' );
	      logger.debug( applicationName + ':zndMngBookKeepersLedger:createHistoricalRecord:recording historical record with ID:[' + record._id + '].' );

	      hist                            = { ...record };
			  hist.storedVersion              = parseInt( record.__v );

			  now                             = new Date();
			  hist.recordTime                 = now.getTime();

			  hist.originalRecordID           = record._id;

			  if ( typeof hist.recordStatus === 'undefined' )
			  {   hist.recordStatus           = 'Active';
			  }
			  delete hist._id;

			  result                          = await zndBookKeepersLedgersHist.create( { ...hist } );

	      logger.trace( applicationName + ':zndMngBookKeepersLedger:createHistoricalRecord:Done.' );

	      return                           result;
	  }
    catch ( ex )
    {   logger.exception( applicationName + ':zndMngBookKeepersLedger:createHistoricalRecord:An Exception occurred [' + ex + '].' );
    }
}

async function createRecord ( record )
{   try
	  {   let response, result, hist, now, responseRecord;

	      logger.trace( applicationName + ':zndMngBookKeepersLedger:createRecord:Started.' );
	      logger.debug( applicationName + ':zndMngBookKeepersLedger:createRecord:Creating record.' );

	      response                        = {};
	      responseRecord                  = {};
	      delete record._id;

		    response                        = await zndBookKeepersLedgers.create( {...record} ) ;
		    responseRecord.createRec        = response._doc;
		    hist                            = { ...response._doc };
	      result                          = await createHistoricalRecord( hist );
	      responseRecord.histRec          = result._doc;


	      logger.trace( applicationName + ':zndMngBookKeepersLedger:createRecord:Done.' );

	      return                           responseRecord;
	  }
    catch ( ex )
    {
        logger.exception( applicationName + ':zndMngBookKeepersLedger:createRecord:An Exception occurred [' + ex + '].' );
    }
}

async function main ( req,res )
{   try
    {   let returnURN, listURN, result;

        logger.trace( applicationName + ':zndMngBookKeepersLedger:main:Started.' );

        returnURN                       = '/zndBookKeepersLedger/';
        listURN                         = '/zndBookKeepersLedgers';

        if ( typeof req.body.bkLedgerEditState === 'undefined' )
		    {   req.body.bkLedgerEditState         = 'off';
		    }

		     if ( ( typeof req.body.bkLedgerID  !== 'undefined' ) && ( typeof req.body.bkLedgerName  !== 'undefined' ) )
		    {   req.body.bkLedgerLabel        = req.body.bkLedgerID + '_' + req.body.bkLedgerName;
		        logger.debug( applicationName + ':zndMngBookKeepersLedger:main:req.body.bkLedgerLabel:[' + req.body.bkLedgerLabel + ']' );
		    }


		    switch ( String( req.body.bkLedgerActie ) )
	   	  {    case 'create'       :   result       = await createRecord( req.body ) ;
	   	  	                           if ( headless == false ) res.redirect( returnURN + result.createRec._id );
	   	  	                           break;

	   	  		 case 'duplicate'    :   result       = await duplicateRecord( req.body ) ;
	   	  		                         if ( headless == false ) res.redirect( returnURN + result.createRec._id );
	   	  	                           break;

	   	  	   case 'updateRecord' :   result       = await updateRecord( req.body );
	   	  	                           if ( headless == false ) res.redirect( returnURN + result.createRec._id );
	   	  	                           break;

	   	  	   case 'deleteRecord' :   result       = await deleteRecord( req.body );
	   	  	                           if ( headless == false ) res.redirect( listURN );
	   	  	                           break;

	   	  	   case 'cancel'       :   result       = {};
	   	  	                           if ( headless == false ) res.redirect( listURN );
	   	  	                           break;

	   	      default             :   logger.exception( applicationName + ':zndMngBookKeepersLedger:manageRequest:An error occured[Unknown Action]:[' + req.body.actie + '].' );
	   	  	                          res.redirect( listURN );
	   	  }
	   	  return result;
	   	  logger.trace( applicationName + ':zndMngBookKeepersLedger:main:Done' );
    }
    catch ( ex )
    {   logger.exception( applicationName + ':zndEmployees:main:An exception occured:[' + ex + '].' );
    }
}

module.exports.main                     = main;
