/* File             : zndMngEmailAddress.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2021   
   Notes            : 
   Description      : 
*/

/* ------------------     External Application Libraries      ----------------*/
const winston                           = require('winston')
/* ------------------ End External Application Libraries      ----------------*/

/* --------------- External Application Libraries Initialization -------------*/
/* ----------- End External Application Libraries Initialization -------------*/

/* ------------------     Internal Application Libraries      ----------------*/
const config                            = require('../services/configuration')
/* ------------------ End Internal Application Libraries      ----------------*/

/* ------------------------------------- Controllers -------------------------*/
/* -------------------------------- End Controllers --------------------------*/

/* ------------------------------------- Services ----------------------------*/
const Logger                            = require('../services/zndLoggerClass')
/* -------------------------------- End Services -----------------------------*/

/* ------------------------------------- Models ------------------------------*/
const zndEmailAdress                       = require('../models/emailAdresses')
const zndEmailAdressHist                   = require('../models/emailAdressesHist')
/* -------------------------------- End Models -------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
const headless                          = config.get('application:headless')
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Variables Initialization -------------------------*/
const logger                            = new Logger(logFileName)
/* ----------- End Internal Variables Initialization -------------------------*/

/* ------------------------------------- Functions   -------------------------*/
async function duplicateRecord(record)
{   try
	  {   var response, result, localRec;


	      logger.trace(applicationName + ':zndMngEmailAddress:duplicateRecord:Started.');
	      logger.debug(applicationName + ':zndMngEmailAddress:duplicateRecord:Duplicating record with ID:[' + record._id + '].');

	      result                          = {};
	      response                        = await zndEmailAdress.findById(record._id);
	      delete response._doc._id;
	      delete response._doc.transferredAccountant;
        response._doc.editState         = "on";
        response.action                 = "create"
        result                          = await createRecord(response._doc) ;

	      logger.debug(applicationName + ':zndMngEmailAddress:duplicateRecord:Result:', result);
	      logger.trace(applicationName + ':zndMngEmailAddress:duplicateRecord:Done.');
	      
	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngEmailAddress:duplicateRecord:An Exception occurred [' + ex + '].');
    }
}



async function deleteRecord(record)
{   try
	  {   var response, result,temp;
	      
	      logger.trace(applicationName + ':zndMngEmailAddress:deleteRecord:Started.');
	      logger.debug(applicationName + ':zndMngEmailAddress:deleteRecord:deleting record with ID:[' + record._id + '].');
	      
	      record.recordStatus             = "Deleted"  
	      //result                          = await createHistoricalRecord(record); 
	      temp                            = await zndEmailAdress.findById(record._id);
	      temp._doc.actie                 = record.actie;
	      result                          = await createHistoricalRecord(temp._doc); 
	      
	      response                        = await zndEmailAdress.findByIdAndDelete(record._id); 	      
	      logger.debug(applicationName + ':zndMngEmailAddress:deleteRecord:Result:', response);
	      logger.trace(applicationName + ':zndMngEmailAddress:deleteRecord:Done.');
	      return result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngEmailAddress:deleteRecord:An Exception occurred [' + ex + '].');
    }      
}



async function  updateRecord(record)
{   try
	  {   var response, result, responseRecord, tempRec;

	      logger.trace(applicationName + ':zndMngEmailAddress:updateRecord:Started.');
	      logger.debug(applicationName + ':zndMngEmailAddress:updateRecord:updating record with ID:[' + record._id + '].');

        responseRecord                  = {};
        result                          = {};
        response                        = {};
        tempRec                         = {};

        tempRec                         = {...record}
          
			  tempRec.__v                     = Number(record.__v)+1;


			  response                        = await zndEmailAdress.findByIdAndUpdate(record._id,{ ...tempRec} , {useFindAndModify:false, new: true});

			  responseRecord.createRec        = response._doc

			  result                          = await createHistoricalRecord({ ...response._doc});

			  responseRecord.histRec          = result._doc

	      logger.trace(applicationName + ':zndMngEmailAddress:updateRecord:Done.');

	      return responseRecord;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngEmailAddress:updateRecord:An Exception occurred [' + ex + '].');
    }
}



async function createHistoricalRecord(record)
{   try
	  {   var hist, now, result ;

	      logger.trace(applicationName + ':zndMngEmailAddress:createHistoricalRecord:Started.');
	      logger.debug(applicationName + ':zndMngEmailAddress:createHistoricalRecord:recording historical record with ID:[' + record._id + '].');

	      hist                            = { ...record };
			  hist.storedVersion              = parseInt(record.__v);

			  now                             = new Date()
			  hist.recordTime                 = now.getTime();

			  hist.originalRecordID           = record._id

			  if (typeof hist.recordStatus === 'undefined')
			  {   hist.recordStatus           = 'Active';
			  }
			  delete hist._id

			  result                          = await zndEmailAdressHist.create({ ...hist });

	      logger.trace(applicationName + ':zndMngEmailAddress:createHistoricalRecord:Done.');

	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngEmailAddress:createHistoricalRecord:An Exception occurred [' + ex + '].');
    }
}



async function createRecord(record)
{   try
	  {   var response, result, hist, now, responseRecord;

	      logger.trace(applicationName + ':zndMngEmailAddress:createRecord:Started.');
	      logger.debug(applicationName + ':zndMngEmailAddress:createRecord:Creating record.');

	      response                        = {};    
	      responseRecord                  = {}
	      delete record._id;
		    
		    response                        = await zndEmailAdress.create({...record}) ;        
		    responseRecord.createRec        = response._doc
		    hist                            = { ...response._doc };
	      result                          = await createHistoricalRecord(hist);
	      responseRecord.histRec          = result._doc


	      logger.trace(applicationName + ':zndMngEmailAddress:createRecord:Done.');

	      return                           responseRecord;
	  }
    catch(ex)
    {    
        logger.exception(applicationName + ':zndMngEmailAddress:createRecord:An Exception occurred [' + ex + '].');
    }
}



async function main(req,res)
{   try
    {   var returnURN, listURN, result;
      
        logger.trace(applicationName + ':zndMngEmailAddress:main:Started.');
        
        returnURN                       = '/zndEmailAddress/'; 
        listURN                         = '/zndEmailAddresses'; 
        
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

	   	      default             :   logger.exception(applicationName + ':zndMngEmailAddress:manageRequest:An error occured[Unknown Action]:[' + req.body.actie + '].')
	   	  	                          res.redirect(listURN)
	   	  }
	   	  return result;	   	  
	   	  logger.trace(applicationName + ':zndMngEmailAddress:main:Done');
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