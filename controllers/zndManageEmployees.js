/* File             : zndManageEmployees.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

/* ------------------     External Application Libraries      ----------------*/
const winston                           = require('winston')
const fileUpload                        = require('express-fileupload')
const path                              = require('path');
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
const zanddEmployees                = require('../models/zanddEmployees')
const zanddEmployeesHist            = require('../models/zanddEmployeesHist')
/* -------------------------------- End Models -------------------------------*/



/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
const headless                          = config.get('application:headless')
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
const logger                            = new Logger(logFileName)
const NO_DOC_ERROR                      = 0x01
const NO_EMPLOYEE_ERROR                 = 0x01
const NO_ERROR                          = 0x00
/* ----------- End Internal Application Libraries Initialization -------------*/

/* ------------------------------------- Functions   -------------------------*/
async function deleteRecord(record)
{   try
	  {   var response, result;
	      
	      logger.trace(applicationName + ':zndManageEmployees:deleteRecord:Started.');
	      logger.debug(applicationName + ':zndManageEmployees:deleteRecord:deleting record with ID:[' + record._id + '].');
	      
	      record.recordStatus             = "Deleted"  
	      result                          = await createHistoricalRecord(record); 
	      response                        = await zanddEmployees.findByIdAndDelete(record._id); 	      
	      logger.debug(applicationName + ':zndManageEmployees:deleteRecord:Result:', response);
	      logger.trace(applicationName + ':zndManageEmployees:deleteRecord:Done.');
	      return result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageEmployees:deleteRecord:An Exception occurred [' + ex + '].');
    }      
}


async function getRecord(recordID)
{   try
	  {   var response, result, localRec;

	      logger.trace(applicationName + ':zndManageEmployees:getRecord:Started.');
	      logger.debug(applicationName + ':zndManageEmployees:getRecord:getting record with ID:[' + recordID + '].');

        response                        = await zanddEmployees.findById(recordID ) ;


	      logger.debug(applicationName + ':zndManageEmployees:getRecord:Result:', response);
	      logger.trace(applicationName + ':zndManageEmployees:getRecord:Done.');

	      return                           response;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageEmployees:getRecord:An Exception occurred [' + ex + '].');
    }
}



async function  updateRecord(record)
{   try
	  {   var response, result, responseRecord, tempRec;

	      logger.trace(applicationName + ':zndManageEmployees:updateRecord:Started.');
	      logger.debug(applicationName + ':zndManageEmployees:updateRecord:updating record with ID:[' + record._id + '].');

        responseRecord                  = {};
        result                          = {};
        response                        = {};
        tempRec                         = {};

        tempRec                         = {...record}

			  tempRec.__v                     = Number(record.__v)+1;


			  response                        = await zanddEmployees.findByIdAndUpdate(record._id,{ ...tempRec} , {useFindAndModify:false, new: true});

			  responseRecord.createRec        = response._doc

			  result                          = await createHistoricalRecord({ ...response._doc});

			  responseRecord.histRec          = result._doc

	      logger.trace(applicationName + ':zndManageEmployees:updateRecord:Done.');

	      return responseRecord;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageEmployees:updateRecord:An Exception occurred [' + ex + '].');
    }
}



async function duplicateRecord(record)
{   try
	  {   var response, result, localRec;


	      logger.trace(applicationName + ':zndManageEmployees:duplicateRecord:Started.');
	      logger.debug(applicationName + ':zndManageEmployees:duplicateRecord:Duplicating record with ID:[' + record._id + '].');

	      result                          = {};
	      response                        = await zanddEmployees.findById(record._id);
	      delete response._doc._id;
	      delete response._doc.transferredAccountant;
        response._doc.editState         = "on";
        response.action                 = "create"
        result                          = await createRecord(response._doc) ;

	      logger.debug(applicationName + ':zndManageEmployees:duplicateRecord:Result:', result);
	      logger.trace(applicationName + ':zndManageEmployees:duplicateRecord:Done.');
	      
	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageEmployees:duplicateRecord:An Exception occurred [' + ex + '].');
    }
}



async function createHistoricalRecord(record)
{   try
	  {   var hist, now, result ;

	      logger.trace(applicationName + ':zndManageEmployees:createHistoricalRecord:Started.');
	      logger.debug(applicationName + ':zndManageEmployees:createHistoricalRecord:recording historical record with ID:[' + record._id + '].');

	      hist                            = { ...record };
			  hist.storedVersion              = parseInt(record.__v);

			  now                             = new Date()
			  hist.recordTime                 = now.getTime();

			  hist.originalRecordID           = record._id

			  if (typeof hist.recordStatus === 'undefined')
			  {   hist.recordStatus           = 'Active';
			  }
			  delete hist._id

			  result                          = await zanddEmployeesHist.create({ ...hist });

	      logger.trace(applicationName + ':zndManageEmployees:createHistoricalRecord:Done.');

	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageEmployees:createHistoricalRecord:An Exception occurred [' + ex + '].');
    }
}



async function createRecord(record)
{   try
	  {   var response, result, hist, now, responseRecord;

	      logger.trace(applicationName + ':zndManageEmployees:createRecord:Started.');
	      logger.debug(applicationName + ':zndManageEmployees:createRecord:Creating record.');

	      responseRecord                  = {}
	      delete record._id;

		    response                        = await zanddEmployees.create({...record}) ;

		    responseRecord.createRec        = response._doc
		    hist                            = { ...response._doc };
	      result                          = await createHistoricalRecord(hist);
	      responseRecord.histRec          = result._doc


	      logger.trace(applicationName + ':zndManageEmployees:createRecord:Done.');

	      return                           responseRecord;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageEmployees:createRecord:An Exception occurred [' + ex + '].');
    }
}



async function main(req, res)
{   try
	  {  var image, docPath, listURN, returnURN, result;

	      logger.trace(applicationName + ':zndManageEmployees:main:Started.');
	      logger.debug(applicationName + ':zndManageEmployees:main: req.body.actie :[' + req.body.actie+'].')

	      listURN                         = '/employeesList';
	      returnURN                       = '/zndEmployees/'
       
		    if(typeof req.body.editState === 'undefined')
		    {   req.body.editState          = 'off'
		    }
 
		    if ((typeof req.files !== 'undefined' ) && ( req.files !== null ))
		    {   if ( ( typeof req.files.docScan !== 'undefined' )  &&  ( req.files.docScan !== '' ))
		        {   image                       = req.files.docScan;
		            docPath                     = path.resolve(__dirname,'../public/docs',image.name);
		            image.mv(docPath);
		            req.body.docScan            = image.name;
		            req.body.docPath            = docPath;
		        }
		    }

		    if ( typeof req.body.employeeID == "undefined" || req.body.employeeID == "" )
		    {   req.body.employeeID =req.body.employeeInitials +req.body.employeelastName.substring(0,1)
		    }	    

	   	  switch(String(req.body.actie))
	   	  {    case "create"       :   result       = await createRecord(req.body) ;
	   	  	                           if (headless == false) res.redirect(returnURN + result.createRec._id)
	   	  	                           break;

	   	  		 case "duplicate"    :   logger.debug(applicationName + ':zndManageEmployees:main: Running Duplicate')
	   	  		                         result       = await duplicateRecord(req.body) ;
	   	  		                         if (headless == false) res.redirect(returnURN + result.createRec._id)
	   	  	                           break;

	   	  	   case "updateRecord" :   req.body.employeeStatus =( typeof req.body.employeeEndDate == 'undefined' || req.body.employeeEndDate == "" )? "Active" : "Non Active";
	   	  	                           result       = await updateRecord(req.body);	   	  	                              
	   	  	                           if (headless == false) res.redirect(returnURN + result.createRec._id)
	   	  	                           break;

	   	  	   case "deleteRecord" :   result       = await deleteRecord(req.body);
	   	  	                           if (headless == false) res.redirect(listURN)
	   	  	                           break; 
	   	  	                           
	   	  	   case "cancel"       :   result       = {} 
	   	  	                           if (headless == false) res.redirect(listURN)
	   	  	                           break;

	   	      default             :   logger.exception(applicationName + ':zndManageEmployees:main:An error occured[Unknown Action]:[' + req.body.actie + '].')
	   	  	                          res.redirect(listURN)
	   	  }
	   	  logger.trace(applicationName + ':zndManageEmployees:main:Done');

	   	  return result;
	  }
	  catch(ex)
	  {   logger.exception(applicationName + ':zndManageEmployees:main:An exception occured:[' + ex + '].')
	  }
}
/* --------------------------------- End Functions   -------------------------*/

/* ----------------------------------Module Initialization -------------------*/
/* ----------------------------------End Module Initialization ---------------*/

/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main
module.exports.getRecord                = getRecord
/* ----------------------------------End External functions ------------------*/

/* LOG:
*/