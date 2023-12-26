/* File             : zndLoadCodaFilesCntrl.js
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
    {   logger.trace(applicationName + ':zndLoadCodaFilesCntrl:main:Started');
        logger.trace(applicationName + ':zndLoadCodaFilesCntrl:main:Done');        
        res.render('zndLoadCodaFiles',{});
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndLoadCodaFilesCntrl:main:An exception occured:[' + ex + '].')
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