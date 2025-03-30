/* File             : zndMngledgerAccountCategory.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/
const {logger,applicationName}         = require( '../services/generic' );

const ledgerAccount                     = require('../models/ledgerAccountCategoryName.js')
const ledgerAccountHist                 = require('../models/ledgerAccountNameCategoryHist.js')


async function duplicateRecord(record)
{   try
	  {   var response, result, localRec;


	      logger.trace(applicationName + ':zndMngledgerAccountCategory:duplicateRecord:Started.');
	      logger.debug(applicationName + ':zndMngledgerAccountCategory:duplicateRecord:Duplicating record with ID:[' + record._id + '].');

	      result                          = {};
	      response                        = await ledgerAccount.findById(record._id);
	      delete response._doc._id;
	      delete response._doc.transferredAccountant;
        response._doc.editState         = "on";
        response.action                 = "create"
        result                          = await createRecord(response._doc) ;

	      logger.debug(applicationName + ':zndMngledgerAccountCategory:duplicateRecord:Result:', result);
	      logger.trace(applicationName + ':zndMngledgerAccountCategory:duplicateRecord:Done.');
	      
	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngledgerAccountCategory:duplicateRecord:An Exception occurred [' + ex + '].');
    }
}


async function deleteRecord(record)
{   try
	  {   var response, result;
	      
	      logger.trace(applicationName + ':zndMngledgerAccountCategory:deleteRecord:Started.');
	      logger.debug(applicationName + ':zndMngledgerAccountCategory:deleteRecord:deleting record with ID:[' + record._id + '].');
	      
	      record.recordStatus             = "Deleted"  
	      result                          = await createHistoricalRecord(record); 
	      response                        = await ledgerAccount.findByIdAndDelete(record._id); 	      
	      logger.debug(applicationName + ':zndMngledgerAccountCategory:deleteRecord:Result:', response);
	      logger.trace(applicationName + ':zndMngledgerAccountCategory:deleteRecord:Done.');
	      return result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngledgerAccountCategory:deleteRecord:An Exception occurred [' + ex + '].');
    }      
}

async function  updateRecord(record)
{   try
	  {   var response, result, responseRecord, tempRec;

	      logger.trace(applicationName + ':zndMngledgerAccountCategory:updateRecord:Started.');
	      logger.debug(applicationName + ':zndMngledgerAccountCategory:updateRecord:updating record with ID:[' + record._id + '].');

        responseRecord                  = {};
        result                          = {};
        response                        = {};
        tempRec                         = {};

        tempRec                         = {...record}
          
			  tempRec.__v                     = Number(record.__v)+1;


			  response                        = await ledgerAccount.findByIdAndUpdate(record._id,{ ...tempRec} , {useFindAndModify:false, new: true});

			  responseRecord.createRec        = response._doc

			  result                          = await createHistoricalRecord({ ...response._doc});

			  responseRecord.histRec          = result._doc

	      logger.trace(applicationName + ':zndMngledgerAccountCategory:updateRecord:Done.');

	      return responseRecord;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngledgerAccountCategory:updateRecord:An Exception occurred [' + ex + '].');
    }
}

async function createHistoricalRecord(record)
{   try
	  {   var hist, now, result ;

	      logger.trace(applicationName + ':zndMngledgerAccountCategory:createHistoricalRecord:Started.');
	      logger.debug(applicationName + ':zndMngledgerAccountCategory:createHistoricalRecord:recording historical record with ID:[' + record._id + '].');

	      hist                            = { ...record };
			  hist.storedVersion              = parseInt(record.__v);

			  now                             = new Date()
			  hist.recordTime                 = now.getTime();

			  hist.originalRecordID           = record._id

			  if (typeof hist.recordStatus === 'undefined')
			  {   hist.recordStatus           = 'Active';
			  }
			  delete hist._id

			  result                          = await ledgerAccountHist.create({ ...hist });

	      logger.trace(applicationName + ':zndMngledgerAccountCategory:createHistoricalRecord:Done.');

	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngledgerAccountCategory:createHistoricalRecord:An Exception occurred [' + ex + '].');
    }
}

async function createRecord(record)
{   try
	  {   var response, result, hist, now, responseRecord;

	      logger.trace(applicationName + ':zndMngledgerAccountCategory:createRecord:Started.');
	      logger.debug(applicationName + ':zndMngledgerAccountCategory:createRecord:Creating record.');

	      response                        = {};    
	      responseRecord                  = {}
	      delete record._id;
		    
		    response                        = await ledgerAccount.create({...record}) ;        
		    responseRecord.createRec        = response._doc
		    hist                            = { ...response._doc };
	      result                          = await createHistoricalRecord(hist);
	      responseRecord.histRec          = result._doc


	      logger.trace(applicationName + ':zndMngledgerAccountCategory:createRecord:Done.');

	      return                           responseRecord;
	  }
    catch(ex)
    {    
        logger.exception(applicationName + ':zndMngledgerAccountCategory:createRecord:An Exception occurred [' + ex + '].');
    }
}

async function main(req,res)
{   try
    {   var returnURN, listURN, result;
      
        logger.trace(applicationName + ':zndMngledgerAccountCategory:main:Started.');
        
        returnURN                       = '/zndLedgerAccountCategory/'; 
        listURN                         = '/zndLedgerAccountCatagories'; 
        
        if(typeof req.body.editState === 'undefined')
		    {   req.body.editState          = 'off'; 
		    }
		    
		     if ( (typeof req.body.ledgerAccountNameID  !== 'undefined') && (typeof req.body.ledgerAccountName  !== 'undefined') ) 
		    {   req.body.ledgerLabel        = req.body.ledgerAccountNameID+'_' + req.body.ledgerAccountName;
		    }
		    
		    
		    switch(String(req.body.actie))
	   	  {    case "create"       :   result       = await createRecord(req.body) ;
	   	  	                           if (headless == false) res.redirect(returnURN + result.createRec._id)
	   	  	                           break;

	   	  		 case "duplicate"    :   result       = await duplicateRecord(req.body) ;
	   	  		                         if (headless == false) res.redirect(returnURN + result.createRec._id)
	   	  	                           break;

	   	  	   case "updateRecord" :   result       = await updateRecord(req.body);	   	  	                              
	   	  	                           if (headless == false) res.redirect(returnURN + result.createRec._id)
	   	  	                           break;

	   	  	   case "deleteRecord" :   result       = await deleteRecord(req.body);
	   	  	                           if (headless == false) res.redirect(listURN)
	   	  	                           break; 
	   	  	                           
	   	  	   case "cancel"       :   result       = {} 
	   	  	                           if (headless == false) res.redirect(listURN)
	   	  	                           break;

	   	      default             :   logger.exception(applicationName + ':zndMngledgerAccountCategory:manageRequest:An error occured[Unknown Action]:[' + req.body.actie + '].')
	   	  	                          res.redirect(listURN)
	   	  }
	   	  return result;	   	  
	   	  logger.trace(applicationName + ':zndMngledgerAccountCategory:main:Done');
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndEmployees:main:An exception occured:[' + ex + '].')
    }
}
/* --------------------------------- End Functions   -------------------------*/

/* ----------------------------------Module Initialization -------------------*/
/* ----------------------------------End Module Initialization ---------------*/

/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main
/* ----------------------------------End External functions ------------------*/


/* LOG:
*/




