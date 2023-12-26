/* File             : zndSentStatements.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2022
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
const zanddLedgerHist                   = require('../models/zanddLedgerHist')
/* -------------------------------- End Models -------------------------------*/



/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
const logger                            = new Logger(logFileName)
/* ----------- End Internal Application Libraries Initialization -------------*/



/* ------------------------------------- Functions   -------------------------*/
async function main(req, res)
{   try
    {   var sendStatementList, elementList, allRecords, idList, i;

        logger.trace(applicationName + ':zndSentStatements:main:Started');

        elementList                     = [];
        allRecords                      = [];
        idList                          = [];


        allRecords                      = await zanddLedgerHist.find({recordTime : { $gt:1628459999000}}).sort({recordTime: -1}).select(' originalRecordID recordTime -_id');

        for(i=0; i < allRecords.length; i++)
        {   if ( ! idList.includes(allRecords[i].originalRecordID) )
            {   idList.push(allRecords[i].originalRecordID)
                elementList.push(allRecords[i])
            }
        }
        sendStatementList               = JSON.stringify(elementList)

        logger.trace(applicationName + ':zndSentStatements:main:Done');
        res.render('zndSentStaments', { sendStatementList:sendStatementList });
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndSentStatements:main:An exception occured:[' + ex + '].')
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