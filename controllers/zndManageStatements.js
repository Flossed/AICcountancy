/* File             : zndStatements.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
   Notes            :
   Description      :
*/

/* ------------------     External Application Libraries      ----------------*/
const winston                           = require('winston')
const fileUpload                        = require('express-fileupload')
const path                              = require('path');
var nodemailer                          = require('nodemailer');
const PizZip                            = require('pizzip');
const Docxtemplater                     = require('docxtemplater');
const fs                                = require('fs');
const { exec }                          = require("child_process");
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
const zndIMAPSync                       = require('../services/zndIMAPSync')
const zndManageData                       = require('../services/zndManageData')

/* -------------------------------- End Services -----------------------------*/

/* ------------------------------------- Models ------------------------------*/
const zanddLedger                       = require('../models/zanddLedger')
const zanddLedgerHist                   = require('../models/zanddLedgerHist.js')
const ledgerAccountLabels               = require('../models/ledgerAccountCategoryName')
const emailAdresses                     = require('../models/emailAdresses')
/* -------------------------------- End Models -------------------------------*/

/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
const headless                          = config.get('application:headless')
const statementTemplate                 = config.get('application:statementTemplate'); 
const outputDir                         = config.get('application:outputDir'); 
const wordPath                         = config.get('application:wordPath'); 
const WordOptions                         = config.get('application:WordOptions'); 

/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
const logger                            = new Logger(logFileName)
var transporter                         = nodemailer.createTransport({
                                                                         host: 'mail.gandi.net',
                                                                         port: 465,
                                                                         secure: true,
                                                                         auth: {   user: 'statements@zandd.eu',
                                                                                   pass: 'P!ckwick70',
                                                                               },
                                                                     });
var statementRecord;
/* ----------- End Internal Application Libraries Initialization -------------*/

/* ------------------------------------- Functions   -------------------------*/
const docOptions                        = {   paragraphLoop: true,   
                                              linebreaks: true,
                                          };
                                          
                                          
const genOptions                        = {   type: 'nodebuffer',                      
                                              compression: 'DEFLATE',
                                          };
                                          
async function printPDF(req, res)
{   try
	  {   logger.trace(applicationName + ':manageStatement:printPDF:Started.');
	      
	      const statementTemplater       = fs.readFileSync(   path.resolve(statementTemplate),   'binary');
	      const zip                      = new PizZip(statementTemplater);
	      const doc                      = new Docxtemplater(zip,docOptions);
	      const outputFileName           = req.body.docScan.replace("pdf", "docx");
	      
	      doc.render(req.body); 
	      
	      const buf                      = doc.getZip().generate(genOptions);
	      
	      fs.writeFileSync(path.resolve(outputDir, outputFileName), buf);	      
	      
	      const printCommand             = "\""+ wordPath + "\""+ " \"" + path.resolve(outputDir, outputFileName)  + "\" " + WordOptions; 
	      console.log(printCommand);
	      
	       exec(`${printCommand} `, (error, stdout, stderr) =>
         {   if (error)
             {   logger.error(`error: ${error.message}`);
                  return;
              }
              if (stderr)
              {   logger.error(`stderr: ${stderr}`);
                  return;
              }
              logger.debug(`stdout: ${stdout}`);
         });
	      
	      logger.trace(applicationName + ':manageStatement:printPDF:Done.');
    }
	  catch(ex)
	  {   logger.exception(applicationName + ':manageStatement:main:An Exception occurred [' + ex + '].');
	  }
}

async function getEmailAccount(emailCategory)
{   try
    {   var emailAccount;

        logger.trace(applicationName + ':zndManageStatements:getEmailAccount:Started.');
        logger.trace(applicationName + ':zndManageStatements:getEmailAccount:Started.['+emailCategory+'].');

        emailAccount                    = {}
        emailAccount                    = await emailAdresses.find({'emailCategory':emailCategory});

        logger.debug(applicationName + 'Email account to send [' + emailCategory + '] to is: ['+emailAccount[0].emailaddress+'] ')
        logger.trace(applicationName + ':zndManageStatements:getEmailAccount:Done.');
        return emailAccount[0].emailaddress;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageStatements:getEmailAccount:An Exception occurred [' + ex + '].');
    }
}



async function getEmailCategory(ledgerLabel)
{   try
    {   var emailAccount, accountLedgerNames, i;

        logger.trace(applicationName + ':zndManageStatements:getEmailCategory:Started.');
        logger.debug(applicationName + ':zndManageStatements:getEmailCategory:Getting email Account for category ['+ ledgerLabel+ '].');

        emailAccount                    = '';
        accountLedgerNames              = await ledgerAccountLabels.find();



        for(i=0; i<accountLedgerNames.length; i++)
        {   if (typeof accountLedgerNames[i].ledgerLabel !== 'undefined' && accountLedgerNames[i].ledgerLabel !== '')
            {   if (accountLedgerNames[i].ledgerLabel.includes(ledgerLabel))
                {   emailAccount        = accountLedgerNames[i].destinationAccount;
                    logger.trace(applicationName + ':zndManageStatements:getEmailCategory:Done. Returning:[' +emailAccount + ']');
                    return emailAccount;
                }
            }
        }
        logger.trace(applicationName + ':zndManageStatements:getEmailCategory:Done.');
        throw(applicationName + ':zndManageStatements:getEmailCategory:ledgerAccount not defined for:['+ ledgerLabel+ '].')
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageStatements:getEmailCategory:An Exception occurred [' + ex + '].');
    }
}



async function mailit(filename, filePath,emailAccount)
{   try
    {   var  subject, info

        logger.trace(applicationName + ':zndManageStatements:mailit:Started.');
        logger.debug(applicationName + ':zndManageStatements:mailit:Mailing ['+ filename + ']  @ ['+ filePath+ ']. to:['+emailAccount+'].')

	      subject                         = 'Filename : [ ' +filename +']. '
	      logger.debug(applicationName + ':zndManageStatements:mailit:Subject ['+ subject + '].')
        info                            = await transporter.sendMail({   from: '"Daniel S. A. Khan" <daniel@zandd.eu>',
                                                                         to: emailAccount,
                                                                         bcc: "statements@zandd.eu", // list of receivers
                                                                         subject: subject,
                                                                         html: filename+ "<br> sent to:["+ emailAccount +"]. <br>",
                                                                         attachments: [{   filename: filename,
                                                                                           path: filePath
                                                                                       }]
                                                                      });
	      logger.debug(applicationName + ':zndManageStatements:mailit:Mailing Message sent:[' + info.messageId +']  To: [' + emailAccount + '].');
	      logger.trace(applicationName + ':zndManageStatements:mailit:Done.');
	      return info;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageStatements:mailit:An Exception occurred [' + ex + '].');
    }
}



async function mailMan(filename, filePath, ledgerCategory)
{   try
    {   var emailAccount, accountName, values, retVal;

        logger.trace(applicationName + ':zndManageStatements:mailMan:Started.');

	      accountName                     = await getEmailCategory(ledgerCategory)

	      emailAccount                    = await getEmailAccount(accountName)
	      values                          = await Promise.all([accountName]);
	      logger.debug(applicationName + ':zndManageStatements:mailMan:Found:[' + emailAccount + '].')
	      retVal                          = await mailit(filename, filePath, emailAccount) ;
	      logger.trace(applicationName + ':zndManageStatements:mailMan:Done.');

	      if ( retVal.response.includes('250 2.0.0 Ok: queued as') )
	        return 0;
	      else
	         return -1
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageStatements:mailMan:An Exception occurred [' + ex + '].');
    }

}



async function createHistoricalRecord(record)
{   try
	  {   var hist, now, result ;

	      logger.trace(applicationName + ':zndManageStatements:createHistoricalRecord:Started.');
	      logger.debug(applicationName + ':zndManageStatements:createHistoricalRecord:recording historical record with ID:[' + record._id + '].');

	      hist                            = { ...record };
			  hist.storedVersion              = parseInt(record.__v);

			  now                             = new Date()
			  hist.recordTime                 = now.getTime();

			  hist.originalRecordID           = record._id

			  if (typeof hist.recordStatus === 'undefined')
			  {   hist.recordStatus           = 'Active';
			  }
			  delete hist._id

			  result                          = await zanddLedgerHist.create({ ...hist });

	      logger.trace(applicationName + ':zndManageStatements:createHistoricalRecord:Done.');

	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageStatements:createHistoricalRecord:An Exception occurred [' + ex + '].');
    }
}



async function createRecord(record)
{   try
	  {   var response, result, hist, now, responseRecord;

	      logger.trace(applicationName + ':zndManageStatements:createRecord:Started.');
	      logger.debug(applicationName + ':zndManageStatements:createRecord:Creating record.');

	      responseRecord                  = {}
	      delete record._id;

		    response                        = await zanddLedger.create({...record}) ;

		    responseRecord.createRec        = response._doc
		    hist                            = { ...response._doc };
	      result                          = await createHistoricalRecord(hist);
	      responseRecord.histRec          = result._doc


	      logger.trace(applicationName + ':zndManageStatements:createRecord:Done.');

	      return                           responseRecord;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageStatements:createRecord:An Exception occurred [' + ex + '].');
    }
}



async function duplicateRecord(record)
{   try
	  {   var response, result, localRec;

	      logger.trace(applicationName + ':zndManageStatements:duplicateRecord:Started.');
	      logger.debug(applicationName + ':zndManageStatements:duplicateRecord:Duplicating record with ID:[' + record._id + '].');

	      localRec                        = {}
	      localRec                        = { ...record}
	      delete localRec._id
			  delete localRec.transferredAccountant
        delete localRec.editState
        delete localRec.accntchk
        delete localRec.editState
        delete localRec.locked

        result                          = await createRecord(localRec);

	      logger.debug(applicationName + ':zndManageStatements:duplicateRecord:Result:', response);
	      logger.trace(applicationName + ':zndManageStatements:duplicateRecord:Done.');


	      return                           result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageStatements:duplicateRecord:An Exception occurred [' + ex + '].');
    }
}



async function  updateRecord(record)
{   try
	  {   var response, result, responseRecord, tempRec;

	      logger.trace(applicationName + ':zndManageStatements:updateRecord:Started.');
	      logger.debug(applicationName + ':zndManageStatements:updateRecord:updating record with ID:[' + record._id + '].');

        responseRecord                  = {};
        result                          = {};
        response                        = {};
        tempRec                         = {};

        tempRec                         = {...record}
			  tempRec.__v                     = parseInt(record.__v)+1;


			  response                        = await zanddLedger.findByIdAndUpdate(record._id,{ ...tempRec} , {useFindAndModify:false, new: true});

			  responseRecord.createRec        = response._doc

			  result                          = await createHistoricalRecord({ ...response._doc});

			  responseRecord.histRec          = result._doc
	      logger.trace(applicationName + ':zndManageStatements:updateRecord:Done.');

	      return responseRecord;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageStatements:updateRecord:An Exception occurred [' + ex + '].');
    }
}



async function deleteRecord(record)
{   try
	  {   var response, result;

	      logger.trace(applicationName + ':zndManageStatements:deleteRecord:Started.');
	      logger.debug(applicationName + ':zndManageStatements:deleteRecord:deleting record with ID:[' + record._id + '].');

	      record.recordStatus             = "Deleted"
	      result                          = await createHistoricalRecord(record);
	      response                        = await zanddLedger.findByIdAndDelete(record._id);

	      logger.debug(applicationName + ':zndManageStatements:deleteRecord:Result:', response);
	      logger.trace(applicationName + ':zndManageStatements:deleteRecord:Done.');
	      return result;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageStatements:deleteRecord:An Exception occurred [' + ex + '].');
    }
}



function sleep(ms)
{   return new Promise(resolve => setTimeout(resolve, ms));
}

 function getRecord()
{ return statementRecord;
}

 function setRecord(record)
{  statementRecord = record;
}


async function findRecord()
{   var record, mailEvidence,result ;

    record                              = getRecord();
    if (typeof record !== 'undefined')
    {   mailEvidence                        = await  zndIMAPSync.findStatement(record.docScan);

		    if( mailEvidence.length > 0 )
		    {   record.lastTransferredAccountantTime        = String(mailEvidence[mailEvidence.length-1].date);
            record.transferredAccountantCount           = String(mailEvidence.length);
		        record.transferredAccountant                = 'on';
		        logger.debug(applicationName + ':zndManageStatements:mailRecord:Storing history.');
		        result                                      =  await updateRecord(record);
		    }
		    else
		    {   logger.debug(applicationName + ':zndManageStatements:findRecord: No records found for :[' + record.docScan +']. ');
		        return {};
		    }
		    return result;
		}
		return {};
}


async function setSendStatus(record)
{   var retVal,  mailEvidence, result;
    setRecord(record);
    retVal                              = await zndIMAPSync.runDBUpdate();

}


async function mailRecord(record)
{   try
	  {   var response, result;

	      logger.trace(applicationName + ':zndManageStatements:mailRecord:Started.');
	      logger.debug(applicationName + ':zndManageStatements:mailRecord:mailing record with ID:[' + record._id + '].');
	      result                          = {}
		 	  response                        = await mailMan(record.docScan, record.docPath, record.ledgerAccount)
		 	  if (response == 0 )
		 	  {   sleep(3000).then( () =>
		 	                        {   setSendStatus(record);
		 	                        });
		 	      sleep(3000).then( () =>
		 	                        {   findRecord();
		 	                        });
		 	  }
		 	  else
		 	  {   throw('Issues mailing record:[' + record._id + '].')
		 	  }

	      logger.trace(applicationName + ':zndManageStatements:mailRecord:Done.');
	      return response;
	  }
    catch(ex)
    {   logger.exception(applicationName + ':zndManageStatements:mailRecord:An Exception occurred [' + ex + '].');
    }
}

async function updateFilesStatus()
{   try
	  {   
    return result;
    }
	  catch(ex)
	  {   logger.exception(applicationName + ':zndManageStatements:main:An Exception occurred [' + ex + '].');
	  }
}

async function main(req, res)
{   try
	  {   var image, docPath, listURN, returnURN, result;

	      logger.trace(applicationName + ':zndManageStatements:main:Started.');
	      logger.debug(applicationName + ':zndManageStatements:main: req.body.actie :[' + req.body.actie+'].')

	      listURN                         = '/zndLedger';
	      returnURN                       = '/zndStatements/'
	      setRecord({});
	      if(typeof req.body.transferredAccountant === 'undefined')
	      {   req.body.transferredAccountant        = 'off'
	      }

		    if(typeof req.body.editState === 'undefined')
		    {   req.body.editState          = 'off'
		    }

		    if ((typeof req.files !== 'undefined' ) && ( req.files !== null ))
		    {
		        if ( ( typeof req.files.docScan !== 'undefined' )  &&  ( req.files.docScan !== '' ))
		        {   image                       = req.files.docScan;
		            docPath                     = path.resolve(__dirname,'../public/docs',image.name);
		            image.mv(docPath);
		            req.body.docScan            = image.name;
		            req.body.docPath            = docPath;
		        }
		    }

        switch(String(req.body.actie))
        {   case "create"               :   result          = await createRecord(req.body) ;
                                            if (headless == false) res.redirect(returnURN + result.createRec._id)
                                            break;

            case "duplicate"            :   result = await duplicateRecord(req.body)
                                            if (headless == false) res.redirect(returnURN +result.createRec._id)
                                            break;

            case "updateRecord"         :   result = await updateRecord(req.body);
                                            setRecord(req.body);
                                            findRecord();
                                            if (headless == false) { res.redirect(returnURN +result.createRec._id) }
                                            break;

            case "deleteRecord"         :   result = await deleteRecord(req.body);
                                            if (headless == false) res.redirect(listURN)
                                            break;

            case "unlockForm"           :   zndManageData.removeLock(req.body._id);
                                            if (headless == false) { res.redirect(returnURN +req.body._id) }
                                            break;
            case "printPDF"             :   console.log('Printing PDF document')                                            
                                            await printPDF(req, res);
                                            if (headless == false) { res.redirect(returnURN +req.body._id) }
                                            break;                                             
                                            
            case "cancel"               :   res.redirect(listURN)
                                            break;
            case "mail"                 :   result = await mailRecord(req.body)
                                            if (headless == false) res.redirect(returnURN +result.createRec._id)
                                            break;

            default                     :   logger.error(applicationName + ':zndManageStatements:main:unmanaged action: [' + req.body.actie+']!');
                                            logger.trace(applicationName + ':zndManageStatements:main:Started.');
                                            res.redirect(listURN)
        }
        return result;
    }
	  catch(ex)
	  {   logger.exception(applicationName + ':zndManageStatements:main:An Exception occurred [' + ex + '].');
	  }
}
/* --------------------------------- End Functions   -------------------------*/



/* ----------------------------------Module Initialization -------------------*/
/* ----------------------------------End Module Initialization ---------------*/



/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main
module.exports.createRecord             = createRecord
module.exports.updateRecord             = updateRecord
module.exports.setRecord                = setRecord
module.exports.findRecord               = findRecord
/* ----------------------------------End External functions ------------------*/


/* LOG:

*/