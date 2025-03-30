/* File             : zndMngPaymentCategories.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2021   
   Notes            : 
   Description      : 
*/

const {logger,applicationName}         = require( '../services/generic' );

const paymentCatagory = require('../models/paymentCatagories')
const companiesHist = require('../models/paymentCatagoriesHist')


async function duplicateRecord(record)
{   try
	  {   var response, result, localRec;


	      logger.trace(applicationName + ':zndMngPaymentCategories:duplicateRecord:Started.');
	      logger.debug(applicationName + ':zndMngPaymentCategories:duplicateRecord:Duplicating record with ID:[' + record._id + '].');

	      result                          = {};
	      response                        = await paymentCatagory.findById(record._id);
	      delete response._doc._id;
	      delete response._doc.transferredAccountant;
        response._doc.editState         = "on";
        response.action                 = "create"
        result                          = await createRecord(response._doc) ;

	      logger.debug(applicationName + ':zndMngPaymentCategories:duplicateRecord:Result:', result);
	      logger.trace(applicationName + ':zndMngPaymentCategories:duplicateRecord:Done.');
	      
	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngPaymentCategories:duplicateRecord:An Exception occurred [' + ex + '].');
    }
}



async function deleteRecord(record)
{   try
	  {   var response, result;
	      
	      logger.trace(applicationName + ':zndMngPaymentCategories:deleteRecord:Started.');
	      logger.debug(applicationName + ':zndMngPaymentCategories:deleteRecord:deleting record with ID:[' + record._id + '].');
	      
	      record.recordStatus             = "Deleted"  
	      result                          = await createHistoricalRecord(record); 
	      response                        = await paymentCatagory.findByIdAndDelete(record._id); 	      
	      logger.debug(applicationName + ':zndMngPaymentCategories:deleteRecord:Result:', response);
	      logger.trace(applicationName + ':zndMngPaymentCategories:deleteRecord:Done.');
	      return result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngPaymentCategories:deleteRecord:An Exception occurred [' + ex + '].');
    }      
}



async function  updateRecord(record)
{   try
	  {   var response, result, responseRecord, tempRec;

	      logger.trace(applicationName + ':zndMngPaymentCategories:updateRecord:Started.');
	      logger.debug(applicationName + ':zndMngPaymentCategories:updateRecord:updating record with ID:[' + record._id + '].');

        responseRecord                  = {};
        result                          = {};
        response                        = {};
        tempRec                         = {};

        tempRec                         = {...record}
          
			  tempRec.__v                     = Number(record.__v)+1;


			  response                        = await paymentCatagory.findByIdAndUpdate(record._id,{ ...tempRec} , {useFindAndModify:false, new: true});

			  responseRecord.createRec        = response._doc

			  result                          = await createHistoricalRecord({ ...response._doc});

			  responseRecord.histRec          = result._doc

	      logger.trace(applicationName + ':zndMngPaymentCategories:updateRecord:Done.');

	      return responseRecord;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngPaymentCategories:updateRecord:An Exception occurred [' + ex + '].');
    }
}



async function createHistoricalRecord(record)
{   try
	  {   var hist, now, result ;

	      logger.trace(applicationName + ':zndMngPaymentCategories:createHistoricalRecord:Started.');
	      logger.debug(applicationName + ':zndMngPaymentCategories:createHistoricalRecord:recording historical record with ID:[' + record._id + '].');

	      hist                            = { ...record };
			  hist.storedVersion              = parseInt(record.__v);

			  now                             = new Date()
			  hist.recordTime                 = now.getTime();

			  hist.originalRecordID           = record._id

			  if (typeof hist.recordStatus === 'undefined')
			  {   hist.recordStatus           = 'Active';
			  }
			  delete hist._id

			  result                          = await companiesHist.create({ ...hist });

	      logger.trace(applicationName + ':zndMngPaymentCategories:createHistoricalRecord:Done.');

	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngPaymentCategories:createHistoricalRecord:An Exception occurred [' + ex + '].');
    }
}



async function createRecord(record)
{   try
	  {   var response, result, hist, now, responseRecord;

	      logger.trace(applicationName + ':zndMngPaymentCategories:createRecord:Started.');
	      logger.debug(applicationName + ':zndMngPaymentCategories:createRecord:Creating record.');

	      response                        = {};    
	      responseRecord                  = {}
	      delete record._id;
		    
		    response                        = await paymentCatagory.create({...record}) ;        
		    responseRecord.createRec        = response._doc
		    hist                            = { ...response._doc };
	      result                          = await createHistoricalRecord(hist);
	      responseRecord.histRec          = result._doc


	      logger.trace(applicationName + ':zndMngPaymentCategories:createRecord:Done.');

	      return                           responseRecord;
	  }
    catch(ex)
    {    
        logger.exception(applicationName + ':zndMngPaymentCategories:createRecord:An Exception occurred [' + ex + '].');
    }
}



async function main(req,res)
{   try
    {   var returnURN, listURN, result;
      
        logger.trace(applicationName + ':zndMngPaymentCategories:main:Started.');
        
        returnURN                       = '/zndPaymentCategory/'; 
        listURN                         = '/zndPaymentCategories'; 
        
        if(typeof req.body.editState === 'undefined')
		    {   req.body.editState          = 'off'; 
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

	   	      default             :   logger.exception(applicationName + ':zndMngPaymentCategories:manageRequest:An error occured[Unknown Action]:[' + req.body.actie + '].')
	   	  	                          res.redirect(listURN)
	   	  }
	   	  return result;	   	  
	   	  logger.trace(applicationName + ':zndMngPaymentCategories:main:Done');
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