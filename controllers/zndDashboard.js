/* File             : zndDashboard.js
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
const zndManageData                     = require('../services/zndManageData')

/* -------------------------------- End Services -----------------------------*/



/* ------------------------------------- Models ------------------------------*/
const zanddLedger                       = require('../models/zanddLedger')
const zndBookKeepersLedgers             = require( "../models/zndBookKeepersLedgers" );
const manageBookkeepingYears           = require( '../services/manageBookkeepingYears' );
/* -------------------------------- End Models -------------------------------*/



/* ---------------------------------  Application constants    ----------------*/
const logFileName                       = config.get('application:logFileName')
const applicationName                   = config.get('application:applicationName')
/* --------------------------------- End Application constants ----------------*/

/* --------------- Internal Application Libraries Initialization -------------*/
const logger                            = new Logger(logFileName)
/* ----------- End Internal Application Libraries Initialization -------------*/



/* ------------------------------------- Functions   -------------------------*/
/* --------------------------------- End Functions   -------------------------*/

/* ----------------------------------Module Initialization -------------------*/
async function main(req, res)
{   try
    {   var items,queryObj, filter;

        logger.trace(applicationName + ':zndDashboard:main():Started ');

        items                           = {};
        queryObj                        = {};
        queryString                     = "";
        queryObj                        = req.query; 
        
        if(  typeof queryObj.augment !== 'undefined') 
        {   
            await zndManageData.runDataAugmentation();
        }
        items                       = await zanddLedger.find(filter).sort({BankdateEpoch : 1})        
        let bookkeepingLedgerNames  = await zndBookKeepersLedgers.find();
        const record                = {};
        record.action               = 'getData';
        const bookkeepingYears     = await manageBookkeepingYears.manageBookkeepingYears(record,''); 
        
        res.render('zndDashboard',{ items:items, queryObj:queryObj, bookkeepingLedgerNames:bookkeepingLedgerNames, bookkeepingYears:bookkeepingYears.body });
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndDashboard:main():An exception occurred: ['+ ex +'].')
    }
}

/* ----------------------------------End Module Initialization ---------------*/



/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main
/* ----------------------------------End External functions ------------------*/


/* LOG:

*/