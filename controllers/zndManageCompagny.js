/* File             : zndManageCompagny.js
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
const zndCompanies                = require('../models/zndCompanies')
const zndCompaniesHist            = require('../models/zndCompaniesHist')
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
	      
	      logger.trace(applicationName + ':zndManageCompagny:deleteRecord:Started.');
	      logger.debug(applicationName + ':zndManageCompagny:deleteRecord:deleting record with ID:[' + record._id + '].');
	      
	      record.recordStatus             = "Deleted"  
	      result                          = await createHistoricalRecord(record); 
	      response                        = await zndCompanies.findByIdAndDelete(record._id); 	      
	      logger.debug(applicationName + ':zndManageCompagny:deleteRecord:Result:', response);
	      logger.trace(applicationName + ':zndManageCompagny:deleteRecord:Done.');
	      return result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageCompagny:deleteRecord:An Exception occurred [' + ex + '].');
    }      
}


async function getRecord(recordID)
{   try
	  {   var response, result, localRec;

	      logger.trace(applicationName + ':zndManageCompagny:getRecord:Started.');
	      logger.debug(applicationName + ':zndManageCompagny:getRecord:getting record with ID:[' + recordID + '].');

        response                        = await zndCompanies.findById(recordID ) ;


	      logger.debug(applicationName + ':zndManageCompagny:getRecord:Result:', response);
	      logger.trace(applicationName + ':zndManageCompagny:getRecord:Done.');

	      return                           response;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageCompagny:getRecord:An Exception occurred [' + ex + '].');
    }
}



async function  updateRecord(record)
{   try
	  {   var response, result, responseRecord, tempRec;

	      logger.trace(applicationName + ':zndManageCompagny:updateRecord:Started.');
	      logger.debug(applicationName + ':zndManageCompagny:updateRecord:updating record with ID:[' + record._id + '].');

        responseRecord                  = {};
        result                          = {};
        response                        = {};
        tempRec                         = {};

        tempRec                         = {...record}
			  tempRec.__v                     = Number(record.__v)+1;


			  response                        = await zndCompanies.findByIdAndUpdate(record._id,{ ...tempRec} , {useFindAndModify:false, new: true});

			  responseRecord.createRec        = response._doc

			  result                          = await createHistoricalRecord({ ...response._doc});

			  responseRecord.histRec          = result._doc

	      logger.trace(applicationName + ':zndManageCompagny:updateRecord:Done.');

	      return responseRecord;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageCompagny:updateRecord:An Exception occurred [' + ex + '].');
    }
}



async function duplicateRecord(record)
{   try
	  {   var response, result, localRec;


	      logger.trace(applicationName + ':zndManageCompagny:duplicateRecord:Started.');
	      logger.debug(applicationName + ':zndManageCompagny:duplicateRecord:Duplicating record with ID:[' + record._id + '].');

	      result                          = {};
	      response                        = await zndCompanies.findById(record._id);
	      delete response._doc._id;
	      delete response._doc.transferredAccountant;
        response._doc.editState         = "on";
        response.action                 = "create"
        result                          = await createRecord(response._doc) ;

	      logger.debug(applicationName + ':zndManageCompagny:duplicateRecord:Result:', result);
	      logger.trace(applicationName + ':zndManageCompagny:duplicateRecord:Done.');
	      
	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageCompagny:duplicateRecord:An Exception occurred [' + ex + '].');
    }
}



async function createHistoricalRecord(record)
{   try
	  {   var hist, now, result ;

	      logger.trace(applicationName + ':zndManageCompagny:createHistoricalRecord:Started.');
	      logger.debug(applicationName + ':zndManageCompagny:createHistoricalRecord:recording historical record with ID:[' + record._id + '].');

	      hist                            = { ...record };
			  hist.storedVersion              = parseInt(record.__v);

			  now                             = new Date()
			  hist.recordTime                 = now.getTime();

			  hist.originalRecordID           = record._id

			  if (typeof hist.recordStatus === 'undefined')
			  {   hist.recordStatus           = 'Active';
			  }
			  delete hist._id

			  result                          = await zndCompaniesHist.create({ ...hist });

	      logger.trace(applicationName + ':zndManageCompagny:createHistoricalRecord:Done.');

	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageCompagny:createHistoricalRecord:An Exception occurred [' + ex + '].');
    }
}



async function createRecord(record)
{   try
	  {   var response, result, hist, now, responseRecord;

	      logger.trace(applicationName + ':zndManageCompagny:createRecord:Started.');
	      logger.debug(applicationName + ':zndManageCompagny:createRecord:Creating record.');

	      responseRecord                  = {}
	      delete record._id;

		    response                        = await zndCompanies.create({...record}) ;

		    responseRecord.createRec        = response._doc
		    hist                            = { ...response._doc };
	      result                          = await createHistoricalRecord(hist);
	      responseRecord.histRec          = result._doc


	      logger.trace(applicationName + ':zndManageCompagny:createRecord:Done.');

	      return                           responseRecord;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageCompagny:createRecord:An Exception occurred [' + ex + '].');
    }
}



async function main(req, res)
{   try
	  {  var image, docPath, listURN, returnURN, result;

	      logger.trace(applicationName + ':zndManageCompagny:main:Started.');
	      logger.debug(applicationName + ':zndManageCompagny:main: req.body.actie :[' + req.body.actie+'].')

	      listURN                         = '/compagnyList';
	      returnURN                       = '/zndCompagny/';
       
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

	   	  switch(String(req.body.actie))
	   	  {    case "create"       :   result       = await createRecord(req.body) ;
	   	  	                           if (headless == false) res.redirect(returnURN + result.createRec._id)
	   	  	                           break;

	   	  		 case "duplicate"    :   logger.debug(applicationName + ':zndManageCompagny:main: Running Duplicate')
	   	  		                         result       = await duplicateRecord(req.body) ;
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

	   	      default             :   logger.exception(applicationName + ':zndManageCompagny:main:An error occured[Unknown Action]:[' + req.body.actie + '].')
	   	  	                          res.redirect(listURN)
	   	  }
	   	  logger.trace(applicationName + ':zndManageCompagny:main:Done');

	   	  return result;
	  }
	  catch(ex)
	  {   logger.exception(applicationName + ':zndManageCompagny:main:An exception occured:[' + ex + '].')
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